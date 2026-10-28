---
title: <spec title>
status: draft
labels:
  - <area>
  - <kind>
---

# <spec title>

**Date:** YYYY-MM-DD  
**Scope:** one-line scope statement.

## Problem Statement

The problem from the user's perspective. Include friction points, current workarounds, and why the status quo is unacceptable.

## Solution

The solution from the user's perspective. One or two paragraphs at the top. Keep technical details for `Implementation Decisions` and `Detailed Implementation`.

## User Stories

A numbered list. Each follows:

> As an `<actor>`, I want `<feature>`, so that `<benefit>`.

Cover the main flows, the edge cases, and both the user and the developer view. Every story maps to a real acceptance criterion or implementation step.

## Wave / dependencies

- **Wave:** `<n>`.
- **Requires:** `<spec or artifact that must hold a verified result first>`.
- **Unblocks:** `<specs or artifact downstream>`.
- **Parallel with:** `<specs in the same wave that touch other files>`.

## Implementation Decisions

A numbered list of hard-to-reverse or load-bearing decisions. For each:

- What was decided.
- Why. State the trade-offs, constraints, and rationale.
- Pointer to an ADR when the decision is architectural.

Keep file paths and code snippets out, unless a prototype produced a decision-rich fragment. In that case inline only the relevant fragment and note its origin.

## Principles (mandatory re-checks)

A numbered list of the principles that are load-bearing for this spec. For each, give the principle ID from the catalog, its name, and the concrete external re-check that must pass during implementation. A principle here is a gate, not a guideline.

## Prototype

Fill this section when the spec introduces new mechanics.

- **Built from:** `<prototype path or none>`.
- **Prototype question:** `<the one question the prototype answers>`.
- **Verdict:** `<author verdict, recorded verbatim in the prototype NOTES>`.
- **Standard to bake in:** `<parameters the verdict locks as production defaults>`.

## Detailed Implementation

The concrete plan: modules, interfaces, data structures, file changes, and how they fit together.

### Files to modify

- `path/to/file.ts` — what changes and why.
- `path/to/new-file.ts` — new module description.

### Behavior changes

- Entry points, command handlers, APIs.
- State changes, side effects, persistence.
- Error handling and fallback behavior.

## Testing Decisions

- What makes a good test for this spec. Test external behavior, not implementation details.
- Which modules or flows are covered.
- Prior art in the codebase.
- Verification commands.

## Intermediate artifact

- **Artifact:** `<what exists when the wave completes>`.
- **Check:** `<command>`.
- **Expected:** `<result>`.

## Out of Scope

List what this spec does not cover. This sets the boundary for reviewers.

## Acceptance Criteria

A checklist. Every item is concrete and verifiable:

- [ ] `<criterion>` — `<how to verify>`.
- [ ] `<criterion>` — `<how to verify>`.

## Related Documents

- `path/to/ADR.md` — architectural decision.
- `path/to/other-spec.md` — related spec.
- `path/to/CURRENT_STATUS.md` — project status snapshot.
