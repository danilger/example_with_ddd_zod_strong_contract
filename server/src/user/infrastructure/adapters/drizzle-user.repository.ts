import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { z } from 'zod';
import { UserSchema } from '@repo/contract';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { DB } from '../../../db/db.port';
import * as schema from '../../../db/schema';

type DbClient = LibSQLDatabase<typeof schema>;

@Injectable()
export class DrizzleUserRepository implements UserRepositoryPort {
  constructor(@Inject(DB) private readonly db: DbClient) {}

  async save(user: User): Promise<User> {
    const row = {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };

    const rows = await this.db.insert(schema.userTable).values(row).returning();
    const parsed = UserSchema.safeParse(rows[0]);
    if (!parsed.success) {
      throw new Error('DB row does not match shared contract');
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.id, id));
    const row = rows[0];
    if (!row) return null;

    const parsed = UserSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error('DB row does not match shared contract');
    }

    return User.rehydrate({
      id: parsed.data.id,
      name: parsed.data.name,
      email: parsed.data.email,
      createdAt: new Date(parsed.data.createdAt),
      updatedAt: new Date(parsed.data.updatedAt),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.email, email));
    const row = rows[0];
    if (!row) return null;

    const parsed = UserSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error('DB row does not match shared contract');
    }

    return User.rehydrate({
      id: parsed.data.id,
      name: parsed.data.name,
      email: parsed.data.email,
      createdAt: new Date(parsed.data.createdAt),
      updatedAt: new Date(parsed.data.updatedAt),
    });
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db.select().from(schema.userTable);
    return rows
      .map((row) => UserSchema.safeParse(row))
      .filter((r): r is z.SafeParseSuccess<z.infer<typeof UserSchema>> => r.success)
      .map((r) =>
        User.rehydrate({
          id: r.data.id,
          name: r.data.name,
          email: r.data.email,
          createdAt: new Date(r.data.createdAt),
          updatedAt: new Date(r.data.updatedAt),
        }),
      );
  }
}
