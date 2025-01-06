import { describe, test, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import materialService from './materials'
import apiUrl from '../config/config'

// Mock axios
vi.mock('axios')

describe('materialService', () => {
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

    // Check that axios.get was called with the correct API URL
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials`)
    // Check that the result matches the mock data
    expect(result).toEqual(mockMaterials)
  })

  test('getAll handles fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'))

    // Expect the error to be thrown
    await expect(materialService.getAll()).rejects.toThrow('Network Error')

    // Check that axios.get was called with the correct API URL
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials`)
  })

  test('create posts a new material successfully', async () => {
    const newMaterial = { name: 'New Material' }
    const createdMaterial = { id: 3, name: 'New Material' }

    axios.post.mockResolvedValueOnce({ data: createdMaterial })

    const result = await materialService.create(newMaterial)

    // Check that axios.post was called with the correct URL and data
    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/materials`,
      newMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
    // Check that the result matches the mock created material
    expect(result).toEqual(createdMaterial)
  })

  test('create handles post error', async () => {
    const newMaterial = { name: 'New Material' }
    axios.post.mockRejectedValueOnce(new Error('Failed to create material'))

    // Expect the error to be thrown
    await expect(materialService.create(newMaterial)).rejects.toThrow(
      'Failed to create material'
    )

    // Check that axios.post was called with the correct URL and data
    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/materials`,
      newMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  })

  test('getSingle fetches a single material successfully', async () => {
    const mockMaterial = { id: 1, name: 'Material 1' }

    axios.get.mockResolvedValueOnce({ data: mockMaterial })

    const result = await materialService.getSingle(1)

    // Check that axios.get was called with the correct API URL
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials/1`)
    // Check that the result matches the mock data
    expect(result).toEqual(mockMaterial)
  })

  test('getSingle handles fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Material not found'))

    // Expect the error to be thrown
    await expect(materialService.getSingle(1)).rejects.toThrow(
      'Material not found'
    )

    // Check that axios.get was called with the correct API URL
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/materials/1`)
  })

  test('update updates a material successfully', async () => {
    const updatedMaterial = { id: 1, name: 'Updated Material' }

    axios.put.mockResolvedValueOnce({ data: updatedMaterial })

    const result = await materialService.update(1, updatedMaterial)

    // Check that axios.put was called with the correct URL, data, and headers
    expect(axios.put).toHaveBeenCalledWith(
      `${apiUrl}/api/materials/1`,
      updatedMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
    // Check that the result matches the mock updated material
    expect(result).toEqual(updatedMaterial)
  })

  test('update handles update error', async () => {
    const updatedMaterial = { id: 1, name: 'Updated Material' }

    axios.put.mockRejectedValueOnce(new Error('Failed to update material'))

    // Expect the error to be thrown
    await expect(materialService.update(1, updatedMaterial)).rejects.toThrow(
      'Failed to update material'
    )

    // Check that axios.put was called with the correct URL, data, and headers
    expect(axios.put).toHaveBeenCalledWith(
      `${apiUrl}/api/materials/1`,
      updatedMaterial,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  })

  test('remove deletes a material successfully', async () => {
    const removedMaterial = { id: 1, name: 'Material to Remove' }

    axios.delete.mockResolvedValueOnce({ data: removedMaterial })

    const result = await materialService.remove(1)

    // Check that axios.delete was called with the correct API URL
    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/api/materials/1`)
    // Check that the result matches the mock removed material
    expect(result).toEqual(removedMaterial)
  })

  test('remove handles delete error', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Failed to delete material'))

    // Expect the error to be thrown
    await expect(materialService.remove(1)).rejects.toThrow(
      'Failed to delete material'
    )

    // Check that axios.delete was called with the correct API URL
    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/api/materials/1`)
  })
})
