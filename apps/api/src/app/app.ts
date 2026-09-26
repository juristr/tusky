import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { productsRoutes } from '@tusky/api-products';
import { ratingsRoutes } from '@tusky/api-ratings';
import { authRoutes } from '@tusky/api-auth';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Tusky Shop API',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Load plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // Register auth routes (public - no authentication required)
  await fastify.register(authRoutes);

  // Register protected routes
  await fastify.register(async function protectedRoutes(scopedFastify) {
    scopedFastify.addHook('preHandler', fastify.authenticate);
    await scopedFastify.register(productsRoutes);
    await scopedFastify.register(ratingsRoutes);
  });

  // Load other routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
