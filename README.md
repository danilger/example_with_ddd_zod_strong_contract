# Пример NestJS + React: DDD + сильный контракт (ts-rest + Zod)

Монорепозиторий в духе [zod-nest](https://github.com/danilger/zod-nest): **один “сильный” контракт** (ts-rest + Zod) в пакете `contract`, общий для **сервера (NestJS)** и **клиента (Vite + React)**.

Ключевая идея: контракт — это **единый источник истины** для:

- **HTTP API** (маршруты, методы, параметры, тела, коды ответов)
- **типов DTO** (на клиенте и сервере)
- **валидации** (Zod на границах и при чтении из БД)
- **согласованности БД** (compile-time соответствие формы строки таблицы и схемы контракта)

Персистенция — **SQLite** через **Drizzle** и драйвер **libSQL** (`@libsql/client`, локальный файл `file:...`), чтобы на Windows не собирать нативный `better-sqlite3`.

## С чего начинать в Cursor

Новый bounded context или расширение проекта удобно вести **не сразу в коде**, а через skills в `.cursor/skills/`.

### DDD-онбординг (обязательная отправная точка)

Скилл [`.cursor/skills/ddd-onboarding`](.cursor/skills/ddd-onboarding) задаёт **последовательный пайплайн** к целевой DDD-архитектуре и сильному контракту:

1. Domain Discovery (вопросы, без кода)
2. `docs/domain/<slug>/domain.md`
3. Контракты в `contract/` (ts-rest + Zod)
4. Явное подтверждение контрактов
5. Backend (`server/`, слои DDD)
6. Frontend (`client/`)

Перескакивать этапы нельзя: сначала домен и контракт, затем сервер, затем клиент. В Cursor вызовите скилл при запросе вроде «онбординг», «новый bounded context», «contract-first фича» — агент будет держаться этой цепочки.

### Карта домена (для чтения и навигации)

Скилл [`.cursor/skills/domain-drawio-map`](.cursor/skills/domain-drawio-map) строит **draw.io-диаграмму** (`.dio`) по структуре модуля в `server/src/<context>/`: слои Application (ports, commands/queries, event handlers), Domain (entities, value objects, events), Presentation, Infrastructure, со ссылками на файлы. Готовые карты: `server/src/user/docs/.dio`, `server/src/post/docs/.dio`.

**После создания карты в первую очередь проверьте направления зависимостей** по стрелкам импортов: они должны идти **только внутрь** (`presentation → application → domain`; infrastructure реализует порты application). На карте **не должно быть** обратных связей — например, стрелки от **сущности или value object** к **infrastructure**, от **domain** к **presentation**, от **application** к **infrastructure** (кроме зависимости handler от порта). Пунктир к `@repo/contract` — только с presentation/infrastructure. Такие стрелки — сигнал нарушения DDD и повод исправить код, а не «норма» диаграммы.

Запросы: «построить карту домена», «карта домена», «обнови .dio по импортам».

## Структура

| Пакет | Назначение |
|--------|------------|
| `contract/` | `@repo/contract` — Zod-схемы и роутеры ts-rest (`userContract`, `postContract`), агрегирующий `apiContract`, типы DTO |
| `server/` | NestJS, DDD-слои, Drizzle + миграции в `server/drizzle/` |
| `client/` | React UI, `initClient` из `@ts-rest/core`, dev-прокси `/users` и `/posts` → backend |

## Что реализовано

- Домен **`user`**: `createUser`, `getUser`, `listUsers`, `updateUser`, `deleteUser`
- Домен **`post`**: `createPost`, `getPost`, `listPosts`
- На сервере оба контекста: **DDD-слои**, **CQRS** (`@nestjs/cqrs`), **AggregateRoot + domain events**, раздельные **write/read** порты репозиториев
- Контракт `@repo/contract` на границе: presentation-адаптеры (command/dto) и валидация строк БД в infrastructure

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

## DDD и CQRS на сервере

Сервер устроен по слоям DDD с направлением зависимостей **только внутрь**. Оба bounded context (`user`, `post`) используют одинаковый каркас.

### Слои

| Слой | Путь | Ответственность |
|------|------|-----------------|
| **Presentation** | `server/src/<context>/presentation/` | ts-rest контроллеры, `CommandBus` / `QueryBus`, адаптеры DTO ↔ command/query |
| **Application** | `server/src/<context>/application/` | commands, queries, handlers, event-handlers, порты write/read |
| **Domain** | `server/src/<context>/domain/` | `AggregateRoot`, value objects, domain events, инварианты |
| **Infrastructure** | `server/src/<context>/infrastructure/` | Drizzle-адаптеры портов (`*repository.adapter.ts`) |

Пакет `@repo/contract` **не импортируется** в application/domain — только в presentation (HTTP) и infrastructure (сверка строк БД с `UserSchema` / `PostSchema`).

### Паттерны

- **CQRS**: команды меняют состояние через write-порт и агрегат; запросы читают `*ReadModel` через read-порт
- **Domain events**: `apply()` в агрегате, `commit()` после save; подписчики `@EventsHandler` в application
- **Repository + Adapter**: порты в application, реализация в infrastructure (GoF Adapter в именах файлов)
- **Персистенция**: state-based (SQLite), не Event Sourcing

### User (`server/src/user/`)

- **Domain**: `User` (`AggregateRoot`), `Email`, `UserId`; события `UserCreated`, `UserNameUpdated`, `UserDeleted`
- **Application**: `CreateUserCommandHandler`, `UpdateUserCommandHandler`, `DeleteUserCommandHandler`, `GetUserQueryHandler`, `ListUsersQueryHandler`; порты `UserWriteRepositoryPort`, `UserReadRepositoryPort`
- **Infrastructure**: `DrizzleUserRepositoryAdapter` (также `InMemoryUserRepositoryAdapter` для тестов/заготовки)
- **Presentation**: `UserController`, `CreateUserCommandAdapter`, `UpdateUserCommandAdapter`, `UserDtoAdapter`
- **Карта**: `server/src/user/docs/.dio`

### Post (`server/src/post/`)

- **Domain**: `Post` (`AggregateRoot`), `PostId`; событие `PostCreated`
- **Application**: `CreatePostCommandHandler`, `GetPostQueryHandler`, `ListPostsQueryHandler`; порты `PostWriteRepositoryPort`, `PostReadRepositoryPort`
- **Infrastructure**: `DrizzlePostRepositoryAdapter`
- **Presentation**: `PostController`, `CreatePostCommandAdapter`, `PostDtoAdapter`
- **Карта**: `server/src/post/docs/.dio`

### Write-поток (пример)

```text
Controller → *CommandAdapter → CommandBus → CommandHandler
  → AggregateRoot (apply domain event) → WriteRepository.save
  → aggregate.commit() → EventBus → @EventsHandler
```

### Query-поток

```text
Controller → QueryBus → QueryHandler → ReadRepository → *ReadModel → *DtoAdapter → HTTP
```

## Клиент и контракт

- Импорт контракта: `import { apiContract, type UserDto, type PostDto } from '@repo/contract'`.
- Клиент инициализируется один раз в `client/src/api.ts`: `initClient(apiContract, { baseUrl })`.
- В **Vite** для бандла настроен алиас на исходники `contract/src` (см. `client/vite.config.ts`), чтобы не упираться в re-export CJS из `dist`.

## “Сильный контракт”: как он сшивает API, БД и клиента

### 1) Контракт → роутер

В `contract/` описывается ts-rest роутер и Zod-схемы:

- маршруты (`/users`, `/posts`)
- методы (`GET`, `POST`, `PATCH`, `DELETE` для `user`)
- входные данные (path params, body)
- возможные ответы (status codes + schema; `strictStatusCodes: true` в роутерах)

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
- **DDD не ломается**: домен и application не тянут HTTP/ORM; контракт — на границе presentation и infrastructure.

## Что пока не в scope

- **Event Sourcing** (event store, replay, проекции из потока событий)
- Физически отдельные таблицы read-моделей (CQRS пока логический, одна БД)
- Domain services, specifications, доменные исключения как отдельные типы
- Межконтекстная интеграция через события (`UserCreated` → реакция в `post`)

## Кратко

Один контракт описывает HTTP и формы `user`/`post`; сервер использует CQRS + агрегаты с domain events, контракт на границе API и БД; клиент получает те же типы и маршруты через `@ts-rest/core`.
