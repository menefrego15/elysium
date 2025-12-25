import { Elysia } from 'elysia';

export const health = new Elysia({
  name: 'health',
  prefix: '/health',
}).get(
  '/',
  () => ({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }),
  {
    detail: {
      tags: ['Health'],
      description: 'Health check endpoint',
    },
  },
);
