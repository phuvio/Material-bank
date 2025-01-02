import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import tagService from './tags'
import apiUrl from '../config/config'

vi.mock('axios') // Mock the axios module

describe('tagsService', () => {
  const mockTags = [
    { id: 1, name: 'Tag1', color: '#ff0000' },
    { id: 2, name: 'Tag2', color: '#00ff00' },
  ]
  const newTag = { name: 'Tag3', color: '#0000ff' }

  it('should fetch all tags', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTags })
    const result = await tagService.getAll()
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/tags`)
    expect(result).toEqual(mockTags)
  })

  it('should create a new tag', async () => {
    axios.post.mockResolvedValueOnce({ data: { ...newTag, id: 3 } })
    const result = await tagService.create(newTag)
    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/api/tags`, newTag)
    expect(result).toEqual({ ...newTag, id: 3 })
  })

  it('should fetch a single tag by ID', async () => {
    const tagId = 1
    axios.get.mockResolvedValueOnce({ data: mockTags[0] })
    const result = await tagService.getSingle(tagId)
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/tags/${tagId}`)
    expect(result).toEqual(mockTags[0])
  })

  it('should update an existing tag', async () => {
    const tagId = 1
    const updatedTag = { ...mockTags[0], name: 'UpdatedTag1' }
    axios.put.mockResolvedValueOnce({ data: updatedTag })
    const result = await tagService.update(tagId, updatedTag)
    expect(axios.put).toHaveBeenCalledWith(
      `${apiUrl}/api/tags/${tagId}`,
      updatedTag
    )
    expect(result).toEqual(updatedTag)
  })

  it('should delete a tag', async () => {
    const tagId = 1
    axios.delete.mockResolvedValueOnce({ data: {} })
    const result = await tagService.remove(tagId)
    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/api/tags/${tagId}`)
    expect(result).toEqual({})
  })

  it('should handle errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'))
    await expect(tagService.getAll()).rejects.toThrow('Network error')
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/tags`)

    axios.delete.mockRejectedValueOnce(new Error('Network error'))
    await expect(tagService.remove(1)).rejects.toThrow('Network error')
    expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/api/tags/1`)
  })
})
