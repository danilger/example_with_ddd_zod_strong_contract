import { useState } from 'react';
import type { NoteDto } from '@repo/contract';
import { api } from './api';

/** UI: без локальных DTO; статусы ответа обрабатываются явно. */
export function NoteExample() {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState<NoteDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await api.createNote({ body: { title: title.trim() } });
    if (res.status === 201) {
      setTitle('');
      setDetail(res.body);
      return;
    }
    if (res.status === 400) {
      setError(res.body.message);
    }
  }

  async function handleLoad(id: string) {
    setError(null);
    const res = await api.getNote({ params: { id } });
    if (res.status === 200) {
      setDetail(res.body);
      return;
    }
    if (res.status === 404) {
      setError(res.body.message);
    }
  }

  return (
    <section>
      <form onSubmit={handleCreate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <button type="submit">Create note</button>
      </form>
      {detail && (
        <p>
          {detail.title}{' '}
          <button type="button" onClick={() => void handleLoad(detail.id)}>
            Reload
          </button>
        </p>
      )}
      {error && <p>{error}</p>}
    </section>
  );
}
