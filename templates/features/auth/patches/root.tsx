import { RootLayout } from '@frontend/components/root-layout';
import type { auth } from '@frontend/lib/auth';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';

type AuthContext = {
  session: Awaited<ReturnType<typeof auth.getSession>> | null;
  isLoading: boolean;
};

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContext;
}>()({
  component: RootLayout,
});
