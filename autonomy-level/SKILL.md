---
name: autonomy-level
description: Choose a human-involvement level for a risky or uncertain task.
autonomy_level: recommend
disable-model-invocation: true
---

# autonomy-level

Pick the right autonomy level for a task based on stakes, uncertainty, and reversibility.

## When to use

- A task can modify state, deploy code, spend money, or affect live users.
- Requirements are ambiguous or the failure cost is high.
- You need to decide whether to proceed automatically or ask a human.

## Core idea

Autonomy is a dial, not a switch. Choose the level that matches the risk. Lower autonomy for higher stakes. Higher autonomy for routine, reversible tasks.

## Levels

- `recommend`: give advice, do not act.
- `execute-with-review`: act, but pause at the next decision point for human review.
- `execute-and-report`: act and report results; only pause on severe failure.
- `human-approval-required`: stop and ask the human before proceeding.

## Procedure

1. **Analyze stakes.** What breaks if this goes wrong? Data loss, money, user trust, or none?
2. **Analyze uncertainty.** Are requirements clear? Is the evidence complete? Are assumptions risky?
3. **Analyze reversibility.** Can the action be undone cheaply? Is it a write or a read?
4. **Pick a level.** Use the mapping below.
5. **Justify.** Give a one-line reason tied to the risk factors.

## Mapping

- Safety-critical, destructive, or live-user-facing → `human-approval-required`.
- Ambiguous requirements or conflicting evidence → `recommend` or `execute-with-review`.
- Routine, reversible, well-defined → `execute-and-report`.
- Unknown risk → default to `execute-with-review`.

## Conventions

- The level is a recommendation. The caller may override it with a reason.
- Never use `execute-and-report` for destructive operations unless the human explicitly allowed it.
- Always state the risk factors, not just the level.

## Output schema

```json
{
  "level": "recommend | execute-with-review | execute-and-report | human-approval-required",
  "reasoning": "string",
  "risk_factors": ["string"],
  "override_allowed": true
}
```

## Verification

- The reasoning mentions stakes, uncertainty, or reversibility.
- The level matches the mapping.
- The caller can safely use the level as a gate.
