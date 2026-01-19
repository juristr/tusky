import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';

/**
 * Cookie plugin for signed cookies used in authentication
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(cookie, {
    secret: 'tusky-shop-cookie-secret-key-2024',
    parseOptions: {},
  });
});
