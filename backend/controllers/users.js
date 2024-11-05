const router = require('express').Router()

const { User } = require('../models/index')

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving users' })
  }
})

router.post('/', async (req, res) => {
  const { username, first_name, last_name, password, role } = req.body

  try {
    const user = User.create({
      username,
      first_name,
      last_name,
      password,
      role,
    })
    res.status(201).json(user)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'Error saving user' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error retrieving user' })
  }
})

module.exports = router
