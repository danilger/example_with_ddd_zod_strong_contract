import { Controller, NotFoundException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { userContract } from '@repo/contract';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UserDtoAdapter } from './user-dto.adapter';

@Controller()
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly userDtoAdapter: UserDtoAdapter,
  ) {}

  @TsRestHandler(userContract.createUser, { validateResponses: true })
  create() {
    return tsRestHandler(userContract.createUser, async ({ body }) => {
      try {
        const user = await this.createUser.execute(body);
        return {
          status: 201 as const,
          body: this.userDtoAdapter.adapt(user),
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          return {
            status: 409 as const,
            body: { message: error.message },
          };
        }
        return {
          status: 400 as const,
          body: { message: 'Bad request' },
        };
      }
    });
  }

  @TsRestHandler(userContract.getUser, { validateResponses: true })
  get() {
    return tsRestHandler(userContract.getUser, async ({ params }) => {
      try {
        const user = await this.getUser.execute(params.id);
        return {
          status: 200 as const,
          body: this.userDtoAdapter.adapt(user),
        };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return {
            status: 404 as const,
            body: { message: 'User not found' },
          };
        }
        return {
          status: 404 as const,
          body: { message: 'User not found' },
        };
      }
    });
  }

  @TsRestHandler(userContract.listUsers, { validateResponses: true })
  list() {
    return tsRestHandler(userContract.listUsers, async () => {
      const users = await this.listUsers.execute();
      return {
        status: 200 as const,
        body: users.map((u) => this.userDtoAdapter.adapt(u)),
      };
    });
  }

  @TsRestHandler(userContract.updateUser, { validateResponses: true })
  update() {
    return tsRestHandler(userContract.updateUser, async ({ params, body }) => {
      try {
        const user = await this.updateUser.execute(params.id, body);
        return {
          status: 200 as const,
          body: this.userDtoAdapter.adapt(user),
        };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return {
            status: 404 as const,
            body: { message: 'User not found' },
          };
        }
        return {
          status: 400 as const,
          body: { message: 'Bad request' },
        };
      }
    });
  }

  @TsRestHandler(userContract.deleteUser, { validateResponses: true })
  delete() {
    return tsRestHandler(userContract.deleteUser, async ({ params }) => {
      try {
        await this.deleteUser.execute(params.id);
        return {
          status: 204 as const,
          body: null,
        };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return {
            status: 404 as const,
            body: { message: 'User not found' },
          };
        }
        return {
          status: 400 as const,
          body: { message: 'Bad request' },
        };
      }
    });
  }
}
