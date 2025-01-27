const router = require('express').Router()
const { Favorite, User, Material } = require('../models/index')
const CustomError = require('../utils/CustomError')

router.post('/:userId/:materialId', async (req, res, next) => {
  const { userId, materialId } = req.params

  try {
    const user = await User.findByPk(userId)
    const material = await Material.findByPk(materialId)

    if (!user || !material) {
      throw new CustomError('User or material not found', 404)
    }

    const existingFavorites = await Favorite.findOne({
      where: { user_id: userId, material_id: materialId },
    })

    if (existingFavorites) {
      throw new CustomError('Material is already in favorites', 400)
    }

    await Favorite.create({
      user_id: userId,
      material_id: materialId,
    })

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
})

router.delete('/:userId/:materialId', async (req, res, next) => {
  const { userId, materialId } = req.params

  try {
    const favorite = await Favorite.findOne({
      where: { user_id: userId, material_id: materialId },
    })

    if (!favorite) {
      throw new CustomError('Favorite not found', 400)
    }

    await favorite.destroy()

    return res.status(200).json({ message: 'Favorite removed' })
  } catch (error) {
    next(error)
  }
})

router.get('/:userId', async (req, res, next) => {
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

    const materialDetails = favorites.map((favorite) => ({
      id: favorite.Material.id,
      name: favorite.Material.name,
      is_url: favorite.Material.is_url,
      url: favorite.Material.url,
    }))

    return res.status(200).json(materialDetails)
  } catch (error) {
    next(error)
  }
})

module.exports = router
