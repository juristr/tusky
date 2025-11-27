import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('displays product details when navigating to /product/3', async ({
    page,
  }) => {
    await page.goto('/product/3');

    // Verify product detail container is visible
    const productDetail = page.getByTestId('product-detail');
    await expect(productDetail).toBeVisible();

    // Verify product name
    const productName = page.getByTestId('product-name');
    await expect(productName).toContainText('Leather Crossbody Bag');

    // Verify image loads
    const productImage = productDetail.locator('img').first();
    await expect(productImage).toBeVisible();

    // Verify price is displayed
    await expect(productDetail.locator('text=$79.99')).toBeVisible();

    // Verify rating stars are displayed
    await expect(productDetail.locator('svg').first()).toBeVisible();

    // Verify Add to Cart button
    await expect(
      productDetail.getByRole('button', { name: /Add to Cart/i })
    ).toBeVisible();

    // Verify In Stock status
    await expect(productDetail.locator('text=In Stock')).toBeVisible();
  });

  test('clicking product in grid navigates to detail page', async ({
    page,
  }) => {
    await page.goto('/');

    // Click on first product link
    const productGrid = page.getByTestId('product-grid');
    await productGrid.locator('a').first().click();

    // Verify navigation to product detail
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.getByTestId('product-detail')).toBeVisible();
  });

  test('shows error for invalid product ID', async ({ page }) => {
    await page.goto('/product/999');

    await expect(page.getByTestId('product-not-found')).toBeVisible();
    await expect(page.locator('text=Product Not Found')).toBeVisible();
  });
});
