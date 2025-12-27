import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./logger', () => {
  return {
    logError: vi.fn(),
  }
})

import CustomError from './customError'
import * as logger from './logger'

describe('CustomError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls logError with the message and "Error" level', () => {
    const message = 'Something went wrong'
    const statusCode = 400
    new CustomError(message, statusCode)

    expect(logger.logError).toHaveBeenCalledWith(message, 'Error')
  })

  it('sets message and statusCode properties correctly', () => {
    const message = 'Another error'
    const statusCode = 404
    const error = new CustomError(message, statusCode)

    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
  })
})
