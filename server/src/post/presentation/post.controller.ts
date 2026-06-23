import { Controller, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { postContract } from '@repo/contract';
import { PostReadModel } from '../application/ports/post.read.repository.port';
import { GetPostQuery } from '../application/queries/get-post.query';
import { ListPostsQuery } from '../application/queries/list-posts.query';
import { CreatePostCommandAdapter } from './create-post-command.adapter';
import { PostDtoAdapter } from './post-dto.adapter';

@Controller()
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly createPostCommandAdapter: CreatePostCommandAdapter,
    private readonly postDtoAdapter: PostDtoAdapter,
  ) {}

  @TsRestHandler(postContract.createPost, { validateResponses: true })
  create() {
    return tsRestHandler(postContract.createPost, async ({ body }) => {
      try {
        const post = await this.commandBus.execute(
          this.createPostCommandAdapter.adapt(body),
        );
        return {
          status: 201 as const,
          body: this.postDtoAdapter.adaptFromAggregate(post),
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
        const readModel = await this.queryBus.execute(
          new GetPostQuery(params.id),
        );
        return {
          status: 200 as const,
          body: this.postDtoAdapter.adaptFromReadModel(readModel),
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
      const readModels = await this.queryBus.execute<
        ListPostsQuery,
        PostReadModel[]
      >(new ListPostsQuery());
      return {
        status: 200 as const,
        body: readModels.map((model) =>
          this.postDtoAdapter.adaptFromReadModel(model),
        ),
      };
    });
  }
}
