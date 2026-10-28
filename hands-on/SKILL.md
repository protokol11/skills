---
name: hands-on
description: Resume an implementation session from a handoff document. Use for resume from handoff, continue from handoff.
disable-model-invocation: true
---

# Handoff continuation

Resume work from a handoff document.

## When to use

Use when the user resumes work from a handoff, or a new session starts from one.

## Contract

- Input: a handoff path, or the newest `.docs/handoff/*.md`.
- Output: the confirmed next action, then the work.
- Gate: the user approves the next action before the first code change.

## Process

1. Pick the handoff. Use the given path, else the newest `.docs/handoff/*.md` by modification time. Done when you choose one path.
2. Read the handoff fully. Done when you read every section.
3. Read `.docs/CURRENT_STATUS.md` and `.docs/PLAN.md`. Done when you read both, or you report their absence.
4. Read every file under the handoff's `Related files` section. Done when each file exists, or you report the missing ones.
5. Compare `git status` with the handoff. Treat the handoff file and its status file as expected. Report any other difference. Done when the tree matches, or you report the difference.
6. State the next action and ask for approval. Done when the user confirms or corrects it.

## Rules

- Ask for approval before the first code change.
- Report a handoff and git mismatch before continuing.
- Re-read the SPEC or ADR before changing architecture.
- Run the handoff's verification commands before reporting the work.
- A handoff older than 7 days needs a fresh read of `.docs/CURRENT_STATUS.md` and key SPECs.

## Related skill

- The `hands-off` skill creates the handoff this skill consumes.
