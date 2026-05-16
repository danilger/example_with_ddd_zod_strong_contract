import { Injectable } from '@nestjs/common';
import { Note } from '../../domain/entities/note.entity';
import { NoteRepositoryPort } from '../../application/ports/note.repository.port';

/** Infrastructure: реализация порта (в репо — Drizzle + Zod safeParse строки БД). */
@Injectable()
export class InMemoryNoteRepository implements NoteRepositoryPort {
  private readonly store = new Map<string, Note>();

  async save(note: Note): Promise<Note> {
    this.store.set(note.getId().getValue(), note);
    return note;
  }

  async findById(id: string): Promise<Note | null> {
    return this.store.get(id) ?? null;
  }
}
