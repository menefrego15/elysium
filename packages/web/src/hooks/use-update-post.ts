import type { UpdatePostRequest } from '@backend/modules/posts/model';
import { client } from '@frontend/lib/client';
import { queryClient } from '@frontend/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({ id, ...request }: { id: number } & UpdatePostRequest) => {
      const response = await client.api.posts({ id }).put(request);

      if (response.error) {
        throw new Error(response.error.value.message);
      }

      if (!response.data) {
        throw new Error('Failed to update post');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message ?? 'Failed to update post');
    },
  });
}
