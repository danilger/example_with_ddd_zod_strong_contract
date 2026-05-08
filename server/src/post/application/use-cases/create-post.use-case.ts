import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from '@repo/contract';
import { Post } from '../../domain/entities/post.entity';
import {
  POST_REPOSITORY,
  PostRepositoryPort,
} from '../ports/post.repository.port';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepositoryPort,
  ) {}

  async execute(dto: CreatePostDto): Promise<Post> {
    const post = Post.create(dto.title, dto.content);
    return this.posts.save(post);
  }
}
