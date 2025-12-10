// Module augmentation for @fastify/swagger with moduleResolution: nodenext
// The package's types don't work properly with nodenext due to missing exports field
import 'fastify';

declare module 'fastify' {
  interface FastifySchema {
    tags?: readonly string[];
    summary?: string;
    description?: string;
  }
}
