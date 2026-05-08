import { Controller, NotFoundException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { userContract, UserDto } from '@repo/contract';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { User } from '../domain/entities/user.entity';

@Controller()
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @TsRestHandler(userContract.createUser, { validateResponses: true })
  create() {
    return tsRestHandler(userContract.createUser, async ({ body }) => {
      try {
        const user = await this.createUser.execute(body);
        return {
          status: 201 as const,
          body: this.toResponse(user),
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
          body: this.toResponse(user),
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
        body: users.map((u) => this.toResponse(u)),
      };
    });
  }

  private toResponse(user: User): UserDto {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
