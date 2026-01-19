import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

const AUTH_COOKIE_NAME = 'tusky_session';

/**
 * Auth plugin that decorates fastify with authenticate preHandler
 * Checks for valid signed cookie and returns 401 if missing/invalid
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const sessionCookie = request.cookies[AUTH_COOKIE_NAME];

      if (!sessionCookie) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
      }

      const unsigned = request.unsignCookie(sessionCookie);

      if (!unsigned.valid || !unsigned.value) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
      }
    }
  );
});
