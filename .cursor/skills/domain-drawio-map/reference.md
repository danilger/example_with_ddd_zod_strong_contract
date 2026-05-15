# Reference and portable example

## Bundled diagram (copy with the skill)

**`example.domain-map.dio`** in this folder is a frozen copy of the canonical layout: swimlane nesting, styles, `UserObject` + `cursor://file/...` pattern, and import edges (no `*.module.ts`).

When moving the skill to another repo, copy the whole directory:

`.cursor/skills/domain-drawio-map/`  
(including `SKILL.md`, `reference.md`, and **`example.domain-map.dio`**).

In the new project, open `example.domain-map.dio` in draw.io (or Cursor) and replace `cursor://file/...` targets with that workspace’s absolute paths, or regenerate `server/src/<context>/docs/.dio` using `SKILL.md`.

## Optional live mirror (this repo only)

In **tutor**, the same diagram may also live at `server/src/post/docs/.dio`. If both exist and diverge, treat **`example.domain-map.dio` here as the skill’s contract** and refresh it when you intentionally change the reference style.

## What to diff when generating

- Parent chain and fixed ids (`18`, `11`, `9`, `32`, `34`, `22`, `23`, `20`, `21`).
- Swimlane `style` strings (copy verbatim from `example.domain-map.dio`).
- Edge style: `strokeColor=#4D4D4D`, `orthogonalEdgeStyle`, `curved=1`, `endArrow=classic`.
