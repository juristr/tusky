import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { ratingsService } from '@tusky/service-ratings';

export async function ratingsRoutes(fastify: FastifyInstance) {
  const getRatingSummaryOpts: RouteShorthandOptions = {
    schema: {
      tags: ['ratings'],
      summary: 'Get rating summary for a product',
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
            rating: { type: 'number' },
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
    getRatingSummaryOpts,
    async (request, reply) => {
      const productId = parseInt(request.params.productId, 10);
      const summary = ratingsService.getRatingSummary(productId);
      if (!summary) {
        reply.code(404);
        return { message: 'No ratings found for this product' };
      }
      return summary;
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
              productId: { type: 'number' },
              rating: { type: 'number' },
              comment: { type: 'string' },
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
      return ratingsService.getAllRatings(productId);
    }
  );
}
