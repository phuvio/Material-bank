import request from 'supertest'
import express from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Buffer } from 'buffer'

vi.mock('../models/index.js', () => ({
  Material: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
  User: {
    findByPk: vi.fn(),
  },
  Tag: {},
  TagsMaterial: {
    bulkCreate: vi.fn(),
    destroy: vi.fn(),
  },
}))

vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))

vi.mock('../config/database.js', () => ({
  sequelize: {
    transaction: vi.fn(() => ({
      commit: vi.fn(),
      rollback: vi.fn(),
    })),
  },
}))

vi.mock('../utils/logger.js', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}))

import { Material } from '../models/index.js'
import materialRouter from './materials.js'

describe('Materials API', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    app.use('/', materialRouter)
  })

  it('GET / returns materials without file data', async () => {
    Material.findAll.mockResolvedValue([{ id: 1, name: 'Material A' }])
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'Material A' }])
  })

  it('GET /:id returns material details', async () => {
    // mock a Sequelize instance with get({ plain: true })
    Material.findOne.mockResolvedValue({
      get: () => ({
        name: 'Test material',
        User: { first_name: 'John', last_name: 'Doe' },
      }),
    })
    const res = await request(app).get('/123')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Test material')
    expect(res.body.User.first_name).toBe('John')
  })

  it('GET /:id returns placeholder user when creator deleted', async () => {
    Material.findOne.mockResolvedValue({
      get: () => ({ name: 'Orphan material', User: null }),
    })
    const res = await request(app).get('/999')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Orphan material')
    expect(res.body.User).toBeDefined()
    expect(res.body.User.first_name).toBe('poistettu')
    expect(res.body.User.last_name).toBe('käyttäjä')
  })

  it('GET /:id/material returns a file', async () => {
    Material.findByPk.mockResolvedValue({
      id: 1,
      name: 'file',
      material: Buffer.from('content'),
      material_type: 'application/pdf',
    })
    const res = await request(app).get('/1/material')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toBe('application/pdf')
  })

  it('POST / uploads a material', async () => {
    const fakeMaterial = { id: 1, name: 'Uploaded', user_id: 1 }
    Material.create.mockResolvedValue(fakeMaterial)
    Material.findByPk.mockResolvedValue({ ...fakeMaterial, Tags: [] })

    const res = await request(app)
      .post('/')
      .field('name', 'Uploaded')
      .field('description', 'desc')
      .field('user_id', '1')
      .field('visible', 'true')
      .field('is_url', 'false')
      .attach('material', Buffer.from('dummy file'), 'file.pdf')

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Uploaded')
  })

  it('PUT /:id updates a material', async () => {
    Material.update.mockResolvedValue([1])
    Material.findByPk.mockResolvedValue({ name: 'Updated material', Tags: [] })

    const res = await request(app)
      .put('/1')
      .field('name', 'Updated material')
      .field('description', 'Updated description')
      .field('tagIds', JSON.stringify([1, 2]))

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated material')
  })

  it('DELETE /:id deletes material', async () => {
    Material.destroy.mockResolvedValue(1)
    const res = await request(app).delete('/1')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Material deleted successfully')
  })

  it('DELETE /:id returns 404 if material not found', async () => {
    Material.destroy.mockResolvedValue(0)
    const res = await request(app).delete('/1')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Material not found')
  })
})
