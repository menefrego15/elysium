import { table } from '@backend/database/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';

const insertPostSchema = createInsertSchema(table.postsTable);
const selectPostSchema = createSelectSchema(table.postsTable);

export const createPostRequest = t.Omit(insertPostSchema, ['id']);
export const updatePostRequest = t.Partial(insertPostSchema);
export const postResponse = selectPostSchema;

export const PostModel = new Elysia({ name: 'Post.Model' }).model({
  post: postResponse,
  'post.create': createPostRequest,
  'post.update': updatePostRequest,
});

export type CreatePostRequest = typeof createPostRequest.static;
export type UpdatePostRequest = typeof updatePostRequest.static;
export type PostResponse = typeof postResponse.static;
