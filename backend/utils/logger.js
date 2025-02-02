const winston = require('winston')

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`
    })
  ),
  transports: [new winston.transports.Console({ level: 'debug' })],
})

const logAction = (userId, action) => {
  const message = `User ${userId} performed action: ${action}`
  logger.info(message)
}

const logDebug = (message) => {
  logger.debug(message)
}

const logWarning = (message) => {
  logger.warn(message)
}

const logError = (message) => {
  logger.error(message)
}

module.exports = { logger, logAction, logDebug, logWarning, logError }
