import { router } from '@frontend/config/router';
import { RouterProvider } from '@tanstack/react-router';

export function AppWrapper() {
  return <RouterProvider router={router} />;
}
