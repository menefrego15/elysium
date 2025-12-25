import { z } from 'zod';

const envSchema = z.object({
  apiUrl: z.url().default('http://localhost:3001'),
  authUrl: z.url().default('http://localhost:3001'),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    apiUrl: import.meta.env.VITE_API_URL,
    authUrl: import.meta.env.VITE_AUTH_URL,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', z.treeifyError(parsed.error));
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = parseEnv();
