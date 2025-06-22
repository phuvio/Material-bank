import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { logAction } from '../utils/logger.js'
import { SECRET, REFRESH_SECRET } from '../config/database.js'
import { User } from '../models/index.js'
import bcrypt from 'bcrypt'
import CustomError from '../utils/customError.js'
import routeLimiter from '../utils/routeLimiter.js'
import cryptoRandomString from 'crypto-random-string'

const router = Router()

router.post('/', routeLimiter, async (req, res, next) => {
  const body = req.body
  try {
    const users = await User.findAll()
    const user = users.find((u) => u.username === body.username)

    if (!user) {
      throw new CustomError('Invalid username or password', 401)
    }

    const passwordCorrect = await bcrypt.compare(body.password, user.password)
    if (!passwordCorrect) {
      throw new CustomError('Invalid username or password', 401)
    }

    const csrfToken = cryptoRandomString({ length: 32 })

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
    })

    const userForToken = {
      fullname: user.first_name + ' ' + user.last_name,
      username: user.username,
      user_id: user.id,
      role: user.role,
    }

    const accessToken = jwt.sign(userForToken, SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(userForToken, REFRESH_SECRET, {
      expiresIn: '7d',
    })

    // Clear old cookie and set new one
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    })

    logAction(user.id, 'Logged in')
    res.status(200).json({ accessToken })
  } catch (error) {
    next(error)
  }
})

router.post('/refresh', routeLimiter, async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    const csrfCookie = req.cookies.csrfToken
    const csrfHeader = req.get('X-CSRF-Token')
    console.log('refresh cookies:', req.cookies)
    console.log('refresh csrf header:', req.get('X-CSRF-Token'))

    if (!refreshToken) {
      throw new CustomError('Refresh token missing', 401)
    }

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ error: 'Invalid CSRF token' })
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
      if (err) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
          path: '/',
        })
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Refresh token expired' })
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({ error: 'Invalid refresh token' })
        }

        return next(err)
      }

      const newAccessToken = jwt.sign(
        {
          fullname: user.fullname,
          username: user.username,
          user_id: user.user_id,
          role: user.role,
        },
        SECRET,
        { expiresIn: '15m' }
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

export default router
