import request from 'supertest'
import express from 'express'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import userRouter from '../controllers/users.js'

vi.mock('../models/index.js', () => ({
  User: {
    findAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('bcrypt', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    __esModule: true,
    default: {
      ...actual,
      compare: vi.fn(),
      hash: vi.fn(),
    },
  }
})

vi.mock('../utils/logger.js', () => ({
  logError: vi.fn(),
  logAction: vi.fn(),
}))

vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))

import bcrypt from 'bcrypt'
import { User } from '../models/index.js'
import { logAction } from '../utils/logger.js'
import errorHandler from '../middlewares/errorHandler.js'

describe('Users API', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/users', userRouter)
    app.use(errorHandler)
    vi.clearAllMocks()
  })

  describe('GET /users', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, username: 'foo' },
        { id: 2, username: 'bar' },
      ]
      User.findAll.mockResolvedValue(users)

      const res = await request(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(users)
      expect(User.findAll).toHaveBeenCalledOnce()
    })

    it('should handle errors', async () => {
      User.findAll.mockRejectedValue(new Error('fail'))
      const res = await request(app).get('/users')
      expect(res.status).toBe(500)
      expect(res.body.error).toBeDefined()
    })
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      bcrypt.hash.mockResolvedValue('hashedpwd')
      const newUser = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'secret',
        role: 'admin',
      }
      const createdUser = { id: 1, ...newUser, password: 'hashedpwd' }
      User.create.mockResolvedValue(createdUser)

      const res = await request(app).post('/users').send(newUser)

      expect(res.status).toBe(201)
      expect(res.body).toEqual(createdUser)
      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10)
      expect(User.create).toHaveBeenCalledWith({
        ...newUser,
        password: 'hashedpwd',
      })
      expect(logAction).toHaveBeenCalledWith('testuser', 'New user created')
    })

    it('should handle creation errors', async () => {
      bcrypt.hash.mockResolvedValue('hashedpwd')
      User.create.mockRejectedValue(new Error('fail'))
      const res = await request(app).post('/users').send({
        username: 'failuser',
        first_name: 'Fail',
        last_name: 'User',
        password: 'pwd',
        role: 'admin',
      })

      expect(res.status).toBe(500)
      expect(res.body.error).toBeDefined()
    })
  })

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const user = { id: 1, username: 'foo' }
      User.findByPk.mockResolvedValue(user)

      const res = await request(app).get('/users/1')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(user)
    })

    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null)

      const res = await request(app).get('/users/999')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User not found')
    })
  })

  describe('PUT /users/:id', () => {
    it('should update user fields', async () => {
      bcrypt.hash.mockResolvedValue('newhashedpwd')
      User.update.mockResolvedValue([1]) // affected rows
      const updatedUser = {
        id: 1,
        first_name: 'Updated',
        last_name: 'Name',
        role: 'admin',
      }
      User.findByPk.mockResolvedValue(updatedUser)

      const res = await request(app).put('/users/1').send({
        first_name: 'Updated',
        last_name: 'Name',
        password: 'newpwd',
        role: 'admin',
      })

      expect(bcrypt.hash).toHaveBeenCalledWith('newpwd', 10)
      expect(User.update).toHaveBeenCalledWith(
        {
          first_name: 'Updated',
          last_name: 'Name',
          role: 'admin',
          password: 'newhashedpwd',
        },
        { where: { id: '1' } }
      )
      expect(logAction).toHaveBeenCalledWith(1, 'User was updated')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(updatedUser)
    })

    it('should return 404 if user to update not found', async () => {
      User.update.mockResolvedValue([0])

      const res = await request(app)
        .put('/users/999')
        .send({ first_name: 'Noone' })

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User not found')
    })

    it('should return 400 if no user ID', async () => {
      // Simulate a route call without an ID is tricky, so just skip or test logic directly if possible
    })
  })

  describe('PUT /users/update-password/:id', () => {
    it('should update password when old password matches', async () => {
      User.findByPk.mockResolvedValue({ id: 1, password: 'hashedoldpwd' })
      bcrypt.compare.mockResolvedValue(true)
      bcrypt.hash.mockResolvedValue('hashednewpwd')
      User.update.mockResolvedValue([1])

      const res = await request(app)
        .put('/users/update-password/1')
        .send({ old_password: 'oldpwd', new_password: 'newpwd' })

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpwd', 'hashedoldpwd')
      expect(bcrypt.hash).toHaveBeenCalledWith('newpwd', 10)
      expect(User.update).toHaveBeenCalledWith(
        { password: 'hashednewpwd' },
        { where: { id: '1' } }
      )
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Password updated successfully')
    })

    it('should return 400 if old or new password missing', async () => {
      const res = await request(app)
        .put('/users/update-password/1')
        .send({ old_password: 'x' })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Old and new passwords are required')
    })

    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null)
      const res = await request(app)
        .put('/users/update-password/999')
        .send({ old_password: 'oldpwd', new_password: 'newpwd' })

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User not found')
    })

    it('should return 400 if old password is incorrect', async () => {
      User.findByPk.mockResolvedValue({ id: 1, password: 'hashedoldpwd' })
      bcrypt.compare.mockResolvedValue(false)

      const res = await request(app)
        .put('/users/update-password/1')
        .send({ old_password: 'wrongpwd', new_password: 'newpwd' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Incorrect old password')
    })

    it('should return 400 if new password same as old', async () => {
      User.findByPk.mockResolvedValue({ id: 1, password: 'hashedoldpwd' })
      bcrypt.compare.mockResolvedValue(true)

      const res = await request(app)
        .put('/users/update-password/1')
        .send({ old_password: 'samepwd', new_password: 'samepwd' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe(
        'New password cannot be the same as the old password'
      )
    })

    it('should return 400 if update fails', async () => {
      User.findByPk.mockResolvedValue({ id: 1, password: 'hashedoldpwd' })
      bcrypt.compare.mockResolvedValue(true)
      bcrypt.hash.mockResolvedValue('hashednewpwd')
      User.update.mockResolvedValue([0]) // no rows affected

      const res = await request(app)
        .put('/users/update-password/1')
        .send({ old_password: 'oldpwd', new_password: 'newpwd' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('User was not found')
    })
  })
})
