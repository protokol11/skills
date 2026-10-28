# Triage Labels

Default canonical labels used in spec/issue frontmatter.

| Label | Meaning |
|---|---|
| `needs-triage` | Maintainer needs to evaluate. |
| `needs-info` | Waiting on reporter or context. |
| `ready-for-agent` | Fully specified; an agent can pick it up without human context. |
| `ready-for-human` | Needs human implementation or judgment. |
| `wontfix` | Will not be actioned. |

## Usage

Add labels to the frontmatter of every `.scratch/<feature-slug>/README.md` and `.docs/SPECS/<area>/*.md`.

```yaml
---
title: example
labels:
  - needs-triage
---
```

Only one active status label at a time.
