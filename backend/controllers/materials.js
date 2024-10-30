const router = require('express').Router()
const sequelize = require('../config/database')
const { QueryTypes } = require('sequelize')

const { Material } = require('../models/index')

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
  try {
    const result = await Material.findOne({
      attributes: [
        'id',
        'name',
        'description',
        'user_id',
        'visible',
        'is_url',
        'url',
        'updated_at',
      ],
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

router.get('/:id/material', async (req, res) => {
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

router.post('/', async (req, res) => {
  try {
    const result = await Material.create(req.body)
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error saving material' })
  }
})

router.post('/:id', async (req, res) => {
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

module.exports = router
