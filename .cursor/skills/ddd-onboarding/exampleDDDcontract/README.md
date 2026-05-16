# exampleDDDcontract — эталон (read-only)

Минимальный срез **Contract First + DDD** для скилла `ddd-onboarding`.  
**Не** подключается к `npm run build`; **не** изменять при онбординге новых контекстов.

Вымышленный bounded context **`note`**: один aggregate, два use case (`create`, `get`).

## Дерево

```
exampleDDDcontract/
  contract/src/          → ts-rest + Zod (источник правды)
  server/src/note/       → domain → application → infrastructure → presentation
  client/src/            → initClient + UI через api
```

## Порядок чтения

1. `contract/src/note.contract.ts`
2. `server/src/note/domain/` → `application/` → `infrastructure/` → `presentation/`
3. `client/src/api.ts` → `NoteExample.tsx`

## Полный репозиторий

Живые `user` / `post` в корне монорепо или снимок на GitHub:  
https://github.com/danilger/example_with_ddd_zod_strong_contract
