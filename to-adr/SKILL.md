---
name: to-adr
description: Record a hard-to-reverse architectural decision as an ADR.
---

# to-adr

Record an architectural decision as an ADR.

## When to use

Create an ADR only when all three are true:

1. **Hard to reverse** — changing your mind later costs meaningfully.
2. **Surprising without context** — a future reader asks "why did they do it this way?".
3. **Result of a real trade-off** — genuine alternatives existed and you picked one for specific reasons.

If any is missing, skip the ADR.

## What qualifies

- Architectural shape. "Monorepo." "Event-sourced write model, projected read model."
- Integration patterns between contexts. "Ordering and Billing communicate via domain events."
- Technology choices with lock-in. Database, message bus, auth provider, deployment target.
- Boundary and scope decisions. The explicit no-s carry as much value as the yes-s.
- Deliberate deviations from the obvious path. "Manual SQL instead of an ORM because X."
- Constraints not visible in the code. "No AWS because of compliance."
- Rejected alternatives when the rejection is non-obvious.

## Procedure

1. Identify the decision and the alternatives.
2. Write the ADR using [ADR-FORMAT.md](./ADR-FORMAT.md).
3. Save it under `.docs/adr/`.
4. Update any related `CONTEXT.md` pointer.

Done when the ADR file exists under `.docs/adr/` and the context pointer is updated.

## Verification

- The file name is `NNNN-slug.md`, where `NNNN` is the highest existing number plus one.
- The first paragraph states the decision and the reason.
- The ADR is linked from `CONTEXT.md` or the decision map.
