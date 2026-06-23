import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@repo/contract';
import { CreatePostCommand } from '../application/commands/create-post.command';

@Injectable()
export class CreatePostCommandAdapter {
  adapt(dto: CreatePostDto): CreatePostCommand {
    return new CreatePostCommand(dto.title, dto.content);
  }
}
