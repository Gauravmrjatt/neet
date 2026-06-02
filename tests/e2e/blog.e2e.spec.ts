import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('should load blog listing page', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load blog post page', async ({ page }) => {
    await page.goto('/blog/test-blog-post')
    await expect(page.locator('body')).toBeVisible()
  })
})
