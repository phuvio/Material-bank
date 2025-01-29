import { describe, test, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import userService from './users'
import apiUrl from '../config/config'

vi.mock('axios')
vi.mock('../utils/getAuthHeaders', () => ({
  default: vi.fn(() => ({ Authorization: 'Bearer mockToken' })),
}))

describe('usersService', () => {
  afterEach(() => {
    vi.clearAllMocks() // Clear mocks after each test
  })

  test('getAll fetches all users successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]

    axios.get.mockResolvedValueOnce({ data: mockUsers })
    const result = await userService.getAll()

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users`, {
      headers: { Authorization: 'Bearer mockToken' },
    })
    expect(result).toEqual(mockUsers)
  })

  test('getAll handles fetch error', async () => {
    const errorMessage = 'Network Error'
    axios.get.mockRejectedValueOnce(new Error(errorMessage))

    await expect(userService.getAll()).rejects.toThrow(errorMessage)
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users`, {
      headers: { Authorization: 'Bearer mockToken' },
    })
  })

  test('getSingle fetches a single user successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe' }

    axios.get.mockResolvedValueOnce({ data: mockUser })
    const result = await userService.getSingle(1)

    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users/1`, {
      headers: { Authorization: 'Bearer mockToken' },
    })
    expect(result).toEqual(mockUser)
  })

  test('create posts a new user successfully', async () => {
    const newUser = { name: 'New User' }
    const createdUser = { id: 3, name: 'New User' }

    axios.post.mockResolvedValueOnce({ data: createdUser })
    const result = await userService.create(newUser)

    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/api/users`, newUser, {
      headers: { Authorization: 'Bearer mockToken' },
    })
    expect(result).toEqual(createdUser)
  })

  test('update puts updated user successfully', async () => {
    const updatedUser = { id: 1, name: 'Updated User' }

    axios.put.mockResolvedValueOnce({ data: updatedUser })
    const result = await userService.update(1, updatedUser)

    expect(axios.put).toHaveBeenCalledWith(
      `${apiUrl}/api/users/1`,
      updatedUser,
      { headers: { Authorization: 'Bearer mockToken' } }
    )
    expect(result).toEqual(updatedUser)
  })
})
