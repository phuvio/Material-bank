import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import favorites from './favorites'
import apiUrl from '../config/config'

// Mock the axios module
vi.mock('axios')

describe('favorites API', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should fetch favorites for a given user ID', async () => {
      const userId = 123
      const mockData = [
        { id: 1, name: 'Material 1', is_url: false, url: null },
        { id: 2, name: 'Material 2', is_url: true, url: 'http://example.com' },
      ]

      // Mock axios.get
      axios.get.mockResolvedValue({ data: mockData })

      const result = await favorites.get(userId)

      expect(axios.get).toHaveBeenCalledWith(
        `${apiUrl}/api/favorites/${userId}`
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('create', () => {
    it('should add a new favorite for a user and material', async () => {
      const userId = 123
      const materialId = 456
      const mockResponse = {
        id: 1,
        name: 'New Material',
        is_url: true,
        url: 'http://example.com',
      }

      // Mock axios.post
      axios.post.mockResolvedValue({ data: mockResponse })

      const result = await favorites.create(userId, materialId)

      expect(axios.post).toHaveBeenCalledWith(
        `${apiUrl}/api/favorites/${userId}/${materialId}`
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('remove', () => {
    it('should remove a favorite for a user and material', async () => {
      const userId = 123
      const materialId = 456
      const mockResponse = { message: 'Favorite removed' }

      // Mock axios.delete
      axios.delete.mockResolvedValue({ data: mockResponse })

      const result = await favorites.remove(userId, materialId)

      expect(axios.delete).toHaveBeenCalledWith(
        `${apiUrl}/api/favorites/${userId}/${materialId}`
      )
      expect(result).toEqual(mockResponse)
    })
  })
})
