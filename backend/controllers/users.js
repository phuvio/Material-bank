const router = require('express').Router()
const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')
const authenticateToken = require('../middlewares/authMiddleware')
const { logAction } = require('../utils/logger')

router.get('/', authenticateToken(['admin']), async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', authenticateToken(['admin']), async (req, res, next) => {
  const { username, first_name, last_name, password, role } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = User.create({
      username,
      first_name,
      last_name,
      password: hashedPassword,
      role,
    })
    logAction(user.username, 'New user created')
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', authenticateToken(['admin']), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      throw new CustomError('Error saving user', 404)
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', authenticateToken(['admin']), async (req, res, next) => {
  try {
    const userId = req.params.id

    if (!userId) {
      throw new CustomError('User ID is needed for update', 400)
    }

    const { first_name, last_name, password, role } = req.body

    const updateData = {}
    if (first_name) updateData.first_name = first_name
    if (last_name) updateData.last_name = last_name
    if (role) updateData.role = role
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    const [affectedRows] = await User.update(updateData, {
      where: { id: userId },
    })

    if (affectedRows === 0) {
      throw new CustomError('User not found', 404)
    }

    const updatedUser = await User.findByPk(userId)

    logAction(updatedUser.userId, 'User was updated')
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.put(
  '/update-password/:id',
  authenticateToken(['admin']),
  async (req, res, next) => {
    try {
      const userId = req.params.id
      const { old_password, new_password } = req.body

      if (!old_password || !new_password) {
        throw new CustomError('Old and new passwords are required', 400)
      }

      const user = await User.findByPk(userId)
      if (!user) {
        throw new CustomError('User not found', 404)
      }

      const isPasswordCorrect = await bcrypt.compare(
        old_password,
        user.password
      )
      if (!isPasswordCorrect) {
        throw new CustomError('Incorrect old password', 400)
      }

      if (new_password === old_password) {
        throw new CustomError(
          'New password cannot be the same as the old password',
          400
        )
      }

      const hashedPassword = await bcrypt.hash(new_password, 10)

      const [affectedRows] = await User.update(
        { password: hashedPassword },
        { where: { id: userId } }
      )

      if (affectedRows === 0) {
        throw new CustomError('User was not found', 400)
      }

      res.status(200)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
