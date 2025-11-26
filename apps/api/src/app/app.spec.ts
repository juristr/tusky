import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { productsRoutes } from '@tusky/api-products';

describe('API Integration Tests', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();

    await server.register(cors, { origin: true });
    await server.register(swagger, {
      openapi: {
        info: { title: 'Tusky Shop API', version: '1.0.0' },
      },
    });
    await server.register(swaggerUi, { routePrefix: '/docs' });
    await server.register(productsRoutes);

    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Products API', () => {
    it('GET /api/products should return products', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/products',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('GET /api/products/:id should return single product', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/products/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(1);
    });

    it('GET /api/products/:id should return 404 for invalid id', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/products/999',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Swagger', () => {
    it('GET /docs/json should return OpenAPI spec', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/docs/json',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.openapi).toBe('3.0.3');
      expect(body.info.title).toBe('Tusky Shop API');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await server.inject({
        method: 'OPTIONS',
        url: '/api/products',
        headers: {
          origin: 'http://localhost:4200',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
