const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../config/database')
const { User } = require('../models/index')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
  const body = req.body

  try {
    const users = await User.findAll()
    const user = users.find((u) => {
      return u.username === body.username
    })

    if (!user) {
      return res.status(401).json({
        error: 'invalid username or password',
      })
    }
    const passwordCorrect = await bcrypt.compare(body.password, user.password)

    if (!user && passwordCorrect) {
      return res.status(401).json({
        error: 'invalid username or password',
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    const fullName = user.first_name + ' ' + user.last_name
    const loggedInUser = {
      fullname: fullName,
      username: user.username,
      user_id: user.id,
      role: user.role,
    }
    console.log('logged in user in back:', loggedInUser)

    res.status(200).send(loggedInUser)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
