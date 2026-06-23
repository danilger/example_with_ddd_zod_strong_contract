export interface PostReadModel {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostReadRepositoryPort {
  findById(id: string): Promise<PostReadModel | null>;
  findAll(): Promise<PostReadModel[]>;
}

export const POST_READ_REPOSITORY = Symbol('POST_READ_REPOSITORY');
