import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import router from './favorites.js'
import errorHandler from '../middlewares/errorHandler.js'

vi.mock('../models/index.js', () => ({
  User: { findByPk: vi.fn() },
  Material: { findByPk: vi.fn() },
  Favorite: { findOne: vi.fn(), findAll: vi.fn(), create: vi.fn() },
}))

vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))

vi.mock('../utils/logger.js', () => ({
  logError: vi.fn(),
  logAction: vi.fn(),
}))

import { User, Material, Favorite } from '../models/index.js'

describe('Favorites Router', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', router)
    app.use(errorHandler)
  })

  describe('POST /:userId/:materialId', () => {
    it('adds a favorite successfully', async () => {
      User.findByPk.mockResolvedValue({ id: 1 })
      Material.findByPk.mockResolvedValue({
        id: 2,
        name: 'Material 1',
        is_url: true,
        url: 'https://example.com',
      })
      Favorite.findOne.mockResolvedValue(null)
      Favorite.create.mockResolvedValue({})

      const res = await request(app).post('/1/2')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        id: 2,
        name: 'Material 1',
        is_url: true,
        url: 'https://example.com',
      })
    })

    it('fails if user or material not found', async () => {
      User.findByPk.mockResolvedValue(null)

      const res = await request(app).post('/1/2')
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User or material not found')
    })

    it('fails if material already in favorites', async () => {
      User.findByPk.mockResolvedValue({ id: 1 })
      Material.findByPk.mockResolvedValue({ id: 2 })
      Favorite.findOne.mockResolvedValue({ id: 5 })

      const res = await request(app).post('/1/2')
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Material is already in favorites')
    })
  })

  describe('DELETE /:userId/:materialId', () => {
    it('removes a favorite successfully', async () => {
      const destroy = vi.fn().mockResolvedValue()
      Favorite.findOne.mockResolvedValue({ id: 5, destroy })

      const res = await request(app).delete('/1/2')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ message: 'Favorite removed' })
      expect(destroy).toHaveBeenCalled()
    })

    it('fails if favorite not found', async () => {
      Favorite.findOne.mockResolvedValue(null)

      const res = await request(app).delete('/1/2')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Favorite not found')
    })
  })

  describe('GET /:userId', () => {
    it('gets list of favorites for a user', async () => {
      User.findByPk.mockResolvedValue({ id: 1 })
      Favorite.findAll.mockResolvedValue([
        {
          Material: {
            id: 2,
            name: 'Material 1',
            is_url: true,
            url: 'https://example.com',
          },
        },
      ])

      const res = await request(app).get('/1')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([
        {
          id: 2,
          name: 'Material 1',
          is_url: true,
          url: 'https://example.com',
        },
      ])
    })

    it('fails if user not found', async () => {
      User.findByPk.mockResolvedValue(null)

      const res = await request(app).get('/1')
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User not found')
    })
  })
})
