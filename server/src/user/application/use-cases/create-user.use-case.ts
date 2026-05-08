import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@repo/contract';
import { User } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = User.create(dto.name, dto.email);
    return this.users.save(user);
  }
}
