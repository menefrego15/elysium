// Add to packages/backend/src/routes/index.ts

// 1. Add import:
import { authMiddleware } from '@backend/modules/auth/middleware';

// 2. Add to middleware chain (before other routes):
.use(authMiddleware)

// Example:
// export const routes = new Elysia({ name: 'routes', prefix: '/api' })
//   .use(authMiddleware)
//   .use(health)
//   .use(posts);