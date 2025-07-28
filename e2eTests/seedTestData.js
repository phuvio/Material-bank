import { User, Material, Tag, TagsMaterial, Favorite } from '../backend/models/index.js'

export const seedTestDatabase = async () => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Never seed database in production!')
  }

  // Clean up old test data
  await TagsMaterial.destroy({ where: {}, truncate: true, cascade: true })
  await Favorite.destroy({ where: {}, truncate: true, cascade: true })
  await Material.destroy({ where: {}, truncate: true, cascade: true })
  await Tag.destroy({ where: {}, truncate: true, cascade: true })
  await User.destroy({ where: {}, truncate: true, cascade: true })

  await User.create({
    username: 'test.admin@proneuron.fi',
    first_name: 'Test',
    last_name: 'Admin',
    password: 'SalasanaTest!123',
    role: 'admin',
  })
  await User.create({
    username: 'test.moderator@proneuron.fi',
    first_name: 'Test',
    last_name: 'Moderator',
    password: 'SalasanaTest!123',
    role: 'moderator',
  })
  await User.create({
    username: 'basic.user@proneuron.fi',
    first_name: 'Basic',
    last_name: 'User',
    password: 'SalasanaTest!123',
    role: 'basic',
  })
}