import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import pg from 'pg'

dotenv.config()

const app = express()
const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
})

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/materials', async (req, res) => {
  const materials = await (await pool.query('SELECT id, name, description, visible, is_URL FROM materials WHERE visible=True'))
  res.json(materials.rows)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
