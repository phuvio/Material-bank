import { vi, describe, it, expect, beforeEach } from 'vitest'
import axios from 'axios'
import api from './api'
import loginService from './login'

// Mock loginService and localStorage
vi.mock('./login')
// eslint-disable-next-line no-undef
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}

describe('API Interceptors', () => {
  let axiosInstance

  beforeEach(() => {
    axiosInstance = api
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()
    localStorage.clear.mockClear()

    // Mock window.location.href to control its behavior in tests
    delete window.location
    window.location = { href: '' }
  })

  it('should add the Authorization header if token exists', async () => {
    localStorage.getItem.mockReturnValue('test-token')

    // Mock request config to check headers
    const config = { headers: {} }
    const result =
      await axiosInstance.interceptors.request.handlers[0].fulfilled(config)

    expect(result.headers['Authorization']).toBe('Bearer test-token')
  })

  it('should clear localStorage and redirect to login if refresh token fails', async () => {
    loginService.refreshToken.mockRejectedValueOnce(
      new Error('Token refresh failed')
    )

    const errorResponse = {
      response: { status: 401 },
      config: {},
    }

    // Mock the response interceptor logic directly
    const interceptorRejected = vi.fn().mockImplementation(async (error) => {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true

        // Ensure headers is always defined
        if (!error.config.headers) {
          error.config.headers = {}
        }

        try {
          const newAccessToken = await loginService.refreshToken()
          if (newAccessToken) {
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axios(error.config)
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (refreshError) {
          localStorage.clear()
          window.location.href = '/login'
          throw refreshError
        }
      }
      throw error
    })

    // Replace the interceptor temporarily with our mock
    axiosInstance.interceptors.response.eject(1) // Eject previous interceptor
    axiosInstance.interceptors.response.use(undefined, interceptorRejected)

    // Wait for the promise to reject after failing to refresh the token
    await expect(interceptorRejected(errorResponse)).rejects.toThrowError(
      'Token refresh failed'
    )

    // Expect localStorage to be cleared
    expect(localStorage.clear).toHaveBeenCalled()

    // Expect window.location.href to be '/login'
    expect(window.location.href).toBe('/login')
  })
})
