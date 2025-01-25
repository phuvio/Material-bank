const CustomError = require('../utils/CustomError')

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ error: error.message })
  } else {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = errorHandler
