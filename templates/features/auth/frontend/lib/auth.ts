import { env } from '@frontend/config/env';
import { createAuthClient } from 'better-auth/react';

export const auth = createAuthClient({
  baseURL: env.authUrl,
  fetchOptions: {
    credentials: 'include',
    mode: 'cors',
  },
});
