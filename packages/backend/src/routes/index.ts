import { health } from '@backend/modules/health';
import { Elysia } from 'elysia';

export const routes = new Elysia({
  name: 'routes',
  prefix: '/api',
}).use(health);
