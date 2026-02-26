import { Button } from '@frontend/components/ui/button';
import { queryClient } from '@frontend/lib/queryClient';
import { authRoute } from '@frontend/routes/auth';
import { indexRoute } from '@frontend/routes/index';
import { postsRoute } from '@frontend/routes/posts';
import { rootRoute } from '@frontend/routes/root';
import { signInRoute } from '@frontend/routes/signin';
import { signUpRoute } from '@frontend/routes/signup';
import { createRouter, Link } from '@tanstack/react-router';

const routeTree = rootRoute.addChildren([authRoute.addChildren([postsRoute]), indexRoute, signInRoute, signUpRoute]);

export const router = createRouter({
  defaultErrorComponent: ({ error, reset }) => {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="font-bold text-2xl">Error!</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
        <Button onClick={reset} variant="outline">
          Reset
        </Button>
        <Button render={<Link to="/" />} nativeButton={false} variant="link">
          Go home
        </Button>
      </div>
    );
  },
  defaultNotFoundComponent: () => {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="font-bold text-2xl">Not found!</p>
        <Link to="/" className="text-blue-500 hover:text-blue-600">
          Go home
        </Link>
      </div>
    );
  },
  routeTree,
  context: {
    queryClient,
    auth: {
      session: null,
      isLoading: false,
    },
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
