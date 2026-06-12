import { Injectable } from '@nestjs/common';
import { PostDto } from '@repo/contract';
import { Post } from '../domain/entities/post.entity';

@Injectable()
export class PostDtoAdapter {
  adapt(post: Post): PostDto {
    return {
      id: post.getId().getValue(),
      title: post.getTitle(),
      content: post.getContent(),
      createdAt: post.getCreatedAt().toISOString(),
      updatedAt: post.getUpdatedAt().toISOString(),
    };
  }
}
