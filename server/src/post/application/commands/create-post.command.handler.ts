import { Inject, Injectable } from '@nestjs/common';
import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Post } from '../../domain/entities/post.entity';
import {
  POST_WRITE_REPOSITORY,
  PostWriteRepositoryPort,
} from '../ports/post.write.repository.port';
import { CreatePostCommand } from './create-post.command';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand, Post>
{
  constructor(
    @Inject(POST_WRITE_REPOSITORY)
    private readonly postWriteRepository: PostWriteRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    const post = this.eventPublisher.mergeObjectContext(
      Post.create(command.title, command.content),
    );
    await this.postWriteRepository.save(post);
    post.commit();
    return post;
  }
}
