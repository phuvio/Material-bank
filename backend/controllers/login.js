const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { logAction } = require('../utils/logger')

const { SECRET, REFRESH_SECRET } = require('../config/database')
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

    const accessToken = jwt.sign(userForToken, SECRET, { expiresIn: '15min' })
    const refreshToken = jwt.sign(userForToken, REFRESH_SECRET, {
      expiresIn: '7d',
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    })

    logAction(user.id, 'Logged in')
    res.status(200).send({ accessToken })
  } catch (error) {
    next(error)
  }
})

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw new CustomError('Refresh token missing', 401)
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
      if (err) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        })
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
        { expiresIn: '15min' }
      )

      res.status(200).json({ accessToken: newAccessToken })
    })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router
