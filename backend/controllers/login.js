const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../config/database')
const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/CustomError')

router.post('/', async (req, res, next) => {
  const body = req.body

  try {
    const users = await User.findAll()
    const user = users.find((u) => {
      return u.username === body.username
    })

    const passwordCorrect = await bcrypt.compare(body.password, user.password)

    if (!user || !passwordCorrect) {
      throw CustomError('invalid username or password', 401)
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

    res.status(200).send({ token, loggedInUser })
  } catch (error) {
    next(error)
  }
})

module.exports = router
