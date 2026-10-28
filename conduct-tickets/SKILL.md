---
name: conduct-tickets
description: Orchestrate parallel implementation of multiple target project tickets through waves of file-isolated coder agents. Use when the user wants to run several tickets at once, mentions multi-agent execution, parallel sessions, conductor-style ticket farming, or when the output of `split-to-tickets` is ready.
disable-model-invocation: true
---

# conduct-tickets

Orchestrate parallel implementation of multiple target project tickets.

## When to use

Run this when a ticket folder produced by `split-to-tickets` exists (`tickets.md`, `waves.md`, `session_*` folders) and the user wants several tickets implemented in parallel.

## What to do

1. **Read the plan** — `tickets.md`, `waves.md`, and each `session_*/sandbox.md`.
2. **Run one wave at a time.** For each session in the wave:
   - Read the ticket file and `sandbox.md`.
   - Spawn a coder subagent with the whitelist and blacklist from `sandbox.md`.
3. **Hold the merge gate** until every coder in the wave reports done.
4. **Verify the wave** with a verifier subagent:
   - `git diff --name-only` vs `sandbox.md` whitelist
   - `py_compile` on changed files
   - ticket-specific tests
   - hygiene scanners (`timing_hygiene_scanner.py`, `error_hygiene_scanner.py`, `print_hygiene_scanner.py`, `global_state_scanner.py`)
5. **Commit the wave** if verification passes. Then start the next wave.
6. **Stop and report** if verification fails. Do not proceed to the next wave.

## Rules

- A coder agent may only edit files in its whitelist.
- Two coder agents may not run in the same wave if their whitelists overlap.
- Never skip the merge gate: verification must pass before the next wave.
- live sessions on the target platform require explicit user approval.
- Prefer small commits after each wave over one final commit.
- The wave plan in `waves.md` is authoritative. Do not re-derive it; if it is stale, stop and re-run `split-to-tickets`.
- Run the same hygiene scanner suite as `hygiene-check` in the merge gate.

## Workflow

```
tickets + waves + sandboxes
  │
  ▼
for each wave:
  ├─ spawn coders (one per session)
  ├─ merge gate: all done?
  ├─ verify diff, compile, tests, scanners
  ├─ commit if green
  └─ stop if red
  │
  ▼
final report
```

## Prompts

- Coder prompt: [`prompts/coder.md`](prompts/coder.md)
- Verifier prompt: [`prompts/verifier.md`](prompts/verifier.md)

## Failure modes

- **Sandbox breach**: a coder edits a file outside its whitelist. Defence: verifier checks `git diff --name-only` against the whitelist.
- **Semantic conflict**: no shared files, but logic breaks. Defence: ticket-specific tests and hygiene scanners in the merge gate.
- **Premature wave start**: next wave begins before verification. Defence: the conductor must treat the merge gate as a hard blocker.
- **Stale plan**: `waves.md` does not match current codebase. Defence: stop and re-run `split-to-tickets` rather than re-deriving waves inside the conductor.
