/* eslint-disable prettier/prettier */
/* eslint-disable multiline-ternary */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { logAction } = require('./utils/logger')
const rateLimit = require('express-rate-limit')

const materialsRouter = require('./controllers/materials')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const tagRouter = require('./controllers/tags')
const favoriteRouter = require('./controllers/favorites')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

// Global rate limiter (e.g., 200 requests per 15 min for all routes)
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { error: 'Too many requests, slow down!' },
  headers: true,
})

let allowedOrigins

process.env.NODE_ENV === 'production'
  ? (allowedOrigins = [
    'https://material-bank-backend-449a0f56d7d0.herokuapp.com',
  ])
  : (allowedOrigins = ['http://localhost:5173'])

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logAction(`Server running on port ${PORT}`)
})
