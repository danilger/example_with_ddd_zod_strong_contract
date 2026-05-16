import { Note } from '../../domain/entities/note.entity';

export interface NoteRepositoryPort {
  save(note: Note): Promise<Note>;
  findById(id: string): Promise<Note | null>;
}

export const NOTE_REPOSITORY = Symbol('NOTE_REPOSITORY');
