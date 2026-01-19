// Module augmentation for @fastify/cookie with moduleResolution: nodenext
import 'fastify';

declare module 'fastify' {
  interface FastifySchema {
    tags?: readonly string[];
    summary?: string;
    description?: string;
  }

  interface FastifyRequest {
    cookies: Record<string, string | undefined>;
    unsignCookie(value: string): {
      valid: boolean;
      renew: boolean;
      value: string | null;
    };
  }

  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: {
        path?: string;
        signed?: boolean;
        httpOnly?: boolean;
        sameSite?: 'lax' | 'strict' | 'none';
        secure?: boolean;
        maxAge?: number;
        expires?: Date;
      }
    ): this;
    clearCookie(
      name: string,
      options?: {
        path?: string;
      }
    ): this;
  }
}
