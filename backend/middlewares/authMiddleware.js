const jwt = require('jsonwebtoken')
const { logAction } = require('../utils/logger')

const authenticateToken = (allowedRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }
  logAction('token accepted')
  try {
    const decoded = jwt.verify(token, process.env.SECRET)

    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' })
    }

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' })
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

module.exports = authenticateToken
