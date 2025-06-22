/* eslint-disable indent */
/* eslint-disable multiline-ternary */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { logAction } from './utils/logger.js'
import materialsRouter from './controllers/materials.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import tagRouter from './controllers/tags.js'
import favoriteRouter from './controllers/favorites.js'
import errorHandler from './middlewares/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.set('trust proxy', 1)

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.headers.host + req.url)
    }
    next()
  })
}

// Global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, slow down!' },
  headers: true,
})

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        'https://www.prone-materiaalipankki.fi',
        'https://material-bank-backend-449a0f56d7d0.herokuapp.com',
      ]
    : ['http://localhost:3000', 'http://localhost:5173']

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
  })
)

app.use('/api', globalRateLimiter)
app.use(express.json())
app.use(cookieParser())

app.use('/api/materials', materialsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/tags', tagRouter)
app.use('/api/favorites', favoriteRouter)
app.use(errorHandler)

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', globalRateLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logAction(`Server running on port ${PORT}`)
})
