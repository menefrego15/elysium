import { Elysia, t } from 'elysia';

export const errorResponse = t.Object({
  error: t.String(),
  message: t.String(),
});

export const CommonModel = new Elysia({ name: 'Common.Model' }).model({
  error: errorResponse,
});
