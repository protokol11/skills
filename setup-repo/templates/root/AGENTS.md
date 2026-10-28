# {{PROJECT_NAME}} — Session Rules

These rules govern every session in this project. If a generic runtime reminder ("auto mode", "make your best judgment", or similar) conflicts with a rule below, follow the rule below and state the conflict explicitly before proceeding.

## Session mode triggers

The user separates discussion and implementation sessions. Detect the mode from explicit triggers:

- **Implementation mode triggers** — proceed after declaring scope:
  "implement", "implementation", "build it", "do it", "do it now".
- **Discussion/planning mode triggers** — declare scope and stop for confirmation, or declare the chosen path:
  "discuss", "drill", "plan", "scope", "handoff" without an implement trigger, "continue the discussion".

If the mode is unclear, declare the inferred mode and scope before acting. The `scope_lock` and `judgement` extensions back the gate.

## Communication

- Reply in Russian, simply and briefly. Short sentences. Put the example or analogy first. Define a new term in one line.
- Skip articles and long prose. For a complex topic, state the core in 2-4 lines first. Add detail only on request.
- When the user says they do not understand, re-explain minimally with one concrete example. Then ask again.

## Language

- All documents are English: `AGENTS.md`, `.docs/`, skills, specs, statuses, handoffs.
- The author's words stay verbatim in their original language, set as a quote: `> «...»`. Mark the block "Author's words are verbatim".
- Chat replies are Russian. See Communication.

## Mandatory scope lock

Before writing or modifying code, state:

1. What will be done.
2. What will not be touched.
3. How success will be checked.

Then proceed only if the user has given an explicit implement trigger or confirmed the scope. If neither is available in the current turn, state the scope and the chosen path explicitly instead of silently implementing.

## Conflict resolution

If any runtime reminder conflicts with this file or the user's explicit request:

1. Follow the user's explicit request.
2. If unclear, state the conflict and stop.
3. Never use "make your best judgment" as a reason to override this file.

## No "later", no "MVP"

"Later" never happens. A decision is never deferred to "later", "MVP", or "the first version". Decide now, with a full logical design that extends the original idea, or converge the raw idea in a drill (`drill-me` / `adhd`) before building. A throwaway prototype is fine as a feasibility check. Shipping a prototype with no explicit path to the full version is a violation. A scope cut is allowed only for a genuinely independent increment that carries no design debt.

## Session naming

After creating a handoff, and at the start of a session resumed from one, name the session with `name_session` (verb-led kebab slug of the current topic). Re-name when the topic shifts mid-session.

## Context discipline

The session working zone is up to ~70% of the context window. Model quality degrades well before the hard limit. Cross the threshold and the session is **transferred, not compacted**: the agent writes a durable handoff (`hands-off`) and a session status (`update-docs`), then the session rotates in place into a child seeded from the handoff (the `session-transfer` extension where installed; otherwise the agent does it by hand: checkpoint, handoff, status, then offer the move). Transfer triggers are an explicit `/transfer` or a deterministic gate (70% of the window or more AND idle 30 min or more). Long mechanical loops (runs, batches) checkpoint every N steps, at least once per turn. Do not wait for the user to say stop.

## Code comments

A comment explains what the code cannot show: incident history, a contract, a non-obvious trap. Names and structure state what the code does. A line with no such why stays uncommented.

## Docs are part of the deliverable

A session ends when the docs say what changed, not when the code works.

- **Before ending any session, and before writing any handoff, run `update-docs`:** write the status file to `.docs/sessions/<YYYY-MM-DD>/statuses/<YYYY-MM-DD>_<PROJECT>_<topic>.md` (template `.docs/sessions/STATUS_TEMPLATE.md`, rules per the project's session-status convention) and update `.docs/CURRENT_STATUS.md` (short, links only).
- A handoff without a recorded status is an incomplete handoff. Cross-link both ways: status → `resumed from <handoff>`, handoff → `status recorded: <link>`.
- Skipping this rule because "the session was small" or "docs later" is a violation. A session that changed nothing writes nothing. A session that changed code or docs writes a status.

## Subagent-first pipeline (default for implementation)

Owner directive: implementation work defaults to a subagent conveyor, not to in-session editing. The orchestrator plans, verifies with trusted commands, and writes docs; subagents write the code.

- **Coder subagent** on a small model (`deepseek/deepseek-flash:low`): gets a self-contained brief — context paths, hypotheses or AC, constraints (no behavior change / no commits / no new deps), and the verification protocol. It reproduces a baseline BEFORE changing anything (PS-FIXER-02).
- **Orchestrator verifies** every claim with its own tool runs (tests, typecheck, build, live runs) before believing the report (VERIFY-BEFORE-RETURN). Read the full diff.
- **Reviewer subagent**: adversarial AC review with line-level evidence; paste pre-image hunks if the reviewer has no shell. A "merge OK" still lists P2 findings.
- **Fixer subagent** closes the reviewer's actionable findings. Deviations from the brief are allowed when reasoned — the orchestrator re-reads the deviated code before accepting it.
- **Temporary probes must be reverted** and the tree proven pristine (`git status` empty) before shipping; only the verdict record ships.
- Every increment ends with: commit in the target repo, verdict record in `NOTES.md` when one exists there, session status via `update-docs`.

## Agent skills

Before executing a task that matches a skill, read that skill's `SKILL.md` end to end first. Do not run a skill from its name, description, or memory alone. The skill body carries the current procedure, gates, and failure modes.

- `drill-me` — structured planning drill with critical thinking.
- `to-context` — update `CONTEXT.md` and ADRs as terms and decisions crystallize.
- `hands-off` — create structured handoff documents.
- `update-docs` — update documentation after implementation.
- `code-review` — review changes against standards and spec.
- `to-spec` — write a specifications (spec) document after planned decisions or a drill session.

See `.agents/skills/` for the full skill catalog.

## Session state

- Implementation sessions keep the todo board: `todo_write` the task at start (or when it changes), `start` the active task, close tasks as they land. The board is the machine-readable "what is being done now" — context-memory reminders and delta gates read it; a session without an active task forfeits both.

## Triage labels

Default canonical labels used in spec and issue frontmatter:

- `needs-triage`
- `needs-info`
- `ready-for-agent`
- `ready-for-human`
- `wontfix`

## Domain docs

- Single-context layout: `CONTEXT.md` at repo root and `.docs/adr/` for decisions.
- SPECs live in `.docs/SPECS/<area>/`.
- Issues live as markdown files in `.scratch/<feature-slug>/`.
- Detailed session reports live in `.docs/sessions/<YYYY-MM-DD>/statuses/<YYYY-MM-DD>_<PROJECT>_<topic>.md`. `CURRENT_STATUS.md` holds only the latest summary and links.

## Compliance

Mechanical checks live in `.docs/violations/lint-rules.md`. The audit trail lives in `.docs/violations/audit-log.md`. The principle catalog is the source, not a stamped card.

## Core principles

The full catalog is `~/.agents/skills/to-violations/PRINCIPLES.md`. These thirteen are the strongest for every session. A reviewer cites the `id` in a violation report.

1. **HALT — Read before write.** Wait for confirmed scope or an explicit GO before any side-effect tool.
2. **VERIFY-BEFORE-RETURN — Verify claims before done.** Check every factual claim against trusted tool output or explicit human confirmation.
3. **HUMAN-JUDGMENT-FINAL — Agent does not self-certify.** Do not claim the output is compliant, correct, or ready.
4. **RTL-04 — Every phase transition is a gate.** A gate returns pass, fail, or abstain. The pipeline stops on fail.
5. **RTL-08 — Trusted tool computes, verification gate decides.** Accept factual results only from trusted tools with explicit verification.
6. **RTL-09 — Every step leaves a trace.** Record trace IDs and structured logs. Replay and root-cause analysis need them.
7. **FOG-OF-WAR — Treat diagnosis as hypothesis.** List competing hypotheses before the fix.
8. **PS-FIXER-02 — Reproduce before fixing.** A failure you cannot reproduce makes every fix a guess.
9. **RSI-08 — Rejection criterion before output.** Declare the criterion that rejects the result before producing it. No post-hoc criteria.
10. **RSI-42 — Held-out split invisible to the proposer.** Evaluation and scoring data stays hidden from the agent under test.
11. **CS-12 — Kill switch outside the agent.** A kill switch lives at the infrastructure layer, outside the agent's process tree.
12. **CS-30 — Pass oracle lives at the runtime, not the model.** The oracle is a runtime refusal of the disallowed call.
13. **CP-22 — Make invalid states unrepresentable.** Design types so invalid states do not compile. Unrepresentable beats checked.
