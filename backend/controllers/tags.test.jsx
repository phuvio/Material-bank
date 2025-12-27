import request from 'supertest'
import express from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../models/index.js', () => ({
  Tag: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}))

vi.mock('../middlewares/authMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}))

vi.mock('../utils/logger.js', () => ({
  logError: vi.fn(),
  logAction: vi.fn(),
}))

import { Tag } from '../models/index.js'
import tagRouter from './tags.js'
import errorHandler from '../middlewares/errorHandler.js'

describe('Tags API', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    app.use('/', tagRouter)
    app.use(errorHandler)
  })

  it('GET / returns all tags', async () => {
    Tag.findAll.mockResolvedValue([{ id: 1, name: 'tagA' }])
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'tagA' }])
  })

  it('GET /:id returns single tag', async () => {
    Tag.findByPk.mockResolvedValue({ id: 2, name: 'tagB' })
    const res = await request(app).get('/2')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('tagB')
  })

  it('GET /:id returns 404 if tag not found', async () => {
    Tag.findByPk.mockResolvedValue(null)
    const res = await request(app).get('/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Tag was not found')
  })

  it('POST / creates a tag', async () => {
    const newTag = { id: 3, name: 'tagC', color: '#fff' }
    Tag.create.mockResolvedValue(newTag)

    const res = await request(app)
      .post('/')
      .send({ name: 'tagC', color: '#fff' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(newTag)
  })

  it('POST / returns 400 if name is missing', async () => {
    const res = await request(app).post('/').send({ color: '#fff' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Name is required')
  })

  it('POST / returns 400 if color is missing', async () => {
    const res = await request(app).post('/').send({ name: 'MissingColor' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Color is required')
  })

  it('PUT /:id updates a tag', async () => {
    Tag.update.mockResolvedValue([1])
    Tag.findByPk.mockResolvedValue({ id: 4, name: 'tagUpdated', color: '#000' })

    const res = await request(app)
      .put('/4')
      .send({ name: 'tagUpdated', color: '#000' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('tagUpdated')
  })

  it('PUT /:id returns 404 if tag not found', async () => {
    Tag.update.mockResolvedValue([0])
    const res = await request(app).put('/404').send({ name: 'x', color: 'y' })

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Tag not found')
  })

  it('PUT /:id returns 400 if name or color missing', async () => {
    const res = await request(app).put('/4').send({ name: 'incomplete' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Color is required')
  })

  it('DELETE /:id removes a tag', async () => {
    Tag.destroy.mockResolvedValue(1)
    const res = await request(app).delete('/5')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Tag deleted successfully')
  })

  it('DELETE /:id returns 404 if tag does not exist', async () => {
    Tag.destroy.mockResolvedValue(0)
    const res = await request(app).delete('/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Tag not found')
  })
})
