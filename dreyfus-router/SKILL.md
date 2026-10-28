---
name: dreyfus-router
description: Choose novice, competent, proficient, or expert mode for a subagent based on task familiarity and uncertainty.
autonomy_level: recommend
disable-model-invocation: true
---

# dreyfus-router

Pick a skill level for a task. Novices need recipes. Experts need context. Match the mode to the task, not the title.

## When to use

- A subagent starts a task and the complexity is unclear.
- You need to decide how much instruction to give.
- A task involves a new technology, domain, or ambiguous requirements.

## Core idea

Dreyfus model: rules help novices, intuition helps experts. Pick the level that fits the task, then shape the prompt.

## Procedure

1. **Analyze the task.** Consider:
   - familiarity with the technology or domain
   - ambiguity of requirements
   - availability of examples and documentation
   - stakes of being wrong
2. **Pick a level.**
   - `novice`: new technology or domain; need step-by-step recipe.
   - `competent`: familiar domain, but task is complex or new.
   - `proficient`: familiar task, need synthesis and prioritization.
   - `expert`: familiar task, well-defined context; rely on intuition and minimal instruction.
3. **Justify.** Give a one-line reason for the level.
4. **Suggest prompt variant.** Describe how to adapt the system prompt or workflow for this level.

## Conventions

- The level is a recommendation, not a jail. The caller may override it.
- Do not confuse experience with expertise. A senior developer can be a novice in a new domain.
- Use the level to shape process, not to limit tools.

## Output schema

```json
{
  "skill_level": "novice | competent | proficient | expert",
  "reasoning": "string",
  "suggested_prompt_variant": "string",
  "suggested_workflow": ["string"]
}
```

## Verification

- The reasoning refers to task attributes, not stereotypes.
- The suggested workflow is appropriate for the chosen level.
- The level is falsifiable from the task description.
