# DDD Onboarding — справочник по репозиторию

Читать на этапах **Contracts**, **Backend**, **Frontend**. Правила слоёв: `.cursor/rules/contract-ddd-contract.mdc`, `server-ddd-contract.mdc`, `client-ddd-contract.mdc`.

## Пути артефактов

| Артефакт | Путь |
|----------|------|
| Domain doc | `docs/domain/<context-slug>/domain.md` |
| HTTP-контракт | `contract/src/<context-slug>.contract.ts` |
| Агрегация API | `contract/src/index.ts` → `apiContract` |
| Backend BC | `server/src/<context-slug>/` |
| Миграции | `server/drizzle/` + `server/src/db/schema.ts` |
| Клиент API | `client/src/api.ts` (`initClient(apiContract, ...)`) |
| UI | `client/src/` (компоненты под сценарии use case) |

`<context-slug>` — kebab-case или одно слово (`user`, `post`), как в существующих модулях.

## Эталон в скилле (приоритет)

**Read-only:** `.cursor/skills/ddd-onboarding/exampleDDDcontract/`

Минимальный BC `note` — contract → server (DDD) → client. Не редактировать при онбординге.

| Этап | Куда смотреть |
|------|----------------|
| Contracts | `exampleDDDcontract/contract/src/note.contract.ts` |
| Backend | `exampleDDDcontract/server/src/note/` |
| Frontend | `exampleDDDcontract/client/src/api.ts`, `NoteExample.tsx` |

## Эталон в живом репо (если ещё на месте)

`contract/src/post.contract.ts` и `user.contract.ts`:

- `*Schema` для сущностей и тел запросов
- `*ParamSchema` для path params
- `*ErrorSchema` или общий `ErrorSchema` для ошибок
- `export const <context>Contract = c.router({ ... })` с явными `responses` на каждый статус
- `export type *Dto = z.infer<typeof *Schema>`

Подключение: в `contract/src/index.ts` — spread в `apiContract` и re-export.

## Маппинг Use Case → контракт

Для каждой строки Use Cases в `domain.md`:

1. Один или несколько endpoint-ов в `<context>Contract`
2. Имена операций в camelCase, отражающие UC (`createPost`, не `save`)
3. Коды ответов из колонки Errors (400, 404, 409, …) со схемами

## Backend (после gate)

Структура bounded context (как `exampleDDDcontract/server/src/note/` или `server/src/post/`):

```
<context>/
  domain/entities/
  domain/value-objects/
  application/ports/
  application/use-cases/
  infrastructure/adapters/
  presentation/
  <context>.module.ts
```

- Presentation: ts-rest controller, только orchestration + map domain → DTO
- Application: use cases, порты `Symbol`
- Domain: без `@repo/contract`, NestJS, Drizzle
- Infrastructure: Drizzle adapter, Zod `safeParse` при чтении, маппинг DB errors

Регистрация модуля в `server/src/app.module.ts`.

## Frontend (после backend)

1. `client/src/api.ts` уже использует `apiContract` — новые endpoint-ы появляются после сборки контракта
2. UI вызывает `api.<context>.<operation>(...)`
3. Типы только из `@repo/contract`, без локальных дубликатов DTO

## Сборка после контракта

```powershell
npm run build:contract
```

Перед завершением backend/frontend: `npm run build` в корне при возможности.

## Вопросы Domain Discovery (чеклист)

**Контекст и цель**

- Какую бизнес-проблему решаем? Кто заказчик сценария?
- Что явно **вне** scope?

**Domain Discovery**

- Какие сущности и действия пользователь называет своими словами?
- Где граница с соседними системами/контекстами?

**Bounded Context**

- Одно имя контекста, одна ответственность
- Список интеграций (синхронные API, события)

**Ubiquitous Language**

- Термины без синонимов-суррогатов в коде (`UserService` ≠ термин домена)

**Aggregates**

- Корень, инварианты (локальные / через порты / глобальные-БД)
- Границы транзакций

**Use Cases**

- Актор, вход, выход, доменные ошибки
- Нет «голого CRUD» без акторов и правил

## Слабые места (после каждого этапа)

Кратко перечислить 1–3 риска: неоднозначные термины, пропущенные ошибки, дубли контекстов, глобальные инварианты без DB constraint.
