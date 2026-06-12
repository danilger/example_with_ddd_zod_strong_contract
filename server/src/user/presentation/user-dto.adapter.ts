import { Injectable } from '@nestjs/common';
import { UserDto } from '@repo/contract';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class UserDtoAdapter {
  adapt(user: User): UserDto {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
