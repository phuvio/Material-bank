import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import loginService from './login'

vi.mock('axios')

describe('loginService', () => {
  const accessToken = 'mock-access-token'
  const credentials = { username: 'test', password: 'pass' }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      clear: vi.fn(),
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('login', () => {
    it('stores token and returns response on success', async () => {
      const response = { data: { accessToken } }
      axios.post.mockResolvedValue(response)

      const result = await loginService.login(credentials)

      expect(result).toEqual(response)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      )
    })

    it('returns null and logs warning if no accessToken in response', async () => {
      axios.post.mockResolvedValue({ data: {} })

      const result = await loginService.login(credentials)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalled()
    })

    it('throws error if login fails', async () => {
      const error = new Error('Login failed')
      axios.post.mockRejectedValue(error)

      await expect(loginService.login(credentials)).rejects.toThrow(
        'Login failed'
      )
      expect(console.error).toHaveBeenCalledWith('Login error:', error)
    })
  })

  describe('refreshToken', () => {
    it('stores and returns new token on success', async () => {
      const response = { status: 200, data: { accessToken } }
      axios.post.mockResolvedValue(response)

      const token = await loginService.refreshToken()

      expect(token).toBe(accessToken)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      )
    })

    it('returns null if response is invalid', async () => {
      axios.post.mockResolvedValue({ status: 200, data: {} })

      const token = await loginService.refreshToken()

      expect(token).toBeNull()
      expect(console.warn).toHaveBeenCalledWith('Failed to refresh token')
    })

    it('clears storage and returns null on error', async () => {
      const error = new Error('Refresh failed')
      axios.post.mockRejectedValue(error)

      const token = await loginService.refreshToken()

      expect(token).toBeNull()
      expect(localStorage.clear).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith(
        'Error refreshing token:',
        error
      )
    })
  })

  describe('logout', () => {
    it('logs error on failure', async () => {
      const error = new Error('Logout failed')
      axios.post.mockRejectedValue(error)

      await loginService.logout()

      expect(console.error).toHaveBeenCalledWith('Erron logging out', error)
    })
  })
})
