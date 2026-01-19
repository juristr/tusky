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

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const sessionCookie = request.cookies['session'];
      if (!sessionCookie) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const unsigned = request.unsignCookie(sessionCookie);
      if (!unsigned.valid || !unsigned.value) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }
  );
});
