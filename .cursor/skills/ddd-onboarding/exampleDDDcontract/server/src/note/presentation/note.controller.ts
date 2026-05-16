import { Controller, NotFoundException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { noteContract, NoteDto } from '@repo/contract';
import { CreateNoteUseCase } from '../application/use-cases/create-note.use-case';
import { GetNoteUseCase } from '../application/use-cases/get-note.use-case';
import { Note } from '../domain/entities/note.entity';

/** Presentation: только HTTP + map domain → DTO по контракту. */
@Controller()
export class NoteController {
  constructor(
    private readonly createNote: CreateNoteUseCase,
    private readonly getNote: GetNoteUseCase,
  ) {}

  @TsRestHandler(noteContract.createNote, { validateResponses: true })
  create() {
    return tsRestHandler(noteContract.createNote, async ({ body }) => {
      try {
        const note = await this.createNote.execute(body);
        return { status: 201 as const, body: this.toDto(note) };
      } catch {
        return { status: 400 as const, body: { message: 'Bad request' } };
      }
    });
  }

  @TsRestHandler(noteContract.getNote, { validateResponses: true })
  get() {
    return tsRestHandler(noteContract.getNote, async ({ params }) => {
      try {
        const note = await this.getNote.execute(params.id);
        return { status: 200 as const, body: this.toDto(note) };
      } catch (e) {
        if (e instanceof NotFoundException) {
          return { status: 404 as const, body: { message: 'Note not found' } };
        }
        throw e;
      }
    });
  }

  private toDto(note: Note): NoteDto {
    return {
      id: note.getId().getValue(),
      title: note.getTitle(),
      createdAt: note.getCreatedAt().toISOString(),
    };
  }
}
