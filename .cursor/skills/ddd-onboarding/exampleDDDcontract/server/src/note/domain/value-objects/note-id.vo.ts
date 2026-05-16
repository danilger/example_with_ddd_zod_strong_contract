import { randomUUID } from 'crypto';

export class NoteId {
  constructor(private readonly value: string = randomUUID()) {}

  getValue(): string {
    return this.value;
  }
}
