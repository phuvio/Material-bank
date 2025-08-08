import { Router } from 'express'
import { Package, Material } from '../models/index.js'
import CustomError from '../utils/customError.js'
import authenticateToken from '../middlewares/authMiddleware.js'
import { logAction } from '../utils/logger.js'
import routeLimiter from '../utils/routeLimiter.js'

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

export default router
