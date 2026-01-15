import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import '@fastify/cookie';

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
      const sessionCookie = request.cookies['tusky-session'];
      if (!sessionCookie) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const unsignedCookie = request.unsignCookie(sessionCookie);
      if (!unsignedCookie.valid || unsignedCookie.value !== 'admin') {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }
  );
});
