import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostCommandHandler } from './application/commands/create-post.command.handler';
import { PostCreatedDomainEventHandler } from './application/event-handlers/post-created.domain-event.handler';
import { POST_READ_REPOSITORY } from './application/ports/post.read.repository.port';
import { POST_WRITE_REPOSITORY } from './application/ports/post.write.repository.port';
import { GetPostQueryHandler } from './application/queries/get-post.query.handler';
import { ListPostsQueryHandler } from './application/queries/list-posts.query.handler';
import { DrizzlePostRepositoryAdapter } from './infrastructure/adapters/drizzle-post.repository.adapter';
import { CreatePostCommandAdapter } from './presentation/create-post-command.adapter';
import { PostController } from './presentation/post.controller';
import { PostDtoAdapter } from './presentation/post-dto.adapter';

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [
    CreatePostCommandHandler,
    GetPostQueryHandler,
    ListPostsQueryHandler,
    PostCreatedDomainEventHandler,
    CreatePostCommandAdapter,
    PostDtoAdapter,
    DrizzlePostRepositoryAdapter,
    {
      provide: POST_WRITE_REPOSITORY,
      useExisting: DrizzlePostRepositoryAdapter,
    },
    {
      provide: POST_READ_REPOSITORY,
      useExisting: DrizzlePostRepositoryAdapter,
    },
  ],
})
export class PostModule {}
