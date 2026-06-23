import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { z } from 'zod';
import { PostSchema } from '@repo/contract';
import {
  PostReadModel,
  PostReadRepositoryPort,
} from '../../application/ports/post.read.repository.port';
import {
  PostWriteRepositoryPort,
} from '../../application/ports/post.write.repository.port';
import { Post } from '../../domain/entities/post.entity';
import { DB } from '../../../db/db.port';
import * as schema from '../../../db/schema';

type DbClient = LibSQLDatabase<typeof schema>;

@Injectable()
export class DrizzlePostRepositoryAdapter
  implements PostWriteRepositoryPort, PostReadRepositoryPort
{
  constructor(@Inject(DB) private readonly db: DbClient) {}

  async save(post: Post): Promise<void> {
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
  }

  async findById(id: string): Promise<PostReadModel | null> {
    const rows = await this.db
      .select()
      .from(schema.postTable)
      .where(eq(schema.postTable.id, id));
    const row = rows[0];
    if (!row) return null;

    return this.toReadModel(row);
  }

  async findAll(): Promise<PostReadModel[]> {
    const rows = await this.db.select().from(schema.postTable);
    return rows
      .map((row) => PostSchema.safeParse(row))
      .filter((r): r is z.SafeParseSuccess<z.infer<typeof PostSchema>> => r.success)
      .map((r) => this.toReadModel(r.data));
  }

  private toReadModel(row: z.infer<typeof PostSchema>): PostReadModel {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
