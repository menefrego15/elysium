import { client } from '@frontend/lib/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery(postsQueryOptions);
}

const fetchPosts = async () => {
  const response = await client.api.posts.get();

  if (response.error) {
    throw new Error(response.error.value.message);
  }

  if (!response.data) {
    throw new Error('Failed to fetch posts');
  }

  return response.data;
};

export const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
});
