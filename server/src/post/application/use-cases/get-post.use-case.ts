import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  POST_REPOSITORY,
  PostRepositoryPort,
} from '../ports/post.repository.port';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepositoryPort,
  ) {}

  async execute(id: string) {
    const post = await this.posts.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
