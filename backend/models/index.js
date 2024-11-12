const Material = require('./materials')
const User = require('./users')

User.hasMany(Material, { foreignKey: 'user_id' })
Material.belongsTo(User, { foreignKey: 'user_id' })

Material.sync()
User.sync()

module.exports = {
  Material,
  User,
}
