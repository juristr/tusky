import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { ratingsService } from '@tusky/service-ratings';

export async function ratingsRoutes(fastify: FastifyInstance) {
  const getProductRatingOpts: RouteShorthandOptions = {
    schema: {
      tags: ['ratings'],
      summary: 'Get average rating for a product',
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
        required: ['productId'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            productId: { type: 'number' },
            averageRating: { type: 'number' },
            totalRatings: { type: 'number' },
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
  };

  fastify.get<{ Params: { productId: string } }>(
    '/api/ratings/:productId',
    getProductRatingOpts,
    async (request, reply) => {
      const productId = parseInt(request.params.productId, 10);
      const rating = ratingsService.getProductRating(productId);
      if (!rating) {
        reply.code(404);
        return { message: 'No ratings found for this product' };
      }
      return rating;
    }
  );

  const getAllRatingsOpts: RouteShorthandOptions = {
    schema: {
      tags: ['ratings'],
      summary: 'Get all user ratings for a product',
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
        required: ['productId'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              productId: { type: 'number' },
              userId: { type: 'number' },
              rating: { type: 'number' },
              review: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    },
  };

  fastify.get<{ Params: { productId: string } }>(
    '/api/ratings/:productId/all',
    getAllRatingsOpts,
    async (request) => {
      const productId = parseInt(request.params.productId, 10);
      return ratingsService.getByProductId(productId);
    }
  );
}
