import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Note } from '../../domain/entities/note.entity';
import { NOTE_REPOSITORY, NoteRepositoryPort } from '../ports/note.repository.port';

@Injectable()
export class GetNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly notes: NoteRepositoryPort,
  ) {}

  async execute(id: string): Promise<Note> {
    const note = await this.notes.findById(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
}
