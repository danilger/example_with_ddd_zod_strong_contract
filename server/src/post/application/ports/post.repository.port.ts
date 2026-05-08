import { Post } from '../../domain/entities/post.entity';

export interface PostRepositoryPort {
  save(post: Post): Promise<Post> | Post;
  findById(id: string): Promise<Post | null> | Post | null;
  findAll(): Promise<Post[]> | Post[];
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
