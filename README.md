# protokol11/skills

26 agent skills from a real, working engineering system — for anyone running AI coding agents daily.

## Credits

- **drill-me** ← grill-me × wayfinder (Matt Pocock, https://github.com/mattpocock/skills)
- **adhd** (https://github.com/uditakhourii) — referenced by `drill` and `drill-me` but **not included** in this bundle; install it separately if you want the "go deeper" ideation path.
- Everything else is original work.

## What you get

Skills are grouped into packages. Copy one package or the whole repo.

| Package | Skills | Repo |
|---|---|---|
| **drill** — Socratic decision protocols (one hard question at a time, mandatory critique, typed question-graph) | `drill`, `drill-me` | https://github.com/protokol11/drill |
| **live-loop** — agent-runnable live-test runners for desktop/hybrid apps (spawn, capture, watch markers, inject faults, tree-kill) | `live-loop`, `monster-longrun` | not published yet (TODO) |
| **handoffs** — state-transfer documents: create one, resume from one | `hands-on`, `hands-off` | not published yet (TODO) |
| **not-messy.docs** — turn conversations into specs, ADRs, and a domain glossary; keep docs current after implementation | `to-spec`, `to-adr`, `to-context`, `update-docs` | not published yet (TODO) |
| **principles** — extract principles from research, lint/rewrite artifacts against them, render compliance artifacts | `to-principles`, `principled-write`, `principles-render` | not published yet (TODO) |
| **violence-fix** — find principle violations, slice-fix them through subagents, re-check claimed fixes for new violations | `to-violations`, `violent`, `violent-subagent` | not published yet (TODO) |
| **repo-upgrade** — bootstrap or upgrade a project to an agentic scaffold with a compliance package | `setup-repo`, `upgrade-repo` | not published yet (TODO) |

### Standalone skills

| Skill | What it does |
|---|---|
| `implement` | Implement a piece of work based on a spec or set of tickets. |
| `write-skill` | Create a well-formed agent skill from a task or a pipeline doc. |
| `groom` | Drain the global inbox into the current project's queue. One question per line. |
| `conduct-tickets` | Orchestrate parallel implementation of multiple tickets through waves of file-isolated coder agents. |
| `payload-compression` | Design dense tool, API, and MCP response payloads. Cut tokens while keeping meaning intact. |
| `dreyfus-router` | Choose novice, competent, proficient, or expert mode for a subagent based on task familiarity. |
| `autonomy-level` | Choose a human-involvement level for a risky or uncertain task. |
| `cost-tracer` | Measure token cost, latency, and tool calls for a task or trajectory. |

## Install

Copy the folders you want into `~/.agents/skills/` — or copy the whole repo.

```sh
cp -r drill drill-me ~/.agents/skills/
```

Works with any agent that reads `SKILL.md` files. Under [pi](https://github.com/badlogic/pi-mono), invoke with `/skill:<name>`, e.g. `/skill:drill-me`.

## Honest status

**Status: working.** These skills run daily in the author's system. Caveats:

- `drill`, `drill-me`, `live-loop` — **draft**: mature in use, docs still being tightened.
- `conduct-tickets` — **draft**: it orchestrates tickets produced by `split-to-tickets` and checked by `hygiene-check`, which are not published and not included here. The skill won't run end to end without them.
- Packages other than `drill` have no standalone repo yet — links above are TODO markers.

## Contents

- [Credits](#credits)
- [What you get](#what-you-get)
- [Standalone skills](#standalone-skills)
- [Install](#install)
- [Honest status](#honest-status)
- [License](#license)

## License

MIT — see [LICENSE](LICENSE).
