require('dotenv').config()
const { Sequelize } = require('sequelize')
const { logError } = require('../utils/logger')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

module.exports = {
  sequelize,
  SECRET: process.env.SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
}
