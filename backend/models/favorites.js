const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

class Favorite extends Model {}

Favorite.init(
  {
    material_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'materials',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'Favorite',
    tableName: 'favorites',
  }
)

module.exports = Favorite
