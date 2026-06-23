export class CreatePostCommand {
  constructor(
    readonly title: string,
    readonly content: string,
  ) {}
}
