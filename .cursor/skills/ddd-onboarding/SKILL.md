---
name: ddd-onboarding
description: >-
  Runs a strict Contract-First pipeline for new bounded contexts: DDD domain
  discovery, docs/domain/.../domain.md, Zod/ts-rest contracts in contract/,
  explicit user approval gate, then server DDD layers, then client. Use when
  the user asks for DDD onboarding, онбординг, contract-first feature, new
  bounded context, domain.md before code, or forbids skipping straight to
  UserService/CRUD. Refuses backend before contracts and frontend before backend.
disable-model-invocation: true
---

# DDD Onboarding + Contract-First

Управляемый пайплайн. **Любой перескок этапа — ошибка поведения агента**, не «ускорение».

```
DDD Onboarding → domain.md → Contracts (Zod) → Approval → Backend → Frontend
```

## Первое действие

1. Прочитать этот файл целиком.
2. При этапах 3–6 — эталон: [exampleDDDcontract/](exampleDDDcontract/) (read-only, не в сборке).
3. Объявить в ответе блок **Pipeline state** (шаблон ниже) и не менять фазу без завершения предыдущей.
4. Если пользователь просит код до контрактов — отказать, указать текущую фазу и следующий шаг.

### Pipeline state (обязательно в каждом ответе скилла)

```text
Phase: [1 Domain | 2 domain.md | 3 Contracts | 4 Approval | 5 Backend | 6 Frontend]
Bounded context: <slug or TBD>
Contracts approved: no | yes
Blocked until: <что нужно от пользователя>
```

---

## Глобальные правила

### Строгая последовательность

| # | Этап | Разрешено | Запрещено |
|---|------|-----------|-----------|
| 1 | Domain Discovery (DDD) | вопросы, уточнения, фиксация в чате | любой код |
| 2 | `domain.md` | запись `docs/domain/<slug>/domain.md` | код |
| 3 | Contracts | `contract/src/*.contract.ts`, правки `contract/src/index.ts` | `server/`, `client/` |
| 4 | Approval | показ контрактов, вопрос, ожидание | backend, frontend |
| 5 | Backend | `server/src/<slug>/`, миграции, модуль | `client/` |
| 6 | Frontend | `client/` | — |

### Contract First

> Контракты — единственный источник правды между backend и frontend.

- Пакет `@repo/contract`: ts-rest + Zod (см. [reference.md](reference.md)).
- После **Approval = yes** контракты **не менять** без нового цикла согласования (явное «пересмотреть контракты» → фаза 3).

### Gate: явное подтверждение

После этапа 3 задать дословно по смыслу:

**«Подтверждаете ли контракты? Можно ответить: да / подтверждаю / ок.»**

- ✅ `да`, `подтверждаю`, `ок` (регистр не важен) → `Contracts approved: yes`, фаза 5
- ❌ иное или правки → фаза 3, правка контрактов, снова gate
- Не интерпретировать молчание или «давай дальше» как подтверждение, если контракты не обсуждались

### Запрет преждевременной генерации

- DDD → **никакого кода**
- Contracts → **никакого** backend/frontend
- Backend → **никакого** frontend
- Не начинать с `UserService`, «просто CRUD», Nest module без домена
- Не изменять и не удалять `exampleDDDcontract/` (эталон скилла)
- По умолчанию **не затирать** существующие `user` / `post` в корне монорепо — онбординг **аддитивный** (новый `<slug>`)

### Противоречия

При расхождении терминов, дублировании контекстов, CRUD без акторов — **остановиться**, задать уточняющие вопросы, обновить `domain.md` до согласованности.

### После каждого этапа

Кратко: **1–3 слабых места** и **опциональные улучшения** (без расширения scope).

---

## Этап 1 — DDD Onboarding

Пройти подэтапы **по порядку**; не объединять в один вопрос всё сразу, если данных мало.

1. **Контекст и цель** — проблема, успех, out of scope
2. **Domain Discovery** — сущности, действия, события языка пользователя
3. **Bounded Context** — имя `<slug>`, граница, интеграции
4. **Ubiquitous Language** — таблица терминов (term / definition / not)
5. **Aggregates** — корни, инварианты (локальные / внешние / глобальные)
6. **Use Cases** — актор, вход, выход, ошибки (без анонимного CRUD)

Использовать чеклист в [reference.md](reference.md). Зафиксировать `<slug>`.

**Выход этапа:** достаточно материала для `domain.md`; фаза 2.

---

## Этап 2 — `domain.md`

Создать или обновить:

`docs/domain/<slug>/domain.md`

Структура — из [domain-template.md](domain-template.md) (разделы: Vision, Actors, Bounded Contexts, Ubiquitous Language, Aggregates, Use Cases, Events).

Показать пользователю путь и краткое содержание. Спросить, есть ли правки к домену **до** контрактов.

**Выход:** согласованный `domain.md` (или явное «домен ок»); фаза 3.

---

## Этап 3 — Контракты (Zod + ts-rest)

На основе **только** `domain.md`:

1. `contract/src/<slug>.contract.ts` — схемы, router, типы `z.infer`
2. Подключить в `contract/src/index.ts` (`apiContract`, exports)
3. Каждый use case → endpoint(ы); все статусы из домена — со схемами ошибок
4. `npm run build:contract` — исправить ошибки сборки

Именование и форма — как в [exampleDDDcontract/contract/src/note.contract.ts](exampleDDDcontract/contract/src/note.contract.ts); в живом репо также `contract/src/post.contract.ts`.

**Выход:** собранный контракт; фаза 4. **Не трогать `server/` и `client/`.**

---

## Этап 4 — Подтверждение

1. Показать сводку: файлы, список endpoint-ов, основные схемы
2. Задать gate-вопрос (см. выше)
3. **Остановиться** — не писать backend

```
если не подтверждено → этап 3
если подтверждено     → этап 5
```

---

## Этап 5 — Backend

Только при `Contracts approved: yes`.

1. Прочитать `.cursor/rules/server-ddd-contract.mdc`
2. Создать `server/src/<slug>/` по слоям (см. [reference.md](reference.md))
3. Presentation строго по `@repo/contract`; domain **без** импорта контракта
4. Infrastructure: Drizzle, Zod на чтении, маппинг ошибок БД
5. Миграции + `schema.ts`, регистрация в `app.module.ts`
6. Тесты на критичные инварианты, где уместно

Контракты не менять; backend подстраивается под них.

**Выход:** рабочий API по контракту; фаза 6.

---

## Этап 6 — Frontend

Только после завершения backend.

1. Прочитать `.cursor/rules/client-ddd-contract.mdc`
2. `client/src/api.ts` — уже на `apiContract`; при необходимости только конфиг baseUrl
3. UI через `api.<operation>`, типы из `@repo/contract`
4. Без дублирования DTO в `client/`

---

## Антипаттерны (жёстко)

- Начинать с кода
- CRUD без домена и акторов
- Игнорировать bounded context
- Смешивать слои (логика в контроллере/репозитории)
- Менять контракты после approval без нового gate
- Frontend до backend
- Имена вроде `MegaFinalUserServiceV2` вместо языка домена

---

## Критерий успеха

1. Пройден DDD-онбординг  
2. Есть `docs/domain/<slug>/domain.md`  
3. Есть контракты в `contract/`  
4. Пользователь явно подтвердил  
5. Backend соответствует контрактам  
6. Frontend использует те же контракты  

---

## Эталон кода (зафиксирован в скилле)

Папка [exampleDDDcontract/](exampleDDDcontract/) — минимальный BC `note`:

| Слой | Файл |
|------|------|
| Contract | `contract/src/note.contract.ts`, `index.ts` |
| Domain | `server/src/note/domain/` |
| Application | `server/src/note/application/` |
| Infrastructure | `server/src/note/infrastructure/adapters/` |
| Presentation | `server/src/note/presentation/note.controller.ts` |
| Client | `client/src/api.ts`, `NoteExample.tsx` |

Читать **до** правок в корневых `contract/`, `server/`, `client/`. Если локальные `user`/`post` удалены — эталон остаётся здесь.

## Связанные скиллы

- Карта модуля после backend: `.cursor/skills/domain-drawio-map/SKILL.md`

## Дополнительно

- Детали путей и чеклисты: [reference.md](reference.md)
- Шаблон домена: [domain-template.md](domain-template.md)
- Полный монорепо: https://github.com/danilger/example_with_ddd_zod_strong_contract
