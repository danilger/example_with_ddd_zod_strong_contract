import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private readonly store = new Map<string, User>();

  save(user: User): User {
    this.store.set(user.getId().getValue(), user);
    return user;
  }

  findById(id: string): User | null {
    return this.store.get(id) ?? null;
  }

  findByEmail(email: string): User | null {
    return Array.from(this.store.values()).find((u) => u.getEmail().getValue() === email) ?? null;
  }

  findAll(): User[] {
    return Array.from(this.store.values());
  }
}
