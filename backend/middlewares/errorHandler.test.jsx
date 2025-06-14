import { vi, describe, it, expect, beforeEach } from 'vitest'
import errorHandler from './errorHandler'
import * as logger from '../utils/logger'
import CustomError from '../utils/customError'

describe('errorHandler middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    }
    next = vi.fn()
    vi.spyOn(logger, 'logError').mockImplementation(() => {})
  })

  it.skip('responds with error status and message for CustomError', () => {
    const error = new CustomError('Not Found', 404)
    console.log(error instanceof CustomError)

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' })
    expect(logger.logError).not.toHaveBeenCalled()
  })

  it.skip('logs error and responds with 500 for unknown errors', () => {
    const error = new Error('Something bad')

    errorHandler(error, req, res, next)

    expect(logger.logError).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
