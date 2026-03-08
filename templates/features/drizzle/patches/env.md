// Add to packages/backend/src/env.ts

// Add to envSchema:
DATABASE_URL: Type.String(),

// Example:
// const envSchema = Type.Object({
//   DATABASE_URL: Type.String(),
//   PORT: Type.String({ default: '3001' }),
//   APP_URL: Type.String(),
// });