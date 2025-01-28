const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../config/database')
const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')

router.post('/', async (req, res, next) => {
  const body = req.body

  try {
    const users = await User.findAll()
    const user = users.find((u) => {
      return u.username === body.username
    })

    if (!user) {
      throw new CustomError('invalid username or password', 401)
    }

    const passwordCorrect = await bcrypt.compare(body.password, user.password)

    if (!user || !passwordCorrect) {
      throw new CustomError('invalid username or password', 401)
    }

    const userForToken = {
      fullname: user.first_name + ' ' + user.last_name,
      username: user.username,
      user_id: user.id,
      role: user.role,
    }

    const token = jwt.sign(userForToken, SECRET)

    res.status(200).send({ token })
  } catch (error) {
    next(error)
  }
})

module.exports = router
