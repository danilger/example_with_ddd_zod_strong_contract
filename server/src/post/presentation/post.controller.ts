import { Controller, NotFoundException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { postContract, PostDto } from '@repo/contract';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case';
import { Post } from '../domain/entities/post.entity';

@Controller()
export class PostController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getPost: GetPostUseCase,
    private readonly listPosts: ListPostsUseCase,
  ) {}

  @TsRestHandler(postContract.createPost, { validateResponses: true })
  create() {
    return tsRestHandler(postContract.createPost, async ({ body }) => {
      try {
        const post = await this.createPost.execute(body);
        return {
          status: 201 as const,
          body: this.toResponse(post),
        };
      } catch {
        return {
          status: 400 as const,
          body: { message: 'Bad request' },
        };
      }
    });
  }

  @TsRestHandler(postContract.getPost, { validateResponses: true })
  get() {
    return tsRestHandler(postContract.getPost, async ({ params }) => {
      try {
        const post = await this.getPost.execute(params.id);
        return {
          status: 200 as const,
          body: this.toResponse(post),
        };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return {
            status: 404 as const,
            body: { message: 'Post not found' },
          };
        }
        return {
          status: 404 as const,
          body: { message: 'Post not found' },
        };
      }
    });
  }

  @TsRestHandler(postContract.listPosts, { validateResponses: true })
  list() {
    return tsRestHandler(postContract.listPosts, async () => {
      const posts = await this.listPosts.execute();
      return {
        status: 200 as const,
        body: posts.map((p) => this.toResponse(p)),
      };
    });
  }

  private toResponse(post: Post): PostDto {
    return {
      id: post.getId().getValue(),
      title: post.getTitle(),
      content: post.getContent(),
      createdAt: post.getCreatedAt().toISOString(),
      updatedAt: post.getUpdatedAt().toISOString(),
    };
  }
}
