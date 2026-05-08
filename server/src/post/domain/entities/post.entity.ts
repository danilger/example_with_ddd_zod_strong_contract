import { PostId } from '../value-objects/post-id.vo';

export class Post {
  private updatedAt: Date;

  private constructor(
    private readonly id: PostId,
    private title: string,
    private content: string,
    private readonly createdAt: Date,
  ) {
    this.updatedAt = createdAt;
  }

  static create(title: string, content: string): Post {
    if (!title || title.trim().length < 2) {
      throw new Error('Title must be at least 2 chars');
    }
    if (!content || content.trim().length < 1) {
      throw new Error('Content is required');
    }
    return new Post(new PostId(), title.trim(), content.trim(), new Date());
  }

  static rehydrate(props: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): Post {
    const post = new Post(
      new PostId(props.id),
      props.title,
      props.content,
      props.createdAt,
    );
    post.updatedAt = props.updatedAt;
    return post;
  }

  getId(): PostId {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
