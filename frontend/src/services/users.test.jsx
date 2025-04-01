import { describe, it, expect, vi } from 'vitest'
import api from './api'
import userService from './users'

// Mock the 'api' module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

describe('User Service API', () => {
  it('fetches all users', async () => {
    const mockResponse = { data: [{ id: 1, name: 'John Doe' }] }
    api.get.mockResolvedValue(mockResponse)

    const users = await userService.getAll()

    expect(users).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/users')
  })

  it('fetches a single user', async () => {
    const mockResponse = { data: { id: 1, name: 'John Doe' } }
    api.get.mockResolvedValue(mockResponse)

    const user = await userService.getSingle(1)

    expect(user).toEqual(mockResponse.data)
    expect(api.get).toHaveBeenCalledWith('/api/users/1')
  })

  it('creates a new user', async () => {
    const newUser = { name: 'John Doe' }
    const mockResponse = { data: { id: 1, ...newUser } }
    api.post.mockResolvedValue(mockResponse)

    const createdUser = await userService.create(newUser)

    expect(createdUser).toEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith('/api/users', newUser)
  })

  it('updates a user', async () => {
    const updatedUser = { name: 'John Doe Updated' }
    const mockResponse = { data: { id: 1, ...updatedUser } }
    api.put.mockResolvedValue(mockResponse)

    const user = await userService.update(1, updatedUser)

    expect(user).toEqual(mockResponse.data)
    expect(api.put).toHaveBeenCalledWith('/api/users/1', updatedUser)
  })

  it('updates a user password', async () => {
    const password = 'newpassword'
    const mockResponse = { data: { id: 1, password } }
    api.put.mockResolvedValue(mockResponse)

    const updatedPassword = await userService.updatePassword(1, password)

    expect(updatedPassword).toEqual(mockResponse.data)
    expect(api.put).toHaveBeenCalledWith(
      '/api/users/update-password/1',
      password
    )
  })
})
