import { test, expect } from '@playwright/test';

test('displays homepage with correct heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h2').first()).toContainText('Legit Products');
});

test('product grid is displayed on homepage', async ({ page }) => {
  await page.goto('/');

  // Wait for product grid to load
  await expect(page.locator('section').first()).toBeVisible();
});

test('filter buttons are functional', async ({ page }) => {
  await page.goto('/');

  const latestButton = page.getByRole('button', { name: 'Latest' });
  const popularButton = page.getByRole('button', { name: 'Popular' });
  const saleButton = page.getByRole('button', { name: 'Sale' });

  await expect(latestButton).toBeVisible();
  await expect(popularButton).toBeVisible();
  await expect(saleButton).toBeVisible();

  await latestButton.click();
  await popularButton.click();
  await saleButton.click();
});
