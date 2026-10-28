---
name: to-violations
description: Produce a structured fix spec from a principle-violation review.
---

## When to use

Use this skill when:

1. A code review finds principle violations.
2. The user asks to convert violations into a fixable spec.
3. A fixer agent needs a scoped, testable task list.

## Inputs

1. Commit range or file list under review.
2. Path to `.agents/skills/to-violations/PRINCIPLES.md`.
3. The violations found by the reviewer.

## Procedure

1. Read `PRINCIPLES.md` and note principle IDs, severities, and texts.
2. For each violation, fill one entry in the spec.
3. Rank severity by risk to correctness and maintainability.
4. State exact file and line range for every violation.
5. List files to change and files not to touch.
6. Write numbered acceptance criteria for every violation.
7. Provide one verification command per violation.
8. Add a global verification gate.
9. Add an out-of-scope section.
10. Add open questions if the fixer must decide something.

## Output format

Use `.agents/skills/to-violations/TEMPLATE.md`.
Write the output to `.docs/violations/<theme>.md`.

## Rules

1. Reference principle IDs from `PRINCIPLES.md`.
2. Use active voice.
3. Keep instructions and criteria under 20 words.
4. Do not use marketing adjectives or banned synonyms.
5. Do not use semicolons or contractions in prose.
6. Do not self-certify correctness or readiness.
7. Preserve scope. Do not add unrelated fixes.
8. Use file paths and line ranges as concrete evidence.

## Verification

Before finishing:

1. Confirm the file follows `TEMPLATE.md` structure.
2. Confirm every principle ID exists in `PRINCIPLES.md`.
3. Confirm every acceptance criterion is testable.
4. Confirm prose follows the voice rules in this skill.
