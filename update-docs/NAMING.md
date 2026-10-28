# PLAN.md item naming

Rule for short, readable `PLAN.md` item titles. Applies when a skill writes or updates plan items (`update-docs` updates statuses, `upgrade-repo` migrates legacy, `setup-repo` scaffolds the canon). Canon: `planmd-standard.md` (Rule 6, ADR-0025).

## Rule

Item title = a short **task name** (what it is), in plain language; English terms are fine if they are simpler or more familiar.

Forbidden in the title:
- log/status ("confirmed working", "done", "finished");
- enumerations of steps ("instrumented X, defensive matching, ...");
- file paths and "see X";
- code identifiers (except the artifact's own name, e.g. `graph.json`).

Status is shown by `[x]`/`[ ]` and the section (`Now`/`Next`/`Backlog`/`Done`). Details and evidence live in the spec/doc/session (DRY).

## Examples

| Before | After |
|---|---|
| "Bootstrap `graph.json` from Session 1 (44 nodes / 77 edges) -> tree visible in `/mental_tree view`" | "Create `graph.json` from Session 1" |
| "Fix `ask`-tool arrows: instrumented `handleInput`, ... - confirmed working" | "Fix arrows in ask-tool" |
| "Mental tree drill (points 1-6) - schema, renderer, ... (see `.docs/MEGADRILL_PLANS.md`)" | "Mental tree drill, points 1-6" |

## Mechanical check

- The title is a single line, readable without knowledge of internals.
- Do not touch `<!-- id: slug -->` (dates are keyed to the id).
