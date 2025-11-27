import { describe, it, expect } from 'vitest';
import { ProductsRepository, productsRepository } from './products.repository';

describe('ProductsRepository', () => {
  describe('findAll', () => {
    it('should return all products', () => {
      const products = productsRepository.findAll();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(8);
    });

    it('should return products with correct structure', () => {
      const products = productsRepository.findAll();
      products.forEach((product) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('category');
      });
    });
  });

  describe('findById', () => {
    it('should return product by id', () => {
      const product = productsRepository.findById(1);
      expect(product).toBeDefined();
      expect(product?.id).toBe(1);
      expect(product?.name).toBe('Wireless Noise-Cancelling Headphones');
    });

    it('should return undefined for non-existent id', () => {
      const product = productsRepository.findById(999);
      expect(product).toBeUndefined();
    });
  });

  describe('instance creation', () => {
    it('should create new repository instance', () => {
      const repo = new ProductsRepository();
      expect(repo.findAll().length).toBe(8);
    });
  });
});
