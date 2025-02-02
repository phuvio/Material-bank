import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import getAuthHeaders from '../utils/getAuthHeaders'
import decodeToken from './decode'

// Mocking decodeToken and navigate
vi.mock('./decode', () => ({
  __esModule: true,
  default: vi.fn(),
}))

// Mocking navigate from react-router-dom
const navigate = vi.fn()

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem') // Mocking localStorage.getItem
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getAuthHeaders', () => {
  test('returns Authorization header when token exists and is valid', () => {
    localStorage.getItem.mockReturnValue('test-token')
    decodeToken.mockReturnValue(true) // Simulating a valid token

    const result = getAuthHeaders(navigate)
    expect(result).toEqual({ Authorization: 'Bearer test-token' })
    expect(navigate).not.toHaveBeenCalled() // Ensure navigate was not called
  })

  test('returns empty object and redirects to login when token does not exist', () => {
    localStorage.getItem.mockReturnValue(null)
    decodeToken.mockReturnValue(false) // Simulating an invalid token

    const result = getAuthHeaders(navigate)
    expect(result).toEqual({})
    expect(navigate).toHaveBeenCalledWith('/') // Ensure navigation to '/login'
  })

  test('returns empty object and redirects to login when token is invalid', () => {
    localStorage.getItem.mockReturnValue('invalid-token')
    decodeToken.mockReturnValue(false) // Simulating an invalid token

    const result = getAuthHeaders(navigate)
    expect(result).toEqual({})
    expect(navigate).toHaveBeenCalledWith('/') // Ensure navigation to '/login'
  })

  test('returns empty object and redirects to login when token is specifically "invalid-token"', () => {
    localStorage.getItem.mockReturnValue('invalid-token')
    decodeToken.mockReturnValue(true) // Simulating a valid decode for an invalid token

    const result = getAuthHeaders(navigate)
    expect(result).toEqual({})
    expect(navigate).toHaveBeenCalledWith('/') // Ensure navigation to '/login'
  })
})
