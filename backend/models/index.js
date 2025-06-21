import Material from './materials.js'
import User from './users.js'
import Tag from './tags.js'
import TagsMaterial from './tagsmaterials.js'
import Favorite from './favorites.js'

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

await Material.sync()
await User.sync()
await Tag.sync()
await Favorite.sync()

export { Material, User, Tag, TagsMaterial, Favorite }
