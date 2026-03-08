import { Spinner } from '@frontend/components/ui/spinner';
import { router } from '@frontend/config/router';
import { auth } from '@frontend/lib/auth';
import { RouterProvider } from '@tanstack/react-router';

export function AppWrapper() {
  const { data: session, isPending } = auth.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          session,
          isLoading: isPending,
        },
      }}
    />
  );
}
