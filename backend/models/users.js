const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')
const bcrypt = require('bcrypt')
const { encrypt, decrypt } = require('../utils/encryptions')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      get() {
        const encryptedValue = this.getDataValue('username')
        const iv = this.getDataValue('username_iv')
        return encryptedValue ? decrypt(encryptedValue, iv) : null
      },
      set(value) {
        const { iv, encryptedData } = encrypt(value)
        this.setDataValue('username', encryptedData)
        this.setDataValue('username_iv', iv)
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const encryptedValue = this.getDataValue('first_name')
        const iv = this.getDataValue('first_name_iv')
        return encryptedValue ? decrypt(encryptedValue, iv) : null
      },
      set(value) {
        const { iv, encryptedData } = encrypt(value)
        this.setDataValue('first_name', encryptedData)
        this.setDataValue('first_name_iv', iv)
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const encryptedValue = this.getDataValue('last_name')
        const iv = this.getDataValue('last_name_iv')
        return encryptedValue ? decrypt(encryptedValue, iv) : null
      },
      set(value) {
        const { iv, encryptedData } = encrypt(value)
        this.setDataValue('last_name', encryptedData)
        this.setDataValue('last_name_iv', iv)
      },
    },
    username_iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name_iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name_iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
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
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10
        user.password = await bcrypt.hash(user.password, saltRounds)
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = 10
          user.password = await bcrypt.hash(user.password, saltRounds)
        }
      },
    },
  }
)

module.exports = User
