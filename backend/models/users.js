const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

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
      type: DataTypes.BLOB,
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
  }
)

module.exports = User
