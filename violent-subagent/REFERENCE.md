# REFERENCE — violent-subagent

Prompt skeletons and the workflow script for each phase.

## Phase 1 — reviewer prompt

```
You are a reviewer. Review <CODE> against <FEATURES> for conflicts with the existing design.
Write a structured spec through the to-violations skill.
Read the full skill first: <toViolationsDir>/SKILL.md.
Read the catalog: <toViolationsDir>/PRINCIPLES.md.
Follow the output format in <toViolationsDir>/TEMPLATE.md.
Code: <paths>.
Spec or ADR: <paths>.
FEATURES: <sketches>.
KNOWN CONFLICTS (check, deepen, find new): <hypotheses>.
Do not write feature code.
Return a structured spec in the to-violations format.
Give priorities and a safe rollout order of slices.
Each slice must not break existing behavior.
```

## Phase 3 — slice coder prompt

```
You implement ONE slice of <plan>.
First read the violation spec end to end: <specPath>.
Follow Required state, Files to change, and Acceptance criteria for YOUR violation ids only.
Do not implement other slices.
Existing behavior not mentioned must not change.

SLICE k — <violation ids in order>.
<feature sketch, if this is a feature slice>.

Gates (keep green; run in <codeRepo>):
  tsc --noEmit -p tsconfig.json
  node --test test/*.test.mjs

Commit with a clear English message after the gates pass.
Use the edit tool. Do not use sed.
Report: commit hash, test count, tsc result, deviations.
```

## Workflow script

```js
// Phase 1: one spec-ing reviewer.
const specResult = await runs.run('spec', {
  agent: 'explore', // confirm the read-only reviewer agent
  model: 'deepseek/deepseek-v4-flash',
  task: specPrompt
});

// Phase 2 and Phase 4 run in the parent. Do not delegate them.

// Phase 3: strict sequential chain.
const out = [];
for (const s of slices) {
  const r = await runs.run(s.key, {
    agent: 'coder',
    model: 'kimi-coding/kimi-for-coding:low',
    task: s.task
  });
  out.push({ slice: s.key, output: String(r?.output ?? r) });
}
return out;
```

Notes:
1. `runs.all` returns an ordered array. Use `results[i]`. It is not a key map.
2. One `runs.run` per slice. Await it. The next slice waits for the gates.
3. `runs.run(key, params)` takes two positional arguments. The key comes first. The `{ key, agent, task }` object belongs inside `runs.all([...])` only. `runs.run({ key: ... })` puts the object in the key slot and throws `runs.run has an invalid key`.

## Pitfalls

| Pitfall | Fix |
| --- | --- |
| 403 "Access denied by security policy" on free models | Fall back to `delegate` or `coder`. Do not retry the same agent. |
| `runs.all` returns an ordered array, not a key map | Use `results[i]` or destructuring. |
| `runs.run has an invalid key` on `runs.run({ ... })` | Pass the key first: `runs.run("review", { agent, task })`. The object form belongs to `runs.all` items. |
| A workflow fails after the children finish | The failed stage never started. Read the error text, fix the script, rerun only that stage. |
| `stop` does not kill children instantly | Finished children keep output dirs. Collect results by hand. |
| Slices drift without owner dispatch | The first slice is always foundation. |
| Key handlers in a pi closure lack headless tests | Verify with tsc and code review. Mark as residual risk. |
| Subagents skip Conventional Commits | Put the requirement in each prompt. |

## Deviation policy

A coder may resolve an open question from the spec.
It must record the deviation in its report.
An out-of-scope fix is forbidden. Mark it. Do not fix it.
Example: do not fix "enrich whole-file reads". Mark it instead.
