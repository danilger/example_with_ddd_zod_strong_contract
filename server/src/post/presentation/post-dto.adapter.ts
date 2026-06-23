import { Injectable } from '@nestjs/common';
import { PostDto } from '@repo/contract';
import { PostReadModel } from '../application/ports/post.read.repository.port';
import { Post } from '../domain/entities/post.entity';

@Injectable()
export class PostDtoAdapter {
  adaptFromAggregate(post: Post): PostDto {
    return {
      id: post.getId().getValue(),
      title: post.getTitle(),
      content: post.getContent(),
      createdAt: post.getCreatedAt().toISOString(),
      updatedAt: post.getUpdatedAt().toISOString(),
    };
  }

  adaptFromReadModel(readModel: PostReadModel): PostDto {
    return {
      id: readModel.id,
      title: readModel.title,
      content: readModel.content,
      createdAt: readModel.createdAt,
      updatedAt: readModel.updatedAt,
    };
  }
}
