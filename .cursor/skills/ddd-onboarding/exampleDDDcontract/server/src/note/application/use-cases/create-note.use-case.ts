import { Inject, Injectable } from '@nestjs/common';
import { CreateNoteDto } from '@repo/contract';
import { Note } from '../../domain/entities/note.entity';
import { NOTE_REPOSITORY, NoteRepositoryPort } from '../ports/note.repository.port';

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly notes: NoteRepositoryPort,
  ) {}

  async execute(dto: CreateNoteDto): Promise<Note> {
    const note = Note.create(dto.title);
    return this.notes.save(note);
  }
}
