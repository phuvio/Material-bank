import jwt from 'jsonwebtoken'
import { logAction } from '../utils/logger.js'

const authenticateToken = (allowedRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }
  logAction('token accepted', token)
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' })
    }

    req.user = decoded
    next()
  } catch (error) {
    logAction(error)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' })
    }

    return res.status(403).json({ message: 'Invalid token' })
  }
}

export default authenticateToken
