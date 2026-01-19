import { chromium, type FullConfig } from '@playwright/test';

const authFile = 'apps/shop-e2e/.auth/user.json';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:4200';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Go to login page
  await page.goto(`${baseURL}/login`);

  // Fill in credentials
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'password');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to homepage after successful login
  await page.waitForURL(`${baseURL}/`);

  // Save storage state
  await page.context().storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;
