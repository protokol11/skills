# Domain Docs

This project uses a single-context layout:

- `CONTEXT.md` at repo root — glossary of project terms.
- `.docs/adr/` — Architecture Decision Records.

## Spec / ADR workflow

1. Every feature starts as a spec in `.docs/SPECS/<area>/`.
2. Hard-to-reverse decisions become ADRs in `.docs/adr/`.
3. Every agent reads `CONTEXT.md` and relevant ADRs before modifying related code.

## Document ownership

| File | Purpose | Update frequency |
|---|---|---|
| `.docs/PLAN.md` | Priorities and next steps | After every session |
| `.docs/SPECS/README.md` | Spec index | After adding or changing spec status |
| `.docs/CURRENT_STATUS.md` | Snapshot of current phase | After every session |
| `.docs/sessions/*.md` | Session-level decisions | After every session |
| `.docs/adr/*.md` | Architecture decisions | When a decision crystallizes |

## No-duplicate rule

- If a task is in `.docs/PLAN.md`, it must not be duplicated in `CURRENT_STATUS.md` except as a reference.
- If a session report exists in `.docs/sessions/`, `CURRENT_STATUS.md` only summarizes it.
