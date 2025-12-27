import { describe, it, expect, vi } from 'vitest'
import api from './api'
import favoriteService from './favorites'

// Mock the 'api' module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Favorite Service API', () => {
  it('fetches a favorite by id', async () => {
    const mockResponse = { data: { userId: 1, materialId: 1 } }
    api.get.mockResolvedValue(mockResponse)

    const favorite = await favoriteService.get(1)

    expect(favorite).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/favorites/1')
  })

  it('creates a new favorite', async () => {
    const userId = 1
    const materialId = 1
    const mockResponse = { data: { userId, materialId } }
    api.post.mockResolvedValue(mockResponse)

    const createdFavorite = await favoriteService.create(userId, materialId)

    expect(createdFavorite).toEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith(
      `/api/favorites/${userId}/${materialId}`,
      {}
    )
  })

  it('removes a favorite', async () => {
    const userId = 1
    const materialId = 1
    const mockResponse = { data: { userId, materialId } }
    api.delete.mockResolvedValue(mockResponse)

    const removedFavorite = await favoriteService.remove(userId, materialId)

    expect(removedFavorite).toEqual(mockResponse.data)
    expect(api.delete).toHaveBeenCalledWith(
      `/api/favorites/${userId}/${materialId}`
    )
  })
})
