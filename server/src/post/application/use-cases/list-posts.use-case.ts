import { Inject, Injectable } from '@nestjs/common';
import {
  POST_REPOSITORY,
  PostRepositoryPort,
} from '../ports/post.repository.port';

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepositoryPort,
  ) {}

  async execute() {
    return this.posts.findAll();
  }
}
