# deep-research — reference

## Vendored dependencies

Two runtime pieces ship inside this skill folder under `vendor/`:

1. `vendor/agent-directory/` — the loader extension that resolves reusable agents from
   `.pi/agents/*.md` (project) and `.agents/agents/*.md` (user). To activate it, copy the
   folder into `<project>/extensions/` or load it with `pi --extension`. If it is already
   installed in the project, the copy here is the pinned source of truth for this skill.
2. `vendor/custom-compaction.reference.ts` — the pi `session_before_compact` example that
   the planned deep-research-compact extension adapts. It is reference material, not
   loaded. Build the real extension from it per the compaction section below.

## Run directory layout

```
<run-dir>/
  plan.md                  goal, directions, seed queries
  scratchpad/
    findings.md            the only non-lossy layer
    visited.md             shared URL blacklist
  notes/
    <agent>.md             per-researcher log + own blacklist
    <agent>.directives.md  parent-written compaction directives
  skeptic/
    verdicts.md
  report.md                final output (P4)
  process/
    session-graph.jsonl    one line per phase/gate, parent-written
```

## findings.md schema

One finding per block, append-only:

```
## <direction-slug>-<n> [revisit:<m>]
claim: <single checkable sentence>
source: <url>
date: <access date YYYY-MM-DD>
status: <open | confirmed | needs-revisit | rejected>
```

Rules: one claim per block. No claim without a source line. `revisit:` blocks answer a
skeptic question and keep the original block id.

## notes/<agent>.md schema

```
# <agent>
direction: <slug>
done: <what was covered>
dead-ends: <what was tried and abandoned, with reason>
blacklist: <urls fetched, one per line>
```

## verdicts.md schema

One line per finding:

```
| finding | verdict | basis |
| <id> | confirmed | <one line: why the source supports it> |
| <id> | needs-revisit | <concrete question to answer> |
| <id> | rejected | <reason> |
```

## visited.md schema

One URL per line, newest last. Researchers read it before each fetch.

## Researcher brief template

Give each researcher: the goal from plan.md, its direction, the scratchpad and notes
paths, the schema requirements above, the compaction-loop procedure, and its model.
Researchers have web tools and file write access to the run directory only.

## Skeptic brief template

Give the skeptic: `scratchpad/findings.md` path, the verdict schema, and the instruction
to check each claim against its source link where reachable. Verdicts are ternary.

## Merger brief template

Give the merger: `scratchpad/findings.md` (confirmed rows only), the agent notes as
structure hints, the report path, and the citation rule (every claim keeps its source).
The report sections follow plan.md directions plus a "not found" appendix from notes.

## Gate checks (P5, parent-run)

1. Coverage: every direction in plan.md appears in findings.md or in the "not found"
   appendix.
2. Citations: `grep -c '^source:' report.md` equals the number of claim sentences in
   report.md (recount, do not trust the merger).
3. Verdict closure: no `status: open` and no `needs-revisit` left in findings.md.
4. Every finding id cited in report.md has verdict `confirmed`.
5. `git status` in the working repo is clean if the run directory is inside a repo
   (run dirs default to AGENTIC_PAPERS, outside repos).

## Compaction directives file

`notes/<agent>.directives.md`, rewritten by the parent whenever a researcher compacts:

```
remember: <facts and open threads that must survive compaction>
skip: <urls already covered, from notes/<agent>.md blacklist>
```

The deep-research-compact extension reads this file on `session_before_compact` for the
session whose cwd is the researcher's run directory and prepends it to the compaction
summary prompt. Build that extension from `vendor/custom-compaction.reference.ts`
(see Vendored dependencies). Without the extension, the threshold fallback in SKILL.md
applies.

## session-graph.jsonl line

```
{"ts":"<iso>","trace_id":"<run-slug>","phase":"<P0-P5>","actor":"<role>","model":"<id>","event":"<done|gate_passed|failed>","details":"<one line>"}
```

## Failure handling

- Subagent error, empty output, or repeated tool call = one failure. Two consecutive
  failures on one role stop the run. Record both in session-graph.jsonl.
- A researcher that finds nothing still writes its notes and an empty finding note, so
  the merge can state what was not found.
