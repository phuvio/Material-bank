import { describe, it, expect, vi } from 'vitest'
import api from './api'
import tagService from './tags'

// Mock the 'api' module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Tag Service API', () => {
  it('fetches all tags', async () => {
    const mockResponse = { data: [{ id: 1, name: 'tag1' }] }
    api.get.mockResolvedValue(mockResponse)

    const tags = await tagService.getAll()

    expect(tags).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/tags')
  })

  it('fetches a single tag', async () => {
    const mockResponse = { data: { id: 1, name: 'tag1' } }
    api.get.mockResolvedValue(mockResponse)

    const tag = await tagService.getSingle(1)

    expect(tag).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/tags/1')
  })

  it('creates a new tag', async () => {
    const newTag = { name: 'tag1' }
    const mockResponse = { data: { id: 1, ...newTag } }
    api.post.mockResolvedValue(mockResponse)

    const createdTag = await tagService.create(newTag)

    expect(createdTag).toEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith('/api/tags', newTag)
  })

  it('updates a tag', async () => {
    const updatedTag = { name: 'tag1 updated' }
    const mockResponse = { data: { id: 1, ...updatedTag } }
    api.put.mockResolvedValue(mockResponse)

    const tag = await tagService.update(1, updatedTag)

    expect(tag).toEqual(mockResponse.data)
    expect(api.put).toHaveBeenCalledWith('/api/tags/1', updatedTag)
  })

  it('removes a tag', async () => {
    const mockResponse = { data: { id: 1, name: 'tag1' } }
    api.delete.mockResolvedValue(mockResponse)

    const removedTag = await tagService.remove(1)

    expect(removedTag).toEqual(mockResponse.data)
    expect(api.delete).toHaveBeenCalledWith('/api/tags/1')
  })
})
