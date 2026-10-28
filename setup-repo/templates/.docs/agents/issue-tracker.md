# Issue Tracker

This project uses a local markdown issue tracker.

## Layout

Issues live as folders under `.scratch/<feature-slug>/`.

Each issue folder contains:

- `README.md` — problem statement, goal, acceptance criteria.
- Optional `plan.md`, `audit.md`, `report.json` as the issue progresses.

## Labels

Use the triage labels from `.docs/agents/triage-labels.md` in issue frontmatter:

```yaml
---
title: feature name
labels:
  - needs-triage
---
```

## Workflow

1. Create `.scratch/<feature-slug>/README.md` with `needs-triage`.
2. Move through labels as the issue becomes ready for agent or human.
3. Archive done issues to `.archive/.scratch/` or mark as `done` in frontmatter.
