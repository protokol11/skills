# Reference — upgrade-repo

`upgrade-repo` upgrades an existing project to match the `setup-repo` agentic scaffold and compliance package.

It is a companion skill to `setup-repo`. It lives in `~/.agents/skills/upgrade-repo/` and reuses templates from `~/.agents/skills/setup-repo/templates/`.

## Workflow

1. **Explore+audit** — read existing project files and produce `AUDIT.md`.
2. **Drill** — ask the user about project purpose, stack, and existing file meanings.
3. **Render** — call `principles-render` for the compliance package.
4. **Plan** — write `upgrade-plan.md` with a merge strategy and risk classes.
5. **Apply** — only after explicit user confirmation (GO).
6. **Verify** — check against setup-repo acceptance criteria and spec verification commands.
7. **Update status** — refresh `.docs/CURRENT_STATUS.md`.

## Key conventions

- **Dry-run by default.** Do not modify files until the user confirms.
- **Merge existing files.** Preserve content from `PROJECT.md`, `AGENTS.md`, etc.
- **Backup before apply.** Git commit `chore: pre-upgrade snapshot` or `.archive/upgrade-<timestamp>/` fallback.
- **No code refactoring.** This skill is for agentic setup only.
- **Risk gating.**
  - Low: create missing file, add generated content to an empty placeholder.
  - Medium: merge content into an existing file.
  - High: move or delete an existing folder, overwrite a hand-written file, change git history.
  - Stop on high-risk changes and ask.
  - Irreversible changes need a design-first ADR.

## Shared templates

Call `setup-repo/scripts/scaffold.ps1` with `-OnlyMissing -SkipGit` to create missing files without overwriting existing ones. Then merge existing files manually.

For full file explanations, see `~/.agents/skills/setup-repo/REFERENCE.md`.

## Compliance package

The renderer produces:

- `must-card.md` — retired. The catalog is the source; do not stamp it into `AGENTS.md`.
- `role-prompts/*.md` — inject into `.pi/agents/*.md`.
- `lint-rules.md` — copy to `.docs/violations/lint-rules.md`.
- `spec-template.md` — merge into `.docs/SPECS/README.md`.

Audit the project against these outputs and record the result in `.docs/violations/audit-log.md`.
