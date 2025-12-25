import { authMiddleware } from '@backend/modules/auth/middleware';
import { health } from '@backend/modules/health';
import { posts } from '@backend/modules/posts';
import { Elysia } from 'elysia';

export const routes = new Elysia({
  name: 'routes',
  prefix: '/api',
})
  .use(authMiddleware)
  .use(health)
  .use(posts);
