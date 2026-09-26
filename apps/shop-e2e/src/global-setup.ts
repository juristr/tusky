import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // Navigate to login page and wait for it to load
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Perform login with valid credentials using correct selectors
  await page.fill('input#username', 'admin');
  await page.fill('input#password', 'password');
  await page.click('button[type="submit"]');

  // Wait for successful login (redirect to home page)
  await page.waitForURL('/');

  // Save signed-in state to 'storageState.json'
  await page.context().storageState({ path: 'apps/shop-e2e/storageState.json' });
});