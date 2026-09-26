import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(cookie, {
    secret: 'tusky-shop-secret-key-change-in-production',
    parseOptions: {},
  });
});
