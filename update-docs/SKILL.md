---
name: update-docs
description: Update target project documentation after implementation or status change. Write the detailed session status to `.docs/sessions/<YYYY-MM-DD>/statuses/<summary>.md`. Keep `CURRENT_STATUS.md` short. Update PRDs and README. Move implemented PRDs to `PRDs/DONE`.
---

# update-docs

Update project docs to reflect what changed and its current status.

## When to use

Run this after implementing a feature, changing a PRD status, or when the user explicitly asks to update documentation. Typical signals: "update docs", "update CURRENT_STATUS", "update PRD index", "README in a subdirectory".

## Session status structure

Detailed session reports go into `.docs/sessions/<YYYY-MM-DD>/statuses/`. `CURRENT_STATUS.md` stays
short and links them. The rules and the size gate live in the target project's
`.docs/SPECS/principles-compliance-system/session-status-convention.md`.

A status file records what you did this session. A handoff plans what to do next. Keep them separate and cross-link: status → `resumed from <handoff>`, handoff → `status recorded: <link>`.

## Naming convention

`.docs/sessions/<YYYY-MM-DD>/statuses/<YYYY-MM-DD>_<PROJECT>_<2-3words-lower>.md`

`<PROJECT>` is an optional short code for multi-project repos that tracks which domain the work
touched. Example set (Agentic-Engineering): `ORCH` (orchestrator/Ralph/conductor), `PRIPL`
(software-dev principles), `SKILLS` (skills), `DRILL` (drill). Single-project repos may omit it.

Examples:
- `.docs/sessions/2026-08-23/statuses/2026-08-23_ORCH_minecraft_m2_tails_bugfix.md`
- `.docs/sessions/2026-07-29/statuses/2026-07-29_1600_video_tester.md` (legacy, no prefix)

Use 2-3 lowercase words that describe what the session did. Do not use generic names like
`update.md` or `fix.md`. Copy the canonical template from the project's
`.docs/sessions/STATUS_TEMPLATE.md`. For the full rules see
`.docs/SPECS/session-status-convention.md`.

## What to do

1. **Identify what changed.**
   - If the user gives PRD/ticket/paths, read them.
   - Otherwise inspect `git status`, recent commits, and `.docs/CURRENT_STATUS.md`.
   - Done when the changed files are listed.
2. **Write the detailed session status.**
   - Create `.docs/sessions/<YYYY-MM-DD>/statuses/<YYYY-MM-DD>_<PROJECT>_<topic>.md`.
   - Open with frontmatter: `date`, `stream` (`ORCH | PRIPL | SKILLS | LAB | DRILL`), `summary` (one line), `next` (one line). The indexes are generated from these four fields.
   - Include: what changed, files touched, verification commands, results, commit hash if known, and next step.
   - Link related handoff files if any.
   - Done when the file exists with every template section filled.
3. **Regenerate the indexes.** Run `node ~/.agents/skills/update-docs/scripts/docs-index.mjs --write`, then `--check`.
   - `CURRENT_STATUS.md` is generated whole. Edit `.docs/status.json` for `blockers`, `questions` and `source_of_truth`. `Latest` and `Next` come from status frontmatter.
   - `SPECS/README.md` keeps its headings and prose. Every table row comes from spec frontmatter.
   - Done when `--check` exits 0.
4. **Update the PRD and SPEC indexes.**
   - PRDs: update `.docs/PRDs/README.md`. Move PRDs with status `implemented`, `done`, or `closed` to the "Implemented PRDs" table. Update in-progress PRDs. Add new PRDs.
   - SPECs: `docs-index.mjs` already rebuilt the status tables. Set the `status` in the spec frontmatter and rerun `--write`.
   - Done when every row matches the `status` in its spec frontmatter.
5. **Update the README in the relevant PRD subdirectory.**
   - If `README.md` exists in the PRD folder, update its PRD index table and status.
   - If it does not exist and the folder has multiple PRDs or active work, create a minimal README. Add a PRD index table.
   - Done when every link in that README resolves.
6. **Move implemented PRDs to `.docs/PRDs/DONE/`.**
   - When a PRD status becomes `implemented`, `done`, or `closed`, move it to the matching subdirectory under `.docs/PRDs/DONE/`.
   - Preserve relative folder structure (e.g. `.docs/PRDs/login-flow/foo.md` → `.docs/PRDs/DONE/login-flow/foo.md`).
   - Update every README link that referenced the old location.
   - Done when no file under `.docs/` names the old path.
7. **Commit the paths this pass wrote.** Stage the status file, the handoff and any index rows regenerated here. Use an English message like `docs: update CURRENT_STATUS and PRD indexes for <feature>`. `git add -A` waits for an explicit owner command. Done when `git status` shows none of those paths.

## Important: when to update README and when to move to DONE

- **Update README** whenever a PRD status changes or you implement something concrete. Do this even if the PRD is not complete.
- **Move to DONE** only when the PRD status is `implemented`, `done`, or `closed`. Do not move PRDs that are merely `in-progress`, `ready-for-agent`, or `draft`.
- After moving, keep the README entry but change the link to point to `./DONE/<path>`.

## Rules

- When writing or renaming PLAN.md item titles, follow [`NAMING.md`](NAMING.md) — a short task name in plain language, no log/status/code/paths. Never touch the trailing `<!-- id: slug -->` (dates are keyed to it).
- Update docs only after you run the verification commands.
- Do not invent verification results.
- Keep `CURRENT_STATUS.md` entries concrete but brief: files, lines, commands, outcomes, and a link to the full status.
- When moving a PRD to DONE, update all README links that referenced the old path.
- If you have not implemented a PRD, do not move it to DONE.
- Do not run live sessions on the target platform unless the user explicitly approves.
- Do not let `CURRENT_STATUS.md` exceed 1000 tokens. If it does, move older sections to `.docs/sessions/<date>/statuses/`.

## Signals

Three checks tell you the pass went wrong. Run them before you report.

- `git status` still lists a path this pass wrote → the commit step was skipped.
- An index link points at a missing file → a move or rename missed a README.
- `CURRENT_STATUS.md` prints more than 800 words → old bullets were appended instead of linked.

## Pipeline note

This skill is typically called after `conduct-tickets` completes a wave or after a standalone implementation session. It pairs with `hands-off` when the session ends with a handoff rather than a clean completion.
