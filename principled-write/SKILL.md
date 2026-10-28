---
name: principled-write
description: "Check and rewrite agent-facing instructions, project memory, PRDs, specs, skills, and handoffs. Make them comply with the principle catalog and project voice rules. Three output modes: lint (report), rewrite (apply), diff (annotated). Never self-certify."
disable-model-invocation: true
---

# principled-write

Check and rewrite a markdown artifact against the principle catalog and the project voice rules. The result must read as a finished artifact, not a commented draft.

## When to use

Use when:
- The user asks to rewrite a doc, PRD, spec, handoff, agent instruction, skill, or project-memory file according to principles.
- Another agent produced the document. It may violate the principle catalog or voice rules.
- The user asks to check a document without rewriting it (lint mode).

## Inputs

- `path`: path to the file to check or rewrite, or raw text if the file does not exist yet.
- `artifact-type`: one of: `agent-instruction`, `handoff`, `spec`, `PRD`, `skill`, `project-memory`, `ADR`, `session-status`, `README`.
- `output-mode`: `lint`, `rewrite`, or `diff` (default `rewrite`).

## Output modes

### lint

Run the embedded STE linter on the file. Return the score and the violations verbatim. Do not rewrite. Do not claim principle-catalog compliance. That needs human judgment.

```
python scripts/ste-lint.py <path>
```

### rewrite

1. Read the source file.
2. Read `principle-catalog.md` and `VOICE.md` from the project. If they do not exist, read `$USER_HOME/pi-orchestrator/.docs/agents/principle-catalog.md` and `$USER_HOME/pi-orchestrator/.pi/agents/VOICE.md` (an example local orchestrator checkout).
3. Select the principles that apply to `artifact-type` from the catalog.
4. Rewrite the artifact so it complies with those principles and with `VOICE.md`.
5. Apply the STE rules in `references/ste-writing-skill.md` to the prose.
6. Run `python scripts/ste-lint.py` on the output. Fix any violations.
7. Return the rewritten artifact.

### diff

Produce a side-by-side diff with principle annotations. Return the structure below.

## Rules

1. **No meta-notes.** Do not add notes like "This file was rewritten to apply...", "Principled rewrite note", or "Changes made:". Process metadata is not part of the artifact.
2. **No self-certification.** Do not claim the output is compliant, correct, or ready. Let reviewers or verification tools decide.
3. **Preserve scope and spec**: do not add, remove, or soften requirements, acceptance criteria, labels, or domain terms. Do this only if the user asked for it. If you must remove something, leave a `TODO` or ask.
4. **Apply principles silently.** The reader should see the effect, not a lecture. If `output-mode=diff`, put principle IDs and explanations in annotations, not in the body.
5. **Follow `VOICE.md` mechanically.**
   - Active voice.
   - One name for one thing.
   - No banned synonyms.
   - No marketing adjectives.
   - Sentences ≤20 words.
   - No semicolons or contractions.
   - Use numbered lists for steps.
   - Put the condition before the command.
6. **Pull complexity downward.** Keep the artifact surface simple. Move implementation details, long examples, and edge-case tables into subsections or appendices.
7. **Keep the original structure** unless it conflicts with the principles. Do not reorganize a PRD into a blog post just to make it shorter.
8. **Preserve contract-level detail**. Keep code blocks, function signatures, type definitions, probability tables, exact values, thresholds, and configuration schemas. They form the spec contract. Do not remove or replace them with vague descriptions. Pull complexity downward only for internal details: imports, helper internals, RNG seeding, exact error messages, or verbose examples.
9. **Apply mechanical lint everywhere**: apply the 20-word limit, no-semicolon rule, and banned-synonym rule to prose in lists, tables, and callouts. Apply them to body paragraphs too. Code and data notation are exempt.
10. **Keep specific facts and references**: do not replace concrete file paths, function names, thresholds, probabilities, or rationale with vague placeholders. If you cannot verify a fact, keep the original wording and flag it.
11. **If a principle conflicts with the original intent**, stop and ask. Do not silently weaken the spec to satisfy a principle.

## Output format

### `output-mode: rewrite`

Return only the rewritten markdown file. No surrounding commentary. No code fences around the whole file.

### `output-mode: diff`

Return a markdown document with this structure:

```markdown
# Rewritten: <filename>

## Summary
- Artifact type: <artifact-type>
- Principles applied: <list of IDs>
- Lint result: <pass / issues>

## Side-by-side diff

### <section name>
**Original:**
<original text>

**Rewritten:**
<rewritten text>

**Annotation** (<principle ID>): <one-line reason>

## Full rewritten text
<full rewritten markdown>
```

### `output-mode: lint`

Return the raw output of:

```
python scripts/ste-lint.py <path>
```

For the per-category breakdown, pipe the file:

```
python scripts/ste-lint.py < <path>
```

Do not interpret the numbers. Do not claim pass or fail.

## Self-containment

This skill bundles its own linter and STE rules:

- `scripts/ste-lint.py`: the STE linter. This is the canonical copy for the skill.
- `references/ste-writing-skill.md`: the STE writing rules.

The upstream origin is an example episode folder (`$USER_HOME/.agents/ep01-the-cure-for-ai-slop`). If the origin updates, re-copy these two files into the skill by hand.

## Verification

Before returning:
- [ ] No meta-notes or self-certifying language.
- [ ] No sentences over 20 words.
- [ ] No banned synonyms or marketing adjectives.
- [ ] No semicolons or contractions.
- [ ] Scope and acceptance criteria preserved.
- [ ] Principle IDs mapped correctly to the artifact type.
- [ ] `scripts/ste-lint.py` passes, or you report the remaining issues honestly.
