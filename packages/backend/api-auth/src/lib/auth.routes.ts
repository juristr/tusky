import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import '@fastify/cookie';
import { LoginRequest, LoginResponse } from '@tusky/api-types';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password';
const COOKIE_NAME = 'session';

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
            success: { type: 'boolean' },
            error: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.post<{ Body: LoginRequest }>(
    '/api/auth/login',
    loginOpts,
    async (request, reply) => {
      const { username, password } = request.body;

      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        reply.setCookie(COOKIE_NAME, username, {
          path: '/',
          signed: true,
          httpOnly: true,
          sameSite: 'lax',
        });

        const response: LoginResponse = {
          success: true,
          user: { username },
        };
        return response;
      }

      reply.code(401);
      return { success: false, error: 'Invalid credentials' };
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

  fastify.post('/api/auth/logout', logoutOpts, async (request, reply) => {
    reply.clearCookie(COOKIE_NAME, { path: '/' });
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
            username: { type: 'string' },
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
    const sessionCookie = request.cookies[COOKIE_NAME];
    if (!sessionCookie) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    const unsigned = request.unsignCookie(sessionCookie);
    if (!unsigned.valid || !unsigned.value) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    return { username: unsigned.value };
  });
}
