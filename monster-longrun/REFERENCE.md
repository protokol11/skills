# Reference

Formats, spec contract, and templates for the monster-longrun pipeline.

## Spec contract (10 sections)

Every spec must carry these sections. `Observability reference`, `Resource ownership`, `Prior-art citation`, and `Deviations` are NEW and load-bearing — they close the P0/P1/P2 failures of the first run.

```
# Spec: <slug>
Status: <draft | ready>
Area: <area>

## Goal
<one to two lines>

## Decisions
<what is already decided>

## Observability reference
<concrete expected signal, not an abstraction>
- Signal: "9 chunks visible", "fps > 30", "frame not black"
- Written BEFORE dispatch. No reference available -> mark `unverifiable -> needs a human sample`.

## Resource ownership
<one vs per-X model for stateful specs: buffers, files, caches>
- Declare "one shared" or "per-chunk / per-X". Required for any spec that owns state.

## Prior-art citation
<canonical source for non-trivial algorithms: Amanatides-Woo 1987, Lysenko greedy meshing, etc.>
- "N/A" only if the spec has no non-trivial algorithm.

## Module boundary
- Owned files: <paths this spec may edit>
- Public interface: <what other modules call>
- Do not touch: <paths outside the boundary>

## Live seam
- Signal: <real check on a real artifact> or "N/A" (pure logic only)
- Anti-signal: <what a dead surface looks like — black frame, empty port, 0 colors>
- Note: <what the live check proves>

## Gates
1. <command> -> <expected result>
2. <command> -> <expected result>

## Deviations
<filled by the builder: what it did not verify / what it changed>
<reviewed by the Conductor, never trusted as-is>

## Commit
<Conventional Commit message + [R1..R6] line>
```

### Rules per section

**Observability reference.** The concrete expected signal for each live seam. No reference → the spec is `unverifiable` and needs a human sample, not silently "N/A". Written before dispatch so the builder has a target to match, not an abstraction.

**Resource ownership.** Declares the ownership model (one vs many) for stateful resources. Closes the "one VBO for 9 chunks" class of hidden assumptions. If the spec has no state, write "N/A".

**Prior-art citation.** Names the canonical algorithm/source for non-trivial parts (DDA, meshing, matrix math). Closes the fake-DDA class: the reviewer greps the implementation against the cited reference.

**Live seam.** `N/A` is allowed ONLY for pure logic. For a running surface (render, canvas, DOM, server) `N/A` is forbidden. `build`, `curl`, `HTTP 200` are NOT a live seam — they prove the bundle built, not that a frame rendered. Each live seam names an anti-signal too (what a dead surface looks like).

**Deviations.** Filled by the builder, reviewed by the Conductor. It is data, not authority. A non-empty deviation without Conductor approval blocks the commit.

## Gate format

A gate is a command plus an expected number. Write it in the spec.

```
Gate: npm test
Expect: PASS >= 48, fail == 0
```

Rules for gates:

1. State the exact command.
2. State the expected exit code or PASS count.
3. A gate is a command, never self-certification. `run-gates.mjs` runs it and records the number.

## Module boundary

The Conductor writes the boundary before dispatch. Rules:

1. Owned files list every path the subagent may edit.
2. The public interface names what other modules call.
3. Do-not-touch lists shared files outside the boundary.
4. For a small feature, the boundary is just its files. Keep it minimal.

## Context package

Write facts the subagent needs into `.scratch/<slug>-context.md`. The subagent reads the file. Keep the prompt short.

Fill gaps by asking the owner or a web-read. Include the prior-art note from Phase 0.

## Builder prompt

Send this to each implementation subagent.

```
Read <spec path> and <context package path>.
Apply the builder persona.
Implement only the module boundary in the spec.
You may NOT delete, weaken, or skip any existing test. Changing a gate is a
deviation — write it explicitly in the Deviations section.
Run each gate until it passes.
Commit with a Conventional Commit message.
List what you did not verify in your handoff.
```

## Resume loop

On a gate fail:

1. Resume the subagent with a diagnosis. Use resume with the run id and a message.
2. If the run cannot resume, spawn a fresh subagent.
3. Give the fresh one the context package plus the diagnosis. Start from the diagnosis.

Worktree hygiene: run `scripts/worktree-snapshot.sh` before every subagent launch and after every crash — orphaned edits must not be committed as the Conductor's own.

## Recheck (two tracks)

Track A — deterministic gates: `scripts/run-gates.mjs <spec>` runs each command and records the number.
Track B — spec-fidelity review: a read-only Reviewer checks the diff against the spec (missing/partial requirements, scope creep, implemented-but-wrong). Cite the spec line.
Verifier: returns ACCEPT (gates pass AND spec-fidelity holds) or REVISE (name the failing property + next step). Terminal condition: loop ends on ACCEPT or budget.

## Role merging

To keep the module deep instead of wide, merge roles when stakes are low:

- Executor ≅ script — if a gate is deterministic, the role collapses into `run-gates.mjs`.
- Reviewer ≅ Verifier — small tasks; one OFF critic both finds and decides.
- Scout ≅ Thinker — trivial recon.

Keep roles separate when stakes are high (SK-03: Thinker/Worker/Verifier).

## Instrumentation (session-graph)

Follow the Ralph telemetry contract (append-only JSONL, `trace_id == runId`). Do not invent a new format.

- Gate verdict: `{ status: pass|fail|abstain, reason, violations[], evidence[], next_action: continue|retry|human }`.
- One JSONL line per phase, gate decision, and subagent (role, agent number, model, timing).
- `scripts/session-graph.mjs` appends; `scripts/render-session-graph.mjs` renders HTML "which phase failed → drill into the session".

## Violation pipeline handoff

Pass these to the violent-subagent skill:

1. The model config from the owner's answers.
2. The critic models for reviewer and re-checker.
3. The gate commands for the final re-check.
