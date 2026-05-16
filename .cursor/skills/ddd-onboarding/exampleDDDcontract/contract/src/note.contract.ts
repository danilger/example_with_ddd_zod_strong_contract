import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/** Сущность в API — только то, что уходит наружу. */
export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  createdAt: z.string().datetime(),
});

export const CreateNoteBodySchema = z.object({
  title: z.string().min(2),
});

export const NoteIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const NoteErrorSchema = z.object({
  message: z.string(),
});

export const noteContract = c.router({
  createNote: {
    method: 'POST',
    path: '/notes',
    body: CreateNoteBodySchema,
    responses: {
      201: NoteSchema,
      400: NoteErrorSchema,
    },
  },
  getNote: {
    method: 'GET',
    path: '/notes/:id',
    pathParams: NoteIdParamSchema,
    responses: {
      200: NoteSchema,
      404: NoteErrorSchema,
    },
  },
});

export type NoteDto = z.infer<typeof NoteSchema>;
export type CreateNoteDto = z.infer<typeof CreateNoteBodySchema>;
