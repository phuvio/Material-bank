const router = require('express').Router()
const sequelize = require('../config/database')
const multer = require('multer')
const { QueryTypes } = require('sequelize')
const { Material, User } = require('../models/index')

const upload = multer()

// get info from all materials, but no files
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

// get single material info, but not file
router.get('/:id', async (req, res) => {
  try {
    const result = await Material.findOne({
      attributes: [
        'name',
        'description',
        'user_id',
        'visible',
        'is_url',
        'url',
        'updated_at',
      ],
      include: {
        model: User,
        attributes: [
          'first_name',
          'last_name',
          'first_name_iv',
          'last_name_iv',
        ],
      },
      where: { id: req.params.id },
    })
    console.log(JSON.stringify(result))
    if (!result) {
      return res.status(404).json({ error: 'Material was not found' })
    }
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

// get file of a single material
router.get('/:id/material', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      attributes: ['id', 'name', 'material', 'material_type'],
    })
    if (!material || !material.material) {
      return res.status(404).json({ error: 'Material was not found' })
    }
    res.setHeader(
      'Content-Type',
      material.material_type || 'application/octet-stream'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${material.name}.${material.material_type.split('/')[1] || 'bin'}"`
    )
    res.send(material.material)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

router.post('/', upload.single('material'), async (req, res) => {
  try {
    const materialData = {
      name: req.body.name,
      description: req.body.description,
      user_id: req.body.user_id,
      visible: req.body.visible,
      is_url: req.body.is_url,
      url: req.body.url ? req.body.url : null,
      material: req.file ? req.file.buffer : null,
      material_type: req.file ? req.file.mimetype : null,
    }

    const result = await Material.create(materialData)
    console.log(JSON.stringify(result))
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
