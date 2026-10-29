# protokol11/skills

29 agent skills from a real, working engineering system — for anyone running AI coding agents daily.

## Why this bundle exists

These skills were not designed in the abstract. Each one was extracted from a daily agentic pipeline that is itself in production use: a session starts by resuming a handoff (`hands-on`), gets planned through a Socratic drill (`drill-me`), turns into specs and ADRs (`to-spec`, `to-adr`), dispatches implementation to subagents (`implement`), verifies results against a principle catalog (`to-violations`, `violent`), and closes with a context-window handoff (`hands-off`). Runtime infrastructure skills — routing subagent cognition (`dreyfus-router`), setting human-involvement levels (`autonomy-level`), measuring cost (`cost-tracer`) — grew the same way, out of observed bottlenecks rather than speculation.

Scope: the skills, their docs, and the sync between this bundle and the standalone package repos.
Non-scope: an orchestrator runtime, a model router, or a principle catalog — the pipeline assumes those already exist.

## What you get

Skills are grouped into packages. Copy one package or the whole repo.

| Package | Skills | Repo |
|---|---|---|
| **drill** — Socratic decision protocols (one hard question at a time, mandatory critique, typed question-graph) | `drill`, `drill-me` | https://github.com/protokol11/drill |
| **live-loop** — agent-runnable live-test runners for desktop/hybrid apps (spawn, capture, watch markers, inject faults, tree-kill) | `live-loop`, `monster-longrun` | https://github.com/protokol11/live-loop |
| **handoffs** — state-transfer documents: create one, resume from one | `hands-on`, `hands-off` | https://github.com/protokol11/handoffs |
| **not-messy.docs** — turn conversations into specs, ADRs, and a domain glossary; keep docs current after implementation | `to-spec`, `to-adr`, `to-context`, `update-docs` | https://github.com/protokol11/not-messy.docs |
| **principles** — extract principles from research, lint/rewrite artifacts against them, render compliance artifacts | `to-principles`, `principled-write`, `principles-render` | https://github.com/protokol11/principles |
| **violence-fix** — find principle violations, slice-fix them through subagents, re-check claimed fixes for new violations | `to-violations`, `violent`, `violent-subagent` | https://github.com/protokol11/violence-fix |
| **repo-upgrade** — bootstrap or upgrade a project to an agentic scaffold with a compliance package | `setup-repo`, `upgrade-repo` | https://github.com/protokol11/repo-upgrade |
| **write-readme** — fix the README section set by project type, front-load the proof command, run link/heading/snippet checks | `write-readme` | https://github.com/protokol11/write-readme |
| **deep-research** — multi-agent web research swarm: reusable agents, disk scratchpad, skeptic pass, one cited report | `deep-research` | https://github.com/protokol11/deep-research |

### Standalone skills

| Skill | What it does |
|---|---|
| `implement` | Implement a piece of work based on a spec or set of tickets. |
| `write-skill` | Create a well-formed agent skill from a task or a pipeline doc. |
| `groom` | Drain the global inbox into the current project's queue. One question per line. |
| `hard-truth` | A bug or "not what I wanted" report comes in; diagnose feature depth and module boundaries before the visible symptom. |
| `conduct-tickets` | Orchestrate parallel implementation of multiple tickets through waves of file-isolated coder agents. Draft: expects `split-to-tickets` and `hygiene-check`, which are not published here — it will not run end to end without them. |
| `payload-compression` | Design dense tool, API, and MCP response payloads. Cut tokens while keeping meaning intact. |
| `dreyfus-router` | Choose novice, competent, proficient, or expert mode for a subagent based on task familiarity. |
| `autonomy-level` | Choose a human-involvement level for a risky or uncertain task. |
| `cost-tracer` | Measure token cost, latency, and tool calls for a task or trajectory. |

## Install

Prerequisites: None — skills are folders with `SKILL.md` files; no build step.

Copy the folders you want into `~/.agents/skills/` — or copy the whole repo.

```sh
cp -r drill drill-me ~/.agents/skills/
```

Expected result: the copied folders appear in `~/.agents/skills/` and the agent loads their `SKILL.md` on the next session.

Works with any agent that reads `SKILL.md` files. Under [pi](https://github.com/badlogic/pi-mono), invoke with `/skill:<name>`, e.g. `/skill:drill-me`.

## Contributing

These skills run daily in the author's own pipeline; most mature through use rather than through external tickets. Drafts (`drill`, `drill-me`, `live-loop` — mature in use, docs being tightened) are marked as such in their packages. File issues at https://github.com/protokol11/skills/issues. Each package repo carries its own checks; there is no bundle-level test suite.

## Credits

- **drill-me** ← grill-me × wayfinder (Matt Pocock, https://github.com/mattpocock/skills)
- **adhd** (https://github.com/uditakhourii) — referenced by `drill` and `drill-me` but **not included** in this bundle; install it separately if you want the "go deeper" ideation path.
- Everything else is original work.

## License

MIT — see [LICENSE](LICENSE).
