import { logError } from '../utils/logger.js'

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    logError(message, 'Error')
  }
}

export default CustomError
