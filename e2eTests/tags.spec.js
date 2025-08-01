import { test, expect } from '@playwright/test'

test.describe('Material Bank E2E Tag Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('test.moderator@proneuron.fi')
    await page.getByRole('textbox', { name: 'Salasana:' }).fill('SalasanaTest!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()
    await page.getByText('Tagien hallinta').click()
  })

  test('moderator can add new tag', async ({ page }) => {
    await page.getByRole('link', { name: 'Luo uusi tagi' }).click()
    await page.getByRole('textbox', { name: 'Nimi:' }).fill('Uusi Tagi')

    await page.locator('[role="button"]').first().click()

    await page.getByRole('button', { name: 'Luo tagi' }).click()

    await expect(page.getByText('Tagi luotu onnistuneesti')).toBeVisible()

    await page.getByText('Tagien hallinta').click()

    await expect(page.getByText('Uusi Tagi')).toBeVisible()
  })

  test('moderator can edit existing tag', async ({ page }) => {
    await page.getByRole('link', { name: 'Kolme' }).click()
    const input = page.getByRole('textbox', { name: 'Nimi:' })
    await expect(input).toHaveValue('Kolme')
    await input.fill('Neljä')
    await expect(input).toHaveValue('Neljä')

    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page.getByText('Tagi päivitetty onnistuneesti')).toBeVisible()

    await page.getByText('Tagien hallinta').click()
    await expect(page.getByRole('link', { name: 'Neljä' })).toBeVisible()
  })
})
