const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Material extends Model {}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_URL: {
      type: DataTypes.BOOLEAN,
    },
    URL: {
      type: DataTypes.STRING(120),
    },
    material: {
      type: DataTypes.BLOB,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'Material',
  }
)

module.exports = Material
