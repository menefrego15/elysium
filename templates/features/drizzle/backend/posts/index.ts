import { CommonModel } from '@backend/lib/models';
import { authMiddleware } from '@backend/modules/auth/middleware';
import { PostModel } from '@backend/modules/posts/model';
import * as PostsService from '@backend/modules/posts/service';
import { Elysia, t } from 'elysia';

export const posts = new Elysia({
  name: 'posts',
  prefix: '/posts',
  tags: ['Posts'],
})
  .use(authMiddleware)
  .use(CommonModel)
  .use(PostModel)
  .get(
    '/',
    async () => {
      return await PostsService.getAllPosts();
    },
    {
      detail: {
        description: 'Get all posts',
        summary: 'List all posts',
      },
      response: {
        200: t.Array(t.Ref('post')),
        500: 'error',
      },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await PostsService.getPostById(params.id);
    },
    {
      params: t.Object({
        id: t.Numeric({
          error: 'Invalid post ID',
        }),
      }),
      detail: {
        description: 'Get a post by ID',
      },
      response: {
        200: t.Ref('post'),
        400: 'error',
        404: 'error',
        500: 'error',
      },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      return await PostsService.createPost(body);
    },
    {
      auth: true,
      body: 'post.create',
      detail: {
        description: 'Create a new post (requires authentication)',
      },
      response: {
        200: 'post',
        400: 'error',
        401: 'error',
        500: 'error',
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      return await PostsService.updatePost(params.id, body);
    },
    {
      auth: true,
      params: t.Object({
        id: t.Numeric({
          error: 'Invalid post ID',
        }),
      }),
      body: 'post.update',
      detail: {
        description: 'Update an existing post (requires authentication)',
      },
      response: {
        200: t.Ref('post'),
        400: 'error',
        401: 'error',
        404: 'error',
        500: 'error',
      },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      await PostsService.deletePost(params.id);
      return { success: true };
    },
    {
      auth: true,
      params: t.Object({
        id: t.Numeric({
          error: 'Invalid post ID',
        }),
      }),
      detail: {
        description: 'Delete a post (requires authentication)',
      },
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
        400: 'error',
        401: 'error',
        404: 'error',
        500: 'error',
      },
    },
  );
