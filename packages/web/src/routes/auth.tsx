import { AppLayout } from '@frontend/layouts/AppLayout';
import { redirectSearchSchema } from '@frontend/lib/validations';
import { rootRoute } from '@frontend/routes/root';
import { createRoute, redirect } from '@tanstack/react-router';

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  validateSearch: redirectSearchSchema,
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
