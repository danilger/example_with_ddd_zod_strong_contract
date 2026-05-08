# Пример NestJS + React: DDD + сильный контракт (ts-rest + Zod)

Монорепозиторий в духе [zod-nest](https://github.com/danilger/zod-nest): **один “сильный” контракт** (ts-rest + Zod) в пакете `contract`, общий для **сервера (NestJS)** и **клиента (Vite + React)**.

Ключевая идея: контракт — это **единый источник истины** для:

- **HTTP API** (маршруты, методы, параметры, тела, коды ответов)
- **типов DTO** (на клиенте и сервере)
- **валидации** (Zod на границах и при чтении из БД)
- **согласованности БД** (compile-time соответствие формы строки таблицы и схемы контракта)

Персистенция — **SQLite** через **Drizzle** и драйвер **libSQL** (`@libsql/client`, локальный файл `file:...`), чтобы на Windows не собирать нативный `better-sqlite3`.

## Структура

| Пакет | Назначение |
|--------|------------|
| `contract/` | `@repo/contract` — Zod-схемы и роутеры ts-rest (`userContract`, `postContract`), агрегирующий `apiContract`, типы DTO |
| `server/` | NestJS, DDD-слои, Drizzle + миграции в `server/drizzle/` |
| `client/` | React UI, `initClient` из `@ts-rest/core`, dev-прокси `/users` и `/posts` → backend |

## Что реализовано

- Домен **`user`**: `createUser`, `getUser`, `listUsers`
- Домен **`post`**: `createPost`, `getPost`, `listPosts`

## Требования

- Node.js 20+ (проверено на 22)
- npm (workspaces)

## Установка и сборка

В корне репозитория:

```powershell
cd d:\projects\example_with_ddd_zod_strong_contract
npm install
npm run build:contract
```

Полная сборка всех пакетов:

```powershell
npm run build
```

Коротко про установку пакетов в workspace:

- Установить пакет только в `server`: `npm i <package-name> -w server`
- Установить пакет только в `client`: `npm i <package-name> -w client`
- Установить пакет только в `contract`: `npm i <package-name> -w @repo/contract`
- Dev-зависимость: `npm i -D <package-name> -w <workspace>`

Как это работает: `workspaces` в корневом `package.json` объединяют `contract`, `server`, `client` в один монорепозиторий с общим `package-lock.json`; npm старается поднимать совместимые общие зависимости в корневой `node_modules`, но запись о пакете остаётся в `package.json` выбранного workspace.

## Запуск в разработке

Терминал 1 — API (порт `3000`):

```powershell
cd d:\projects\example_with_ddd_zod_strong_contract
npm run dev:server
```

Терминал 2 — клиент (порт `5173`, прокси на API):

```powershell
cd d:\projects\example_with_ddd_zod_strong_contract
npm run dev:client
```

Откройте в браузере `http://localhost:5173`. В dev-режиме запросы к `/users` и `/posts` идут на Nest через `vite` proxy.

Переменная `VITE_API_URL` (опционально): если задать полный URL API, прокси не используется для клиента ts-rest (удобно при разнесённых хостах).

## База данных

- Файл БД: `server/data/app.db` (создаётся при старте, каталог `data/` добавляется автоматически).
- При старте сервера вызывается `migrate()` из `drizzle-orm/libsql/migrator` к папке `server/drizzle/`.
- Схема таблиц и compile-time сверка с контрактом: `server/src/db/schema.ts` (`IsExact` для строки БД и `UserSchema`/`PostSchema`).

Скрипты Drizzle (из каталога `server/`):

```powershell
cd d:\projects\example_with_ddd_zod_strong_contract\server
npx drizzle-kit generate
npx drizzle-kit push
```

После изменения `schema.ts` сгенерируйте новую миграцию и обновите `drizzle/meta/_journal.json` при необходимости (или используйте `generate`, когда окружение `drizzle-kit` корректно подхватывает зависимости).

## DDD на сервере

Сервер устроен по слоям DDD с направлением зависимостей **только внутрь**:

- **Presentation** (`server/src/**/presentation/**`): HTTP-слой, контроллеры ts-rest (`@ts-rest/nest`)
- **Application** (`server/src/**/application/**`): use case-ы + порты репозиториев (`*RepositoryPort`)
- **Domain** (`server/src/**/domain/**`): сущности и value objects с инвариантами (без Nest/HTTP/Drizzle)
- **Infrastructure** (`server/src/**/infrastructure/**`): адаптеры портов (например, Drizzle-репозитории)

На примере доменов:

- **User**
  - Domain: `User`, `Email`, `UserId`
  - Application: `CreateUserUseCase`, `GetUserUseCase`, `ListUsersUseCase` + `UserRepositoryPort`
  - Infrastructure: `DrizzleUserRepository` (валидация строк через `UserSchema.safeParse`)
  - Presentation: `UserController` с `@ts-rest/nest`, `validateResponses: true`
- **Post**
  - Domain: `Post`, `PostId`
  - Application: `CreatePostUseCase`, `GetPostUseCase`, `ListPostsUseCase` + `PostRepositoryPort`
  - Infrastructure: `DrizzlePostRepository` (валидация строк через `PostSchema.safeParse`)
  - Presentation: `PostController` с `@ts-rest/nest`, `validateResponses: true`

## Клиент и контракт

- Импорт контракта: `import { apiContract, type UserDto, type PostDto } from '@repo/contract'`.
- Клиент инициализируется один раз в `client/src/api.ts`: `initClient(apiContract, { baseUrl })`.
- В **Vite** для бандла настроен алиас на исходники `contract/src` (см. `client/vite.config.ts`), чтобы не упираться в re-export CJS из `dist`.

## “Сильный контракт”: как он сшивает API, БД и клиента

### 1) Контракт → роутер

В `contract/` описывается ts-rest роутер и Zod-схемы:

- маршруты (`/users`, `/posts`)
- методы (`GET`, `POST`)
- входные данные (path params, body)
- возможные ответы (status codes + schema)

На сервере контроллеры используют **те же** определения:

- `@TsRestHandler(userContract.* | postContract.*)`
- `validateResponses: true` — сервер гарантирует, что отдаёт ровно то, что обещал контракт

### 2) Контракт ↔ БД (две гарантии)

В `server/src/db/schema.ts` есть две проверки:

- **compile-time**: форма строки таблицы (`UserRow`/`PostRow`) должна **в точности** совпадать с `z.infer<typeof UserSchema/PostSchema>` (`IsExact`)
- **runtime**: репозитории валидируют сырые строки из БД через `UserSchema.safeParse` / `PostSchema.safeParse`

Это делает рассинхронизацию “контракт ↔ таблица” практически невозможной: либо не соберётся, либо упадёт сразу и явно.

### 3) Контракт → клиент

Клиент получает:

- строго типизированные методы (`api.createUser`, `api.listPosts`, …)
- строго типизированные тела/параметры
- исчерпывающие статусы ответов (TypeScript заставляет обработать 200/400/404 и т.п.)

## Почему это удобно (практические плюсы)

- **Один источник истины**: схемы/типы/маршруты не дублируются между frontend/backend.
- **Изменения “сквозняком”**: меняете контракт — TypeScript подсвечивает все места на сервере/клиенте/БД, которые нужно обновить.
- **Меньше “плавающих” багов**: ошибки формата данных ловятся либо на этапе сборки, либо сразу при чтении из БД/отдаче ответа.
- **DDD не ломается**: домен и application не тянут HTTP/ORM, но на границе (presentation + repo) строго соблюдают контракт.

## Кратко

Один контракт описывает HTTP и формы `user`/`post`; сервер использует этот контракт в контроллерах и проверяет соответствие таблиц/строк; клиент получает те же типы и маршруты через `@ts-rest/core`.
