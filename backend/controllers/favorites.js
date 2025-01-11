const router = require('express').Router()
const { Favorite, User, Material } = require('../models/index')

router.post('/:userId/:materialId', async (req, res) => {
  const { userId, materialId } = req.params

  try {
    const user = await User.findByPk(userId)
    const material = await Material.findByPk(materialId)

    if (!user || !material) {
      return res.status(404).json({ error: 'User or material not found' })
    }

    const existingFavorites = await Favorite.findOne({
      where: { user_id: userId, material_id: materialId },
    })

    if (existingFavorites) {
      return res.status(400).json({ error: 'Material is already in favorites' })
    }

    const favorite = await Favorite.create({
      user_id: userId,
      material_id: materialId,
    })

    return res.status(200).json(favorite)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:userId/:materialId', async (req, res) => {
  const { userId, materialId } = req.params

  try {
    const favorite = await Favorite.findOne({
      where: { user_id: userId, material_id: materialId },
    })

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' })
    }

    await favorite.destroy()

    return res.status(200).json({ message: 'Favorite removed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
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
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
