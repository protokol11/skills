# Reference — setup-repo

File-by-file explanation of the scaffold and how to customize it.

## Root documents

### `CLAUDE.md`

Project memory and agent entry point. Keep it short (< 150 lines). It tells the agent:

- what the project is,
- what to read first,
- critical rules,
- conventions,
- key tools.

Update it when project purpose or stack changes. Push detailed procedures to `AGENTS.md`.

### `AGENTS.md`

Agent procedures and session rules. Contains:

- session mode triggers (implementation vs discussion),
- mandatory scope lock,
- conflict resolution,
- agent skills list,
- triage labels,
- domain docs layout,
- language and code comment rules.

It resolves conflicts with generic runtime reminders. Keep it lean.

### `CONTEXT.md`

Controlled vocabulary and deep anchors. Contains:

- project-specific terms table,
- deep anchors (`red-green-refactor`, `tracer bullets`, `fog of war`, `scope lock`, `grill`, `handoff`, `skill map`, `dreyfus`, `autonomy level`, `token roi`).

Update it when a term stabilizes or a new deep anchor is adopted.

### `README.md`

Human-readable project summary. Purpose, quick start, structure, status link.

## `.pi/`

### `.pi/settings.json`

Pi configuration:

- `skills` paths,
- `defaultThinkingLevel`,
- `compaction`,
- `conductor` roles and chains,
- `permissionGate`.

Customize per project: add telegram, session navigator, or project-specific skills paths.

### `.pi/agents/`

Subagent manifests. `explore`, `plan`, `coder`, `fixer` are lean; `tester` is full because it owns the `report.json` schema.

Edit these manifests when the project needs specialized tools or workflows.

### `.pi/agents/VOICE.md`

Mechanical writing rules. Reduces slop in prose artifacts. Keep lean; expand only if the project has many contributors.

## `.docs/`

### `.docs/CURRENT_STATUS.md`

Snapshot of current phase, blockers, completed work, and next actions. Updated after every session.

### `.docs/PLAN.md`

Living priority list: Now / Next / Backlog / Done.

### `.docs/SPECS/README.md`

Index of specifications. Active / Done / Backlog. Includes the renderer's spec template so every new spec carries a verification command on each acceptance criterion.

### `.docs/agents/domain.md`

Rules for domain docs, spec/ADR workflow, document ownership, no-duplicate rule.

### `.docs/agents/issue-tracker.md`

Local markdown issue tracker layout and workflow.

### `.docs/agents/triage-labels.md`

Canonical label vocabulary.

## `.scratch/`

Local markdown issue tracker. One folder per feature.

## `.docs/sessions/`

Session status reports. Nested by date: `.docs/sessions/<YYYY-MM-DD>/statuses/<summary>.md`.

## `.docs/violations/`

Compliance artifacts.

### `.docs/violations/audit-log.md`

Append-only log of compliance events and decisions.

### `.docs/violations/lint-rules.md`

Mechanical checks for the compliance gate. Generated from the principle catalog.

## `scripts/scaffold.ps1`

Deterministic scaffold script. Copies templates, calls the renderer, injects role prompts and the spec template, stamps lint rules, replaces placeholders, and initializes git. Run it before the agent drill.

### Simple placeholders

- `{{PROJECT_NAME}}`
- `{{PROJECT_PATH}}`
- `{{DATE}}`
- `{{LANGUAGE}}`
- `{{PLATFORM}}`

### Rendered placeholders

- `{{ROLE_PROMPT}}` — injected into `.pi/agents/coder.md`, `tester.md`, `fixer.md`, `explore.md`, `plan.md`.
- `{{SPEC_TEMPLATE}}` — injected into `.docs/SPECS/README.md`.

## Customization guide

1. Edit templates in this skill folder if you want the change for all future projects.
2. Edit generated files in the target project if the change is project-specific.
3. Keep `CLAUDE.md` small. Push details down the ladder.
4. Add project-specific tools and seams to `CLAUDE.md` and `CONTEXT.md`.
