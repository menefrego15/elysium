import z from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  body: z.string().min(1, 'Body is required'),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});
