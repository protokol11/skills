---
name: principles-render
description: Render compliance artifacts from the principle catalog.
disable-model-invocation: true
---

# principles-render

Render compliance artifacts from `~/.agents/skills/to-violations/PRINCIPLES.md`.

## When to use

Use when:
- `upgrade-repo` or `setup-repo` stamps a project.
- You re-stamp after a catalog version bump.
- A new role prompt or must-card needs regeneration.

## Steps

1. Read the catalog at `~/.agents/skills/to-violations/PRINCIPLES.md`.
2. Parse the YAML structure. Expect 100 principles.
3. Generate four artifacts into the output directory.
4. Verify the count and idempotency.

## Outputs

The renderer writes these files into `--out <dir>` (default: `./rendered`):

1. `must-card.md`: principles whose `artifacts` include `agent-instruction`.
2. `role-prompts/*.md`: coder, tester, fixer, explore, plan prompts.
3. `lint-rules.md`: mechanical checks for lintable must principles.
4. `spec-template.md`: spec skeleton with mandatory verification commands.

## Role grouping

- `PS-CODER-*` → `coder.md`.
- `PS-TESTER-*` → `tester.md`.
- `PS-FIXER-*` → `fixer.md`.
- Shared must principles with `code` artifact → `coder.md`, `tester.md`, `fixer.md`.
- General principles with `spec`, `PRD`, `handoff`, `skill`, or `diagnose` artifacts → `explore.md`, `plan.md`.
- Must-card principles are not duplicated in role prompts (DRY).

## Verification

- The renderer extracts exactly 100 principles.
- Two consecutive runs produce an empty diff.
- Generated `.md` files pass `ste-lint.py`.

## Command

```bash
node render.mjs --out ./rendered
```

## Reference

- Catalog: `~/.agents/skills/to-violations/PRINCIPLES.md`
- Spec: `$USER_HOME/Agentic-Engineering/.docs/SPECS/principles-compliance-system/README.md` (an example local checkout)
- Lint tool: `$USER_HOME/pi-orchestrator/tools/ste-lint.py` (bundled copy lives in this skill at `scripts/ste-lint.py`)
