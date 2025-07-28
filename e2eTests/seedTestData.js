import { User, Material } from '../backend/models/index.js'

export const seedTestDatabase = async () => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Never seed database in production!')
  }

  // Clean up old test data
  await Material.destroy({ where: {} })
  await User.destroy({ where: {} })

  await User.create({
    username: 'test.admin@proneuron.fi',
    first_name: 'Test',
    last_name: 'Admin',
    password: 'SalasanaTest!123',
    role: 'admin',
  })
}
