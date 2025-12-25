import { SignIn } from '@frontend/pages/SignIn';
import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: SignIn,
  beforeLoad: ({ context, location }) => {
    if (context.auth.session) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});
