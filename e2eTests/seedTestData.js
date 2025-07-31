import { User, Material, Tag, TagsMaterial, Favorite } from '../backend/models/index.js'

export const seedTestDatabase = async () => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Never seed database in production!')
  }

  // Clear all data
  await TagsMaterial.destroy({ where: {}, truncate: true, cascade: true })
  await Favorite.destroy({ where: {}, truncate: true, cascade: true })
  await Material.destroy({ where: {}, truncate: true, cascade: true })
  await Tag.destroy({ where: {}, truncate: true, cascade: true })
  await User.destroy({ where: {}, truncate: true, cascade: true })

  const users = [
    {
      username: 'test.admin@proneuron.fi',
      first_name: 'Test',
      last_name: 'Admin',
      password: 'SalasanaTest!123',
      role: 'admin',
    },
    {
      username: 'test.moderator@proneuron.fi',
      first_name: 'Test',
      last_name: 'Moderator',
      password: 'SalasanaTest!123',
      role: 'moderator',
    },
    {
      username: 'basic.user@proneuron.fi',
      first_name: 'Basic',
      last_name: 'User',
      password: 'SalasanaTest!123',
      role: 'basic',
    },
    {
      username: 'john.doe@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe',
      password: 'OldPassword!123',
      role: 'basic',
    },
  ]

  for (const u of users) {
    await User.create({
      username: u.username,
      first_name: u.first_name,
      last_name: u.last_name,
      password: u.password,
      role: u.role
    })
  }
}
