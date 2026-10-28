# {{PROJECT_NAME}}: Agent Entry Point

Project: [one-line project description].
Goal: [one-line goal].

## Start here

Every agent must read these files in order before working:

1. `.docs/CURRENT_STATUS.md`: current phase, active blockers, and next steps.
2. `.docs/PLAN.md`: feature priorities and next steps.
3. `AGENTS.md`: triage labels, domain docs, conventions.
4. `.docs/SPECS/README.md`: spec folder index and statuses.
5. `CONTEXT.md`: glossary of project terms.

## Critical rules

- **One feature = one session = one spec.** Do not mix unrelated changes.
- **Spec before code.** If no spec exists, drill first.
- **Do not break working code.** Risky changes go behind a flag.
- **Commit after each logical change.** Clear English messages: `<area>: <what changed> (<reason>)`.
- **Stage intentionally.** Before `git add -A`, run `git status` and review untracked files.
- **Never expose sensitive data** (passwords, tokens, cookies, IPs) in responses or committed files.

## Project conventions

- **Language:** English for all documents and code terms. Chat replies in Russian. Author quotes stay verbatim in `> «...»`.
- **Communication:** short and concrete. No generic theory.
- **OS:** Windows 10, Git Bash (default). PowerShell for Windows tasks.

## Key tools

| Tool | Purpose |
|---|---|
| `tools/` | *(add as needed)* |

## Related

- `AGENTS.md`: conventions.
- `.docs/agents/domain.md`: domain docs and workflow rules.
- `CONTEXT.md`: glossary.
- `.docs/violations/lint-rules.md`: compliance gate rules.
- `.docs/violations/audit-log.md`: compliance audit trail.
