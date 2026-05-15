---
name: domain-drawio-map
description: >-
  Builds a draw.io XML map (.dio) for a bounded context: same swimlane nesting,
  green DDD styling, Cursor file links, and import arrows as in
  .cursor/skills/domain-drawio-map/example.domain-map.dio. Use when the user asks to build a domain map,
  «построить карту домена», «карта домена», a DDD draw.io diagram for a module
  under server/src, or to refresh .dio docs from imports.
disable-model-invocation: false
---

# Domain draw.io map (bounded context)

## Goal

Produce **one** draw.io-compatible XML file (`.dio` or `.drawio`) that mirrors **structure, nesting, and styles** of the bundled reference:

`.cursor/skills/domain-drawio-map/example.domain-map.dio` (same folder as this skill; safe to copy into other projects).

Do **not** invent a different layout (no alternate grouping, no extra top-level lanes unless the user explicitly asks).

## When to run

Apply this skill when the user (Russian or English) asks to **build / update a domain map** for a server module, e.g.:

- «построить карту домена»
- «карта домена»
- «схема bounded context / модуля»
- «обнови .dio по импортам»

Default target: bounded context root folder, e.g. `server/src/<context>/` (confirm `<context>` from the message or open files).

## Exclusions

- **Do not** add NestJS `*.module.ts` nodes or edges (composition root stays off this diagram), unless the user explicitly requests it.

## Container hierarchy (must match reference)

All inner swimlanes are **children of the same ids and parents** as in `example.domain-map.dio`:

1. **Root** `mxCell id="18"` — outer swimlane, **empty** `value`, `parent="1"`.
2. **Application** `id="11"` — `parent="18"`.
3. Under **Application** (`parent="11"`):
   - **Ports** `id="22"`
   - **Use cases** `id="23"`
   - **Domain** `id="9"`
4. Under **Domain** (`parent="9"`):
   - **Entities** `id="32"`
   - **Value objects** `id="34"`
5. Under **root** `parent="18"` (siblings of Application, **not** inside Application):
   - **Presentation** `id="20"`
   - **Infrastructure** `id="21"`

Populate file nodes only from existing paths:

| Swimlane   | Scan folder |
|-----------|-------------|
| Entities  | `domain/entities/**/*.ts` |
| Value objects | `domain/value-objects/**/*.ts` |
| Ports     | `application/ports/**/*.ts` |
| Use cases | `application/use-cases/**/*.ts` |
| Presentation | `presentation/**/*.ts` |
| Infrastructure | `infrastructure/adapters/**/*.ts` |

Sort files alphabetically within each swimlane for stable diffs.

## Styling (copy verbatim from reference)

Open **`example.domain-map.dio`** next to this skill and copy **`style` attributes per swimlane role** (do not invent new colors or flags). At minimum, align with that file for:

- **Root 18** — empty title, `gradientColor=none`, rounded outer swimlane.
- **Application 11** — gray gradient, no `flipH`.
- **Domain 9, Entities 32, Value objects 34, Ports 22, Use cases 23** — same green header + `rounded=1;flipH=1;flipV=0` as in the file.
- **Presentation 20, Infrastructure 21** — rounded, **no** `flipH`.
- **File nodes** (`UserObject` → child `mxCell`): `text;whiteSpace=wrap;html=1;fontSize=25;fontColor=#4D9900;`

**Geometry**: start from the reference file’s positions/sizes; adjust **only** what is needed so swimlanes fit all files (e.g. grow **Use cases** height by ~52px per extra row). Keep sibling positions consistent (Application right block, Presentation left, Infrastructure right).

## File nodes and Cursor links

For each TypeScript file in the table above:

```xml
<UserObject label="<filename>.ts" link="cursor://file/<ABSOLUTE_PATH_TO_FILE>" id="<uniqueId>">
  <mxCell style="text;whiteSpace=wrap;html=1;fontSize=25;fontColor=#4D9900;" parent="<swimlaneId>" vertex="1">
    <mxGeometry .../>
  </mxCell>
</UserObject>
```

- `label` = basename only (e.g. `create-post.use-case.ts`).
- `link` = `cursor://file/` + **absolute** path to the file in the user’s workspace (derive from the opened project root; on Windows keep `D:\...` style as in the reference).

Assign **unique** numeric string ids to every `UserObject` / edge. Reuse fixed structural ids (`0,1,9,11,18,20,21,22,23,32,34`) exactly; assign new ids for file nodes and edges that do not collide (continue from the next free integer in the file you write).

## Edges (imports)

- For each pair of diagrammed files **A → B** such that **A** imports **B** via a relative path resolvable inside the bounded context root, add an `mxCell` edge with `edge="1"`, `parent="1"`, `source="<idA>"`, `target="<idB>"`.
- **Direction**: from the file that **contains** the import **to** the **imported** file.
- Ignore imports to packages outside the context (`@nestjs/*`, `@repo/*`, `drizzle-orm`, `../..` leaving the module, etc.) unless the user asks to include them.

**Edge style** (match current reference):

`edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#4D4D4D;endArrow=classic;endFill=1;curved=1;`

Each edge:

```xml
<mxCell id="..." style="..." edge="1" parent="1" source="..." target="...">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## Output

- Write or overwrite: `server/src/<context>/docs/.dio` (create `docs` if missing), unless the user specifies another path.
- Preserve `mxfile` / `mxGraphModel` wrapper and `root` with `mxCell id="0"` and `id="1"` like the reference.

## Quality check

Before finishing:

- [ ] Same swimlane **titles** and **parent chain** as reference (`Application` contains Domain + Ports + Use cases; Presentation/Infrastructure are only under root).
- [ ] No `*.module.ts` on the canvas.
- [ ] Every shown `.ts` has a working-looking `cursor://file/...` absolute path.
- [ ] Edges only for intra-context relative imports; direction importer → imported.

For edge cases (no `presentation` folder, empty `entities`), still emit the swimlanes with the same labels and ids; leave them visually minimal (small height) rather than deleting layers.

## Additional resources

- [reference.md](reference.md) — bundled `example.domain-map.dio`, how to copy the skill, optional mirror in `server/src/post/docs/.dio`.
