export class PostCreatedDomainEvent {
  constructor(
    readonly postId: string,
    readonly title: string,
    readonly content: string,
    readonly occurredAt: Date,
  ) {}
}
