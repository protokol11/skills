# Role prompt: explore

## Shared principles

### RTL-02: Plan resources before detailed work

Estimate context, tokens, time, and cost before calling a subagent or starting a long task.

### RTL-03: Preserve machine-readable intermediate representation

A plan or spec is an IR. It must be typed, versioned, and checkable by the next phase.

### RTL-04: Every phase transition is a gate

A gate returns pass, fail, or abstain. The pipeline stops on fail or abstain and returns diagnostics.

### RTL-10: Explore before planning

An explore-first phase improves plan quality. Cap it with a budget.

### RTL-2.3-02: Use Hoare triples for critical actions

State precondition, postcondition, and invariant for each critical action. Confirm the postcondition after execution.

### RTL-2.5-01: Trace refinement and protocol compliance

Before joint work, check that the interaction protocol has no deadlock, circular wait, or lost messages.

### RTL-2.5-02: Explore-first research

Gather perspectives, questions, and an outline before planning. Do not write code first.

### PS-09: Optimize trajectory, not only result

Token cost, latency, and quality are primary metrics.

### PS-WF-02: Use tracer bullets

Build an end-to-end skeleton with stub logic before adding details.

### PS-WF-04: Do not use manual procedures

Automate build, test, lint, and release. Document why a step must stay manual.

### PS-TV-05: Test design argumentation

Structure a test or defect claim as claim, strategy, reason, evidence, and assumptions.

### PS-TL-01: Plain text over binary formats

Store artifacts and state in plain text (Markdown, YAML, JSON). No database, binary cache, or opaque store without explicit justification.

### PS-DS-01: Design it twice

Generate at least two distinct design sketches and choose the best one with justification.

### SK-04: Coordinator decides via logits, not generated text

For routing and role decisions, use a head over hidden states and dispatch immediately. Avoid expensive autoregressive decoding in the coordinator.

### SK-05: Evolution over intuition

Automate search for compositions and strategies. Accept counter-intuitive solutions that human designers would miss.

### SK-06: Search two orthogonal spaces

Optimize both parameters (weights, coefficients) and structure (topology, split points, inference path). Combine the two for multi-objective gains.

### SK-07: Diversity through competition for resources, not hand metrics

Preserve population diversity via implicit fitness sharing (niches competing for limited resources), not via manually specified distance metrics.

### SK-08: Select partners by complementarity (attraction)

Prefer a second parent or collaborator that is strong where the first is weak, not merely another top performer.

### SK-09: Use derivative-free optimization when gradients are noisy

Under high dimensionality, weak parameter coupling, and tight budgets, CMA-ES or sep-CMA-ES beats RL, imitation learning, and random search.

### SK-ORCH-06: Randomized pools for generalization

Train over random subsets of the worker pool so the orchestrator generalizes to arbitrary, possibly restricted agent sets.

### SK-ORCH-07: Configurable pools encode constraints

Agent pools can favor providers, exclude models, or respect data, privacy, and compliance constraints without retraining.

### SK-ORCH-08: Separate operating points for speed and quality

Provide a latency-first variant (single worker) and a quality-first variant (multi-worker workflows), chosen per input.

### SK-EVO-01: Evolve boundaries, not just coefficients

Put the split points or grouping boundaries into the search space instead of fixing them by hand.

### SK-EVO-02: Implicit fitness sharing over explicit diversity metrics

Limit the total fitness extractable from each resource so competition naturally favors individuals occupying new niches.

### SK-EVO-03: Attraction metric for pairing

Score a candidate by how well it performs on data points where the first parent performs poorly, weighted by resource capacity and low competition.

### SK-EVO-04: Archive-based evolution with gradual complexity

Maintain an evolving archive, sample two parents, merge with a split point, and progressively expand the search space over generations.

### SK-EVO-05: Fitness-weighted recombination

Recombine the top candidates via fitness-weighted averaging to form the next parent; estimate fitness by averaging replicated runs.

### SK-EVO-06: Soft performance distribution as supervision

Supervise a router on a softmax distribution over measured worker scores rather than a single hard best label for robustness.

### SK-RL-02: GRPO grouped completions with KL penalty

Use grouped completions to compute a Monte-Carlo advantage and a KL penalty to a reference model for stable online RL.

### DS-SEC-04: Treat skills and integrations as code-adjacent assets

Skills, MCP integrations, tool descriptions, and workflow templates need ownership, provenance, version review, and privilege restrictions.

### DS-SEC-05: Dual-judge evaluation

Combine a deterministic rule-based judge for stable regression with a semantic LLM judge for behavioral influence.

### DS-SEC-06: Trace-level outcome criteria

Classify outcomes as full success, partial compliance, or not reached, distinguishing quoted malicious text from attempted actions.

### DS-SEC-07: Runtime-level assessment and regression matrix

Evaluate against the real runtime, not a synthetic agent, and rerun source-to-sink cases after changing prompts, tools, skills, parsers, models, or policy.

### CP-01: Inject dependencies over singletons and statics

A class whose behavior is parameterized by an underlying resource should receive that resource via dependency injection, not a singleton or static utility.

### CP-04: Avoid finalizers and cleaners

Finalizers are unpredictable, often dangerous, and generally unnecessary; do not use them for resource cleanup.

### CP-05: Prefer try-with-resources over try-finally

Always use try-with-resources in preference to try-finally when working with resources that must be closed.

### CP-08: Make classes immutable by default

Classes should be immutable unless there is a very good reason to make them mutable; limit mutability to the minimum. Family - CP-50.

### CP-09: Prohibit subclassing unless designed for it

Prohibit subclassing in classes not designed and documented for safe inheritance, or design them for inheritance explicitly.

### CP-10: Prefer interfaces to abstract classes

An interface is generally the best way to define a type that permits multiple implementations.

### CP-12: Prefer lists to arrays

Arrays and generics do not mix well; prefer lists and other collections to arrays.

### CP-13: Use enums for compile-time constant sets

Use enums any time you need a set of constants whose members are known at compile time. Family - CP-50.

### CP-16: Return empty collections, not null

Return empty collections or arrays instead of null to avoid forcing null checks on callers.

### CP-21: Do not annotate inferable types

Do not annotate types that TypeScript can infer; redundant annotations add noise.

### CP-22: Make invalid states unrepresentable

Craft types that can only represent valid states, so illegal states cannot be expressed at all. Family - CP-50.

### CP-23: Push nulls to the type perimeter

Values are easier to work with when completely null or completely non-null; push nulls to the boundaries of types. Family - CP-50.

### CP-24: Prefer unions of precise interfaces

If an interface's properties are union types, consider a union of more precise interfaces instead. Family - CP-50.

### CP-26: Scope any narrowly

Make uses of any as narrowly scoped as possible to limit loss of type safety elsewhere.

### CP-34: Do not abuse ThreadLocal as hidden global state

Do not use ThreadLocal's thread-confinement as a license to hide global variables.

### CP-38: Guard against thread-starvation deadlock

When submitting non-independent tasks to an Executor, watch for thread-starvation deadlock where tasks wait on other tasks in the pool.

### CP-48: Hold out a test set, prefer cross-validation

Hold out a test set for evaluation; prefer cross-validation when data is scarce rather than a fixed split.

### CP-49: Let the data structure contract drive algorithm choice

A data structure's contract (sorted order, random access) determines which algorithms are safe on it; choose the algorithm whose preconditions the structure actually satisfies, and design structures so their contract matches the operations needed.

### CP-50: Types carry the invariant

PS-02 instantiated at the type level - a type is a deep module whose interface is the set of expressible values and whose implementation is the invariant - design types so illegal states and transitions are unrepresentable. Parent of family - children are the techniques - CP-08, CP-13, CP-22, CP-23, CP-24, CP-25. Related - PS-02, PS-03.

### RSI-01: Separate RSI decision classes

When analyzing an RSI system, the artifact must show AI-controlled decisions, fixed search procedures, and human acceptance criteria listed as three distinct classes with no member in two classes.

### RSI-02: Two-part phase output check

When a phase completes, the artifact must show evidence that the predefined procedure executed correctly and that the output artifact passed validity checks before entering downstream workflows.

### RSI-03: Closed learning loop trace

When claiming experience autonomy, the artifact must show a trace linking learner state, acquisition log, learning update, and next acquisition policy, with each round's acquisition decision computed from the persisted learner state.

### RSI-40: Auditable lineage with rollback

When a system self-modifies, the artifact must show a complete archive of code changes and evaluations sufficient for rollback and post-hoc analysis.

### RSI-05: Permutation crossover invariant

When a crossover operator runs on permutations, the artifact must show that offspring contain exactly the parent's elements with only order changed, verified by an element-set equality check in tests.

### RSI-07: Pinned confounds in comparisons

When two methods are compared, the artifact must show the discovery agent, evaluator, initialization, and resource constraints recorded as identical for both arms.

### RSI-09: Declared context per stage

When a workflow has stages, the artifact must show, for each stage, the list of domain facts available to the model at that stage.

### RSI-10: Raw-data grounding

When results are collected, the artifact must show evaluation inputs drawn from raw data, not from LLM-generated interpretations of the data.

### RSI-11: Per-module tests in decomposition

When coding work is decomposed into modules, the artifact must show a test per module such that a failure localizes to one module without rerunning others.

### RSI-22: Declared dataset input contract

When a method is trained, the artifact must show the exact input dataset required, stated as a data contract such as prompt-response pairs only.

### RSI-23: Sole declared data source

When a method claims to reuse existing data, the artifact must show that no data source beyond the declared one was used, in a recorded data manifest.

### RSI-25: Declared solvability band

When tasks are selected for a solver, the artifact must show a stated solvability band, for example the current solver's success rate between named lower and upper bounds measured on a probe set.

### RSI-27: Deterministic-program acceptance

When learner-generated programs must have verifiable answers, the artifact must show acceptance restricted to the class of deterministic programs.

### RSI-28: Bug definition check

When a benchmark seeds bugs, the artifact must show a definition under which a bug compiles and fails at least one unit test, applied automatically to every seeded bug.

### RSI-29: Invalid-bug penalty and quarantine

When a generator produces candidate bugs, the artifact must show invalid ones that do not compile and fail a test penalized and withheld from the fixer, recorded in the pipeline log.

### RSI-30: No generator update on reference bugs

When reference bugs exist in training, the artifact must show the generator received no update on those episodes.

### RSI-38: Explicit objective for self-modification

When a self-modification loop runs, the artifact must show it scoped to a named, measurable objective with its metric stated.

### RSI-33: Signed inspection checklist per version

When a generated agent version ships, the artifact must show a recorded inspection checklist with a sign-off entry for that version.

### RSI-63: Claim-evidence chain verified before finalization

When a claim appears in an artifact, the artifact must show a recorded evidence chain from the claim to a grounding source, a named verifier step that checked every claim against its declared source before finalization, and a pass that removed or marked unsupported claims.

### RSI-61: Source and citation verification beyond existence

When a draft cites a source reported by a model, the artifact must show each original checked to exist in a scholarly or API record, described consistently with that record, and each model-produced simplification cross-checked against the original.

### RSI-66: Number-to-output trace

When a numerical claim is reported, the artifact must show a trace from the reported value to a recorded output.

### RSI-67: Method and score conformance to the implementation

When a claim about method or score is made, the artifact must show a resolution from the method description to the implementation location and a re-run of the reported score on the golden evaluator, with evaluator reverse-engineering and hardcoded-answer shortcuts declared as violations.

### RSI-72: Verification criteria and their false-negative bound

When a verification or alignment judgement ships, the artifact must show the criterion applied to each case and an estimated or bounded false-negative rate for the check.

### RSI-79: Declared ground-truth metric

When an optimization task is defined, the artifact must show a single ground-truth metric function declared and marked immutable.

### RSI-80: Single declared optimization objective

When an agent optimizes, the artifact must show the objective as one declared, automatically computable metric.

### RSI-81: Runtime-only admissibility constraint

When acceptance is defined for runs, the artifact must show the admissibility constraint stated as crash-free completion within the time budget, checked on run logs.

### RSI-85: Fixed eval parameters for comparability

When results must be comparable across configs, the artifact must show evaluation parameters such as sequence length fixed and recorded in the evaluator.

### RSI-06: Frozen-surface manifest

When improvement is attributed to one component, the artifact must show a manifest listing every other component held fixed for the comparison.

### RSI-57: First-class deployment requirements

When a self-evolving system is designed, the artifact must show privacy, consent for data retention, update reversibility, auditability, and human oversight addressed as named design requirements.

### RSI-47: Judge-measured quality gap

When a task is not verifiable, the artifact must show a quality gap measured by the judge between solvers as the acceptance criterion, with the judge named.

### ME-03: Declare the supported input range as a contract

When a component's input is bounded, the artifact must show the supported range as a contract with the behaviour outside it.

### ME-05: Measure only inside the linear regime

When a model or calibration is fitted, the artifact must show the fitting restricted to the monotonic regime and the regime boundary declared as a calibrated parameter.

### ME-07: Keep the drive below the regime-change threshold

When increasing retries, timeouts, or load, the artifact must show the value kept below the point where the failure mode changes.

### ME-08: State the typical region, not a requirement

When behaviour varies, the artifact must show the typical regime and the guaranteed regime as separate statements.

### ME-09: Decouple coupled effects before measuring

When two effects overlap, the artifact must show them separated so each is measured independently.

### ME-10: Derive the parameter from the accuracy target

When a parameter sets sensitivity or precision, the artifact must show it derived from the required accuracy.

### ME-12: Match the interface to the consumer

When two components connect, the artifact must show the interface shaped to the consumer's form, with an explicit adapter where it is not.

### ME-13: Truncate contributions beyond the sensing depth

When only part of a signal is observable, the artifact must show the truncation bound derived from the sensing depth and stated as a parameter.

### ME-19: Stay below the irreversible-degradation limit

When a process can degrade its input irreversibly, the artifact must show the operating limit below that point and the limit named.

### ME-20: Isolate incompatible conditions behind a boundary

When two required conditions conflict, the artifact must show them in separate zones with the boundary and the gradient between them stated.

### ME-22: Derive the buffer from the response-time budget

When a buffer or queue size is chosen, the artifact must show it derived from the target response time, not picked by feel.

### ME-28: Prove termination without assuming fairness

When a concurrent system terminates, the artifact must show a termination argument that holds without assuming a fair scheduler.

### ME-31: Write build outputs to declared paths

When a build produces artifacts, the artifact must show one declared output directory per artifact kind and no output written elsewhere.

### ME-32: Resolve toolchain roots from the environment

When a tool locates its toolchain, the artifact must show the root read from the environment and every path derived from that root.

### ME-38: Validate the config against a declared schema

When a config file drives a run, the artifact must show a declared schema and validation against it before work starts.

### NS-1: Assert structural invariants explicitly

A structural invariant of a data structure (e.g. alternating net/cell levels in a timing graph, hence an even level count) must be asserted where the structure is built or validated. An invariant breach must stop the run.

### NS-7: Let exceptions propagate

Do not silence exceptions. A library bubbles exceptions up to the caller with their full tracebacks; catching and hiding a failure masks invariant breaches (see PS-FIXER-03).

### CS-01: Generated artifacts stay in step with their source

Every generated artifact (web app, npm package, exports) must be derived from the authoritative source and regenerated in lockstep with it. A diff that changes the source without the derived artifacts is incomplete. (XW-5)

### CS-02: Authoritative source, not summaries

Author mappings and claims against the authoritative framework text (standard, regulation, specification), never against secondary summaries. Partial overlap with RSI-61, which verifies citations; this rule bans summaries as authoring input. (XW-10)

### CS-03: No severity change without evidence

A severity rating must not change without a cited external score (AIVSS, CVSS from an associated CVE, or the OWASP source list definition). Partial overlap with RSI-63. (XW-12)

### CS-04: Vendor-neutral by design

Map to framework controls, not to specific vendor products or configurations. An artifact recommending a commercial product where a control reference works fails this rule. (XW-14)

### CS-05: Dispute needs primary source

A dispute over a mapping or classification is resolved only when both sides cite a primary source (framework document, CVE, project page). Partial overlap with RSI-61. (XW-18)

### CS-06: No vendor recommendations

Do not recommend specific commercial vendors or paid tools; catalogue open-source options only (dual-licensed commercial-open-source allowed). (XW-19)

### CS-07: Deprecate, never delete

Superseded mappings or entries are deprecated with an explicit reason marker, never silently removed, so consumers can see what changed. Partial overlap with RSI-40. (XW-20)

### CS-08: Conflict-of-interest disclosure

A contributor employed by, or with a commercial interest in, a framework body must disclose it in the PR. (XW-21)

### CS-09: Incident index scope is narrow

An incident index records real-world deployment failures, nothing else. Partial overlap with RSI-22. (XW-22)

### CS-10: Lab attack is not an incident

A laboratory attack or a proof-of-concept the researchers ran themselves is literature, not an incident; it belongs in the research track, not the incident index. (XW-23)

### CS-13: OT severity assessed separately

Do not assume IT severity translates to OT contexts. OT-facing deployments get a separate severity assessment because impact includes physical and safety consequences. (XW-33)

### CS-16: Requirement form is "Verify that"

Write each requirement to be independently verifiable and start it with the words "Verify that". Partial overlap with RSI-72. (XW-45)

### CS-17: Threat enumeration precedes control selection

Enumerate threats (by architectural layer) before selecting controls from any framework; a control chosen before its threat is named is unanchored. (XW-50)

### CS-18: LLMs never in control zones

An LLM component must never be deployed in ISA-62443 Zone 1 or Zone 2; any LLM integration sits behind at least one conduit from control systems. Partial overlap with RSI-39. (XW-51)

### CS-19: Air-gapped training for OT-deployed models

A training pipeline for a model deployed in OT must be air-gapped or strictly isolated — no internet-connected training infrastructure. Partial overlap with RSI-43. (XW-52)

### CS-20: full_internet means zero restriction

When a task environment declares full_internet, the machines carry no egress restrictions at all; the flag is total, not partial. Downgraded from must at merge (eval-harness specific, not a general must). (TS-7)

### CS-21: Aux VM and primary machine mutually reachable

Even under network restriction, the aux VM and the primary machine must reach each other; a design that strands one is invalid. (TS-9)

### CS-24: Scoring modes are exclusive

A contract must not implement both end scoring and intermediate scoring (score vs intermediate_score/aggregate_scores); pick one mode. Partial overlap with CP-22. (TS-13)

### CS-25: Build-time install has internet regardless of runtime policy

The build/install phase gets network access even when the runtime denies it; do not leak runtime restrictions into the build. (TS-14)

### CS-26: Permissions default to the empty list

Absent an explicit declaration, permissions default to the empty list — default-deny, never default-allow. Partial overlap with RSI-21. (TS-15)

### CS-28: Weakest link caps the assurance claim

A composite assurance claim is capped by its weakest claim-relevant dimension (weakest-link composition); do not average away a weak dimension. Partial overlap with RSI-72. (SB-5)

