import { Module } from '@nestjs/common';
import { TsRestModule } from '@ts-rest/nest';
import { DrizzleModule } from './db/drizzle.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TsRestModule.register({ isGlobal: true }),
    DrizzleModule,
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
