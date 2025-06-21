import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import errorHandler from '../middlewares/errorHandler.js'

// Mocks
vi.mock('bcrypt', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    __esModule: true,
    ...actual,
    compare: vi.fn(),
  }
})

vi.mock('jsonwebtoken', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    __esModule: true,
    ...actual,
    sign: vi.fn(),
    verify: vi.fn(),
  }
})

vi.mock('../config/database.js', () => ({
  sequelize: { define: vi.fn(), authenticate: vi.fn() },
  SECRET: 'test-access-secret',
  REFRESH_SECRET: 'test-refresh-secret',
}))

vi.mock('../models/index.js', () => ({
  User: {
    findAll: vi.fn(),
  },
}))

vi.mock('../utils/logger.js', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}))

import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { logAction } from '../utils/logger.js'
import router from './login.js'

describe('Auth router', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', router)
    app.use(errorHandler)
  })

  describe('POST /', () => {
    it.skip('logs in successfully and sets refresh token cookie', async () => {
      User.findAll.mockResolvedValue([
        {
          id: 1,
          username: 'johndoe',
          password: 'hashedPassword',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
        },
      ])
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token')

      const res = await request(app)
        .post('/')
        .send({ username: 'johndoe', password: 'correctpassword' })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ accessToken: 'access-token' })
      expect(res.headers['set-cookie']).toBeDefined()
      expect(logAction).toHaveBeenCalledWith(1, 'Logged in')
    })

    it('fails login if user not found', async () => {
      User.findAll.mockResolvedValue([])

      const res = await request(app)
        .post('/')
        .send({ username: 'unknown', password: 'pass' })

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'Invalid username or password' })
    })

    it('fails login if password incorrect', async () => {
      User.findAll.mockResolvedValue([
        {
          id: 1,
          username: 'johndoe',
          password: 'hashedPassword',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
        },
      ])
      bcrypt.compare.mockResolvedValue(false)

      const res = await request(app)
        .post('/')
        .send({ username: 'johndoe', password: 'wrongpass' })

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'Invalid username or password' })
    })
  })

  describe('POST /refresh', () => {
    it.skip('successfully refreshes access token', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(null, {
          fullname: 'John Doe',
          username: 'johndoe',
          user_id: 1,
          role: 'user',
        })
      })
      jwt.sign.mockReturnValue('new-access-token')

      const res = await request(app)
        .post('/refresh')
        .set('Cookie', ['refreshToken=valid-refresh-token'])

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ accessToken: 'new-access-token' })
    })

    it('fails if refresh token missing', async () => {
      const res = await request(app).post('/refresh')

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'Refresh token missing' })
    })

    it('fails if refresh token invalid', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(new Error('invalid token'), null)
      })

      const res = await request(app)
        .post('/refresh')
        .set('Cookie', ['refreshToken=bad-token'])

      expect(res.status).toBe(403)
      expect(res.body).toEqual({ error: 'Invalid refresh token' })
      expect(res.headers['set-cookie']).toBeDefined()
    })
  })

  describe('POST /logout', () => {
    it('clears refresh token cookie and responds', async () => {
      const res = await request(app).post('/logout')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ message: 'Logged out successfully' })
      expect(res.headers['set-cookie']).toBeDefined()
    })
  })
})
