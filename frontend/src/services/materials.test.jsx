import { describe, it, expect, vi } from 'vitest'
import api from './api'
import materialService from './materials'

// Mock the 'api' module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Material Service API', () => {
  it('fetches all materials', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Material 1' }] }
    api.get.mockResolvedValue(mockResponse)

    const materials = await materialService.getAll()

    expect(materials).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/materials')
  })

  it('fetches a single material', async () => {
    const mockResponse = { data: { id: 1, name: 'Material 1' } }
    api.get.mockResolvedValue(mockResponse)

    const material = await materialService.getSingle(1)

    expect(material).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/materials/1')
  })

  it('creates a new material', async () => {
    const newMaterial = { name: 'Material 1' }
    const mockResponse = { data: { id: 1, ...newMaterial } }
    api.post.mockResolvedValue(mockResponse)

    const createdMaterial = await materialService.create(newMaterial)

    expect(createdMaterial).toEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith(
      '/api/materials',
      newMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  })

  it('updates a material', async () => {
    const updatedMaterial = { name: 'Material 1 Updated' }
    const mockResponse = { data: { id: 1, ...updatedMaterial } }
    api.put.mockResolvedValue(mockResponse)

    const material = await materialService.update(1, updatedMaterial)

    expect(material).toEqual(mockResponse.data)
    expect(api.put).toHaveBeenCalledWith(
      '/api/materials/1',
      updatedMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  })

  it('removes a material', async () => {
    const mockResponse = { data: { id: 1, name: 'Material 1' } }
    api.delete.mockResolvedValue(mockResponse)

    const removedMaterial = await materialService.remove(1)

    expect(removedMaterial).toEqual(mockResponse.data)
    expect(api.delete).toHaveBeenCalledWith('/api/materials/1')
  })
})
