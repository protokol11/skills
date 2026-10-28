---
name: to-spec
description: Turn the current conversation context into an implementation-ready spec or spec set. Use when the user wants to capture a design or implementation plan as a SPEC.
---

# to-spec

Turn the current conversation context and codebase understanding into a spec set. Synthesize what you already know. Do not interview the user.

A spec is a concrete, implementation-ready document. It answers six questions: what problem are we solving, what is the solution, which decisions are locked, which files change, how do we verify it, and what is out of scope. A feature that spans several seams produces several specs in waves. Read [references/wave-planning.md](references/wave-planning.md).

## Process

### 1. Reconnaissance and seam check

Run the `reference-first` skill for the code, logs, and prior decisions in scope. Then confirm the spec-specific facts:

- Every referenced function or constant is reachable from module level.
- Every duration or timestamp claim traces to a log line or tool output. Event time is not condition time.
- Every polling call returns faster than its poll interval.

Done when every referenced artifact exists and every timing claim has evidence. If an artifact is missing or different, stop and resolve it.

### 2. Map seams and split into waves

Name the highest seam at which the feature is testable. Prefer an existing seam. One spec covers one seam and one owner.

Split the work by code seams. Put pure refactors first, isolate new mechanics in a prototype, and keep production integration last. Group the specs into waves so specs inside a wave touch different files.

State the seam map and the wave plan in your response. Ask the user to confirm before writing. Several specs is the normal output.

Done when the user confirms the seam map and the wave order.

### 3. Select principle re-checks

Scan the principle catalog shipped with the `to-violations` skill. Choose the principles whose artifacts include `spec` or `code` and that this spec could violate. Typical hits: `DRY`, `PS-02`, `PULL-COMPLEXITY-DOWNWARD`, `PS-TL-01`, `PS-TV-04`, `RTL-03`, `PS-WF-02`, `PS-FIXER-03`, `HUMAN-JUDGMENT-FINAL`.

For each chosen principle, define one concrete external re-check: a command, a grep, a diff, or a review step. The implementer re-runs it during implementation.

Done when every load-bearing principle has a concrete re-check command.

### 4. Prototype new mechanics

Run the `prototype` skill when a spec introduces new mechanics, a new function, a changed interface, or a non-obvious code path. Build each new prototype on the verified frame of the previous one and add one question.

Record the author verdict and the final parameters in the prototype NOTES. The spec links to those NOTES. The verdict is the mechanic gate. The agent does not certify it.

Skip this step when the change is a behavioral tweak inside an existing function.

Done when every new mechanic has a prototype with a recorded verdict or an explicit skip.

### 5. Write the spec

Fill the template at [references/spec-template.md](references/spec-template.md). Keep the status as `draft` while writing.

Done when every template section is filled.

### 6. Run the verification gate

Run the checklist below. If any item fails, report the mismatch to the user and keep status `draft`.

- [ ] Reachability: every referenced function or constant is reachable from module level.
- [ ] Timing claims: every duration or timestamp traces to a log line or tool output.
- [ ] Seam coverage: every acceptance criterion has a test or command that exercises the changed code.
- [ ] Poll versus inner timeout: every polling loop returns faster than its poll interval.
- [ ] Wave position: the spec names what it requires and what it unblocks.
- [ ] Intermediate artifact: the spec names one checkable artifact for its wave.
- [ ] Prototype verdict: every new mechanic records an author verdict.
- [ ] Out of scope: the section excludes what the user did not ask for.
- [ ] Principle re-checks: every load-bearing principle has a concrete external re-check.
- [ ] No nested-function leaks: no module-level function references a nested function.

Done when every item passes.

### 7. Publish

Save each spec to the project spec location. Default: `.docs/SPECS/<area>/<short-title>.md`. Link the specs of one set through their Wave sections. Add an entry to the project spec index when one exists.

Set status to `ready-for-agent` only after the gate passes. Set a spec `ready-for-agent` only when the wave it requires holds a verified result.

Done when every spec file exists at the resolved location and the status is recorded.

Report the spec paths and the single most important acceptance criterion.

## Out of scope for this skill

- Writing PRDs.
- Interviewing the user for requirements.
- Implementing the spec.
