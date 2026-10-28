---
name: to-context
description: Update the project's domain glossary in CONTEXT.md. Use when a term is resolved, conflicts with existing glossary, or needs sharpening.
disable-model-invocation: true
---

Actively update the project's domain glossary.

## When to use

- The user uses a term that conflicts with `CONTEXT.md`.
- A vague or overloaded term needs a precise canonical name.
- A term is resolved during design or implementation.

## Procedure

1. **Challenge against the glossary**
   - If a term conflicts with existing language, call it out immediately.

2. **Sharpen fuzzy language**
   - Propose a precise canonical term and ask the user to confirm.

3. **Update CONTEXT.md inline**
   - Save the resolved term using the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).
   - Keep `CONTEXT.md` free of implementation details.

## Verification

- `CONTEXT.md` is updated and consistent.
- No implementation details leaked into the glossary.
