import Index from '@frontend/pages/Index';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});
