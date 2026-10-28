# ADR Format

ADRs live in `.docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, and so on.

Create `.docs/adr/` lazily, only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: the context, the decision, and the reason.}
```

An ADR can be a single paragraph. The value is in recording that a decision was made and why. Keep empty sections out.

## Optional sections

Include these only when they add value.

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`) when decisions get revisited.
- **Considered Options** when rejected alternatives are worth remembering.
- **Consequences** when downstream effects need a callout.

## Numbering

Scan `.docs/adr/` for the highest existing number. Increment by one.
