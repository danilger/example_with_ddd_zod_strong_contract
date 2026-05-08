import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  content: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePostBodySchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
});

export const PostIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const PostErrorSchema = z.object({
  message: z.string(),
});

export const postContract = c.router({
  createPost: {
    method: 'POST',
    path: '/posts',
    body: CreatePostBodySchema,
    responses: {
      201: PostSchema,
      400: PostErrorSchema,
    },
  },
  getPost: {
    method: 'GET',
    path: '/posts/:id',
    pathParams: PostIdParamSchema,
    responses: {
      200: PostSchema,
      404: PostErrorSchema,
    },
  },
  listPosts: {
    method: 'GET',
    path: '/posts',
    responses: {
      200: z.array(PostSchema),
    },
  },
});

export type PostDto = z.infer<typeof PostSchema>;
export type CreatePostDto = z.infer<typeof CreatePostBodySchema>;
