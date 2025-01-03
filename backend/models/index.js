const Material = require('./materials')
const User = require('./users')
const Tag = require('./tags')
const TagsMaterial = require('./tagsmaterials')

User.hasMany(Material, { foreignKey: 'user_id' })
Material.belongsTo(User, { foreignKey: 'user_id' })

Tag.belongsToMany(Material, { through: TagsMaterial, foreignKey: 'tag_id' })
Material.belongsToMany(Tag, {
  through: TagsMaterial,
  foreignKey: 'material_id',
})

Material.sync()
User.sync()
Tag.sync()

module.exports = {
  Material,
  User,
  Tag,
  TagsMaterial,
}
