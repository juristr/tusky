import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { productsRoutes } from './products.routes';

vi.mock('@tusky/service-products', () => ({
  productsService: {
    getAll: vi.fn().mockReturnValue([
      {
        id: 1,
        name: 'Test',
        price: 99,
        rating: 5,
        image: 'x.jpg',
        category: 'A',
      },
      {
        id: 2,
        name: 'Test2',
        price: 49,
        rating: 4,
        image: 'y.jpg',
        category: 'B',
      },
    ]),
    getById: vi.fn().mockImplementation((id: number) => {
      if (id === 1) {
        return {
          id: 1,
          name: 'Test',
          price: 99,
          rating: 5,
          image: 'x.jpg',
          category: 'A',
        };
      }
      return undefined;
    }),
  },
}));

describe('Products Routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    await app.register(productsRoutes);
    await app.ready();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(1);
      expect(body.name).toBe('Test');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products/999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Product not found');
    });
  });
});
