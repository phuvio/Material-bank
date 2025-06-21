import CustomError from '../utils/customError.js'
import { logError } from '../utils/logger.js'

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ error: error.message })
  } else {
    logError(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default errorHandler
