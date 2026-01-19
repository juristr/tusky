// Module augmentation for @fastify/swagger with moduleResolution: nodenext
import 'fastify';

declare module 'fastify' {
  interface FastifySchema {
    tags?: readonly string[];
    summary?: string;
    description?: string;
  }
}
