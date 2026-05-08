import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export class User {
  private updatedAt: Date;

  private constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private readonly createdAt: Date,
  ) {
    this.updatedAt = createdAt;
  }

  static create(name: string, email: string): User {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 chars');
    }
    return new User(new UserId(), name.trim(), new Email(email), new Date());
  }

  static rehydrate(props: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const user = new User(
      new UserId(props.id),
      props.name,
      new Email(props.email),
      props.createdAt,
    );
    user.updatedAt = props.updatedAt;
    return user;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 chars');
    }
    this.name = name.trim();
    this.updatedAt = new Date();
  }
}
