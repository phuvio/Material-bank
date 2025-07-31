import { test, expect } from '@playwright/test'

test.describe('Material Bank E2E User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('test.admin@proneuron.fi')
    await page.getByRole('textbox', { name: 'Salasana:' }).fill('SalasanaTest!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()
    await page.getByText('Käyttäjähallinta').click()
  })

  test('admin can add new user', async ({ page }) => {
    await page.getByRole('link', { name: 'Luo uusi käyttäjä' }).click()
    await page.getByRole('textbox', {name: 'Käyttäjätunnus:'}).fill('new.user@proneuron.fi')
    await page.getByRole('textbox', {name: 'Etunimi:'}).fill('New')
    await page.getByRole('textbox', {name: 'Sukunimi:'}).fill('User')
    await page.getByLabel('Salasana:').fill('NewPassword!123')
    await page.selectOption('select#role', 'basic')
    await page.getByRole('button', { name: 'Tallenna'}).click()

    await expect(page.getByText('Käyttäjä luotu onnistuneesti')).toBeVisible()

    await page.getByText('Käyttäjähallinta').click()

    await expect(page.getByText('New User')).toBeVisible()
  })
})
