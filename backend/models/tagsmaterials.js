import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

class TagsMaterial extends Model {}

TagsMaterial.init(
  {
    material_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'materials',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'TagsMaterials',
    tableName: 'tags_materials',
  }
)

export default TagsMaterial
