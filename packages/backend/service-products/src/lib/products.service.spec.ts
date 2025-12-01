import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsService } from './products.service';
import { ProductsRepository } from '@tusky/data-products';
import { Product } from '@tusky/api-types';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    rating: 5,
    image: 'test.jpg',
    category: 'Test',
  },
  {
    id: 2,
    name: 'Another Product',
    price: 49.99,
    rating: 4,
    image: 'test2.jpg',
    category: 'Test',
  },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepo: ProductsRepository;

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn().mockReturnValue(mockProducts),
      findById: vi
        .fn()
        .mockImplementation((id: number) =>
          mockProducts.find((p) => p.id === id)
        ),
    } as unknown as ProductsRepository;

    service = new ProductsService(mockRepo);
  });

  describe('getAll', () => {
    it('should return all products from repository', () => {
      const result = service.getAll();
      expect(result).toEqual(mockProducts);
      expect(mockRepo.findAll).toHaveBeenCalledOnce();
    });
  });

  describe('getById', () => {
    it('should return product by id', () => {
      const result = service.getById(1);
      expect(result).toEqual(mockProducts[0]);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it('should return undefined for non-existent id', () => {
      const result = service.getById(999);
      expect(result).toBeUndefined();
    });
  });
});
