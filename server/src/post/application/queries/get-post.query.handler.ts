import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_READ_REPOSITORY,
  PostReadModel,
  PostReadRepositoryPort,
} from '../ports/post.read.repository.port';
import { GetPostQuery } from './get-post.query';

@Injectable()
@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @Inject(POST_READ_REPOSITORY)
    private readonly postReadRepository: PostReadRepositoryPort,
  ) {}

  async execute(query: GetPostQuery): Promise<PostReadModel> {
    const post = await this.postReadRepository.findById(query.id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
