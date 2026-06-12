import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@repo/contract';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class InMemoryUserRepositoryAdapter implements UserRepositoryPort {
  private readonly store = new Map<string, User>();

  save(user: User): User {
    this.store.set(user.getId().getValue(), user);
    return user;
  }

  findById(id: string): User | null {
    return this.store.get(id) ?? null;
  }

  findByEmail(email: string): User | null {
    return (
      Array.from(this.store.values()).find(
        (u) => u.getEmail().getValue() === email,
      ) ?? null
    );
  }

  findAll(): User[] {
    return Array.from(this.store.values());
  }

  update(id: string, dto: UpdateUserDto): User {
    const user = this.store.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.updateName(dto.name);
    return user;
  }

  delete(id: string): void {
    if (!this.store.delete(id)) {
      throw new Error('User not found');
    }
  }
}
