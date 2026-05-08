import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const UserIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const ErrorSchema = z.object({
  message: z.string(),
});

/** Единый API-контракт для backend и frontend. */
export const userContract = c.router({
  createUser: {
    method: 'POST',
    path: '/users',
    body: CreateUserBodySchema,
    responses: {
      201: UserSchema,
      409: ErrorSchema,
      400: ErrorSchema,
    },
  },
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: UserIdParamSchema,
    responses: {
      200: UserSchema,
      404: ErrorSchema,
    },
  },
  listUsers: {
    method: 'GET',
    path: '/users',
    responses: {
      200: z.array(UserSchema),
    },
  },
});

export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserBodySchema>;
