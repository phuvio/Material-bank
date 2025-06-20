import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

class Tag extends Model {}

Tag.init(
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
    color: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'Tag',
    tableName: 'tags',
  }
)

export default Tag
