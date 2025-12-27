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
    it('fails if refresh token missing', async () => {
      const res = await request(app).post('/refresh')

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'Refresh token missing' })
    })

    it('fails if refresh token is invalid', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        const err = new jwt.JsonWebTokenError('invalid token')
        cb(err, null)
      })

      const res = await request(app)
        .post('/refresh')
        .set('Cookie', ['refreshToken=invalid-token'])

      expect(res.status).toBe(403)
      expect(res.body).toEqual({ error: 'Invalid refresh token' })
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
