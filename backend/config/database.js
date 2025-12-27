/* eslint-disable multiline-ternary */
/* eslint-disable prettier/prettier */
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}

import { Sequelize } from 'sequelize'
import { logError } from '../utils/logger.js'

const isTest = process.env.NODE_ENV === 'test'

const databaseUrl = isTest ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL

export const sequelize = new Sequelize(databaseUrl, {
  dialectOptions: isTest
    ? {}
    : {
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
