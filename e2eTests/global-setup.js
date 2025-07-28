/* eslint-disable no-undef */
import { syncDatabase } from '../backend/models/index.js'
import { seedTestDatabase } from './seedTestData.js'

export default async function globalSetup() {
  console.log('Syncing and seeding test database...')
  await syncDatabase()
  await seedTestDatabase()
  console.log('Database ready')
}
