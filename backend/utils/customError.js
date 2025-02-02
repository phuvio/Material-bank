const { logError } = require('../utils/logger')
class CustomError extends Error {
  constructor(message, statusCode) {
    logError(message, 'Error')
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = CustomError
