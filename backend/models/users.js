const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
// eslint-disable-next-line no-global-assign, no-redeclare
const crypto = require('crypto')

// Load encryption key from environment variables
const encryptionKey = process.env.ENCRYPTION_KEY // Should be 32 bytes for AES-256
const algorithm = 'aes-256-cbc'
const iv = crypto.randomBytes(16) // Initialization vector

class User extends Model {}

// Helper functions for encryption and decryption
function encrypt(text) {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted // Store IV with encrypted data
}

function decrypt(text) {
  const [ivHex, encryptedText] = text.split(':')
  const ivBuffer = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey, 'hex'),
    ivBuffer
  )
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

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
        return encryptedValue ? decrypt(encryptedValue) : null
      },
      set(value) {
        this.setDataValue('username', encrypt(value))
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const encryptedValue = this.getDataValue('first_name')
        return encryptedValue ? decrypt(encryptedValue) : null
      },
      set(value) {
        this.setDataValue('first_name', encrypt(value))
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const encryptedValue = this.getDataValue('last_name')
        return encryptedValue ? decrypt(encryptedValue) : null
      },
      set(value) {
        this.setDataValue('last_name', encrypt(value))
      },
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
