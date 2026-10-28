---
name: monster-longrun
description: Ship a batch of specs in one session through a single-writer subagent pipeline with numbered gates, eyes-on verification, spec-fidelity re-checks, and a violation pass. Generic cheap Ralph Loop for any multi-step task.
disable-model-invocation: true
---

# monster-longrun

Generic cheap Ralph Loop. Ship a batch of specs in one session for **any** multi-step task. The pipeline is single-writer: one subagent per spec, sequential. The Conductor (you, the orchestrator) runs it, re-checks every gate, and authorizes every accept.

Principle: **eyes over code.** A green unit-test shield does not prove the product works. Prove the real surface (screenshot, live artifact) — never take a self-report as authority.

## Conductor persona

Be strategic, question like Socrates, wonder like a 10-year-old.

- **Socrates:** for every "done"/"pass", ask "how do you know?" Re-run the command. What tool output proves it? A report is data, not authority.
- **10-year-old:** ask "why?", "why not simpler?", "what am I not seeing?"
- **Strategic:** coordinate, never solve. Dispatch, then verify, then authorize.

## Done

The run is done when:

1. Every spec's gates pass on the Conductor's own re-run (`scripts/run-gates.mjs`).
2. Every live seam passed the eyes-on check (`scripts/gate-screenshot.mjs` or Eyes role).
3. The violation pass is clean.
4. update-docs wrote the session status and the current status.
5. The session-graph JSONL has one line per phase, gate, and subagent (complete trace).

## Phases

0. **Recon.** Prior-art check (`research` skill, Mode 2: build|adapt|exists) + canonical overview of non-trivial algorithms. Role: Scout. Done when prior-art verdict recorded and no reinvention is possible.
1. **Configure.** Ask the owner (ask tool): (a) budget — paid (default) or free-only; (b) per-role model preference, pre-filled with the deterministic selection from MODEL-CATALOG (the owner may override any role); (c) confirm Eyes (vision) + final slice. Done when the owner confirms the role table.
2. **Decompose.** If no specs, run `adhd`, then have the owner run `/to-spec`. Each spec carries the full contract (REFERENCE.md). Role: Thinker. Done when each spec has a file.
3. **Context package.** Gather missing facts + the prior-art note. Write `.scratch/<slug>-context.md`. Done when every fact is listed and no question is open.
4. **Module boundary.** Write owned files, public interface, do-not-touch into each spec. Done when every spec has a boundary.
5. **Live seam.** Each spec names a real signal on a real artifact (not `build`/`curl`/`HTTP 200`) or "N/A" (pure logic only). Build the runner where it applies. Role: Eyes. Done when every spec has a live seam with an anti-signal.
6. **Implement.** One subagent per spec, sequential. Pass gates as numbered commands. Role: Builder. Done when every gate passes on your own re-run. If the builder must be blind to the host filesystem (eval isolation), spawn it in an isolated environment per Rule 13 instead of a same-machine subagent.
7. **Recheck.** Two tracks: (A) deterministic gates via `run-gates.mjs`; (B) spec-fidelity review of the diff (Reviewer, OFF). Verifier returns ACCEPT/REVISE — the terminal of the loop. Done when every gate passes and spec-fidelity holds.
8. **Violation pipeline.** Run the violent-subagent skill. Reviewer → violation spec; Slice-coder (kimi:low) fixes. Expect at least one new violation. Done when the re-check finds no new violation and every gate passes.
9. **Update docs.** Write the session status and the current status. Done when both files exist.

## Rules

1. One spec = one subagent. Single-writer at all times.
2. Re-run the gates yourself (`run-gates.mjs`). Trust tool output over reports.
3. A subagent self-report is data, not authority. The Conductor authorizes accept/commit.
4. Gates are commands with numbers, e.g. "PASS ≥ 12". Modifying/deleting a test is a deviation — `diff-test-files.sh` after every slice.
5. Live seam targets a real artifact. `build`/`curl`/`HTTP 200` are NOT a live seam.
6. Between "builder finished" and "commit accepted", run `gate-commit.sh`. Fail → resume, not analysis-on-the-fly.
7. Reviewers are read-only. Conductor-as-writer is a recorded deviation.
8. OFF critics catch symptoms; re-check the root cause with grep or a test.
9. The model is pinned per slice; changing it = a new slice with fresh context.
10. Session-graph is written throughout. Every handoff lists what is NOT verified.
11. Never `taskkill` all node; only tree-kill the specific PID (live-loop).
12. HUMAN-JUDGMENT-FINAL — the human is the final judge of the live picture.
13. Isolated builder lane. When the writer must not see the host filesystem (e.g., eval blind), run it in an isolated environment (WSL2 / container), NOT a same-machine subagent. The concrete spawn command and project path live in the project context (prompt/AGENTS), never hardcoded here.

## Reference

Formats, spec contract, and templates: [REFERENCE.md](REFERENCE.md).
Model budget by role: [MODEL-CATALOG.md](MODEL-CATALOG.md).
Personas by role: [PERSONA.md](PERSONA.md).
Scripts: `scripts/` (gates, screenshot, commit hook, worktree snapshot, session-graph).
