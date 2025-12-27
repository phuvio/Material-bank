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
    destroy: vi.fn(),
  },
}))
vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))
vi.mock('../utils/logger.js', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}))

const sharedTransactionMock = { commit: vi.fn(), rollback: vi.fn() }

vi.mock('../config/database.js', () => ({
  sequelize: {
    transaction: vi.fn(() => sharedTransactionMock),
  },
}))

import packageRouter from './packages.js'
import { Package } from '../models/index.js'
import PackagesMaterial from '../models/packagesmaterials.js'

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

  it('GET /:id returns one package with ordered materials', async () => {
    Package.findOne.mockResolvedValue({
      id: 1,
      name: 'Package A',
      description: 'Description',
      Materials: [
        { id: 1, name: 'Mat 1', position: 1 },
        { id: 2, name: 'Mat 2', position: 2 },
      ],
    })

    const res = await request(app).get('/1')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Package A')
    expect(res.body.Materials).toHaveLength(2)
    expect(res.body.Materials[0].id).toBe(1)
    expect(res.body.Materials[1].id).toBe(2)
    expect(Package.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        order: [[expect.anything(), expect.anything(), 'position', 'ASC']],
      })
    )
  })

  it('GET /:id returns 404 if package not found', async () => {
    Package.findOne.mockResolvedValue(null)

    const res = await request(app).get('/123')

    expect(res.status).toBe(404)
  })

  it('POST / creates a new package with materials and positions', async () => {
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
        materialIds: [
          { id: 1, position: 1 },
          { id: 2, position: 2 },
        ],
      })

    expect(res.status).toBe(201)
    expect(Package.create).toHaveBeenCalled()
    expect(PackagesMaterial.bulkCreate).toHaveBeenCalledWith(
      [
        { package_id: 99, material_id: 1, position: 1 },
        { package_id: 99, material_id: 2, position: 2 },
      ],
      expect.objectContaining({ transaction: expect.any(Object) })
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

  it('POST / handles db failure', async () => {
    Package.create.mockRejectedValue(new Error('DB failed'))

    const res = await request(app).post('/').send({
      name: 'Bad pack',
      description: 'Oops',
      materialIds: [],
    })

    expect(res.status).toBe(400)
    expect(sharedTransactionMock.rollback).toHaveBeenCalled()
  })

  it('PUT /:id updates package and materials positions', async () => {
    const packageToUpdate = {
      id: 55,
      name: 'Old Pack',
      description: 'Old Desc',
      save: vi.fn(),
    }

    Package.findByPk.mockResolvedValue(packageToUpdate)
    Package.findByPk.mockResolvedValueOnce(packageToUpdate)
    Package.findByPk.mockResolvedValueOnce({
      ...packageToUpdate,
      Materials: [],
    })

    const res = await request(app)
      .put('/55')
      .send({
        name: 'Updated Pack',
        description: 'Updated Desc',
        materialIds: [
          { id: 3, position: 1 },
          { id: 4, position: 2 },
        ],
      })

    expect(res.status).toBe(200)
    expect(packageToUpdate.save).toHaveBeenCalled()
    expect(PackagesMaterial.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { package_id: 55 } })
    )
    expect(PackagesMaterial.bulkCreate).toHaveBeenCalledWith(
      [
        { package_id: 55, material_id: 3, position: 1 },
        { package_id: 55, material_id: 4, position: 2 },
      ],
      expect.objectContaining({ transaction: expect.any(Object) })
    )
  })

  it('PUT /:id returns 404 if package not found', async () => {
    Package.findByPk.mockResolvedValue(null)

    const res = await request(app).put('/999').send({
      name: 'DoesntExist',
      description: 'Desc',
      materialIds: [],
    })

    expect(res.status).toBe(400)
  })
})
