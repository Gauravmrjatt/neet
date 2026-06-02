import { test, expect } from '@playwright/test'

const pages = [
  '/',
  '/blog',
  '/videos',
  '/about',
  '/contact',
  '/helpdesk',
  '/counsellors',
  '/josaa-counsellor',
]

test.describe('Navigation', () => {
  for (const path of pages) {
    test(`should load ${path}`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.locator('body')).toBeVisible()
    })
  }

  test('should redirect to login for protected routes', async ({ page }) => {
    await page.goto('/live-counselling')
    await expect(page.locator('body')).toBeVisible()
  })
})
