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

  it.skip('should handle 401 error and refresh token', async () => {
    // Mock refreshToken to return a new token
    loginService.refreshToken.mockResolvedValue('new-access-token')

    // Simulate a 401 error
    const errorResponse = {
      response: { status: 401 },
      config: { _retry: false },
    }
    console.log('errorResponse', errorResponse)

    const originalRequest = {
      _retry: false,
      headers: {},
    }

    // Mock the response interceptor logic directly
    const interceptorRejected = vi.fn().mockImplementation(async (error) => {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true

        try {
          const newAccessToken = await loginService.refreshToken()
          if (newAccessToken) {
            console.log('newAccessToken', newAccessToken)
            localStorage.setItem('accessToken', newAccessToken)
            console.log('error config', error)
            if (!error.config.headers) {
              error.config.headers = {}
            }
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
            console.log('error header', error.config.headers)
            console.log('Retrying with config:', error.config)
            // Retry the original request with new token
            return axios(error.config) // Retry the request with updated headers
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (refreshError) {
          localStorage.clear()
          window.location.href = '/login' // Redirect to login
          throw refreshError
        }
      }
      throw error
    })
    console.log('next stage')
    // Replace the interceptor temporarily with our mock
    axiosInstance.interceptors.response.eject(1) // Eject previous interceptor
    axiosInstance.interceptors.response.use(undefined, interceptorRejected)

    // Simulate the 401 error
    const promise = interceptorRejected(errorResponse)

    // Wait for the promise to resolve after refreshing the token
    await promise

    // Expect refreshToken to have been called
    expect(loginService.refreshToken).toHaveBeenCalled()

    // Check that the token is set in the headers after refresh
    expect(originalRequest.headers['Authorization']).toBe(
      'Bearer new-access-token'
    )
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
