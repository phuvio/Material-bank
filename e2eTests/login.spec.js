/* eslint-disable no-undef */
import { test, expect } from '@playwright/test'
import { syncDatabase } from '../backend/models/index.js'
import { seedTestDatabase } from './seedTestData.js'

test.describe('Material Bank E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await syncDatabase()
    await seedTestDatabase()

    page.on('response', (res) => {
        if (res.url().includes('/login')) console.log('Login response:', res.status())
    })

    page.on('console', (msg) => console.log('Browser log:', msg.text()))

    await page.goto('http://localhost:5173')
  })

  test('login page can be opened', async ({ page }) => {
    await expect(page).toHaveTitle(/Pronen materiaalipankki/)

    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('test.admin@proneuron.fi')
    await page.getByLabel('Salasana:').fill('SalasanaTest!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()

    await expect(page.getByRole('heading', { name: 'Materiaalit' })).toBeVisible()
  })

  test('login fails with incorrect credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('wrong.person@proneuron.fi')
    await page.getByLabel('Salasana:').fill('WrongPassword!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()

    await expect(page.getByText('Väärä käyttäjätunnus tai salasana')).toBeVisible()
  })
})
