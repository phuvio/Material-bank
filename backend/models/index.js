const Material = require('./materials')
const User = require('./users')
const Tag = require('./tags')

User.hasMany(Material, { foreignKey: 'user_id' })
Material.belongsTo(User, { foreignKey: 'user_id' })
Tag.belongsToMany(Material, { through: 'MaterialTag' })

Material.sync()
User.sync()
Tag.sync()

module.exports = {
  Material,
  User,
  Tag,
}
