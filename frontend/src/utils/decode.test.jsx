import { vi, describe, test, expect, beforeEach } from 'vitest'
import decodeToken from './decode'
import { jwtDecode } from 'jwt-decode'

// Mock the jwt-decode library
vi.mock('jwt-decode')

describe('decodeToken', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear()
  })

  test('should return decoded token for a valid token', () => {
    const mockToken = 'valid_token'
    const decodedPayload = {
      exp: Math.floor(Date.now() / 1000) + 60,
      fullname: 'Test User',
      username: 'test_user',
      role: 'admin',
      user_id: 123,
    }

    // Mock jwtDecode to return a valid decoded token
    jwtDecode.mockReturnValue(decodedPayload)

    // Call decodeToken with a mock token
    const result = decodeToken(mockToken)

    // Assert that the decoded token is returned correctly
    expect(result).toEqual(decodedPayload)
  })

  test('should return null for an expired token', () => {
    const mockToken = 'expired_token'
    const expiredPayload = {
      exp: Math.floor(Date.now() / 1000) - 60,
      fullname: 'Test User',
      username: 'test_user',
      role: 'admin',
      user_id: 123,
    }

    // Mock jwtDecode to return an expired decoded token
    jwtDecode.mockReturnValue(expiredPayload)

    // Call decodeToken with the expired token
    const result = decodeToken(mockToken)

    // Assert that the result is null due to expiration
    expect(result).toBeNull()
  })

  test('should return null if an error occurs during decoding', () => {
    const mockToken = 'invalid_token'

    // Mock jwtDecode to throw an error
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    // Call decodeToken with the invalid token
    const result = decodeToken(mockToken)

    // Assert that the result is null due to the decoding error
    expect(result).toBeNull()
  })

  test('should return null if no token is provided and localStorage is empty', () => {
    // Call decodeToken without passing a token and with empty localStorage
    const result = decodeToken()

    // Assert that the result is null because no token is provided
    expect(result).toBeNull()
  })

  test('should return decoded token from localStorage if no token is provided', () => {
    const mockToken = 'valid_token_from_localStorage'
    const decodedPayload = {
      exp: Math.floor(Date.now() / 1000) + 60,
      fullname: 'Test User',
      username: 'test_user',
      role: 'admin',
      user_id: 123,
    }

    // Mock jwtDecode to return a valid decoded token
    jwtDecode.mockReturnValue(decodedPayload)

    // Set the token in localStorage
    window.localStorage.setItem('token', mockToken)

    // Call decodeToken without passing a token
    const result = decodeToken()

    // Assert that the decoded token from localStorage is returned
    expect(result).toEqual(decodedPayload)
  })
})
