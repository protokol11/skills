---
name: setup-repo
description: Bootstrap a new project folder with a Pi-ready agentic scaffold plus a compliance package. Stamps CLAUDE.md, AGENTS.md, .pi/agents/*.md, .docs/violations/, and .docs/sessions/ from the universal principle catalog.
disable-model-invocation: true
---

# setup-repo

Bootstrap a new project with the Pi agentic scaffold and the compliance package.

## When to use

- New project folder.
- New directory that will use Pi orchestration (explore/plan/coder/tester/fixer).
- Before starting a feature when no agentic scaffold exists.

## Steps

1. **Render** — call the renderer before scaffolding.
   - Command: `node ~/.agents/skills/principles-render/render.mjs --out <tmp-render-dir>`.
   - Completion: temp directory contains `role-prompts/*.md`, `lint-rules.md`, `spec-template.md`.

2. **Scaffold** — run `scripts/scaffold.ps1 -ProjectPath <path>`.
   - Copies templates (incl. `.docs/PLAN.md` in canonical planmd format — Now/Next/Backlog/Done, `1. [ ]`, optional `[P0]`).
   - Replaces project placeholders.
   - Injects role prompts into `.pi/agents/*.md`.
   - Replaces `.docs/SPECS/README.md` spec template section with the renderer's template.
   - Writes `.docs/violations/lint-rules.md` and `.docs/violations/audit-log.md`.
   - Creates `.docs/sessions/STATUS_TEMPLATE.md`.
   - Initializes git unless `-SkipGit`.

3. **Drill** — ask the user one question at a time to fill project-specific content.
   - Questions: project purpose, stack, main entry point, sensitive data exclusions, special workflow rules.
   - Completion: `CLAUDE.md`, `CONTEXT.md`, `README.md`, and `AGENTS.md` contain project-specific content.

4. **Verify** — check the scaffold against the acceptance criteria in `REFERENCE.md`.
   - Required files exist and have non-placeholder content.
   - `.docs/PLAN.md` follows the canonical planmd format (Now/Next/Backlog/Done).
   - `.pi/agents/*.md` contain role-specific principles.
   - `.docs/violations/` exists with `audit-log.md` and `lint-rules.md`.
   - `.docs/sessions/` exists instead of `sessions/` in the repo root.

5. **Archive spec** — move `SPEC.md` to `.archive/` when the user confirms.
   - Completion: `SPEC.md` is moved to `.archive/SPEC-<date>.md` or deleted.

## Conventions

- Language: all documents and code terms are English. Chat replies are Russian. Author quotes stay verbatim in `> «...»`.
- Keep `CLAUDE.md` < 150 lines; push details to `AGENTS.md` and `REFERENCE.md`.
- Use the deep anchors in `CONTEXT.md`.
- Do not commit sensitive data.
- The compliance package (`lint-rules.md`, `audit-log.md`) is generated from the catalog and cannot drift from it.

## Output

A bootstrapped project ready for the `explore` → `plan` → `coder` → `tester` workflow, with compliance artifacts stamped.

## Reference

See [REFERENCE.md](REFERENCE.md) for file-by-file explanations and [templates/](templates/) for the scaffold.
