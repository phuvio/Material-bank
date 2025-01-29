import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import getAuthHeaders from '../utils/getAuthHeaders'

// Mock localStorage
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getAuthHeaders', () => {
  test('returns Authorization header when token exists', () => {
    localStorage.getItem.mockReturnValue('test-token')
    expect(getAuthHeaders()).toEqual({ Authorization: 'Bearer test-token' })
  })

  test('returns empty object when token does not exist', () => {
    localStorage.getItem.mockReturnValue(null)
    expect(getAuthHeaders()).toEqual({})
  })
})
