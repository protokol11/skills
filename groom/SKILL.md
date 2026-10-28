---
name: groom
description: Drain ~/.agents/INBOX.md into the current project's PLAN.md. Use when the inbox has undecided lines, or on session start when it does.
disable-model-invocation: true
---

# Groom

Drain the global inbox into the current project's queue. One question per line. No line stays undecided.

## Scope

This skill decides:

- The section of each inbox line: `Now`, `Next`, `Backlog`, or `wontfix`.
- The anchor of each `Now` item: `code`, `doc`, or `human`.

This skill does not decide:

- The section of any line before the owner answers. No answer, no write.
- Anything outside the current project and its `PLAN.md`.
- Capture, reconcile, or dropping done items. Other tools own those.

The `Now` cap is 3. A fourth `Now` answer is refused and the item goes to `Next`.

## Ritual

1. Read `~/.agents/INBOX.md`. Stop and report when it is empty.
2. Read the current project's `PLAN.md`. Count items in `Now`.
3. Ask one question per line with the `ask` tool:

```json
{
  "question": "Where does this line go: <line text>?",
  "options": [
    { "label": "A. Now", "description": "Act now; needs an anchor" },
    { "label": "B. Next", "description": "Act after Now" },
    { "label": "C. Backlog", "description": "Park it" },
    { "label": "D. wontfix", "description": "Drop it" }
  ]
}
```

4. Wait for the answer. Never pick a section yourself.
5. Drop the line when the answer is `wontfix`.
6. Refuse a `Now` answer when `Now` already holds 3 items. Put the item in `Next` instead.
7. Ask a second question when the answer is `Now`:

```json
{
  "question": "Which anchor proves this item: <line text>?",
  "options": [
    { "label": "A. code", "description": "A file path, with an optional symbol" },
    { "label": "B. doc", "description": "A file path that must exist" },
    { "label": "C. human", "description": "A note the owner checks by hand" }
  ]
}
```

8. Wait for the answer. Ask for the anchor target as free text when missing.
9. Write the item into `PLAN.md` through the planmd machinery. Never edit the frontmatter by hand. Attach the anchor on the item as the planmd items contract defines.
10. Remove the line from `~/.agents/INBOX.md` after it lands in `PLAN.md` or is dropped.
11. Repeat until the inbox is empty. An owner deferral writes `wontfix` and ends the run.

## Verify

1. Run `/reconcile` in the project.
2. Check that every `Now` item shows `done` or `pending`, never `unverified`.

## Dry run

Seed `~/.agents/INBOX.md` with three lines. Run the ritual and answer the questions. Expect three entries in `PLAN.md`, an empty inbox, and no `unverified` `Now` items.

## Out of scope

- Running the ritual without owner answers.
- Editing the `capture` extension.
- Grooming several projects in one pass.
