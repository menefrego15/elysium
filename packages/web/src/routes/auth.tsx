import { AppLayout } from '@frontend/layouts/AppLayout';
import { rootRoute } from '@frontend/routes/root';
import { createRoute, redirect } from '@tanstack/react-router';

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  beforeLoad: ({ context, location }) => {
    if (!context.auth.session) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      });
    }
  },
  component: AppLayout,
});
