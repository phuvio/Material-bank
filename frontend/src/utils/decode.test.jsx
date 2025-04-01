import { vi, describe, it, expect, beforeEach } from 'vitest'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'
import decodeToken from '../utils/decode'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
}))

describe('decodeToken', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    delete window.location
    window.location = { assign: vi.fn() }
  })

  it('returns null if no token is in localStorage', async () => {
    const result = await decodeToken()
    expect(result).toBeNull()
  })

  it('returns decoded token if it is not expired', async () => {
    const mockToken = 'valid.token.here'
    const mockDecoded = { exp: Date.now() / 1000 + 3600, user: 'testUser' }
    localStorage.setItem('accessToken', mockToken)
    jwtDecode.mockReturnValue(mockDecoded)

    const result = await decodeToken()
    expect(result).toEqual(mockDecoded)
    expect(jwtDecode).toHaveBeenCalledWith(mockToken)
  })

  it('attempts to refresh token if expired and succeeds', async () => {
    const expiredToken = 'expired.token.here'
    const newToken = 'new.token.here'
    const expiredDecoded = { exp: Date.now() / 1000 - 10, user: 'testUser' }
    const newDecoded = { exp: Date.now() / 1000 + 3600, user: 'testUser' }
    localStorage.setItem('accessToken', expiredToken)
    jwtDecode
      .mockReturnValueOnce(expiredDecoded)
      .mockReturnValueOnce(newDecoded)
    api.post.mockResolvedValue({ data: { accessToken: newToken } })

    const result = await decodeToken()
    expect(api.post).toHaveBeenCalledWith('/refresh')
    expect(localStorage.getItem('accessToken')).toBe(newToken)
    expect(result).toEqual(newDecoded)
  })

  it('clears localStorage and redirects if refresh fails', async () => {
    const expiredToken = 'expired.token.here'
    const expiredDecoded = { exp: Date.now() / 1000 - 10, user: 'testUser' }
    localStorage.setItem('accessToken', expiredToken)
    jwtDecode.mockReturnValue(expiredDecoded)
    api.post.mockRejectedValue(new Error('Refresh failed'))

    const result = await decodeToken()

    expect(api.post).toHaveBeenCalledWith('/refresh')
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(window.location.assign).toHaveBeenCalledWith('/')
    expect(result).toBeNull()
  })
})
