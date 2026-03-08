// Add to packages/backend/src/routes/index.ts

// 1. Add import:
import { posts } from '@backend/modules/posts';

// 2. Add to middleware chain:
.use(posts)

// Example:
// export const routes = new Elysia({ name: 'routes', prefix: '/api' })
//   .use(health)
//   .use(posts);