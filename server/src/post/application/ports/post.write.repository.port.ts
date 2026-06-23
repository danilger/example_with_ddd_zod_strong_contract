import { Post } from '../../domain/entities/post.entity';

export interface PostWriteRepositoryPort {
  save(post: Post): Promise<void>;
}

export const POST_WRITE_REPOSITORY = Symbol('POST_WRITE_REPOSITORY');
