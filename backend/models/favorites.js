import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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

export default Favorite
