import { SignUp } from '@frontend/pages/SignUp';
import { rootRoute } from '@frontend/routes/root';
import { createRoute, redirect } from '@tanstack/react-router';

export const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUp,
  beforeLoad: ({ context, location }) => {
    if (context.auth.session) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});
