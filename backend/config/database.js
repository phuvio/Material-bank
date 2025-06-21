import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'
import { logError } from '../utils/logger.js'

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

sequelize
  .authenticate()
  .then(() => {
    logError('Connection to the database has been established successfully.')
  })
  .catch((err) => {
    logError('Unable to connect to the database:', err)
  })

export const SECRET = process.env.SECRET
export const REFRESH_SECRET = process.env.REFRESH_SECRET
