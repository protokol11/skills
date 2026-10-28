# Reference

Standards for the skill you write. Check the skill against these before it ships.

## Predictability

A skill exists to make the agent take the same process every run. Predictability is the root virtue. Every rule below serves it.

## Two loads

Every line spends one of two budgets.

- context load. Always-loaded material. A skill description sits in the window every turn.
- cognitive load. The human remembering which skills exist and when to reach each.

A pointer escapes context load at the price of its own line.

## Invocation

Pick one first.

- user-invoked. Set `disable-model-invocation: true`. Only the human typing the name can fire it. Zero context load. The description becomes a one-line human summary.
- model-invoked. Omit the flag. The agent can fire it on its own and other skills can reach it. The description stays loaded every turn, so it earns harder pruning.

Pick model-invoked only when the agent or another skill must reach it.

## Router skills

When user-invoked skills multiply past memory, add a router skill. It names the others and when to reach each. It can only hint, never fire them.

## Description

A model-invoked description does two jobs. State what the skill is and list the branches that trigger it.

1. Front-load the leading word.
2. One trigger per branch. Synonyms that rename one branch are one branch written twice.
3. Cut identity the body already carries.

## Context pointers

A context pointer names out-of-context material and encodes when to reach it. A skill description is one pointer. Weak wording on a needed pointer is a variance bug. Sharpen the wording first.

## Information hierarchy

Three tiers, ranked by how soon the agent needs the material.

1. In-skill step. The ordered actions. Each ends on a completion criterion.
2. In-skill reference. Definitions and rules consulted on demand.
3. Disclosed reference. Material pushed to a sibling file, reached by a context pointer.

Progressive disclosure moves material down the tiers. Co-location keeps one concept's definition, rules, and caveats under one heading.

## Completion criteria

Each step ends on a condition that tells the agent the work is done. Two properties.

- Checkable. Can the agent tell done from not-done?
- Exhaustive. Write "every model accounted for", not "produce a change list".

A vague criterion invites premature completion.

## Leading words

A leading word is a compact concept already in the model's pretraining. It anchors behaviour in few tokens by recruiting priors. Collapse a triad spelled at three sites into one token. See VOCABULARY.md.

## Negation

Steering by prohibition backfires. "Do not think of an elephant" names the elephant. Phrase the positive: state the target behaviour. Keep a prohibition only as a guardrail you cannot phrase positively, and pair it with the positive target.

## Pruning

1. Single source of truth. One meaning in one place.
2. The environment is a source too. Do not restate what package.json or --help already says.
3. Check relevance. Delete a line that no longer bears on the skill.
4. Hunt no-ops. If a sentence does not change behaviour, delete it whole.

## Splitting

Split only when the cut earns it.

- By invocation. Split off a model-invoked skill when a distinct leading word must trigger it on its own.
- By sequence. Split a run of steps when the later steps tempt the agent to rush the current one.

## Failure modes

- premature completion: ending a step before it is done. Sharpen the criterion first.
- duplication: one meaning in two places.
- sediment: stale layers that settle over time.
- sprawl: a skill too long even when every line is live. Disclose reference or split.
- no-op: a line the model already obeys by default.
- negation: steering by prohibition.

## Voice

Apply these to all prose. Code, identifiers, and commands are exempt.

1. Active voice.
2. One name for one thing.
3. No marketing adjectives or banned synonyms.
4. Sentences under 20 words. No semicolons. No contractions.
5. Numbered lists for steps. Condition before command.

Banned synonyms: helper, manager, utility, handler, seamlessly, robustly, powerfully, robust, powerful, cutting-edge, effortless, world-class, next-generation, revolutionary, state-of-the-art, leverage, utilize, commence, initiate, obtain, acquire, ensure, prior to, subsequent to, regarding, concerning, additionally, furthermore, moreover, demonstrate, perform an analysis of, carry out, make use of.

Use instead: use, start, get, make sure, before, after, about, also, show, analyze, use.

## Principles

Apply these to a skill artifact.

- DRY. Reference existing artifacts. Do not repeat them.
- CHOOSE-PRECISE-NAMES. One name for one thing. No vague labels.
- PULL-COMPLEXITY-DOWNWARD. Keep the surface simple. Hide details in reference.
- SCOPE-LOCK. One task per artifact. Do not widen scope.
- HUMAN-JUDGMENT-FINAL. The agent supports human decisions. It does not self-certify.
- HALT. Read before write. Do not run side-effect tools until scope is confirmed.
- FOG-OF-WAR. Treat each diagnosis and plan as a hypothesis until a tool or the human confirms it.
- VERIFY-BEFORE-RETURN. Check every fact against tool output or the user before you ship.
- CONSISTENCY-AND-CONVENTIONS. Follow project conventions and keep terms consistent.

## Search

When you search for an existing skill:

1. Check the skills.sh leaderboard first.
2. Prefer 1K+ installs from known sources, like vercel-labs, anthropics, or microsoft.
3. Treat a skill from a repo under 100 stars with caution.
4. Present install count, source, and the install command before you recommend.

## Verify

Run before you ship the skill.

1. Line count. `wc -l SKILL.md`. Keep it under 100.
2. Banned words. `grep -rniE "\b(seamlessly|robustly|robust|powerful|leverage|utilize|ensure|helper|manager|utility|handler)\b" .`
3. Semicolons and contractions. `grep -rnE "[;]|(can't|won't|don't|it's)" .`
4. One meaning in one place. Read each file for a repeated rule.
5. Every step has a completion criterion.
