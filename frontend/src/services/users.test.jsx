import { describe, test, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import userService from './users'
import apiUrl from '../config/config'

vi.mock('axios')

describe('usersService', () => {
  afterEach(() => {
    vi.clearAllMocks() // Clear mocks after each test
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

  test('getSingle fetches a single user successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe' }

    // Mock resolved value for axios.get
    axios.get.mockResolvedValueOnce({ data: mockUser })

    const result = await userService.getSingle(1)

    // Ensure the correct API endpoint is called
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users/1`)
    // Ensure the returned data matches the mock
    expect(result).toEqual(mockUser)
  })

  test('getSingle handles fetch error for a single user', async () => {
    const errorMessage = 'User not found'
    axios.get.mockRejectedValueOnce(new Error(errorMessage))

    await expect(userService.getSingle(1)).rejects.toThrow(errorMessage)

    // Ensure the correct API endpoint is called
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/users/1`)
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

  test('update puts updated user successfully', async () => {
    const updatedUser = { id: 1, name: 'Updated User' }

    // Mock resolved value for axios.put
    axios.put.mockResolvedValueOnce({ data: updatedUser })

    const result = await userService.update(1, updatedUser)

    // Ensure the correct API endpoint and data are used
    expect(axios.put).toHaveBeenCalledWith(`${apiUrl}/api/users/1`, updatedUser)
    // Ensure the returned data matches the mock
    expect(result).toEqual(updatedUser)
  })

  test('update handles put error', async () => {
    const updatedUser = { id: 1, name: 'Updated User' }
    const errorMessage = 'Failed to update user'

    axios.put.mockRejectedValueOnce(new Error(errorMessage))

    await expect(userService.update(1, updatedUser)).rejects.toThrow(
      errorMessage
    )

    // Ensure the correct API endpoint and data are used
    expect(axios.put).toHaveBeenCalledWith(`${apiUrl}/api/users/1`, updatedUser)
  })
})
