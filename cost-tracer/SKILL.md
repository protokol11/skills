---
name: cost-tracer
description: Measure token cost, latency, and tool calls for a task or trajectory.
autonomy_level: execute-and-report
disable-model-invocation: true
---

# cost-tracer

Measure the cost of a task or trajectory. Log tokens, time, and tool calls. Warn if the budget is exceeded.

## When to use

- Before a long run to estimate cost.
- After a task to compare approaches.
- When a trajectory becomes expensive without clear progress.

## Core idea

Token ROI = quality / (token cost × time cost). Optimize the trajectory, not only the final output.

## Procedure

1. **Start.** Record the start time, expected budget, and quality metric if known.
2. **Execute.** Run the task while counting tool calls and wall-clock time.
3. **Record tokens.** Capture input and output tokens if the environment provides them.
4. **Compute.**
   - `token_cost = input_tokens + output_tokens`
   - `time_cost = wall_seconds` (or normalized unit)
   - `token_roi = quality_score / (token_cost * time_cost)`
5. **Report.** Output the trace. Set `budget_exceeded` if the cost is above the budget.

## Conventions

- If token counts are unavailable, estimate from output size and tool calls.
- Use the same units across runs so comparisons are valid.
- Quality score is a number between 0 and 1. If unknown, leave it null.
- `budget_exceeded` is a flag, not a verdict.

## Output schema

```json
{
  "task": "string",
  "input_tokens": 0,
  "output_tokens": 0,
  "tool_calls": 0,
  "wall_seconds": 0,
  "token_cost": 0,
  "time_cost": 0,
  "quality_score": null,
  "token_roi": 0,
  "budget": 0,
  "budget_exceeded": false,
  "summary": "string"
}
```

## Verification

- All numeric fields are present.
- `token_roi` uses the correct formula.
- The summary states whether the budget was exceeded.
