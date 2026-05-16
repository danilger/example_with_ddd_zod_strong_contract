import { Module } from '@nestjs/common';
import { NOTE_REPOSITORY } from './application/ports/note.repository.port';
import { CreateNoteUseCase } from './application/use-cases/create-note.use-case';
import { GetNoteUseCase } from './application/use-cases/get-note.use-case';
import { InMemoryNoteRepository } from './infrastructure/adapters/in-memory-note.repository';
import { NoteController } from './presentation/note.controller';

@Module({
  controllers: [NoteController],
  providers: [
    CreateNoteUseCase,
    GetNoteUseCase,
    { provide: NOTE_REPOSITORY, useClass: InMemoryNoteRepository },
  ],
})
export class NoteModule {}
