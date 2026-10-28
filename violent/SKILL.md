---
name: violent
description: Re-check a claimed fix for newly introduced principle violations. Use after a fixer subagent closes a violation fix-spec.
disable-model-invocation: true
---

# violent

Re-check a claimed fix. A fixer can close acceptance criteria and still add new principle violations. This skill finds them.

## When to use

Use when a fixer subagent claims the fix is complete and closes a violation fix-spec. The user invokes this skill by hand. Do not run it after every fix.

## Inputs

The caller gives three inputs:

1. The target fix-spec path. This spec is the baseline.
2. The changed files list from `git status` or `git diff`.
3. The verification output from the fix.

## Procedure

1. Read the target fix-spec.
2. Read the changed files.
3. Find direct dependents. A dependent is a file that imports a changed file.
4. Read each dependent only for a broken contract. A changed signature or export breaks the contract.
5. Run the verification command from the fix-spec.
6. Compare the files against the principle catalog at `~/.agents/skills/to-violations/PRINCIPLES.md`.
7. Keep only violations missing from the target fix-spec. These are the new violations.
8. Rank the new violations by severity.
9. Write the report.

## Output

A Markdown report. List only new violations. Each violation includes:

- location: file and line range
- severity
- principle id
- evidence: a quoted line or diff hunk

## Rules

1. Report. Do not fix.
2. Do not write or update a fix-spec. The `to-violations` skill does that.
3. Cite line references as evidence.
4. Do not self-certify. The report is input to human judgment.

## Pitfalls

- Alias or dynamic imports evade the dependent scan.
- Do not re-check a dependent for its own old issues. Check only the contract.
- Do not re-check the whole repo. This blurs into a full review.
