import { NoteId } from '../value-objects/note-id.vo';

/** Domain: инварианты без HTTP, Zod-контракта и ORM. */
export class Note {
  private constructor(
    private readonly id: NoteId,
    private readonly title: string,
    private readonly createdAt: Date,
  ) {}

  static create(title: string): Note {
    const trimmed = title.trim();
    if (trimmed.length < 2) {
      throw new Error('Title must be at least 2 chars');
    }
    return new Note(new NoteId(), trimmed, new Date());
  }

  static rehydrate(id: string, title: string, createdAt: Date): Note {
    return new Note(new NoteId(id), title, createdAt);
  }

  getId(): NoteId {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
