---
name: hands-off
description: handoff — create a state-transfer document so the next agent knows what happened and what to do next. Use for handoff, checkpoint, state transfer.
disable-model-invocation: true
---

# Handoff creator

Record the current session state in one document. The next agent reads it to continue the work.

## When to use

Use when the session pauses, rotates, or hands work to another agent.

## Contract

- Input: current session state, git status, the previous handoff.
- Output: `.docs/handoff/handoff-<area>-YYYY-MM-DD.md`.
- Template: `references/handoff-template.md`.
- Gate: the report names evidence, the commit sha, one next action, and any path left dirty. The human decides readiness.

## Process

1. Read `.docs/CURRENT_STATUS.md`, the newest `.docs/handoff/*.md`, and `references/handoff-template.md`. Done when the current next action is named.
2. Record the `HEAD` sha in the handoff frontmatter. Done when the sha line is present.
3. Fill the handoff from the template. Done when every section has content or `N/A`.
4. State one next action with a file or command reference. Done when the step names a path or command.
5. Update `.docs/CURRENT_STATUS.md` with a pointer to the handoff. Done when the pointer exists.
6. Run `node ~/.agents/skills/update-docs/scripts/docs-index.mjs --check`, then `--write` if it reports drift. Done when `--check` exits 0.
7. Commit the handoff, the session status, and the regenerated indexes. Done when `git status` shows none of those paths.
8. Report the handoff path, the commit sha, the next action, and any path left dirty. Done when the report names evidence, not a verdict.

## Rules

- Reference a file, commit, or command output for every claim.
- Preserve each decision and its rationale.
- Prefer primary evidence over this skill's memory when sources conflict.
- Commit only the paths this skill wrote. An explicit owner command widens the scope to `git add -A`.
- Keep the handoff short. Reference the source instead of copying it.
- Read only the canonical template at `references/handoff-template.md` in this skill folder.
