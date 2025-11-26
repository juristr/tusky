import { FastifyInstance } from 'fastify';
import { productsService } from '@tusky/service-products';

export async function productsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/products', {
    schema: {
      tags: ['products'],
      summary: 'Get all products',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              price: { type: 'number' },
              originalPrice: { type: 'number' },
              rating: { type: 'number' },
              image: { type: 'string' },
              category: { type: 'string' },
            },
          },
        },
      },
    },
    handler: async () => {
      return productsService.getAll();
    },
  });

  fastify.get<{ Params: { id: string } }>('/api/products/:id', {
    schema: {
      tags: ['products'],
      summary: 'Get product by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            price: { type: 'number' },
            originalPrice: { type: 'number' },
            rating: { type: 'number' },
            image: { type: 'string' },
            category: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const product = productsService.getById(id);
      if (!product) {
        reply.code(404);
        return { message: 'Product not found' };
      }
      return product;
    },
  });
}
