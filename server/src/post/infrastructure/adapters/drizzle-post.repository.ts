import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { z } from 'zod';
import { PostSchema } from '@repo/contract';
import { PostRepositoryPort } from '../../application/ports/post.repository.port';
import { Post } from '../../domain/entities/post.entity';
import { DB } from '../../../db/db.port';
import * as schema from '../../../db/schema';

type DbClient = LibSQLDatabase<typeof schema>;

@Injectable()
export class DrizzlePostRepository implements PostRepositoryPort {
  constructor(@Inject(DB) private readonly db: DbClient) {}

  async save(post: Post): Promise<Post> {
    const row = {
      id: post.getId().getValue(),
      title: post.getTitle(),
      content: post.getContent(),
      createdAt: post.getCreatedAt().toISOString(),
      updatedAt: post.getUpdatedAt().toISOString(),
    };

    const rows = await this.db.insert(schema.postTable).values(row).returning();
    const parsed = PostSchema.safeParse(rows[0]);
    if (!parsed.success) {
      throw new Error('DB row does not match shared contract');
    }

    return post;
  }

  async findById(id: string): Promise<Post | null> {
    const rows = await this.db
      .select()
      .from(schema.postTable)
      .where(eq(schema.postTable.id, id));
    const row = rows[0];
    if (!row) return null;

    const parsed = PostSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error('DB row does not match shared contract');
    }

    return Post.rehydrate({
      id: parsed.data.id,
      title: parsed.data.title,
      content: parsed.data.content,
      createdAt: new Date(parsed.data.createdAt),
      updatedAt: new Date(parsed.data.updatedAt),
    });
  }

  async findAll(): Promise<Post[]> {
    const rows = await this.db.select().from(schema.postTable);
    return rows
      .map((row) => PostSchema.safeParse(row))
      .filter((r): r is z.SafeParseSuccess<z.infer<typeof PostSchema>> => r.success)
      .map((r) =>
        Post.rehydrate({
          id: r.data.id,
          title: r.data.title,
          content: r.data.content,
          createdAt: new Date(r.data.createdAt),
          updatedAt: new Date(r.data.updatedAt),
        }),
      );
  }
}
