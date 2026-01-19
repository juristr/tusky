import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import '../types/fastify-cookie.js';

const AUTH_COOKIE_NAME = 'tusky_session';
const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = 'password';

interface LoginBody {
  username: string;
  password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  const loginOpts: RouteShorthandOptions = {
    schema: {
      tags: ['auth'],
      summary: 'Login with username and password',
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

  fastify.post<{ Body: LoginBody }>(
    '/api/auth/login',
    loginOpts,
    async (request, reply) => {
      const { username, password } = request.body;

      if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
        reply.setCookie(AUTH_COOKIE_NAME, username, {
          path: '/',
          signed: true,
          httpOnly: true,
          sameSite: 'lax',
        });
        return { success: true, user: { username } };
      }

      reply.status(401);
      return { error: 'Invalid credentials' };
    }
  );

  const logoutOpts: RouteShorthandOptions = {
    schema: {
      tags: ['auth'],
      summary: 'Logout and clear session',
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
    reply.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    return { success: true };
  });

  const meOpts: RouteShorthandOptions = {
    schema: {
      tags: ['auth'],
      summary: 'Get current user',
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
    const sessionCookie = request.cookies[AUTH_COOKIE_NAME];

    if (!sessionCookie) {
      reply.status(401);
      return { error: 'Not authenticated' };
    }

    const unsigned = request.unsignCookie(sessionCookie);

    if (!unsigned.valid || !unsigned.value) {
      reply.status(401);
      return { error: 'Invalid session' };
    }

    return { user: { username: unsigned.value } };
  });
}
