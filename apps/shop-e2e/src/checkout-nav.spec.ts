import { test, expect } from '@playwright/test';

test('navigation to orders page works', async ({ page }) => {
  await page.goto('/');

  // Navigate directly to orders page
  await page.goto('/orders');
  await expect(page).toHaveURL(/\/orders$/);

  // Verify orders page content is displayed
  await expect(page.locator('h2').first()).toBeVisible();
});

test('navigation to past orders page works', async ({ page }) => {
  await page.goto('/');

  // Navigate directly to past orders page
  await page.goto('/orders/past');
  await expect(page).toHaveURL(/\/orders\/past/);
});

test('navigation to create order page works', async ({ page }) => {
  await page.goto('/');

  // Navigate to create order page directly via URL
  await page.goto('/orders/create');
  await expect(page).toHaveURL(/\/orders\/create/);
});

test('all main routes are accessible', async ({ page }) => {
  const routes = ['/', '/orders', '/orders/past', '/orders/create'];

  for (const route of routes) {
    await page.goto(route);
    await expect(page).not.toHaveTitle(/404/);
    await expect(page.locator('main')).toBeVisible();
  }
});
