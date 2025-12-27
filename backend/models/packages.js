import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

class Package extends Model {}

Package.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'Package',
    tableName: 'packages',
  }
)

export default Package
