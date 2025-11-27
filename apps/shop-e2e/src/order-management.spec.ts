import { test, expect } from '@playwright/test';

test('navigation bar is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('header')).toBeVisible();
  await expect(page.getByTestId('navbar-title')).toContainText('ShopSecure');
});

test('footer is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('footer')).toBeVisible();
});

test('page has proper responsive layout', async ({ page }) => {
  await page.goto('/');

  // Check main element has proper classes
  await expect(page.locator('main')).toHaveClass(/flex-grow/);
  await expect(page.locator('main')).toHaveClass(/container/);
  await expect(page.locator('main')).toHaveClass(/mx-auto/);
});

test('page maintains consistent layout structure', async ({ page }) => {
  await page.goto('/');

  const navbar = page.locator('nav');
  const main = page.locator('main');
  const footer = page.locator('footer');

  await expect(navbar).toBeVisible();
  await expect(main).toBeVisible();
  await expect(footer).toBeVisible();

  const navbarBox = await navbar.boundingBox();
  const mainBox = await main.boundingBox();
  const footerBox = await footer.boundingBox();

  expect(navbarBox?.y).toBeLessThan(mainBox?.y ?? 0);
  expect(mainBox?.y).toBeLessThan(footerBox?.y ?? 0);
});
