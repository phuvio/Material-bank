import { vi, describe, test, expect, beforeEach } from 'vitest'
import axios from 'axios'
import loginService from './login'
import apiUrl from '../config/config' // Ensure correct API base URL

// Mock axios
vi.mock('axios')

describe('loginService', () => {
  const credentials = { username: 'testuser', password: 'password123' }

  beforeEach(() => {
    vi.restoreAllMocks() // Reset all mocks before each test

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })
  })

  test('successfully logs in with valid credentials', async () => {
    // Mock the response of axios.post
    const mockResponse = {
      status: 200,
      data: {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      },
    }
    axios.post.mockResolvedValue(mockResponse)

    // Call the login function
    const result = await loginService.login(credentials)

    // Ensure axios.post was called with correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/login`,
      credentials,
      { withCredentials: true }
    )

    // Check that login function returns expected response
    expect(result).toEqual(mockResponse)
  })

  test('throws an error when login fails', async () => {
    // Mock the response of axios.post to simulate a login failure
    axios.post.mockRejectedValue({
      response: { status: 401, data: { message: 'Invalid credentials' } },
    })

    // Ensure the login function throws an error
    await expect(loginService.login(credentials)).rejects.toMatchObject({
      response: { status: 401, data: { message: 'Invalid credentials' } },
    })
  })

  test('successfully refreshes token', async () => {
    // Spy on localStorage.setItem
    vi.spyOn(localStorage, 'setItem')

    // Mock axios.post response
    const mockResponse = {
      status: 200,
      data: { accessToken: 'newMockAccessToken' },
    }
    axios.post.mockResolvedValue(mockResponse)

    // Call refreshToken function
    const newAccessToken = await loginService.refreshToken()

    // Expect axios.post to have been called with correct URL and options
    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/login/refresh`,
      {},
      { withCredentials: true }
    )

    // Expect new token to be returned
    expect(newAccessToken).toBe('newMockAccessToken')

    // Ensure localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      'newMockAccessToken'
    )
  })

  test('handles refresh token failure correctly', async () => {
    // Spy on localStorage.removeItem
    vi.spyOn(localStorage, 'removeItem')

    // Mock axios.post failure response
    axios.post.mockRejectedValue(new Error('Token refresh failed'))

    // Call refreshToken function
    const newAccessToken = await loginService.refreshToken()

    // Expect newAccessToken to be null
    expect(newAccessToken).toBeNull()

    // Ensure localStorage.removeItem was called for both tokens
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
  })
})
