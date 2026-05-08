import { Global, Module } from '@nestjs/common';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { DB } from './db.port';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: DB,
      useFactory: async () => {
        const dataDir = join(process.cwd(), 'data');
        if (!existsSync(dataDir)) {
          mkdirSync(dataDir, { recursive: true });
        }
        const sqlitePath = join(dataDir, 'app.db');
        const client = createClient({ url: `file:${sqlitePath}` });
        const db = drizzle(client, { schema });
        const migrationsFolder = join(process.cwd(), 'drizzle');
        await migrate(db, { migrationsFolder });
        return db;
      },
    },
  ],
  exports: [DB],
})
export class DrizzleModule {}
