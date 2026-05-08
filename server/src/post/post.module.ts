import { Module } from '@nestjs/common';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { GetPostUseCase } from './application/use-cases/get-post.use-case';
import { ListPostsUseCase } from './application/use-cases/list-posts.use-case';
import { POST_REPOSITORY } from './application/ports/post.repository.port';
import { DrizzlePostRepository } from './infrastructure/adapters/drizzle-post.repository';
import { PostController } from './presentation/post.controller';

@Module({
  controllers: [PostController],
  providers: [
    CreatePostUseCase,
    GetPostUseCase,
    ListPostsUseCase,
    {
      provide: POST_REPOSITORY,
      useClass: DrizzlePostRepository,
    },
  ],
})
export class PostModule {}
