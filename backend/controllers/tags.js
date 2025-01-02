const router = require('express').Router()
const { Tag } = require('../models/index')

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll()
    res.json(tags)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving tags' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) {
      return res.status(404).json({ error: 'Tag was not found' })
    }
    res.json(tag)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving tag' })
  }
})

router.post('/', async (req, res) => {
  const { name, color } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  } else if (!color) {
    return res.status(400).json({ error: 'Color is required' })
  }

  try {
    const result = await Tag.create({ name, color })
    res.status(201).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creating tag' })
  }
})

router.put('/:id', async (req, res) => {
  const { name, color } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  } else if (!color) {
    return res.status(400).json({ error: 'Color is required' })
  }

  try {
    const result = await Tag.update(
      { name, color },
      { where: { id: req.params.id } }
    )
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error updating tag' })
  }

  router.delete('/:id', async (req, res) => {
    try {
      const result = await Tag.destroy({ where: { id: req.params.id } })
      if (result === 0) {
        return res.status(404).json({ error: 'Tag not found' })
      }
      res.json({ message: 'Tag deleted successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error deleting tag' })
    }
  })
})

module.exports = router
