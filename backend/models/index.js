import Material from './materials.js'
import User from './users.js'
import Tag from './tags.js'
import TagsMaterial from './tagsmaterials.js'
import Favorite from './favorites.js'
import Package from './packages.js'
import PackagesMaterial from './packagesmaterials.js'

User.hasMany(Material, { foreignKey: 'user_id' })
Material.belongsTo(User, { foreignKey: 'user_id' })

Tag.belongsToMany(Material, { through: TagsMaterial, foreignKey: 'tag_id' })
Material.belongsToMany(Tag, {
  through: TagsMaterial,
  foreignKey: 'material_id',
})

Material.belongsToMany(User, { through: Favorite, foreignKey: 'material_id' })
User.belongsToMany(Material, { through: Favorite, foreignKey: 'user_id' })

Favorite.belongsTo(Material, { foreignKey: 'material_id' })
Material.hasMany(Favorite, { foreignKey: 'material_id' })

Package.belongsToMany(Material, {
  through: PackagesMaterial,
  foreignKey: 'package_id',
})
Material.belongsToMany(Package, {
  through: PackagesMaterial,
  foreignKey: 'material_id',
})

export async function syncDatabase() {
  const env = process.env.NODE_ENV

  if (env === 'production') {
    console.warn('syncDatabase() skipped in production.')
    return
  }

  const syncOptions = env === 'test' ? { force: true } : {}

  await User.sync(syncOptions)
  await Material.sync(syncOptions)
  await Tag.sync(syncOptions)
  await TagsMaterial.sync(syncOptions)
  await Favorite.sync(syncOptions)
  await Package.sync(syncOptions)
  await PackagesMaterial.sync(syncOptions)
}

export {
  Material,
  User,
  Tag,
  TagsMaterial,
  Favorite,
  Package,
  PackagesMaterial,
}
