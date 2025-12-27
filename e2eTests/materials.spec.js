import { test, expect } from '@playwright/test'

test.describe('Material Bank E2E Material Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: 'Käyttäjätunnus:' }).fill('basic.user@proneuron.fi')
    await page.getByRole('textbox', { name: 'Salasana:' }).fill('SalasanaTest!123')
    await page.getByRole('button', { name: "Kirjaudu sisään" }).click()
  })

  test('basic user can add new material, change it and remove it', async ({ page }) => {
    await page.getByRole('link', { name: 'Luo uusi materiaali' }).click()
    await page.getByLabel('Materiaalin nimi:').fill('Matsku')
    await page.getByLabel('Kuvaus:').fill('Tämä on testimateriaali.')
    await page.getByLabel('Onko materiaali linkki:').check()
    await page.getByRole('textbox', { name: 'Linkki:' }).fill('https://example.com/test-material')
    await page.getByLabel('Yksi').check()
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page.getByText('Materiaali lisätty')).toBeVisible()
    await expect(page.getByText('Matsku')).toBeVisible()

    await page.getByRole('link', { name: 'Matsku' }).click()
    await page.getByRole('link', { name: 'Muokkaa materiaalia' }).click()

    const input = page.getByRole('textbox', { name: 'Materiaalin nimi:' })
    await expect(input).toHaveValue('Matsku')
    await input.fill('Jotain ihan muuta')
    await expect(input).toHaveValue('Jotain ihan muuta')

    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page.getByText('Materiaali päivitetty onnistuneesti')).toBeVisible()
    await expect(page.getByText('Jotain ihan muuta')).toBeVisible()

    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Haluatko varmasti poistaa tämän materiaalin?')
      await dialog.accept()
    })

    await page.getByRole('button', { name: 'Poista materiaali' }).click()

    await expect(page.getByText('Materiaali poistettu onnistuneesti')).toBeVisible()
    await expect(page.getByText('Jotain ihan muuta')).not.toBeVisible()
  })

  test('basic user can change material tags', async ({ page }) => {
    await page.getByRole('link', { name: 'Testimateriaali 1' }).click()
    await page.getByLabel('Kaksi').check()
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page.getByText('Tagit päivitetty onnistuneesti')).toBeVisible()

    await page.getByText('Materiaalit').click()
    const kaksi = page.locator('text=Kaksi')
    await expect(kaksi).toHaveCount(2)
  })
})
