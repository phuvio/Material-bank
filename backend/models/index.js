const Material = require('./materials')
const User = require('./users')

User.hasMany(Material)
Material.belongsTo(User)

Material.sync()
User.sync()

module.exports = {
  Material,
  User,
}
