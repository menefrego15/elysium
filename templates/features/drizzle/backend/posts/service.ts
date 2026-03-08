import { table } from '@backend/database/schema';
import { db } from '@backend/lib/db';
import { InternalServerError, NotFoundError } from '@backend/lib/errors';
import type { CreatePostRequest, PostResponse, UpdatePostRequest } from '@backend/modules/posts/model';
import { eq } from 'drizzle-orm';

export async function getAllPosts(): Promise<PostResponse[]> {
  try {
    return await db.select().from(table.postsTable);
  } catch (error) {
    throw new InternalServerError('Failed to fetch posts', error);
  }
}

export async function getPostById(id: number): Promise<PostResponse> {
  try {
    const post = await db.select().from(table.postsTable).where(eq(table.postsTable.id, id));

    if (!post[0]) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }

    return post[0];
  } catch (error) {
    throw new InternalServerError('Failed to fetch post', error);
  }
}

export async function createPost(request: CreatePostRequest): Promise<PostResponse> {
  try {
    const newPost = await db.insert(table.postsTable).values(request).returning();
    if (!newPost[0]) {
      throw new InternalServerError('Failed to create post');
    }
    return newPost[0];
  } catch (error) {
    throw new InternalServerError('Failed to create post', error);
  }
}

export async function updatePost(id: number, request: UpdatePostRequest): Promise<PostResponse> {
  try {
    const updatedPost = await db.update(table.postsTable).set(request).where(eq(table.postsTable.id, id)).returning();

    if (!updatedPost[0]) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }

    return updatedPost[0];
  } catch (error) {
    throw new InternalServerError('Failed to update post', error);
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    const result = await db.delete(table.postsTable).where(eq(table.postsTable.id, id)).returning();

    if (!result[0]) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }
  } catch (error) {
    throw new InternalServerError('Failed to delete post', error);
  }
}
