import { postsQueryOptions } from '@frontend/hooks/use-posts';
import { Posts } from '@frontend/pages/posts';
import { authRoute } from '@frontend/routes/auth';
import { createRoute } from '@tanstack/react-router';

export const postsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'posts',
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(postsQueryOptions),
  component: Posts,
});
