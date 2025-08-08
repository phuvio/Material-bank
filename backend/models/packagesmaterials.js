import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

class PackagesMaterial extends Model {}

PackagesMaterial.init(
  {
    package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'packages',
        key: 'id',
      },
    },
    material_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'materials',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'PackagesMaterial',
    tableName: 'packages_materials',
  }
)

export default PackagesMaterial
