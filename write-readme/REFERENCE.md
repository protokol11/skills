# Reference — section table, section rules, checks

Consulted on demand from `SKILL.md`. Sources for each rule: [EVIDENCE.md](EVIDENCE.md).

## Section table

Order of the rows that survive. Optional rows may be dropped. The surviving rows keep this order.

| # | Section | Status |
|---|---|---|
| 1 | Title (H1) | required |
| 2 | One-line description | required |
| 3 | Badges | optional |
| 4 | Screenshot or GIF | optional |
| 5 | Table of contents | required when the README passes 100 lines, otherwise drop it |
| 6 | Background or Why | optional |
| 7 | Install | required, skippable for a documentation repo |
| 8 | Usage, one worked result | required, skippable for a documentation repo |
| 9 | CLI | required when the binary takes subcommands |
| 10 | Configuration | when settings exist |
| 11 | API | when a public API exists |
| 12 | Troubleshooting | optional |
| 13 | Contributing | required |
| 14 | Project status | when the project is archived or seeking maintainers |
| 15 | License | required, last |

Four rows carry a hard requirement: Title, one-line description, Contributing, License. Rows 5, 7 and 8 carry a condition, not a rule.

Project type changes three rows. A documentation repo has no functional code, so rows 7 and 8 drop. A CLI adds row 9. A monorepo adds a root package table and one scoped README per package, with a single setup command from the root.

## Section rules

- **Title.** The project name. A tagline alone does not serve as the title.
- **One-line description.** The constraint and the three-way match are step 3 of `SKILL.md`. This row adds nothing to it.
- **Badges.** Live state only: build, coverage, dependency freshness. These correlate with more tests, better pull requests and fresher dependencies, strongest for assessment badges. Correlational, 2018 npm data.- **Screenshot or GIF.** Beside working text. A cluster of READMEs holding only a name and screenshots was less popular than clusters with install and usage text. Correlational. Static image format, no animated GIF. No image of text, code or terminal output.
- **Table of contents.** Lists every H2 and starts at the section after itself. Add it when the file passes 100 lines.
- **Background or Why.** The problem, then scope and non-scope, both named. A feature list does not substitute.
- **Install.** Prerequisites as the first section, the literal word None when empty, then the exact command, then the output. Every prerequisite named.
- **Usage.** One path to one result. Real output at each step. No option branches. A tutorial stays separate from a how-to, since conflating the two sits "at the root of many difficulties that afflict documentation".
- **CLI.** Synopsis, then one invocation per subcommand with its real output.
- **Configuration.** Table of key, type, default, effect. Defaults stated. No secrets.
- **API.** One runnable example per public entry point, plus a link to the full reference.
- **Troubleshooting.** Symptom, cause, fix. Flag the signs of going wrong inside Steps too.
- **Contributing.** Where to file an issue, and the command that runs the tests.
- **Project status.** Maintained, seeking maintainers, or archived, with a date.
- **License.** Name the license, link the LICENSE file. Without a license the default copyright applies and nobody may reproduce or distribute the work.

## Checks

Run every row marked runnable. Record the result of each.

| Check | Command | Kind |
|---|---|---|
| Links resolve | `lychee --no-progress README.md`, or the `lychee-action` in CI | runnable |
| Heading structure and order | `markdownlint README.md` with MD043 required headings, MD041 first line is H1, MD040 fenced code has a language, MD025 one H1 | runnable |
| Section order | the standard-readme remark preset: `standard-readme:section-order`, `no-unknown-sections` | runnable, work in progress, skips Title and description |
| Prose style | `vale README.md` with a project style | runnable |
| Snippets run | `pytest --doctest-glob="*.md"`, `mdbook test` for Rust blocks, a shell runner for shell blocks | runnable per language |
| Alt text present | `accessibility-alt-text-bot`, then read against WCAG 2.2 SC 1.1.1: `alt=""` only for decorative images | bot plus manual |
| Badge is live | open each badge URL | manual |
| Size limit | content past 500 KiB is truncated on GitHub | manual |
| Description match | compare line 2 with the package description and the repository description | manual |

## Writing for coding agents

Holds when coding agents read the repo as well as people.

- One H1, then a blockquote summary, then short H2 sections. Structure is what carries.
- Every command in the README is a command that ran.
- Prerequisites explicit. No `...` in a command block, no "install the dependencies".
- Keep the README human-first. Build steps and conventions belong in `AGENTS.md`, which exists so they do not clutter the README.
- Length: no measured README budget exists. The nearest numbers are for sibling files, "under 200 lines per CLAUDE.md" and "no longer than 2 pages" for generated instructions. Use them as an order of magnitude, not as a rule.

## Anti-patterns and the target

Each line names the target first, then the failure it replaces.

- Text carries the content, images support it. A README that is only a logo or a screenshot loses to one with install and usage text.
- Text, code and terminal output stay as text. Put an image where a diagram earns it.
- Every informative image carries alt text that states its content. Decorative images carry `alt=""`.
- Every claim a reader can check stays checkable. Cite the measurement or cut the superlative.
- Every badge reports live state. A static badge where a measurement belongs misleads.
- Every code block runs as pasted. A block with an omission is labelled as a fragment.
- The file stays current. 28.9% of popular projects hold at least one outdated code reference, and 82.3% were outdated at least once. Wire the snippet check and the link check.
