// Add to packages/web/src/config/env.ts

// Add to envSchema:
authUrl: z.url().default('http://localhost:3001'),

// Example:
// const envSchema = z.object({
//   apiUrl: z.url().default('http://localhost:3001'),
//   authUrl: z.url().default('http://localhost:3001'),
// });