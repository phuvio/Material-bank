import request from 'supertest'
import express from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../models/index.js', () => ({
  Package: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
  Material: {},
}))
vi.mock('../models/packagesmaterials.js', () => ({
  default: {
    bulkCreate: vi.fn(),
  },
}))
vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))
vi.mock('../utils/logger.js', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}))
vi.mock('../config/database.js', () => ({
  sequelize: {
    transaction: vi.fn(() => ({
      commit: vi.fn(),
      rollback: vi.fn(),
    })),
  },
}))

import packageRouter from './packages.js'
import { Package } from '../models/index.js'
import PackagesMaterial from '../models/packagesmaterials.js'
import { sequelize } from '../config/database.js'

describe('Packages API', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    app.use('/', packageRouter)
  })

  it('GET / returns all packages', async () => {
    Package.findAll.mockResolvedValue([{ id: 1, name: 'Test Package' }])
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'Test Package' }])
  })

  it('GET /:id returns one package with materials', async () => {
    Package.findOne.mockResolvedValue({
      id: 1,
      name: 'Package A',
      description: 'Description',
      Materials: [],
    })
    const res = await request(app).get('/1')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Package A')
  })

  it('GET /:id returns 404 if package not found', async () => {
    Package.findOne.mockResolvedValue(null)
    const res = await request(app).get('/123')
    expect(res.status).toBe(404)
  })

  it.skip('POST / creates a new package with materials', async () => {
    const mockTransaction = await sequelize.transaction()
    const newPackage = { id: 99, name: 'New Pack', description: 'Desc' }

    Package.create.mockResolvedValue(newPackage)
    Package.findByPk.mockResolvedValue({
      ...newPackage,
      Materials: [],
    })

    const res = await request(app)
      .post('/')
      .send({
        name: 'New Pack',
        description: 'Desc',
        materialIds: [1, 2],
      })

    expect(res.status).toBe(201)
    expect(Package.create).toHaveBeenCalled()
    expect(PackagesMaterial.bulkCreate).toHaveBeenCalledWith(
      [
        { package_id: 99, material_id: 1 },
        { package_id: 99, material_id: 2 },
      ],
      { transaction: mockTransaction }
    )
    expect(res.body.name).toBe('New Pack')
  })

  it('POST / returns 400 if name missing', async () => {
    const res = await request(app).post('/').send({
      description: 'Some desc',
      materialIds: [],
    })
    expect(res.status).toBe(400)
  })

  it('POST / returns 400 if description missing', async () => {
    const res = await request(app).post('/').send({
      name: 'Test name',
      materialIds: [],
    })
    expect(res.status).toBe(400)
  })

  it.skip('POST / handles db failure', async () => {
    const mockTransaction = await sequelize.transaction()
    Package.create.mockRejectedValue(new Error('DB failed'))

    const res = await request(app).post('/').send({
      name: 'Bad pack',
      description: 'Oops',
      materialIds: [],
    })

    expect(res.status).toBe(400)
    expect(mockTransaction.rollback).toHaveBeenCalled()
    expect(res.body.error).toBe('Failed to create package')
  })
})
