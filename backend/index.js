/* eslint-disable prettier/prettier */
/* eslint-disable multiline-ternary */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const materialsRouter = require('./controllers/materials')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

let allowedOrigins
console.log('Node_env', process.env.NODE_ENV)
console.log('Frontend dist path:', path.join(__dirname, '../frontend/dist'))
process.env.NODE_ENV === 'production'
  ? (allowedOrigins = [
    'https://material-bank-backend-449a0f56d7d0.herokuapp.com',
  ])
  : (allowedOrigins = ['http://localhost:3001'])

app.use(cors({ origin: allowedOrigins }))

app.use(express.json())

app.use('/api/materials', materialsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
