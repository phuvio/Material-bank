/* eslint-disable multiline-ternary */
import { Router } from 'express'
import { sequelize } from '../config/database.js'
import multer from 'multer'
import mime from 'mime-types'
import { Material, User, Tag, TagsMaterial } from '../models/index.js'
import CustomError from '../utils/customError.js'
import authenticateToken from '../middlewares/authMiddleware.js'
import { logError, logAction } from '../utils/logger.js'
import routeLimiter from '../utils/routeLimiter.js'

const router = Router()
const upload = multer()

// get info from all materials, but no files
router.get(
  '/',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    try {
      const materials = await Material.findAll({
        attributes: ['id', 'name', 'description', 'visible', 'is_url', 'url'],
        include: {
          model: Tag,
        },
      })
      res.json(materials)
    } catch (error) {
      next(error)
    }
  }
)

// get single material info, but not file
router.get(
  '/:id',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
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

      if (!result) {
        throw new CustomError('Material was not found', 404)
      }

      // Convert to plain object so we can safely modify the returned shape
      const material = result.get({ plain: true })

      // If the creating user was removed, return a harmless placeholder
      if (!material.User) {
        material.User = {
          first_name: 'poistettu',
          last_name: 'käyttäjä',
        }
      }

      res.json(material)
    } catch (error) {
      next(error)
    }
  }
)

// get file of a single material
router.get(
  '/:id/material',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    try {
      const material = await Material.findByPk(req.params.id, {
        attributes: ['id', 'name', 'material', 'material_type'],
      })
      if (!material || !material.material) {
        throw new CustomError('Material was not found', 404)
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

      logAction(sanitizedFileName, 'Material was downloaded')
      res.send(material.material)
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  upload.single('material'),
  async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
      const materialData = {
        name: req.body.name,
        description: req.body.description,
        user_id: req.body.user_id,
        visible: req.body.visible,
        is_url: req.body.is_url,
        url: req.body.url || null,
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

      logAction(material.user_id, 'User uploaded material')
      logAction(material.name, 'Material was uploaded')
      res.status(201).json(materialWithTags)
    } catch (error) {
      logError(error)
      await transaction.rollback()
      next(new CustomError('Error saving material', 400))
    }
  }
)

router.put(
  '/:id',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  upload.single('material'),
  async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
      const materialId = req.params.id

      if (!materialId) {
        throw new CustomError('Material ID is needed for update', 400)
      }

      const { name, description, tagIds } = req.body

      const updateData = { name, description }
      if (req.file) {
        updateData.material = req.file.buffer
        updateData.material_type = req.file.mimetype
      }

      const [affectedRows] = await Material.update(updateData, {
        where: { id: materialId },
        transaction,
      })

      if (affectedRows === 0) {
        await transaction.rollback()
        throw new CustomError('Material not found', 404)
      }

      if (tagIds) {
        const parsedTagIds = JSON.parse(tagIds)

        await TagsMaterial.destroy({
          where: { material_id: materialId },
          transaction,
        })

        await TagsMaterial.bulkCreate(
          parsedTagIds.map((tag_id) => ({
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

      logAction(updatedMaterial.name, 'Material was updated')
      res.status(200).json(updatedMaterial)
    } catch (error) {
      logError(error)
      if (!transaction.finished) {
        await transaction.rollback()
      }

      next(
        error instanceof CustomError
          ? error
          : new CustomError('Error saving material', 400)
      )
    }
  }
)

router.delete(
  '/:id',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    try {
      const result = await Material.destroy({ where: { id: req.params.id } })
      if (result === 0) {
        return res.status(404).json({ error: 'Material not found' })
      }
      logAction(req.params.id, 'Material was deleted')
      res.json({ message: 'Material deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
)

export default router
