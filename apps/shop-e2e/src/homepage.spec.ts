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

test('product grid has products listed with all required elements', async ({
  page,
}) => {
  await page.goto('/');

  // Wait for product grid to load
  const productGrid = page.getByTestId('product-grid');
  await expect(productGrid).toBeVisible();

  // Verify that all 8 products are listed
  const productCards = productGrid.locator('> div');
  await expect(productCards).toHaveCount(8);

  // Verify first product has all required elements
  const firstProduct = productCards.first();
  await expect(firstProduct.locator('img')).toBeVisible();
  await expect(firstProduct.locator('h3')).toBeVisible();

  // Verify product has category, price, and rating
  await expect(firstProduct.locator('text=Electronics')).toBeVisible();
  await expect(firstProduct.locator('text=$249.99')).toBeVisible();
  await expect(firstProduct.getByTestId('rating-stars')).toBeVisible();
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
