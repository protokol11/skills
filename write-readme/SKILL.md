---
name: write-readme
description: Write or audit a project README. Fixes the section set by project type, front-loads the one-line description and the proof command, then runs the link, heading and snippet checks. Use when asked to write, rewrite, tighten or audit a README, or when a repo has none.
disable-model-invocation: true
---

# write-readme

Write the README that lets a developer start and reproduce one result without reading further.

Rules, section table and check commands: [REFERENCE.md](REFERENCE.md).
Source for each rule and the open gaps: [EVIDENCE.md](EVIDENCE.md).

## Done

1. The section set matches the project type.
2. The proof command runs as written from the first screenful.
3. Every runnable check in REFERENCE.md ran, and the reply names any check that did not.

## Steps

1. **Intake.** Read the manifest, entry points, `bin` field and workspace config. Write down five answers: project type (library, app, CLI, monorepo, documentation repo), audience (user or developer), one sentence on what the project does, the package `description`, the one command that proves it works. Run that command in a clean checkout. Done when five answers are written and the command has produced output.
2. **Pick the section set.** Apply the section table in REFERENCE.md. Mark every section required, optional or skipped, with the reason beside it. Done when the list covers every row of the table.
3. **Write the one-line description.** One line, no heading, under 120 characters, no leading `> `. Match the package `description` and the GitHub repository description word for word. Done when all three strings are identical.
4. **Write the opening.** Sentence one states what it is. Sentence two states why it matters. Then scope and non-scope. Done when a reader who stops after this paragraph knows what the project is, who it serves, and what it leaves out.
5. **Write Install.** Prerequisites first, as its own section, with the literal word None when there are none. Then the exact command. Then the expected output. Done when every prerequisite is named and no step assumes an unstated tool.
6. **Write Usage as one path to one worked result.** Show the real output of each step. Keep the tutorial free of option branches. Done when the result reproduces in a clean environment using only README text.
7. **Document the rest of the surface.** A CLI section when the binary takes subcommands. A configuration table when settings exist. An entry-point example per public API. Troubleshooting ordered symptom, cause, fix. Done when every public surface named in the manifest has one runnable example.
8. **Close with Contributing, then License last.** Contributing names the test command and where to file an issue. License names the license and links the LICENSE file. Done when both sections exist and License is the final section.
9. **Add visuals and badges last.** Alt text decided at insertion. Badges report live state, not a technology list. Done when every image carries alt text and every badge URL resolves to a live status.
10. **Run the checks.** Execute every runnable row of the check table in REFERENCE.md. Fix failures. Done when each row has a recorded result, pass or fail, and the failures are fixed or reported.

## The two sentences that carry the README

- **One line, under 120 characters.** It is mirrored into the package manifest and the repository description. Three copies of one string.
- **One command, above the fold.** It is the reason the reader stays.

## Voice

Concrete over promotional. First sentence carries the point. Headings carry keywords. Front-load the first words of every bullet.

Measured, with its limit: objective wording beat promotional wording by 27% on usability in a 1997 test of websites. Concise beat long by 58%. Scannable beat dense by 47%. All three together beat the control by 124%. Those are 1990s web pages, not READMEs, and the numbers stay attached to that date when quoted.

## Report

Close with what shipped and what could not be checked. Name the failed or skipped check. Leave the judgement of readiness to the human.
