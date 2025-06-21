import winston from 'winston'

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

export const logAction = (userId, action) => {
  const message = `User ${userId} performed action: ${action}`
  logger.info(message)
}

export const logDebug = (message) => {
  logger.debug(message)
}

export const logWarning = (message) => {
  logger.warn(message)
}

export const logError = (message) => {
  logger.error(message)
}

export { logger }
