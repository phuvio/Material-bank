const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

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
    is_url: {
      type: DataTypes.BOOLEAN,
    },
    url: {
      type: DataTypes.STRING(120),
    },
    material: {
      type: DataTypes.BLOB,
    },
    material_type: {
      type: DataTypes.STRING(255),
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
    modelName: 'Material',
    tableName: 'materials',
  }
)

module.exports = Material
