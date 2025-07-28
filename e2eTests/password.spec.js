/* eslint-disable no-undef */
import { test, expect } from '@playwright/test'

test.describe('Material Bank E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    page.on('response', (res) => {
      if (res.url().includes('/login')) console.log('Login response:', res.status())
    })

    page.on('console', (msg) => console.log('Browser log:', msg.text()))

    await page.goto('/')
  })

  test('login, change password, logout, and login again', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('test.admin@proneuron.fi')
    await page.getByLabel('Salasana:').fill('SalasanaTest!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()

    await page.selectOption('#user-dropdown', { label: 'Vaihda salasana' })

    await expect(page.getByRole('heading', { name: 'Vaihda salasana'})).toBeVisible()

    await page.getByLabel('Nykyinen salasana:').fill('SalasanaTest!123')
    await page.getByLabel('Uusi salasana:').fill('NewPassword!123')
    await page.getByLabel('Uusi salasana uudelleen:').fill('NewPassword!123')
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await page.selectOption('#user-dropdown', { label: 'Kirjaudu ulos' })

    await expect(page.getByRole('heading', { name: 'Sisäänkirjautuminen' })).toBeVisible()

    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('test.admin@proneuron.fi')
    await page.getByLabel('Salasana:').fill('NewPassword!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()

    await expect(page.getByRole('heading', { name: 'Materiaalit' })).toBeVisible()
  })
})
