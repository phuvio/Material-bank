import request from 'supertest'
import express from 'express'
import { describe, vi, it, expect, beforeEach } from 'vitest'
import errorHandler from '../middlewares/errorHandler'

// Mocks
vi.mock('../models/index', () => ({
  User: {
    findAll: vi.fn(),
  },
}))

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
  }
))

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(),
  }
))

vi.mock('../utils/logger', () => ({
  logAction: vi.fn(),
}))

import router from './login'
import cookieParser from 'cookie-parser'
import { User } from '../models/index'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { logAction } from '../utils/logger'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/', router)
app.use(errorHandler)

describe('Auth router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /', () => {
    it.skip('should login successfully and set refresh token cookie', async () => {
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

    it('should fail if user not found', async () => {
      User.findAll.mockResolvedValue([])
      const res = await request(app)
        .post('/')
        .send({ username: 'unknown', password: 'pass' })

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'invalid username or password' })
    })

    it('should fail if password is incorrect', async () => {
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
      expect(res.body).toEqual({ error: 'invalid username or password' })
    })
  })

  describe('POST /refresh', () => {
    it.skip('should refresh token successfully', async () => {
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

    it('should fail if refresh token is missing', async () => {
      const res = await request(app).post('/refresh')

      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: 'Refresh token missing' })
    })

    it('should fail if refresh token is invalid', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(new Error('invalid token'), null)
      })

      const res = await request(app)
        .post('/refresh')
        .set('Cookie', ['refreshToken=bad-token'])

      expect(res.status).toBe(403)
      expect(res.body).toEqual({ error: 'Invalid refresh token' })
      expect(res.headers['set-cookie']).toBeDefined() // cookie cleared
    })
  })

  describe('POST /logout', () => {
    it('should clear refresh token cookie and respond', async () => {
      const res = await request(app).post('/logout')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ message: 'Logged out successfully' })
      expect(res.headers['set-cookie']).toBeDefined() // cookie cleared
    })
  })
})
