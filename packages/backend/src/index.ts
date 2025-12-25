import { env } from '@backend/env';
import { routes } from '@backend/routes';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from './lib/errors';

const app = new Elysia()
  .error({
    ServerError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
  })
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);

    if (error instanceof ServerError) {
      set.status = error.status;
      return {
        error: error.name,
        message: error.message,
      };
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        error: 'Validation Error',
        message: error.message || 'Invalid request data',
        ...(process.env.NODE_ENV !== 'production' && {
          details: error.all,
        }),
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        error: 'Not Found',
        message: 'Route not found',
      };
    }

    if (code === 'PARSE') {
      set.status = 400;
      return {
        error: 'Parse Error',
        message: 'Invalid request format',
      };
    }

    const isProduction = process.env.NODE_ENV === 'production';
    set.status = 500;

    return {
      error: 'Internal Server Error',
      message: isProduction ? 'Something went wrong' : 'message' in error ? error.message : 'An error occurred',
    };
  })
  .use(
    cors({
      origin: env.APP_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Starter API',
          version: '1.0.0',
          description: 'Modern full-stack starter with Elysia, React, and Drizzle',
        },
        tags: [
          { name: 'Health', description: 'Health check endpoints' },
          { name: 'Posts', description: 'Posts CRUD operations' },
          { name: 'Auth', description: 'Authentication endpoints' },
        ],
      },
    }),
  )
  .use(routes)
  .listen(env.PORT);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
