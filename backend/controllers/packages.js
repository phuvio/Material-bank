/* eslint-disable multiline-ternary */
import { Router } from 'express'
import { sequelize } from '../config/database.js'
import { Package, Material } from '../models/index.js'
import CustomError from '../utils/customError.js'
import authenticateToken from '../middlewares/authMiddleware.js'
import { logAction, logError } from '../utils/logger.js'
import routeLimiter from '../utils/routeLimiter.js'
import PackagesMaterial from '../models/packagesmaterials.js'

const router = Router()

router.get(
  '/',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    try {
      const packages = await Package.findAll()
      res.json(packages)
    } catch (error) {
      next(error)
    }
  }
)

router.get(
  '/:id',
  routeLimiter,
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    try {
      const onePackage = await Package.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'name', 'description'],
        include: [
          {
            model: Material,
            attributes: ['id', 'name', 'visible', 'is_url', 'url'],
          },
        ],
      })

      if (!onePackage) {
        throw new CustomError('Package was not found', 404)
      }
      res.json(onePackage)
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/',
  routeLimiter,
  authenticateToken(['admin']),
  async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
      const { name, description } = req.body
      if (!name) {
        throw new CustomError('Name is required', 400)
      }
      if (!description) {
        throw new CustomError('Description is required', 400)
      }

      const newPackage = await Package.create(
        { name, description },
        { transaction }
      )

      const materialIds = req.body.materialIds

      if (materialIds.length > 0) {
        await PackagesMaterial.bulkCreate(
          materialIds.map((material_id) => ({
            package_id: newPackage.id,
            material_id,
          })),
          { transaction }
        )
      }

      await transaction.commit()

      const packageWithMaterials = await Package.findByPk(newPackage.id, {
        include: [
          {
            model: Material,
            attributes: ['id', 'name', 'visible', 'is_url', 'url'],
          },
        ],
      })

      logAction(newPackage.id, 'New package created')
      res.status(201).json(packageWithMaterials)
    } catch (error) {
      logError(error)
      await transaction.rollback()
      next(new CustomError('Failed to create package', 400))
    }
  }
)

router.delete(
  '/:id',
  routeLimiter,
  authenticateToken(['admin']),
  async (req, res, next) => {
    try {
      const packageToDelete = await Package.findByPk(req.params.id)
      if (!packageToDelete) {
        throw new CustomError('Package not found', 404)
      }

      await PackagesMaterial.destroy({
        where: { package_id: req.params.id },
      })

      await packageToDelete.destroy()

      logAction(packageToDelete.id, 'Package deleted')
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

export default router
