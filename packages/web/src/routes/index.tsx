import Index from '@frontend/pages/Index';
import { rootRoute } from '@frontend/routes/root';
import { createRoute } from '@tanstack/react-router';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});
