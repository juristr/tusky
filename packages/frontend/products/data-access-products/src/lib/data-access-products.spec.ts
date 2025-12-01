import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getProducts, getProductById, Product } from './data-access-products';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Test Product 1',
    price: 99.99,
    rating: 5,
    image: 'test1.jpg',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Test Product 2',
    price: 49.99,
    rating: 4,
    image: 'test2.jpg',
    category: 'Fashion',
  },
];

describe('Products Data Access Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch and return all products', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response);

      const result = await getProducts();
      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products')
      );
    });

    it('should throw error on failed fetch', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductById', () => {
    it('should fetch and return product by id', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockProducts[0]),
      } as Response);

      const result = await getProductById(1);
      expect(result).toEqual(mockProducts[0]);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/1')
      );
    });

    it('should return undefined for 404', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await getProductById(999);
      expect(result).toBeUndefined();
    });

    it('should throw error on other failures', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getProductById(1)).rejects.toThrow(
        'Failed to fetch product'
      );
    });
  });
});
