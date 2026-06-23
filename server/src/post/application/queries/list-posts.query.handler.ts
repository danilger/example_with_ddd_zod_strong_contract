import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_READ_REPOSITORY,
  PostReadModel,
  PostReadRepositoryPort,
} from '../ports/post.read.repository.port';
import { ListPostsQuery } from './list-posts.query';

@Injectable()
@QueryHandler(ListPostsQuery)
export class ListPostsQueryHandler implements IQueryHandler<ListPostsQuery> {
  constructor(
    @Inject(POST_READ_REPOSITORY)
    private readonly postReadRepository: PostReadRepositoryPort,
  ) {}

  async execute(_query: ListPostsQuery): Promise<PostReadModel[]> {
    return this.postReadRepository.findAll();
  }
}
