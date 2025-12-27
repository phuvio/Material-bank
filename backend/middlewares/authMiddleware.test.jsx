import express from 'express'
import request from 'supertest'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { logAction } from '../utils/logger.js'

// Mock jsonwebtoken default export correctly
vi.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}))

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logAction: vi.fn(),
}))

import jwt from 'jsonwebtoken'
import authenticateToken from '../middlewares/authMiddleware.js'

describe('authenticateToken middleware', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    vi.clearAllMocks()
  })

  function setupRoute(allowedRoles) {
    app.get('/protected', authenticateToken(allowedRoles), (req, res) => {
      res.status(200).json({ user: req.user })
    })
  }

  it('should return 401 if no token provided', async () => {
    setupRoute(['admin'])

    const res = await request(app).get('/protected')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized: No token provided')
    expect(logAction).not.toHaveBeenCalled()
  })

  it('should call logAction with token and accept valid token with allowed role', async () => {
    const fakeToken = 'valid.token.here'
    const decoded = { id: 1, role: 'admin' }

    setupRoute(['admin', 'user'])
    jwt.verify.mockReturnValue(decoded)

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${fakeToken}`)

    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, process.env.SECRET)
    expect(logAction).toHaveBeenCalledWith('token accepted', fakeToken)
    expect(res.status).toBe(200)
    expect(res.body.user).toEqual(decoded)
  })

  it('should return 403 if role is not allowed', async () => {
    const fakeToken = 'valid.token.here'
    const decoded = { id: 1, role: 'guest' }

    setupRoute(['admin', 'user'])
    jwt.verify.mockReturnValue(decoded)

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${fakeToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden: Access denied')
  })

  it('should return 401 and log on TokenExpiredError', async () => {
    const fakeToken = 'expired.token'
    const error = new Error('jwt expired')
    error.name = 'TokenExpiredError'

    setupRoute(['admin'])
    jwt.verify.mockImplementation(() => {
      throw error
    })

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${fakeToken}`)

    expect(logAction).toHaveBeenCalledWith(error)
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized: Token expired')
  })

  it('should return 403 and log on invalid token error', async () => {
    const fakeToken = 'invalid.token'
    const error = new Error('invalid token')
    error.name = 'JsonWebTokenError'

    setupRoute(['admin'])
    jwt.verify.mockImplementation(() => {
      throw error
    })

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${fakeToken}`)

    expect(logAction).toHaveBeenCalledWith(error)
    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Invalid token')
  })
})
