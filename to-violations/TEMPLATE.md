---
source:
  commits: "<start-sha>..<end-sha>"
  principle_file: ".agents/skills/to-violations/PRINCIPLES.md"
reviewer: "<agent role or name>"
status: "pending-fix"
---

# Violation Fix Spec — <theme>

## Summary

- Total violations: <n>
- Critical: <n>
- High: <n>
- Medium: <n>
- Low: <n>

## Violations

### V<nnn>: <precise violation name>

- **Location:** `file:line-range`
- **Severity:** critical / high / medium / low
- **Principle:** `<principle-id>` — <one-line principle text>
- **Current state:** <what the code does now>
- **Required state:** <what the code must do after the fix>
- **Files to change:**
  1. `path/to/file`
- **Files not to touch:**
  1. `path/to/file`
- **Acceptance criteria:**
  1. <criterion 1>
  2. <criterion 2>
- **Verification command:** `<exact shell command>`

## Global verification gate

Run these commands after all fixes:

1. `<command 1>`
2. `<command 2>`

## Out of scope

1. <item 1>
2. <item 2>

## Open questions

1. <question 1>
2. <question 2>
