const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10
        user.password = await bcrypt.hash(user.password, saltRounds)

        user.username = crypto
          .createHash('sha265')
          .update(user.username)
          .digest('hex')
        user.first_name = crypto
          .createHash('sha265')
          .update(user.first_name)
          .digest('hex')
        user.last_name = crypto
          .createHash('sha265')
          .update(user.last_name)
          .digest('hex')
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = 10
          user.password = await bcrypt.hash(user.password, saltRounds)
        }
      },
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'User',
    tableName: 'users',
  }
)

module.exports = User
