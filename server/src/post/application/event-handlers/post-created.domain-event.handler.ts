import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostCreatedDomainEvent } from '../../domain/events/post-created.domain-event';

@Injectable()
@EventsHandler(PostCreatedDomainEvent)
export class PostCreatedDomainEventHandler
  implements IEventHandler<PostCreatedDomainEvent>
{
  private readonly logger = new Logger(PostCreatedDomainEventHandler.name);

  handle(event: PostCreatedDomainEvent): void {
    this.logger.log(
      `Post created: id=${event.postId}, title="${event.title}"`,
    );
  }
}
