import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { PostSchema, UserSchema } from '@repo/contract';
import type { AssertTrue, IsExact } from '../shared/types/compile-time';

export const userTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type UserRow = typeof userTable.$inferSelect;
export type NewUserRow = typeof userTable.$inferInsert;

export const postTable = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type PostRow = typeof postTable.$inferSelect;
export type NewPostRow = typeof postTable.$inferInsert;

type ContractUser = z.infer<typeof UserSchema>;
type DbUser = UserRow;
type ContractPost = z.infer<typeof PostSchema>;
type DbPost = PostRow;

// Compile-time гарантия: форма БД = форма контракта.
type _UserShapeMustMatchContract = AssertTrue<IsExact<DbUser, ContractUser>>;
type _PostShapeMustMatchContract = AssertTrue<IsExact<DbPost, ContractPost>>;
