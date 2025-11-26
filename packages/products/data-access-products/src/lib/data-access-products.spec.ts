import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProducts, getProductById } from './data-access-products';

describe('Products Data Access Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts function', () => {
    it('should return all products', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = getProducts();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(8);
    });

    it('should return products with correct structure', async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const result = getProducts();
      result.forEach((product) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('category');
      });
    });

    it('should handle concurrent access', async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const promises = Array(20)
        .fill(null)
        .map(() => Promise.resolve(getProducts()));
      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result.length).toBe(8);
      });
    });
  });

  describe('getProductById function', () => {
    it('should return correct product by id', async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const product = getProductById(1);
      expect(product).toBeDefined();
      expect(product?.name).toBe('Wireless Noise-Cancelling Headphones');
      expect(product?.price).toBe(249.99);
    });

    it('should return undefined for non-existent id', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const product = getProductById(999);
      expect(product).toBeUndefined();
    });

    it('should handle all valid product ids', async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      for (let i = 1; i <= 8; i++) {
        const product = getProductById(i);
        expect(product).toBeDefined();
        expect(product?.id).toBe(i);
      }
    });
  });

  describe('Product data integrity', () => {
    it('should have valid price ranges', async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const allProducts = getProducts();
      allProducts.forEach((product) => {
        expect(product.price).toBeGreaterThan(0);
        expect(product.price).toBeLessThan(1000);
      });
    });

    it('should have valid ratings', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const allProducts = getProducts();
      allProducts.forEach((product) => {
        expect(product.rating).toBeGreaterThanOrEqual(1);
        expect(product.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have unique product ids', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allProducts = getProducts();
      const ids = allProducts.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Category filtering', () => {
    it('should have products in multiple categories', async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const allProducts = getProducts();
      const categories = new Set(allProducts.map((p) => p.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it('should simulate category-based queries', async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const allProducts = getProducts();
      const electronics = allProducts.filter(
        (p) => p.category === 'Electronics'
      );
      expect(electronics.length).toBeGreaterThan(0);
      electronics.forEach((product) => {
        expect(product.category).toBe('Electronics');
      });
    });
  });

  describe('Performance benchmarks', () => {
    it('should handle rapid sequential requests', async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        getProducts();
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });

    it('should efficiently retrieve products by id', async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const start = Date.now();
      for (let i = 1; i <= 8; i++) {
        getProductById(i);
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
