import { describe, test, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import userService from './users'
import apiUrl from '../config/config'

vi.mock('axios')

describe('usersService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getAll fetches all users successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]

    // Mock resolved value for axios.get
    axios.get.mockResolvedValueOnce({ data: mockUsers })

    const result = await userService.getAll()

    // Ensure the correct API endpoint is called
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users`)
    // Ensure the returned data matches the mock
    expect(result).toEqual(mockUsers)
  })

  test('getAll handles fetch error', async () => {
    const errorMessage = 'Network Error'
    axios.get.mockRejectedValueOnce(new Error(errorMessage))

    await expect(userService.getAll()).rejects.toThrow(errorMessage)

    // Ensure the correct API endpoint is called
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users`)
  })

  test('create posts a new user successfully', async () => {
    const newUser = { name: 'New User' }
    const createdUser = { id: 3, name: 'New User' }

    // Mock resolved value for axios.post
    axios.post.mockResolvedValueOnce({ data: createdUser })

    const result = await userService.create(newUser)

    // Ensure the correct API endpoint and data are used
    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/api/users`, newUser)
    // Ensure the returned data matches the mock
    expect(result).toEqual(createdUser)
  })

  test('create handles post error', async () => {
    const newUser = { name: 'New User' }
    const errorMessage = 'Failed to create user'

    axios.post.mockRejectedValueOnce(new Error(errorMessage))

    await expect(userService.create(newUser)).rejects.toThrow(errorMessage)

    // Ensure the correct API endpoint and data are used
    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/api/users`, newUser)
  })
})
