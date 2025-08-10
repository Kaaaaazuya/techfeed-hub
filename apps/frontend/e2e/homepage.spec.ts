import { test, expect } from '@playwright/test'

test.describe('Basic functionality', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // ページが正常にロードされ、基本的な要素が表示されることを確認
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display TechFeed Hub header', async ({ page }) => {
    await page.goto('/')

    // TechFeed Hubロゴが表示されることを確認
    await expect(page.getByRole('link', { name: 'TechFeed Hub' })).toBeVisible()
  })

  test('should display main content area', async ({ page }) => {
    await page.goto('/')

    // メインコンテンツエリアが表示されることを確認
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have search functionality in header', async ({ page }) => {
    await page.goto('/')

    // 検索入力フィールドが表示されることを確認 (デスクトップビューで)
    const searchInput = page.locator('input[placeholder*="記事を検索"]')
    await expect(searchInput).toBeVisible()
  })
})
