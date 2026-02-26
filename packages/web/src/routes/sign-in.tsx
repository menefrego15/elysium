import { redirectSearchSchema } from '@frontend/lib/validations';
import { SignIn } from '@frontend/pages/sign-in';
import { rootRoute } from '@frontend/routes/root';
import { createRoute, redirect } from '@tanstack/react-router';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: SignIn,
  validateSearch: redirectSearchSchema,
  beforeLoad: ({ context, location }) => {
    if (context.auth.session) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});
