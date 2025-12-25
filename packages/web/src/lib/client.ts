import type { App } from '@backend/index';
import { treaty } from '@elysiajs/eden';
import { env } from '@frontend/config/env';

export const client = treaty<App>(env.apiUrl, {
  fetch: {
    credentials: 'include',
  },
});
