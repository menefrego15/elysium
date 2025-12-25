import { SignUp } from '@frontend/pages/SignUp';
import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root';

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
