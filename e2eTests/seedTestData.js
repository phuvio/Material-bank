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
      username: 'old.person@proneuron.fi',
      first_name: 'Old',
      last_name: 'Person',
      password: 'PoIuy?098',
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

  const tags = [
    {
      name: 'Yksi',
      color: '#27AE60',
    },
    {
      name: 'Kaksi',
      color: '#7E5109',
    },
    {
      name: 'Kolme',
      color: '#F7DC6F',
    }
  ]

  for (const t of tags) {
    await Tag.create({
      name: t.name,
      color: t.color
    })
  }

  const materials = [
    {
      name: 'Testimateriaali 1',
      description: 'Tämä on testimateriaali 1',
      user_id: 1,
      visible: true,
      is_url: true,
      url: 'https://example.com/material1',
      material: null,
      material_type: null,
    },
    {
      name: 'Testimateriaali 2',
      description: 'Tämä on testimateriaali 2',
      user_id: 2,
      visible: true,
      is_url: true,
      url: 'https://example.com/material2',
      material: null,
      material_type: null,
    },
  ]

  for (const m of materials) {
    await Material.create({
      name: m.name,
      description: m.description,
      user_id: m.user_id,
      visible: m.visible,
      is_url: m.is_url,
      url: m.url,
      material: m.material,
      material_type: m.material_type
    })
  }
}
