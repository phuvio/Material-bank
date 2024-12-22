import { describe, test, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import materialService from './materials'
import apiUrl from '../config/config'

vi.mock('axios')

describe('apiService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getAll fetches all materials successfully', async () => {
    const mockMaterials = [
      { id: 1, name: 'Material 1' },
      { id: 2, name: 'Material 2' },
    ]

    axios.get.mockResolvedValueOnce({ data: mockMaterials })

    const result = await materialService.getAll()

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials`)
    expect(result).toEqual(mockMaterials)
  })

  test('getAll handles fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'))

    await expect(materialService.getAll()).rejects.toThrow('Network Error')

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials`)
  })

  test('create posts a new material successfully', async () => {
    const newMaterial = { name: 'New Material' }
    const createdMaterial = { id: 3, name: 'New Material' }

    axios.post.mockResolvedValueOnce({ data: createdMaterial })

    const result = await materialService.create(newMaterial)

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/materials`,
      newMaterial
    )
    expect(result).toEqual(createdMaterial)
  })

  test('create handles post error', async () => {
    const newMaterial = { name: 'New Material' }
    axios.post.mockRejectedValueOnce(new Error('Failed to create material'))

    await expect(materialService.create(newMaterial)).rejects.toThrow(
      'Failed to create material'
    )

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/materials`,
      newMaterial
    )
  })
})
