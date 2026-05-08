import { useCallback, useEffect, useState } from 'react';
import type { PostDto, UserDto } from '@repo/contract';
import { api } from './api';

export function App() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDto | null>(null);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<PostDto | null>(null);

  const loadList = useCallback(async () => {
    setError(null);
    const res = await api.listUsers({});
    if (res.status === 200) {
      setUsers(res.body);
    } else {
      setError('Не удалось загрузить список');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const loadPosts = useCallback(async () => {
    try {
      const res = await api.listPosts({});
      if (res.status === 200) {
        setPosts(Array.isArray(res.body) ? res.body : []);
        return;
      }
      setError('Не удалось загрузить посты');
    } catch {
      setError('Не удалось загрузить посты');
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await api.createUser({ body: { name: name.trim(), email: email.trim() } });
    setCreating(false);
    if (res.status === 201) {
      setName('');
      setEmail('');
      await loadList();
      return;
    }
    if (res.status === 409 || res.status === 400) {
      setError(res.body.message);
      return;
    }
    setError('Ошибка создания');
  }

  async function handleSelect(id: string) {
    setSelectedId(id);
    setDetail(null);
    const res = await api.getUser({ params: { id } });
    if (res.status === 200) {
      setDetail(res.body);
    } else if (res.status === 404) {
      setError(res.body.message);
    } else {
      setError('Не удалось загрузить пользователя');
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setCreatingPost(true);
    setError(null);
    const res = await api.createPost({
      body: {
        title: postTitle.trim(),
        content: postContent.trim(),
      },
    });
    setCreatingPost(false);
    if (res.status === 201) {
      setPostTitle('');
      setPostContent('');
      await loadPosts();
      return;
    }
    if (res.status === 400) {
      setError(res.body.message);
      return;
    }
    setError('Ошибка создания поста');
  }

  async function handleSelectPost(id: string) {
    setSelectedPostId(id);
    setPostDetail(null);
    const res = await api.getPost({ params: { id } });
    if (res.status === 200) {
      setPostDetail(res.body);
    } else if (res.status === 404) {
      setError(res.body.message);
    } else {
      setError('Не удалось загрузить пост');
    }
  }

  return (
    <>
      <h1>Пользователи (ts-rest + Zod)</h1>
      <p>
        Клиент и сервер делят контракт из пакета <code>@repo/contract</code>. В dev-режиме запросы к{' '}
        <code>/users</code> проксируются на порт 3000 (см. <code>vite.config.ts</code>).
      </p>

      <section>
        <h2>Создать</h2>
        <form onSubmit={(e) => void handleCreate(e)}>
          <label>
            Имя (мин. 2 символа)
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit" disabled={creating}>
            {creating ? 'Создание…' : 'Создать'}
          </button>
        </form>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section>
        <h2>Список</h2>
        {loading ? (
          <p>Загрузка…</p>
        ) : users.length === 0 ? (
          <p>Пока нет пользователей.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                <strong>{u.name}</strong>
                <small>{u.email}</small>
                <div>
                  <button type="button" className="secondary" onClick={() => void handleSelect(u.id)}>
                    Открыть
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedId ? (
        <section>
          <h2>Карточка</h2>
          {!detail ? (
            <p>Загрузка…</p>
          ) : (
            <pre style={{ overflow: 'auto', padding: '1rem', background: '#161b22', borderRadius: 8 }}>
              {JSON.stringify(detail, null, 2)}
            </pre>
          )}
        </section>
      ) : null}

      <hr />

      <h1>Посты (новый домен)</h1>

      <section>
        <h2>Создать пост</h2>
        <form onSubmit={(e) => void handleCreatePost(e)}>
          <label>
            Заголовок
            <input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required minLength={2} />
          </label>
          <label>
            Контент
            <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} required minLength={1} />
          </label>
          <button type="submit" disabled={creatingPost}>
            {creatingPost ? 'Создание…' : 'Создать пост'}
          </button>
        </form>
      </section>

      <section>
        <h2>Список постов</h2>
        {!Array.isArray(posts) || posts.length === 0 ? (
          <p>Пока нет постов.</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p.id}>
                <strong>{p.title}</strong>
                <div>
                  <button type="button" className="secondary" onClick={() => void handleSelectPost(p.id)}>
                    Открыть
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedPostId ? (
        <section>
          <h2>Карточка поста</h2>
          {!postDetail ? (
            <p>Загрузка…</p>
          ) : (
            <pre style={{ overflow: 'auto', padding: '1rem', background: '#161b22', borderRadius: 8 }}>
              {JSON.stringify(postDetail, null, 2)}
            </pre>
          )}
        </section>
      ) : null}
    </>
  );
}
