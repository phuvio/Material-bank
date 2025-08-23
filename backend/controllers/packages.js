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
            through: { attributes: ['position'] },
          },
        ],
        order: [[Material, PackagesMaterial, 'position', 'ASC']],
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
          materialIds.map((m) => ({
            package_id: newPackage.id,
            material_id: m.id,
            position: m.position,
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

router.put(
  '/:id',
  routeLimiter,
  authenticateToken(['admin']),
  async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
      const packageId = req.params.id

      if (!packageId) {
        throw new CustomError('Package ID is required', 400)
      }

      const { name, description, materialIds } = req.body

      if (!name) {
        throw new CustomError('Name is required', 400)
      }
      if (!description) {
        throw new CustomError('Description is required', 400)
      }

      const packageToUpdate = await Package.findByPk(packageId)
      if (!packageToUpdate) {
        throw new CustomError('Package not found', 404)
      }

      packageToUpdate.name = name
      packageToUpdate.description = description

      await packageToUpdate.save({ transaction })

      await PackagesMaterial.destroy({
        where: { package_id: packageToUpdate.id },
        transaction,
      })

      if (materialIds.length > 0) {
        await PackagesMaterial.bulkCreate(
          materialIds.map((m) => ({
            package_id: packageToUpdate.id,
            material_id: m.id,
            position: m.position,
          })),
          { transaction }
        )
      }

      await transaction.commit()

      const updatedPackage = await Package.findByPk(packageToUpdate.id, {
        include: [
          {
            model: Material,
            attributes: ['id', 'name', 'visible', 'is_url', 'url'],
          },
        ],
      })

      logAction(packageToUpdate.id, 'Package updated')
      res.json(updatedPackage)
    } catch (error) {
      logError(error)
      await transaction.rollback()
      next(new CustomError('Failed to update package', 400))
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
