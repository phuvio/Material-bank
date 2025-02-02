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

    if (!passwordCorrect) {
      throw new CustomError('invalid username or password', 401)
    }

    const userForToken = {
      fullname: user.first_name + ' ' + user.last_name,
      username: user.username,
      user_id: user.id,
      role: user.role,
    }

    const accessToken = jwt.sign(userForToken, SECRET, { expiresIn: '2m' })
    const refreshToken = jwt.sign(userForToken, SECRET, { expiresIn: '2d' })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    res.status(200).send({ accessToken })
  } catch (error) {
    next(error)
  }
})

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' })
  }

  jwt.verify(refreshToken, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    const newAccessToken = jwt.sign(
      {
        fullname: user.fullname,
        username: user.username,
        user_id: user.user_id,
        role: user.role,
      },
      SECRET,
      { expiresIn: '2m' }
    )

    res.status(200).json({ accessToken: newAccessToken })
  })
})

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router
