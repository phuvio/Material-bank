import { vi, describe, test, expect } from 'vitest'
import axios from 'axios'
import loginService from './login' // Adjust the import path to where your login function is defined

// Mocking axios.post
vi.mock('axios')

describe('loginService', () => {
  const credentials = { username: 'testuser', password: 'password123' }

  test('successfully logs in with valid credentials', async () => {
    // Arrange: Mock the response of axios.post
    const mockResponse = { data: { token: 'some-jwt-token' } }
    axios.post.mockResolvedValue(mockResponse)

    // Act: Call the login function
    const result = await loginService.login(credentials)

    // Assert: Ensure axios.post was called with correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/login',
      credentials
    )

    // Assert: Check the result returned by the login function
    expect(result).toEqual(mockResponse)
  })

  test('throws an error when login fails', async () => {
    // Arrange: Mock the response of axios.post to simulate an error
    axios.post.mockRejectedValue(new Error('Login failed'))

    // Act & Assert: Ensure that the login function throws an error
    await expect(loginService.login(credentials)).rejects.toThrow(
      'Login failed'
    )
  })
})
