const router = require('express').Router()
const { Tag } = require('../models/index')
const CustomError = require('../utils/customError')

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.findAll()
    res.json(tags)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) {
      throw new CustomError('Tag was not found', 404)
    }
    res.json(tag)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  const { name, color } = req.body
  if (!name) {
    throw new CustomError('Name is required', 400)
  } else if (!color) {
    throw new CustomError('Color is required', 400)
  }

  try {
    const result = await Tag.create({ name, color })
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  const { name, color } = req.body
  if (!name) {
    throw new CustomError('Name is required', 400)
  } else if (!color) {
    throw new CustomError('Color is required', 400)
  }

  try {
    const result = await Tag.update(
      { name, color },
      { where: { id: req.params.id } }
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Tag.destroy({ where: { id: req.params.id } })
    if (result === 0) {
      throw new CustomError('Tag not found', 404)
    }
    res.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
