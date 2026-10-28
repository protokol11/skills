---
name: violent-subagent
description: Run the autonomous to-violations to slice-fix pipeline through subagents. A reviewer subagent writes the violation spec. Slice coders fix one owner at a time. A violent re-check verifies no new violations. Use when the user asks to fix feature violations by pipeline, or mentions "to-violations pipeline", "slice-fix", or "violation-spec".
disable-model-invocation: true
---

# violent-subagent

Run the violation fix pipeline end to end through subagents. Delegate the spec, the fixes, and the re-check. Do not fix by hand.

## When to use

Use when:
1. The user asks to fix principle violations across features.
2. The user mentions "to-violations pipeline", "slice-fix", or "violation-spec".
3. A review found violations and the user wants autonomous fixes.

## Inputs

The caller gives:
1. `codeRepo` — path to the code base.
2. `features` — feature sketches to review.
3. `specPath` — where to write the violation spec. Default `.docs/violations/<topic>.md`.
4. `baseRef` — git reference to compare. Default HEAD.
5. `knownConflicts` — orchestrator hypotheses. The reviewer checks and extends them.
6. `toViolationsDir` — path to the to-violations skill. Default `~/.agents/skills/to-violations`.

## Sources of truth

Resolve every reference to these files. Never a same-named file elsewhere.
1. `toViolationsDir/SKILL.md` — the spec procedure.
2. `toViolationsDir/PRINCIPLES.md` — the principle catalog. The only valid source of principle ids.
3. `toViolationsDir/TEMPLATE.md` — the spec output format.
4. `toViolationsDir/principles.schema.json` — the typed schema for the spec.

On a typical machine `toViolationsDir` resolves to `~/.agents/skills/to-violations`.

## Outputs

1. A violation spec at `specPath`.
2. N fix commits. Each keeps the gates green.
3. A violent re-check report. It lists only new violations.
4. A session status and CURRENT_STATUS update.

## Principles

These rules govern the pipeline. They are not principle ids from `PRINCIPLES.md`.
1. One writer per cwd. Never run parallel fixes.
2. Foundation slices come before feature slices.
3. Do not fix out-of-scope issues. Mark them. Do not fix them.
4. Never trust a subagent report. Verify the gates yourself.
5. Record every deviation from the spec.
6. No self-certification. The human decides the live run.
7. Follow VOICE.md. Active voice. Sentences under 20 words. No semicolons or contractions.

## Procedure

### Phase 0 — baseline and scope
1. Record the baseline. Run `tsc --noEmit` and `node --test`. Confirm `git status` is clean.
2. Write each feature as a sketch. List known conflict points.
3. Enforce one writer per cwd. Run slices strictly sequential.

### Phase 1 — spec the violations
1. Spawn one reviewer subagent. Model `deepseek/deepseek-v4-flash`. Thinking off.
2. Tell it to read `toViolationsDir/SKILL.md` first. Then review the code against the features.
3. Require `toViolationsDir/TEMPLATE.md`. Do not drop a field. Keep acceptance criteria testable and under 20 words.
4. Require a "Safe rollout order" section. One slice holds one concern. Each slice keeps gates green.
5. Mark open questions. A slice coder resolves them and records the deviation.

### Phase 2 — plan the slices
1. Read the spec. Verify each principle id exists in `toViolationsDir/PRINCIPLES.md`.
2. Verify each acceptance criterion is testable.
3. Verify the slices cover every violation. Verify the order.
4. Order slices: foundation refactors, then state-model changes, then shared mechanisms, then features.
5. Give each slice an exact violation list, an inner order, and a do-not-touch list.

### Phase 3 — fix by slice
1. Run slice coders as a strict sequential chain. Model `kimi-coding/kimi-for-coding:low`.
2. Start each coder only after the previous gates pass. One writer per cwd.
3. Tell each coder to read the spec end to end. Fix only its own violation ids.
4. Require green gates before commit: `tsc --noEmit` and `node --test`.
5. Require Conventional Commits. Use the edit tool. No sed.
6. Allow a coder to resolve open questions. Require it to record every deviation.

### Phase 4 — verify
1. Do not trust coder reports. Run the gates yourself.
2. Check `git log` for clean Conventional Commits.
3. Run a violent re-check. Find new violations missing from the spec.
4. Run a smoke check with `pi -p name_session`.

### Phase 5 — document
1. Run `update-docs`. Write the session status with a per-slice addendum.
2. Update CURRENT_STATUS. Cross-link the spec.
3. Mark the live run as a human step. HUMAN-JUDGMENT-FINAL.

## Reference

Prompt skeletons, the workflow script, and pitfalls live in [REFERENCE.md](REFERENCE.md).

## Verification

1. The baseline is green or recorded as known-broken.
2. Every commit keeps the gates green.
3. The re-check report lists only new violations.
4. The status doc links the spec and the commits.
