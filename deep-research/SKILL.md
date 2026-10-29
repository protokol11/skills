---
name: deep-research
description: Run a multi-agent web research swarm (reusable agents, disk scratchpad, skeptic pass) and return one cited report. Use on /deep-research or "research X in depth".
disable-model-invocation: true
---

# deep-research

Run a multi-agent web research swarm and return one cited report. Reuses agents from the
agent-directory extension. State lives on disk so compaction stays safe.

Use on `/deep-research`, "run deep research on X", "research X in depth".
Not for single questions a web_search answers.

## Leading rule

State lives on disk and context is expendable. Every finding is written to the
scratchpad before an agent compacts. The final report is assembled from the scratchpad, never from
agent summaries.

## Policy card (ask once, at start)

1. Research question and scope.
2. Output path for the run directory. Default `AGENTIC_PAPERS/deep-research/<slug>-<date>/`.
3. Model split. Default: researchers `deepseek/deepseek-flash:low`, skeptic and merger
   `kimi-coding/kimi-for-coding:low`.
4. Researcher count and directions. Default 4, decomposed by the planner.
5. Compaction directives: yes (default, requires the deep-research-compact extension) or
   plain pi compaction.

Preflight before P0: resolve every model id in `subagent({action:"models"})`. An unknown
id stops the run. Create the run directory layout from REFERENCE.md.

## Phases

0. **Plan.** Decompose the question into 3-6 research directions. Write `plan.md` with the
   goal, the directions, and per-direction seed queries. Done when the owner confirms or
   60 seconds pass without objection.
1. **Round 1.** Spawn one researcher subagent per direction, async, each with its own
   `cwd` under the run directory. Each researcher writes confirmed findings
   (claim | source | date) to `scratchpad/findings.md`, keeps `notes/<agent>.md` with a
   visited-URL blacklist, and appends the blacklist to the shared `scratchpad/visited.md`.
   Done when every researcher reports done and `findings.md` has at least one entry per
   direction that produced evidence.
2. **Skeptic.** One skeptic subagent reads `scratchpad/findings.md` (never the summaries)
   and writes `skeptic/verdicts.md`: per finding `confirmed` / `needs-revisit` (with a
   concrete question) / `rejected` (with a reason). Done when every finding has a verdict.
3. **Revisit.** For each `needs-revisit`, spawn a targeted mini-round with the skeptic's
   question and the relevant URL blacklist. Findings append to the scratchpad with
   `revisit:` prefix. Done when no `needs-revisit` remains open or a revisit returns no
   new evidence twice.
4. **Merge.** One merger subagent assembles the report from the scratchpad. Agent
   summaries serve only as the skeleton (what was searched, what was not found). Every
   claim keeps its source link. Done when the report passes the gate checks in
   REFERENCE.md.
5. **Gate.** Run the checks in REFERENCE.md yourself: coverage, citation presence,
   verdict closure, probe files reverted, tree clean. Done when all pass.

## Compaction loop (per researcher)

When the deep-research-compact extension is active, the parent writes
`notes/<agent>.directives.md` (what to remember, which URLs to skip). The extension
injects it into the researcher's compaction summary. The researcher summarizes its
mini-round into `notes/<agent>.md` before each compact and continues. Without the
extension, researchers stop at ~65k estimated context, write the summary, and resume in a
fresh subagent seeded from the notes file.

## Rules

1. One phase at a time. Gates run in the parent.
2. The skeptic reads the scratchpad, never summaries.
3. A unit without a source link is dropped, not merged.
4. Researchers read `scratchpad/visited.md` before each new source fetch.
5. A subagent report is data. The parent re-runs every gate check itself.
6. Stop the run after two consecutive failed subagent attempts on the same role.

## Reference

State contract, file schemas, verdict format, gate commands: [REFERENCE.md](REFERENCE.md).
