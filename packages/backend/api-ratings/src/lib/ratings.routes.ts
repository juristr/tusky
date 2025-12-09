import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { ratingsService } from '@tusky/service-ratings';

export async function ratingsRoutes(fastify: FastifyInstance) {
  const getRatingByProductIdOpts: RouteShorthandOptions = {
    schema: {
      tags: ['ratings'],
      summary: 'Get rating by product ID',
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
    getRatingByProductIdOpts,
    async (request, reply) => {
      const productId = parseInt(request.params.productId, 10);
      const rating = ratingsService.getRatingByProductId(productId);
      if (!rating) {
        reply.code(404);
        return { message: 'Rating not found' };
      }
      return rating;
    }
  );
}
