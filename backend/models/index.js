const Material = require('./materials')
const User = require('./users')
const Tag = require('./tags')
const TagsMaterial = require('./tagsmaterials')
const Favorite = require('./favorites')

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

Material.sync()
User.sync()
Tag.sync()
Favorite.sync()

module.exports = {
  Material,
  User,
  Tag,
  TagsMaterial,
  Favorite,
}
