import rateLimit from 'express-rate-limit'

const routeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests to this endpoint, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export default routeLimiter
