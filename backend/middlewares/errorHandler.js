const CustomError = require('../utils/customError')
const { logError } = require('../utils/logger')

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ error: error.message })
  } else {
    logError(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = errorHandler
