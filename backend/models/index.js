const Material = require('./materials')
const User = require('./users')

Material.sync()
User.sync()

module.exports = {
  Material,
  User,
}
