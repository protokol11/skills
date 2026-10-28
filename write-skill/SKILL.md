---
name: write-skill
description: Create a well-formed agent skill from a task or a pipeline doc.
disable-model-invocation: true
---

# write-skill

Turn a task into a skill. The skill you write is self-contained and follows the standards in REFERENCE.md.

## Done

The skill is done when:

1. A web search checked for an existing skill.
2. The pipeline comes from a doc the user gave or from the user's answers.
3. SKILL.md follows the output structure below.
4. The checks in REFERENCE.md pass.

## Phases

1. Find. Search the web for an existing skill. Run `npx skills find <query>` or read the skills.sh leaderboard. Check installs and source before you recommend. Done when you state what exists or that nothing exists.
2. Gather. Take the pipeline from a doc the user gives. If none, ask what the skill does. Done when you can name the goal and the steps.
3. Write. Build the skill folder. Use the output structure below. Done when every file is written.
4. Verify. Check the skill against the standards in REFERENCE.md. Fix every violation. Done when the checks pass.

## Output structure

```
skill-name/
├── SKILL.md        # required, under 100 lines
├── REFERENCE.md    # formats and details, when SKILL.md would exceed 100 lines
├── EXAMPLES.md     # optional, when an example earns its load
└── scripts/        # optional, for a deterministic operation only
```

## Core rules

1. Pick the invocation first. User-invoked for a skill you fire by hand. Model-invoked when the agent or another skill must reach it.
2. Front-load the leading word in the description. One trigger per branch. Cut identity the body already carries.
3. Give every step a completion criterion. Make it checkable and exhaustive.
4. Keep each meaning in one place. Reference, do not repeat.
5. Phrase the positive. State the target behaviour, not the banned one.
6. Reach for a pretrained leading word before coining one. See VOCABULARY.md.

## Reference

Standards and checks: see [REFERENCE.md](REFERENCE.md).
Deep-rooted terms: see [VOCABULARY.md](VOCABULARY.md).
