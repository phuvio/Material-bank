const router = require('express').Router()
const { sequelize } = require('../config/database')
const multer = require('multer')
const mime = require('mime-types')
const { Material, User, Tag, TagsMaterial } = require('../models/index')

const upload = multer()

// get info from all materials, but no files
router.get('/', async (req, res) => {
  try {
    const materials = await Material.findAll({
      attributes: ['id', 'name', 'description', 'visible', 'is_url', 'url'],
      include: {
        model: Tag,
      },
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
      where: { id: req.params.id },
      attributes: [
        'name',
        'description',
        'user_id',
        'visible',
        'is_url',
        'url',
        'updated_at',
      ],
      include: [
        {
          model: User,
          attributes: [
            'first_name',
            'last_name',
            'first_name_iv',
            'last_name_iv',
          ],
        },
        {
          model: Tag,
          attributes: ['id', 'name', 'color'],
        },
      ],
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
    const mimeType =
      material.material_type?.trim() || 'application/octet-stream'
    const getFileExtension = (mimeType) => {
      const extension = mime.extension(mimeType)
      return (
        extension ||
        {
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            'docx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            'xlsx',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            'pptx',
        }[mimeType] ||
        'bin'
      )
    }
    const fileExtension = getFileExtension(mimeType)
    const sanitizedFileName = encodeURIComponent(material.name).replace(
      /%20/g,
      '_'
    )
    res.setHeader('Content-Type', mimeType)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sanitizedFileName}.${fileExtension}"`
    )
    res.send(material.material)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving material' })
  }
})

router.post('/', upload.single('material'), async (req, res) => {
  const transaction = await sequelize.transaction()
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

    const material = await Material.create(materialData, { transaction })

    const tagIds = req.body.tagIds ? JSON.parse(req.body.tagIds) : []

    if (tagIds.length > 0) {
      await TagsMaterial.bulkCreate(
        tagIds.map((tag_id) => ({
          material_id: material.id,
          tag_id,
        })),
        { transaction }
      )
    }

    await transaction.commit()

    const materialWithTags = await Material.findByPk(material.id, {
      include: [
        {
          model: Tag,
          attributes: ['id', 'name', 'color'],
        },
      ],
    })

    res.status(200).json(materialWithTags)
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    res.status(400).json({ error: 'Error saving material' })
  }
})

router.put('/:id', upload.single('material'), async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const materialId = req.params.id

    if (!materialId) {
      return res.status(400).json({ error: 'Material ID is needed for update' })
    }

    const { name, description, tagIds } = req.body

    const [affectedRows] = await Material.update(
      { name, description },
      { where: { id: materialId }, transaction }
    )

    if (affectedRows === 0 && !tagIds) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Material not found' })
    }

    if (tagIds) {
      const parseTagIds = JSON.parse(tagIds)

      await TagsMaterial.destroy({
        where: { material_id: materialId },
        transaction,
      })

      await TagsMaterial.bulkCreate(
        parseTagIds.map((tag_id) => ({
          material_id: materialId,
          tag_id,
        })),
        { transaction }
      )
    }

    await transaction.commit()

    const updatedMaterial = await Material.findByPk(materialId, {
      include: [
        {
          model: Tag,
          attributes: ['id', 'name', 'color'],
        },
      ],
    })

    res.status(200).json(updatedMaterial)
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    res.status(400).json({ error: 'Error saving material' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Material.destroy({ where: { id: req.params.id } })
    if (result === 0) {
      return res.status(404).json({ error: 'Material not found' })
    }
    res.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error deleting material' })
  }
})

module.exports = router
