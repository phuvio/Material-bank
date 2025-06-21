import { Router } from 'express'
import { Favorite, User, Material } from '../models/index.js'
import CustomError from '../utils/customError.js'
import authenticateToken from '../middlewares/authMiddleware.js'

const router = Router()

router.post(
  '/:userId/:materialId',
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    const { userId, materialId } = req.params

    try {
      const user = await User.findByPk(userId)
      const material = await Material.findByPk(materialId)

      if (!user || !material) {
        throw new CustomError('User or material not found', 404)
      }

      const existingFavorite = await Favorite.findOne({
        where: { user_id: userId, material_id: materialId },
      })

      if (existingFavorite) {
        throw new CustomError('Material is already in favorites', 400)
      }

      await Favorite.create({ user_id: userId, material_id: materialId })

      const materialDetails = {
        id: material.id,
        name: material.name,
        is_url: material.is_url,
        url: material.url,
      }

      return res.status(200).json(materialDetails)
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/:userId/:materialId',
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    const { userId, materialId } = req.params

    try {
      const favorite = await Favorite.findOne({
        where: { user_id: userId, material_id: materialId },
      })

      if (!favorite) {
        throw new CustomError('Favorite not found', 404)
      }

      await favorite.destroy()

      return res.status(200).json({ message: 'Favorite removed' })
    } catch (error) {
      next(error)
    }
  }
)

router.get(
  '/:userId',
  authenticateToken(['admin', 'moderator', 'basic']),
  async (req, res, next) => {
    const { userId } = req.params

    try {
      const user = await User.findByPk(userId)

      if (!user) {
        throw new CustomError('User not found', 404)
      }

      const favorites = await Favorite.findAll({
        where: { user_id: userId },
        attributes: ['id'],
        include: [
          {
            model: Material,
            attributes: ['id', 'name', 'is_url', 'url'],
          },
        ],
      })

      const materialDetails = favorites.map((fav) => ({
        id: fav.Material.id,
        name: fav.Material.name,
        is_url: fav.Material.is_url,
        url: fav.Material.url,
      }))

      return res.status(200).json(materialDetails)
    } catch (error) {
      next(error)
    }
  }
)

export default router
