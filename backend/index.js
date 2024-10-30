require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const sequelize = require('./config/database')
const { QueryTypes } = require('sequelize')
const Material = require('./models/materials')

const app = express()

let allowedOrigins

if (process.env.NODE_ENV === 'production') {
  allowedOrigins = ['https://material-bank-backend-449a0f56d7d0.herokuapp.com']
} else {
  allowedOrigins = ['http://localhost:5173']
}

app.use(cors({ origin: allowedOrigins }))

app.use(express.json())

app.get('/api/materials', async (req, res) => {
  try {
    const materials = await Material.findAll({
      attributes: ['id', 'name', 'description', 'visible', 'is_url', 'url'],
    })
    res.json(materials)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving materials' })
  }
})

app.get('/api/materials/:id', async (req, res) => {
  try {
    const result = await Material.findOne({
      attributes: ['id', 'name', 'description', 'visible', 'is_url', 'url'],
      where: { id: req.params.id },
    })
    console.log(result)
    if (!result) {
      return res.status(404).json({ error: 'Material was not found' })
    }
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

app.get('/api/materials/:id/material', async (req, res) => {
  try {
    const result = await Material.findOne({
      attributes: ['material'],
      where: { id: req.params.id },
    })
    console.log(result)
    if (!result) {
      return res.status(404).json({ error: 'Material was not found' })
    }
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

app.post('/api/materials', async (req, res) => {
  try {
    const result = await Material.create(req.body)
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error saving material' })
  }
})

app.post('/api/materials/:id', async (req, res) => {
  const { name, description, visible, is_URL, URL, material } = req.body
  const id = req.params.id
  try {
    const result = await sequelize.query(
      'UPDATE materials SET name = $1, description = $2, visible = $3, is_URL = $4, URL = $5, material = $6 \
        WHERE id = $7 RETURNING *',
      [name, description, visible, is_URL, URL, material, id],
      { type: QueryTypes.UPDATE }
    )
    console.log(result)
    res.json(result[0])
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error saving material' })
  }
})

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
