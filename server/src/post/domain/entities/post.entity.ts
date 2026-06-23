import { AggregateRoot } from '@nestjs/cqrs';
import { PostCreatedDomainEvent } from '../events/post-created.domain-event';
import { PostId } from '../value-objects/post-id.vo';

export class Post extends AggregateRoot {
  private updatedAt: Date;

  private constructor(
    private readonly id: PostId,
    private title: string,
    private content: string,
    private readonly createdAt: Date,
  ) {
    super();
    this.updatedAt = createdAt;
  }

  static create(title: string, content: string): Post {
    if (!title || title.trim().length < 2) {
      throw new Error('Title must be at least 2 chars');
    }
    if (!content || content.trim().length < 1) {
      throw new Error('Content is required');
    }

    const postId = new PostId();
    const createdAt = new Date();
    const post = new Post(
      postId,
      title.trim(),
      content.trim(),
      createdAt,
    );
    post.apply(
      new PostCreatedDomainEvent(
        postId.getValue(),
        title.trim(),
        content.trim(),
        createdAt,
      ),
    );
    return post;
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

  protected onPostCreatedDomainEvent(_event: PostCreatedDomainEvent): void {
    // Состояние уже задано в create(); обработчик нужен для будущего replay из event store.
  }
}
