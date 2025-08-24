import { describe, it, expect, vi } from 'vitest'
import api from './api'
import packageService from './packages'

// Mock the 'api' module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Package Service API', () => {
  it('fetches all packages', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Package A' }] }
    api.get.mockResolvedValue(mockResponse)

    const packages = await packageService.getAll()

    expect(packages).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/packages')
  })

  it('fetches a single package', async () => {
    const mockResponse = { data: { id: 1, name: 'Package A' } }
    api.get.mockResolvedValue(mockResponse)

    const pkg = await packageService.getSingle(1)

    expect(pkg).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/packages/1')
  })

  it('creates a new package', async () => {
    const newPackage = {
      name: 'Package A',
      description: 'Description of Package A',
    }
    const mockResponse = { data: { id: 1, ...newPackage } }
    api.post.mockResolvedValue(mockResponse)

    const createdPackage = await packageService.create(newPackage)

    expect(createdPackage).toEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith('/api/packages', newPackage)
  })

  it('updates a package', async () => {
    const updatedPackage = {
      name: 'Package A Updated',
      description: 'Updated description of Package A',
    }
    const mockResponse = { data: { id: 1, ...updatedPackage } }
    api.put.mockResolvedValue(mockResponse)

    const pkg = await packageService.update(1, updatedPackage)

    expect(pkg).toEqual(mockResponse.data)
    expect(api.put).toHaveBeenCalledWith('/api/packages/1', updatedPackage)
  })

  it('deletes a package', async () => {
    const mockResponse = { status: 200, data: {} }
    api.delete.mockResolvedValue(mockResponse)

    const response = await packageService.remove(1)

    expect(response).toEqual(mockResponse.data)
    expect(api.delete).toHaveBeenCalledWith('/api/packages/1')
  })
})
