import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { DrizzleUserRepositoryAdapter } from './infrastructure/adapters/drizzle-user.repository.adapter';
import { UserController } from './presentation/user.controller';
import { UserDtoAdapter } from './presentation/user-dto.adapter';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UserDtoAdapter,
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepositoryAdapter,
    },
  ],
})
export class UserModule {}
