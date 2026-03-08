// Add to packages/backend/src/env.ts

// Add to envSchema:
BETTER_AUTH_SECRET: Type.String(),
BETTER_AUTH_URL: Type.String(),
GOOGLE_CLIENT_ID: Type.String(),
GOOGLE_CLIENT_SECRET: Type.String(),

// Example:
// const envSchema = Type.Object({
//   DATABASE_URL: Type.String(),
//   PORT: Type.String({ default: '3001' }),
//   BETTER_AUTH_SECRET: Type.String(),
//   BETTER_AUTH_URL: Type.String(),
//   GOOGLE_CLIENT_ID: Type.String(),
//   GOOGLE_CLIENT_SECRET: Type.String(),
//   APP_URL: Type.String(),
// });