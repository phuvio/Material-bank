require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pg = require('pg')

const app = express()
const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

app.use(cors())

app.get('/api/materials', async (req, res) => {
  try {
    const materials = await pool.query(
      'SELECT id, name, description, visible, is_URL FROM materials WHERE visible=True'
    )
    res.json(materials.rows) 
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving materials' })
  }
})

app.get('/api/materials/:id', async (req, res) => {
  const material_id = req.params.id
  console.log(material_id)
  try {
    const result = await pool.query(
      'SELECT id, name, description, visible, is_URL, URL FROM materials WHERE id=$1',
      [material_id]
    )
    console.log(result)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material was not found' })
    }
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

app.post('/api/materials', async (req, res) => {
  const { name, description, user_id, visible, is_URL, URL, material } =
    req.body
  try {
    const result = await pool.query(
      'INSERT INTO materials (name, description, user_id, visible, is_URL, URL, material) \
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, user_id, visible, is_URL, URL, material]
    )
    console.log(result)
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error saving material' })
  }
})

app.post('/api/materials/:id', async (req, res) => {
  const { name, description, user_id, visible, is_URL, URL, material } =
    req.body
  const id = req.params
  try {
    const result = await pool.query(
      'UPDATE materials SET name = $1, description = $2, visible = $3, is_URL = $4, URL = $5, material = $6 \
        WHERE id = $7 RETURNING *',
      [name, description, visible, is_URL, URL, material, id]
    )
    console.log(result)
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error saving material' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
