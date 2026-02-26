import GetStarted from '@frontend/pages/get-started';
import { rootRoute } from '@frontend/routes/root';
import { createRoute } from '@tanstack/react-router';

export const getStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/get-started',
  component: GetStarted,
});
