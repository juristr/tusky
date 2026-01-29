import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import '@fastify/cookie';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password';

export async function authRoutes(fastify: FastifyInstance) {
  const loginOpts: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['username', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                username: { type: 'string' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.post<{ Body: { username: string; password: string } }>(
    '/api/auth/login',
    loginOpts,
    async (request, reply) => {
      const { username, password } = request.body;

      if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      reply.setCookie('tusky-session', username, {
        path: '/',
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
      });

      return { success: true, user: { username } };
    }
  );

  const logoutOpts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          },
        },
      },
    },
  };

  fastify.post('/api/auth/logout', logoutOpts, async (_request, reply) => {
    reply.clearCookie('tusky-session', { path: '/' });
    return { success: true };
  });

  const meOpts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                username: { type: 'string' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.get('/api/auth/me', meOpts, async (request, reply) => {
    const sessionCookie = request.cookies['tusky-session'];
    if (!sessionCookie) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const unsignedCookie = request.unsignCookie(sessionCookie);
    if (!unsignedCookie.valid) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    return { user: { username: unsignedCookie.value } };
  });
}
