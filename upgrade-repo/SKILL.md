---
name: upgrade-repo
description: Audit an existing project and upgrade it to the setup-repo agentic scaffold plus compliance package. Runs dry-run by default. Applies only after explicit GO confirmation.
disable-model-invocation: true
---

# upgrade-repo

Upgrade an existing project to the setup-repo agentic scaffold and compliance package.

## When to use

- Existing project lacks `CLAUDE.md`, `CONTEXT.md`, `AGENTS.md`, `.pi/`, `.docs/PLAN.md`, `.docs/CURRENT_STATUS.md`, `.docs/violations/`, or `.docs/sessions/`.
- Project has grown organically and needs a predictable agentic workflow.
- Before handing a legacy project to `explore`/`plan`/`coder`/`tester`/`fixer` subagents.
- A catalog version bump requires re-stamping the compliance package.

## Steps

1. **Explore+audit**: read the project and report scaffold, compliance, and structure gaps.
   - Output: `AUDIT.md` with a gap list against setup-repo acceptance criteria.
   - Gaps: missing files, outdated sessions path, missing violations folder, missing role prompts, missing verification commands, non-canonical `.docs/PLAN.md`.

2. **Drill**: ask the user one question at a time about project purpose, stack, and the meaning of existing files.
   - Capture resolved terms as pointers in `CONTEXT.md`.
   - Completion: you resolve unclear terms and document them.

3. **Render**: call the renderer for the compliance package.
   - Command: `node ~/.agents/skills/principles-render/render.mjs --out <tmp-render-dir>`.
   - Completion: temp directory contains `role-prompts/*.md`, `lint-rules.md`, `spec-template.md`.

4. **Plan**: write `upgrade-plan.md`.
   - Include: files to create, files to merge, files to skip.
   - Classify every change as low, medium, or high risk.
   - State why for each item.
   - High-risk changes stop for user confirmation.
   - Irreversible changes require a design-first ADR.

5. **Apply**: only after explicit user confirmation (GO).
   - Create a backup: git commit `chore: pre-upgrade snapshot`.
   - If no git, copy the project to `.archive/upgrade-<timestamp>/`.
   - Run `setup-repo/scripts/scaffold.ps1 -ProjectPath <path> -OnlyMissing -SkipGit` to create missing files.
   - Regenerate `AGENTS.md` and `CLAUDE.md` fully by merging the current `setup-repo` templates with project facts.
   - Keep the compliance pointer in `AGENTS.md` (`## Compliance`). Do not stamp a must-card; the principle catalog is the source.
   - Re-sync the standard header blocks from `setup-repo` templates so template updates propagate:
     - `AGENTS.md`: replace the `# <name> — Session Rules` title and the conflict-preamble paragraph with the current `templates/root/AGENTS.md` versions (substitute `{{PROJECT_NAME}}`).
     - `AGENTS.md`: re-sync these sections verbatim from `templates/root/AGENTS.md` when the project predates them (project-specific content inside them is preserved by the project, not by the template): `## Context discipline`, `## Subagent-first pipeline (default for implementation)`, `## Session state`. Skip sections the project deliberately dropped.
   - `AGENTS.md`: re-sync the `## Core principles` section verbatim from `templates/root/AGENTS.md` (catalog top-10; bump the section with the catalog, not by hand).
     - `CLAUDE.md`: list the compliance links under `## Related`; do not repeat the catalog.
   - Do not silently overwrite existing project-specific content.
   - If `.docs/PLAN.md` exists but is non-canonical, migrate its sections to Now/Next/Backlog/Done (stop for user confirmation; never delete content).
   - Stamp `.docs/violations/lint-rules.md` and `.docs/violations/audit-log.md`.
   - Move existing `sessions/` root folder to `.docs/sessions/` if present.

6. **Verify**: run the verification commands from the plan/spec.
   - Check every acceptance criterion.
   - Confirm `.docs/violations/audit-log.md` and `lint-rules.md` exist.
   - Confirm `.docs/sessions/` exists and root `sessions/` does not.
   - Confirm the `AGENTS.md` header matches `setup-repo` templates: title `# <name> — Session Rules`, the concrete conflict preamble, and the `## Communication`, `## Language`, `## Code comments`, `## Context discipline`, `## Subagent-first pipeline (default for implementation)`, and `## Session state` sections.
   - Re-check `AGENTS.md` vs `CLAUDE.md` for duplicated content. A block copied into both is a DRY violation — keep shared content in one file and reference it from the other.

7. **Update status**: refresh `.docs/CURRENT_STATUS.md` with the upgrade result.
   - Link to `AUDIT.md`, `upgrade-plan.md`, and the catalog version.

## Conventions

- Language: all documents and code terms are English. Chat replies are Russian. Author quotes stay verbatim in `> «...»`.
- Use merge strategy for existing files. Never replace without user confirmation.
- Do not refactor application code. This skill is for agentic setup only.
- Reuse setup-repo templates from `~/.agents/skills/setup-repo/templates/`.
- When migrating or touching PLAN.md item titles, follow [`NAMING.md`](../update-docs/NAMING.md) — a short task name in plain language, no log/status/code/paths. Never touch the trailing `<!-- id: slug -->`.
- High-risk or irreversible changes stop and ask.

## Output

An upgraded project with agentic scaffold, compliance package, `AUDIT.md`, and `upgrade-plan.md`.

## Reference

See [REFERENCE.md](REFERENCE.md) for the workflow and risk classes.
