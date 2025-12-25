import { AppLayout } from '@frontend/layouts/AppLayout';
import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root';

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
