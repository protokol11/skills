# Evidence — what each rule rests on

Full evidence base: `AGENTIC_PAPERS/deep-research/readme-skill-2026-10-24/report.md` (repo
`Agentic-Engineering`, gitignored run directory). Every row below was fetched and adjudicated by a
second agent before it entered this skill.

Tags: **declared** means a spec or style guide states it. **measured** means a study reports a
number, kept with its year and scope. **correlational** means association only.

| Rule | Tag | Source |
|---|---|---|
| 16-section order, optional sections may be omitted | declared | [Standard Readme spec](https://raw.githubusercontent.com/RichardLitt/standard-readme/master/spec.md) |
| Four unconditionally required sections, License last | declared | same spec |
| Short description: no heading, own line, under 120 characters, no leading `> `, three-way match | declared | same spec |
| Install and Usage skippable for a documentation repo | declared | same spec |
| CLI section required when the binary takes subcommands | declared | same spec |
| ToC lists every H2, required past a line count | declared | same spec |
| Section order is machine-checkable | declared | [standard-readme-preset](https://raw.githubusercontent.com/RichardLitt/standard-readme-preset/main/README.md) |
| Five content areas, README-only scope, 500 KiB truncation | declared | [GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) |
| Four questions a README answers | declared | [Open Source Guides](https://opensource.guide/starting-a-project/) |
| Prerequisites as the first section, literal None when empty | declared | [MicrosoftDocs quickstart template](https://raw.githubusercontent.com/MicrosoftDocs/content-templates/main/templates/docs-quickstart-article.md) |
| One path to one worked result, real output per step | declared | [Diátaxis tutorials](https://diataxis.fr/tutorials/) |
| Tutorial and how-to stay separate | declared | [Diátaxis how-to guides](https://diataxis.fr/how-to-guides/) |
| Scope and non-scope both named | declared | [Google Technical Writing One](https://developers.google.com/tech-writing/one/documents) |
| No image of text, code or terminal output, no animated GIF | declared | [Google style: images](https://developers.google.com/style/images), [GitHub screenshots](https://docs.github.com/en/contributing/writing-for-github-docs/creating-screenshots) |
| Alt text required, empty alt only for decorative | declared | [WCAG 2.2 SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [W3C decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) |
| No unverifiable performance claims | declared | [Google style: excessive claims](https://developers.google.com/style/excessive-claims) |
| License mandatory, default copyright without one | declared | [GitHub licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) |
| Objective beats promotional, 27%. Concise 58%. Scannable 47%. Combined 124% | measured, 1997, websites | [NN/G](https://www.nngroup.com/articles/how-users-read-on-the-web/) |
| 79% scan, 16% read word for word | measured, 1997 | same article |
| Headings carry the scan, layer-cake pattern | measured, small sample | [NN/G layer-cake](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) |
| About 2 words of a list item get seen | measured, 2009, links not README bullets | [NN/G first 2 words](https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/) |
| First sentence carries the point | declared | [NN/G inverted pyramid](https://www.nngroup.com/articles/inverted-pyramid/) |
| Badges correlate with more tests and fresher dependencies | correlational, 2018 npm | [Trockman et al.](https://arxiv.org/abs/1802.06997) |
| Name-plus-screenshots READMEs are less popular | correlational, 14,901 Java repos | [Liu et al.](https://enoei.github.io/papers/liu2022readme.pdf) |
| 28.9% of popular projects hold an outdated code reference | measured, EMSE 2023 | [arXiv 2603.00489](https://arxiv.org/abs/2603.00489) |
| Markdown structure lifts exact-match by about 20 points | measured, one legal-QA study, not READMEs | [arXiv 2505.12837](https://arxiv.org/abs/2505.12837) |
| Under 200 lines per CLAUDE.md, longer files reduce adherence | declared, sibling file not README | [Claude Code best practices](https://code.claude.com/docs/en/best-practices) |
| AGENTS.md exists so build steps stay out of the README | declared | [agents.md](https://agents.md/) |
| One H1, blockquote summary, H2 link lists | declared, separate file | [llms.txt](https://llmstxt.org/) |

## What the evidence does not establish

- No study measures README quality against a reader's task success.
- No study measures which opening framing converts readers. Only the shape is supported.
- Following a structure spec is argued to help onboarding. It is not measured.
- Badges and screenshots have no causal evidence. Every popularity result is correlational.
- No measured README length or token budget for coding agents. The 200-line figure is for CLAUDE.md.
- Linting impact is unmeasured. Adoption counts are all that exists.
- Badge rot, dead demo links and marketing drift have no prevalence figure.

## Rules marked as judgement

Three rows of the section table rest on no source: configuration, API placement, troubleshooting
order. They follow from how readers use those sections, not from a cited study. Treat them as the
default, and let a project convention override them.
