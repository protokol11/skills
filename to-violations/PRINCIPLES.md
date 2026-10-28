---
principles:
  - id: RTL-01
    name: Pipeline is a sequence of lowering stages
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD, skill]
    text: Each phase lowers abstraction. A signoff gate sits between phases. The next phase starts only after the gate returns pass.

  - id: RTL-02
    name: Plan resources before detailed work
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, PRD, skill]
    text: Estimate context, tokens, time, and cost before calling a subagent or starting a long task.

  - id: RTL-03
    name: Preserve machine-readable intermediate representation
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [spec, PRD, plan, skill]
    text: A plan or spec is an IR. It must be typed, versioned, and checkable by the next phase.

  - id: RTL-04
    name: Every phase transition is a gate
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, PRD, skill]
    text: A gate returns pass, fail, or abstain. The pipeline stops on fail or abstain and returns diagnostics.

  - id: RTL-05
    name: Optimization without regression is breakage
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec, PRD]
    text: Every change, refactor, prompt tuning, or model swap must pass an equivalence check against baseline.

  - id: RTL-06
    name: State is a first-class citizen
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec, PRD]
    text: Every loop or state machine must have explicit states, transitions, terminal states, and max iterations.

  - id: RTL-07
    name: Agents communicate through typed channels
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: Agents exchange typed messages. Shared mutable state is a source of races and untraceable bugs.

  - id: RTL-08
    name: Trusted tool computes, LLM orchestrates, verification gate decides
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD, diagnose, code]
    text: Accept a numeric or factual result only if it comes from a trusted tool and passes explicit verification.

  - id: RTL-09
    name: Every step leaves a trace
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, skill, code]
    text: Record trace ID, spans, and structured logs for root-cause analysis and replay.

  - id: RTL-10
    name: Explore before planning
    source: RTL-to-GDS_PRINCIPLES.md
    severity: should
    artifacts: [handoff, spec, PRD]
    text: An explore-first phase improves plan quality. Cap it with a budget.

  - id: RTL-2.1-01
    name: DRC gate checks lint, type, and architecture rules
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec]
    text: A DRC gate reports banned imports, architecture violations, and lint failures in structured form.

  - id: RTL-2.1-02
    name: LVS gate compares PRD and implementation
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec, PRD]
    text: Compare requirement and implementation. List mismatches explicitly.

  - id: RTL-2.1-03
    name: LEC gate checks regression equivalence
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec]
    text: After a refactor, run regression tests. Explain any behavior change or roll back.

  - id: RTL-2.3-01
    name: Model state machines explicitly
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec, skill]
    text: Model loops as deterministic finite automata. Define states, transitions, terminal states, and max iterations.

  - id: RTL-2.3-02
    name: Use Hoare triples for critical actions
    source: RTL-to-GDS_PRINCIPLES.md
    severity: should
    artifacts: [code, spec, skill]
    text: State precondition, postcondition, and invariant for each critical action. Confirm the postcondition after execution.

  - id: RTL-2.3-03
    name: Preserve invariants at every step
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [code, spec]
    text: Check invariants on every step. Examples are source hash unchanged and test pass rate not dropped.

  - id: RTL-2.3-04
    name: Abstain when confidence is low
    source: RTL-to-GDS_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec]
    text: If verification fails or confidence is low, refuse explicitly and explain what is needed to continue.

  - id: RTL-2.5-01
    name: Trace refinement and protocol compliance
    source: RTL-to-GDS_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Before joint work, check that the interaction protocol has no deadlock, circular wait, or lost messages.

  - id: RTL-2.5-02
    name: Explore-first research
    source: RTL-to-GDS_PRINCIPLES.md
    severity: should
    artifacts: [handoff, spec, PRD]
    text: Gather perspectives, questions, and an outline before planning. Do not write code first.

  - id: PS-01
    name: Zero tolerance for ad-hoc hacks
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: Small compromises in prompts or interfaces accumulate into an unmanageable system. Reject ad-hoc hacks in skills.

  - id: PS-02
    name: Deep modules beat wide modules
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: A skill or module should deliver high value through a narrow interface.

  - id: PS-03
    name: Hide information and do not repeat
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: Prompts, examples, and retry logic live inside a skill. Subagents see only the input-output contract.

  - id: PS-04
    name: Design before code
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code, spec]
    text: A subagent must justify design decisions before producing implementation.

  - id: PS-05
    name: Iterate with fast feedback
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: Treat every skill as a hypothesis. Verify it on real traces.

  - id: PS-06
    name: Do not trust a result without verification
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [handoff, spec, code]
    text: Every numeric or factual claim must pass a trusted tool or verification gate.

  - id: PS-07
    name: Separate concerns
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: Planner, executor, verifier, and critic are distinct roles or subagents.

  - id: PS-08
    name: Structured state and tool feedback
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: Raw logs are poor input for a planner. Parse them into structured state.

  - id: PS-09
    name: Optimize trajectory, not only result
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [skill, code]
    text: Token cost, latency, and quality are primary metrics.

  - id: PS-10
    name: Human is final authority in assurance
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [handoff, spec, code]
    text: A subagent must not self-certify correctness or safety in assurance tasks. The review point is the merge - every change, even agent-authored, passes human review by the person opening the PR before it merges.

  - id: PS-WF-01
    name: Work iteratively
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [skill, code]
    text: Make one small step at a time. Say what changed and why.

  - id: PS-WF-02
    name: Use tracer bullets
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [spec, PRD, code]
    text: Build an end-to-end skeleton with stub logic before adding details.

  - id: PS-WF-03
    name: Stage gates and sequential dependency
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [handoff, spec, code]
    text: Check the precondition before moving to the next stage.

  - id: PS-WF-04
    name: Do not use manual procedures
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [skill, code]
    text: Automate build, test, lint, and release. Document why a step must stay manual.

  - id: PS-TV-01
    name: Solver-grounded design
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code, spec]
    text: A number or fact in the output must come from a trusted tool and pass a verification gate.

  - id: PS-TV-02
    name: Safe failure and abstention
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [agent-instruction, code]
    text: If verification fails, refuse explicitly and explain why.

  - id: PS-TV-03
    name: Clear division of labor
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [agent-instruction, skill]
    text: The LLM does not compute physical quantities. Tools compute. The gate decides.

  - id: PS-TV-04
    name: Read versus write distinction
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [agent-instruction, code]
    text: Read tools are safe. Write tools need confirmation.

  - id: PS-TV-05
    name: Test design argumentation
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [code, spec]
    text: Structure a test or defect claim as claim, strategy, reason, evidence, and assumptions.

  - id: PS-TV-06
    name: Find bugs once
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Add a regression test for every confirmed bug.

  - id: PS-TV-07
    name: Declared safe-autofix boundary
    source: scrub-slop/SKILL.md
    severity: should
    artifacts: [agent-instruction, code, skill]
    text: A tool auto-applies only transforms it can prove behaviour-preserving. A transform that needs judgment is reported, not applied.

  - id: PS-CODER-01
    name: Design first
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: State design decisions and why they fit the plan before changing code.

  - id: PS-CODER-02
    name: Verify before returning
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Compare the diff against acceptance criteria. Stop and report any mismatch.

  - id: PS-CODER-03
    name: No broken windows
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [code]
    text: Fix TODOs, untested branches, or stale comments. File a follow-up task if you cannot fix them. Add comments only when genuinely important; a comment must never describe previous code behavior - such notes belong in commit messages and PR comments.

  - id: PS-CODER-04
    name: Write or update tests
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Write a regression test before or with the fix when tests are missing.

  - id: PS-CODER-05
    name: Stay calm on failures
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Collect facts, reproduce the failure, then fix.

  - id: PS-TESTER-01
    name: Argument each failure or risk
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: For every failure or risk provide claim, evidence, reason, and assumptions.

  - id: PS-TESTER-02
    name: Verify evidence relevance
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Do not trust logs blindly. Check that evidence supports the claim.

  - id: PS-TESTER-03
    name: Cover edge states
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Test representative states and edge cases, not only happy paths.

  - id: PS-TESTER-04
    name: Report is input to human judgment
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Do not self-certify readiness. The report supports human judgment.

  - id: PS-FIXER-01
    name: Focus on root cause
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Focus on root cause and remediation. Do not focus on blame.

  - id: PS-FIXER-02
    name: Reproduce before fixing
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Reproduce the failure before changing code. Test assumptions explicitly.

  - id: PS-FIXER-03
    name: Crash early on invariant violation
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: If an invariant is violated, escalate. Do not mask the violation.

  - id: PS-FIXER-04
    name: Explain why the fix works
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Explain why the fix works, not only that it works.

  - id: PS-FIXER-05
    name: Re-run regression checks
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: must
    artifacts: [code]
    text: Re-run the relevant tests and at least one broader regression check.

  - id: HALT
    name: Read before write
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff]
    text: Do not run side-effect tools until the user confirms scope or gives an explicit GO trigger.

  - id: FOG-OF-WAR
    name: Treat diagnosis as hypothesis
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff, diagnose]
    text: Link every root cause to concrete evidence. Label inference as inference.

  - id: SCOPE-LOCK
    name: One task per artifact
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: Do not widen scope silently or bundle unrelated changes. Ship a behaviour-preserving surface fix as its own change, apart from semantic changes.

  - id: VERIFY-BEFORE-RETURN
    name: Verify claims before done
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: Check every factual claim against trusted tool output or explicit human confirmation.

  - id: HUMAN-JUDGMENT-FINAL
    name: Agent does not self-certify
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: Do not claim the output is compliant, correct, or ready.

  - id: DRY
    name: Do not repeat
    source: principle-catalog.md
    severity: should
    artifacts: [agent-instruction, handoff, skill]
    text: Reference existing artifacts. Do not duplicate context already in the repo.

  - id: CHOOSE-PRECISE-NAMES
    name: One name for one thing
    source: principle-catalog.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, code]
    text: Avoid vague labels and banned synonyms.

  - id: CONSISTENCY-AND-CONVENTIONS
    name: Follow project conventions
    source: principle-catalog.md
    severity: should
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: Keep terminology consistent across related artifacts.

  - id: PULL-COMPLEXITY-DOWNWARD
    name: Hide internal complexity
    source: principle-catalog.md
    severity: should
    artifacts: [agent-instruction, skill, spec, PRD]
    text: Keep the artifact surface simple. Move implementation details into subsections.

  - id: PS-TL-01
    name: Plain text over binary formats
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [spec, code, skill]
    text: Store artifacts and state in plain text (Markdown, YAML, JSON). No database, binary cache, or opaque store without explicit justification.

  - id: PS-DS-01
    name: Design it twice
    source: PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md
    severity: should
    artifacts: [spec, PRD, code]
    text: Generate at least two distinct design sketches and choose the best one with justification.

  - id: SK-01
    name: Coordination is a learned ability, not a hand-designed scaffold
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD, skill, code]
    text: Orchestration strategy is discovered through end-to-end reward (RL or evolution), not fixed by hand. Give the orchestrator freedom to choose topology.

  - id: SK-02
    name: Specify workflows in natural language
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: A workflow step is a natural-language subtask plus an assigned agent id plus an access list defining visibility of prior steps.

  - id: SK-03
    name: "Separate roles: Thinker, Worker, Verifier"
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: Decompose work into thinker (strategize), worker (execute), verifier (accept or revise). Offload skill acquisition to workers; keep the coordinator light.

  - id: SK-04
    name: Coordinator decides via logits, not generated text
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [code, skill]
    text: For routing and role decisions, use a head over hidden states and dispatch immediately. Avoid expensive autoregressive decoding in the coordinator.

  - id: SK-05
    name: Evolution over intuition
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [spec, PRD, skill]
    text: Automate search for compositions and strategies. Accept counter-intuitive solutions that human designers would miss.

  - id: SK-06
    name: Search two orthogonal spaces
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [spec, PRD, skill]
    text: Optimize both parameters (weights, coefficients) and structure (topology, split points, inference path). Combine the two for multi-objective gains.

  - id: SK-07
    name: Diversity through competition for resources, not hand metrics
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Preserve population diversity via implicit fitness sharing (niches competing for limited resources), not via manually specified distance metrics.

  - id: SK-08
    name: Select partners by complementarity (attraction)
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Prefer a second parent or collaborator that is strong where the first is weak, not merely another top performer.

  - id: SK-09
    name: Use derivative-free optimization when gradients are noisy
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Under high dimensionality, weak parameter coupling, and tight budgets, CMA-ES or sep-CMA-ES beats RL, imitation learning, and random search.

  - id: SK-10
    name: Reward must be verifiable
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, PRD, code]
    text: "Optimize only against verifiable signals: format plus correctness, or a binary terminal reward averaged over replicated runs."

  - id: SK-11
    name: Trace source-to-sink and separate data from authority
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, code]
    text: Treat untrusted content as data that cannot change the objective. Authorize sensitive actions independently of the model's reading of external documents.

  - id: SK-12
    name: Capability is model plus scaffold
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, PRD]
    text: Performance is a property of the scaffold and orchestration around the model, not only of the model itself.

  - id: SK-ORCH-01
    name: Emergent coordination from end-to-end reward
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: Planner, verifier, refinement, best-of-N, and debate patterns emerge from pure reward maximization instead of being hard-coded.

  - id: SK-ORCH-02
    name: Communication topology as an explicit design object
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: Decide which previous subtasks and responses each worker sees (access list). Control information flow explicitly.

  - id: SK-ORCH-03
    name: Verifier is the terminal condition
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, spec, code]
    text: Halt when the verifier accepts the accumulated solution, or when a fixed turn budget is exhausted.

  - id: SK-ORCH-04
    name: Adapt compute to difficulty
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [agent-instruction, handoff, PRD]
    text: Allocate more steps to hard problems and fewer to easy ones. Do not waste compute on simple cases.

  - id: SK-ORCH-05
    name: Recursive self-reference as test-time scaling
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [agent-instruction, skill, code]
    text: Allow the coordinator to invoke itself as a worker under a bounded recursion depth, turning recursion into a tunable compute axis.

  - id: SK-ORCH-06
    name: Randomized pools for generalization
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [handoff, spec, skill]
    text: Train over random subsets of the worker pool so the orchestrator generalizes to arbitrary, possibly restricted agent sets.

  - id: SK-ORCH-07
    name: Configurable pools encode constraints
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, PRD]
    text: Agent pools can favor providers, exclude models, or respect data, privacy, and compliance constraints without retraining.

  - id: SK-ORCH-08
    name: Separate operating points for speed and quality
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [handoff, spec, skill]
    text: Provide a latency-first variant (single worker) and a quality-first variant (multi-worker workflows), chosen per input.

  - id: SK-EVO-01
    name: Evolve boundaries, not just coefficients
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Put the split points or grouping boundaries into the search space instead of fixing them by hand.

  - id: SK-EVO-02
    name: Implicit fitness sharing over explicit diversity metrics
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Limit the total fitness extractable from each resource so competition naturally favors individuals occupying new niches.

  - id: SK-EVO-03
    name: Attraction metric for pairing
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Score a candidate by how well it performs on data points where the first parent performs poorly, weighted by resource capacity and low competition.

  - id: SK-EVO-04
    name: Archive-based evolution with gradual complexity
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Maintain an evolving archive, sample two parents, merge with a split point, and progressively expand the search space over generations.

  - id: SK-EVO-05
    name: Fitness-weighted recombination
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Recombine the top candidates via fitness-weighted averaging to form the next parent; estimate fitness by averaging replicated runs.

  - id: SK-EVO-06
    name: Soft performance distribution as supervision
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [skill, code]
    text: Supervise a router on a softmax distribution over measured worker scores rather than a single hard best label for robustness.

  - id: SK-RL-01
    name: Progressive format and correctness rewards
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [handoff, spec, code]
    text: Reward adherence to the output structure first, then correctness of the resulting workflow execution.

  - id: SK-RL-02
    name: GRPO grouped completions with KL penalty
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [code]
    text: Use grouped completions to compute a Monte-Carlo advantage and a KL penalty to a reference model for stable online RL.

  - id: SK-RL-03
    name: Remove manual constraints on strategy
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, skill]
    text: Let the model express any strategy expressible in natural language rather than choosing from a preset topology list.

  - id: DS-SEC-01
    name: Model indirect injection as source-to-sink
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, code]
    text: A source is a content-reading tool whose result is attacker-controlled. A sink is an externally observable action. Track taint between them.

  - id: DS-SEC-02
    name: Preserve provenance at the model boundary
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, code]
    text: Tool results retain a source label, trust tier, and carrier type. State that untrusted content is data and cannot change the user's objective.

  - id: DS-SEC-03
    name: Authorize sensitive sinks independently
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [agent-instruction, handoff, code]
    text: Email, HTTP submission, shell, file mutation, privilege changes, and financial actions require allowlists, argument checks, classification, or user approval.

  - id: DS-SEC-04
    name: Treat skills and integrations as code-adjacent assets
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: must
    artifacts: [skill, handoff, spec]
    text: Skills, MCP integrations, tool descriptions, and workflow templates need ownership, provenance, version review, and privilege restrictions.

  - id: DS-SEC-05
    name: Dual-judge evaluation
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [code, spec]
    text: Combine a deterministic rule-based judge for stable regression with a semantic LLM judge for behavioral influence.

  - id: DS-SEC-06
    name: Trace-level outcome criteria
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [code, spec]
    text: Classify outcomes as full success, partial compliance, or not reached, distinguishing quoted malicious text from attempted actions.

  - id: DS-SEC-07
    name: Runtime-level assessment and regression matrix
    source: SAKANA_DEEPSEEK_PRINCIPLES.md
    severity: should
    artifacts: [code, spec]
    text: Evaluate against the real runtime, not a synthetic agent, and rerun source-to-sink cases after changing prompts, tools, skills, parsers, models, or policy.
  - id: CP-01
    name: Inject dependencies over singletons and statics
    source: Round11 - Effective Java
    severity: should
    artifacts: [code, spec]
    text: A class whose behavior is parameterized by an underlying resource should receive that resource via dependency injection, not a singleton or static utility.

  - id: CP-02
    name: Reuse objects instead of re-creating them
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Avoid creating unnecessary objects — reuse a single object where a functionally equivalent one would otherwise be created repeatedly.

  - id: CP-03
    name: Null out obsolete references in self-managed memory
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Whenever a class manages its own memory, null out references to objects that are no longer needed to avoid memory leaks.

  - id: CP-04
    name: Avoid finalizers and cleaners
    source: Round11 - Effective Java
    severity: should
    artifacts: [code]
    text: Finalizers are unpredictable, often dangerous, and generally unnecessary; do not use them for resource cleanup.

  - id: CP-05
    name: Prefer try-with-resources over try-finally
    source: Round11 - Effective Java
    severity: should
    artifacts: [code]
    text: Always use try-with-resources in preference to try-finally when working with resources that must be closed.

  - id: CP-06
    name: Obey the equals contract
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: When overriding equals, obey its general contract (reflexive, symmetric, transitive, consistent, and non-null).

  - id: CP-07
    name: Override hashCode whenever equals is overridden
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Override hashCode in every class that overrides equals, or hash-based collections will break.

  - id: CP-08
    name: Make classes immutable by default
    source: Round11 - Effective Java
    severity: should
    artifacts: [code, spec]
    text: Classes should be immutable unless there is a very good reason to make them mutable; limit mutability to the minimum. Family - CP-50.

  - id: CP-09
    name: Prohibit subclassing unless designed for it
    source: Round11 - Effective Java
    severity: should
    artifacts: [code, spec]
    text: Prohibit subclassing in classes not designed and documented for safe inheritance, or design them for inheritance explicitly.

  - id: CP-10
    name: Prefer interfaces to abstract classes
    source: Round11 - Effective Java
    severity: should
    artifacts: [code, spec]
    text: An interface is generally the best way to define a type that permits multiple implementations.

  - id: CP-11
    name: Do not use raw types
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Using raw types loses type safety and can lead to runtime exceptions; always parameterize generic types.

  - id: CP-12
    name: Prefer lists to arrays
    source: Round11 - Effective Java
    severity: should
    artifacts: [code]
    text: Arrays and generics do not mix well; prefer lists and other collections to arrays.

  - id: CP-13
    name: Use enums for compile-time constant sets
    source: Round11 - Effective Java
    severity: should
    artifacts: [code]
    text: Use enums any time you need a set of constants whose members are known at compile time. Family - CP-50.

  - id: CP-14
    name: Use the Override annotation consistently
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Consistently annotate methods that override a superclass declaration with @Override to catch signature errors.

  - id: CP-15
    name: Program defensively with defensive copies
    source: Round11 - Effective Java
    severity: must
    artifacts: [code]
    text: Assume clients will try to destroy your class invariants; make defensive copies of mutable inputs and outputs.

  - id: CP-16
    name: Return empty collections, not null
    source: Round11 - Effective Java
    severity: should
    artifacts: [code]
    text: Return empty collections or arrays instead of null to avoid forcing null checks on callers.

  - id: CP-17
    name: Enable noImplicitAny in new projects
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: Start new TypeScript projects with noImplicitAny on so types are written explicitly from the start.

  - id: CP-18
    name: Understand the dangers of any before using it
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: The any type eliminates many of the advantages of TypeScript; understand that cost before using it.

  - id: CP-19
    name: Prefer type declarations to type assertions
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: Prefer type declarations over type assertions — declarations are checked, assertions suppress checking.

  - id: CP-20
    name: Prefer type aliases for internal types
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: Use type aliases rather than interfaces for types used internally, to avoid accidental declaration merging.

  - id: CP-21
    name: Do not annotate inferable types
    source: Round11 - Effective TypeScript
    severity: should
    artifacts: [code]
    text: Do not annotate types that TypeScript can infer; redundant annotations add noise.

  - id: CP-22
    name: Make invalid states unrepresentable
    source: Round11 - Effective TypeScript
    severity: should
    artifacts: [code, spec]
    text: Craft types that can only represent valid states, so illegal states cannot be expressed at all. Family - CP-50.

  - id: CP-23
    name: Push nulls to the type perimeter
    source: Round11 - Effective TypeScript
    severity: should
    artifacts: [code, spec]
    text: Values are easier to work with when completely null or completely non-null; push nulls to the boundaries of types. Family - CP-50.

  - id: CP-24
    name: Prefer unions of precise interfaces
    source: Round11 - Effective TypeScript
    severity: should
    artifacts: [code, spec]
    text: If an interface's properties are union types, consider a union of more precise interfaces instead. Family - CP-50.

  - id: CP-25
    name: Prefer narrower types over string
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: Before declaring a string type, ask whether a narrower type such as a literal union or template type is more appropriate. Family - CP-50.

  - id: CP-26
    name: Scope any narrowly
    source: Round11 - Effective TypeScript
    severity: should
    artifacts: [code]
    text: Make uses of any as narrowly scoped as possible to limit loss of type safety elsewhere.

  - id: CP-27
    name: Ask for a precise type before any
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: When using any, ask whether a more specific type was actually intended.

  - id: CP-28
    name: Use unknown instead of any
    source: Round11 - Effective TypeScript
    severity: must
    artifacts: [code]
    text: Use unknown as the type-safe alternative to any when the value's type is not known.

  - id: CP-29
    name: Synchronize access to shared mutable state
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Whenever more than one thread accesses a state variable and one may write it, all accesses must be synchronized for atomicity and memory visibility.

  - id: CP-30
    name: Confine mutable data to avoid sharing
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Do not share mutable data across threads; confine it to a single thread or make it immutable to eliminate synchronization needs.

  - id: CP-31
    name: Publish shared objects safely
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Shared mutable objects must be safely published and be either thread-safe or guarded by a lock.

  - id: CP-32
    name: Make compound actions atomic
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Compound actions on shared state, such as read-modify-write and check-then-act, and updates to related state variables, must be performed in a single atomic operation.

  - id: CP-33
    name: Synchronize for memory visibility
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: To ensure a thread's writes are visible to other threads, use synchronization, or volatile where only visibility is needed.

  - id: CP-34
    name: Do not abuse ThreadLocal as hidden global state
    source: Round11 - Java Concurrency in Practice
    severity: should
    artifacts: [code]
    text: Do not use ThreadLocal's thread-confinement as a license to hide global variables.

  - id: CP-35
    name: Do not let this escape during construction
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Do not allow the this reference to escape from a constructor, for example by publishing it or starting a thread.

  - id: CP-36
    name: Avoid client-side locking on foreign objects
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Avoid client-side locking on classes that do not commit to their locking strategy.

  - id: CP-37
    name: Do not swallow InterruptedException
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Never catch InterruptedException and do nothing; restore the interrupt status or propagate it.

  - id: CP-38
    name: Guard against thread-starvation deadlock
    source: Round11 - Java Concurrency in Practice
    severity: should
    artifacts: [code]
    text: When submitting non-independent tasks to an Executor, watch for thread-starvation deadlock where tasks wait on other tasks in the pool.

  - id: CP-39
    name: Acquire locks in a fixed global order
    source: Round11 - Java Concurrency in Practice
    severity: must
    artifacts: [code]
    text: Acquire multiple locks in a fixed global order to avoid lock-ordering deadlocks.

  - id: CP-40
    name: Return Task, not async void
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Non-event-handler async methods should return Task rather than async void so callers can observe completion and failures.

  - id: CP-41
    name: Synchronize without serializing the program
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Use only enough synchronization for thread safety, not enough to serialize unrelated work.

  - id: CP-42
    name: Do not lock on this or public objects
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Do not lock on this or other publicly reachable objects, since other code may lock them and cause deadlocks.

  - id: CP-43
    name: Prefer timed waits on locks
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Prefer being able to time out when acquiring locks to avoid hard-to-diagnose deadlocks.

  - id: CP-44
    name: Do not rely on WhenAny for large task sets
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Task.WhenAny does not scale because it registers a continuation for every task; use alternatives for large task sets.

  - id: CP-45
    name: Do not parallelize order-sensitive loops
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: Do not parallelize a loop when iteration order matters.

  - id: CP-46
    name: Release the thread during async I/O
    source: Round11 - Pro Async .NET
    severity: must
    artifacts: [code]
    text: During asynchronous I/O, release the request thread back to the thread pool instead of blocking it.

  - id: CP-47
    name: Do not evaluate a model on its training data
    source: Round11 - Intro ML with Python
    severity: must
    artifacts: [code]
    text: Never use the same data to build a model and to evaluate it; evaluation must use held-out data.

  - id: CP-48
    name: Hold out a test set, prefer cross-validation
    source: Round11 - Intro ML with Python
    severity: should
    artifacts: [code, spec]
    text: Hold out a test set for evaluation; prefer cross-validation when data is scarce rather than a fixed split.

  - id: CP-49
    name: Let the data structure contract drive algorithm choice
    source: Round11 - Data Structures and Algorithms
    severity: should
    artifacts: [code, spec]
    text: A data structure's contract (sorted order, random access) determines which algorithms are safe on it; choose the algorithm whose preconditions the structure actually satisfies, and design structures so their contract matches the operations needed.
  - id: CP-50
    name: Types carry the invariant
    source: Round11 consolidation - deep-module family parent
    severity: should
    artifacts: [code, spec]
    text: PS-02 instantiated at the type level - a type is a deep module whose interface is the set of expressible values and whose implementation is the invariant - design types so illegal states and transitions are unrepresentable. Parent of family - children are the techniques - CP-08, CP-13, CP-22, CP-23, CP-24, CP-25. Related - PS-02, PS-03.
  - id: RSI-01
    name: Separate RSI decision classes
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [skill, spec, code]
    text: When analyzing an RSI system, the artifact must show AI-controlled decisions, fixed search procedures, and human acceptance criteria listed as three distinct classes with no member in two classes.
  - id: RSI-02
    name: Two-part phase output check
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [skill, spec]
    text: When a phase completes, the artifact must show evidence that the predefined procedure executed correctly and that the output artifact passed validity checks before entering downstream workflows.
  - id: RSI-03
    name: Closed learning loop trace
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [skill, code]
    text: When claiming experience autonomy, the artifact must show a trace linking learner state, acquisition log, learning update, and next acquisition policy, with each round's acquisition decision computed from the persisted learner state.
  - id: RSI-12
    name: Append-only session log
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [agent-instruction, skill]
    text: When session logging is used, the artifact must show new entries appended without deletion, overwrite, or summarization of earlier entries.
  - id: RSI-13
    name: Durable state in files
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [agent-instruction, code]
    text: When a harness keeps durable state, the artifact must show that state stored in files rather than held only in the model's context window.
  - id: RSI-14
    name: Explicit parallelism
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [agent-instruction, skill]
    text: When a harness runs parallel work, the artifact must show parallelism declared explicitly as named branches and joins and inspectable in logs.
  - id: RSI-40
    name: Auditable lineage with rollback
    source: Round4 RSI - loop integrity
    severity: should
    artifacts: [skill, code]
    text: When a system self-modifies, the artifact must show a complete archive of code changes and evaluations sufficient for rollback and post-hoc analysis.
  - id: RSI-04
    name: Irreversible-effect deployment gate
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When a system has irreversible effects, the artifact must show a rollback procedure, a monitoring window with a stated duration, and a named approving authority recorded before deployment.
  - id: RSI-16
    name: Security outside self-edit loop
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When a loop edits its own harness, the artifact must show permission-control and security layers located outside that loop and unreachable by its edits.
  - id: RSI-19
    name: Evaluator outside evolving loop
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [agent-instruction, skill, code]
    text: When a loop evolves a harness, the artifact must show the evaluator and permission control running outside the loop, with held-out tests, trace audits, and human review at decision points.
  - id: RSI-20
    name: Named approval gate before irreversible action
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [agent-instruction, skill]
    text: Before any irreversible or externally visible action, the artifact must show a named human approval gate with its required inputs declared.
  - id: RSI-21
    name: Role-scoped agent permissions
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [agent-instruction, code]
    text: When multiple agents share a system, the artifact must show read and write permissions of each agent scoped to its role and stated in a permissions manifest.
  - id: RSI-26
    name: Sensitive-package blocklist
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When generated programs execute, the artifact must show a blocklist of sensitive packages (for example os, sys, shutil) enforced in the execution sandbox.
  - id: RSI-34
    name: Containerized execution of generated code
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When code is generated by an agent, the artifact must show it executed in a containerized, isolated environment.
  - id: RSI-36
    name: Sandboxed self-modification
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When agents self-modify, the artifact must show all execution and self-modification running inside isolated sandboxes.
  - id: RSI-37
    name: Per-execution time limit
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When sandboxed executions run, the artifact must show a strict time limit enforced on each execution, with the limit value stated.
  - id: RSI-39
    name: Sandbox network and host restrictions
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When experiment agents run, the artifact must show limited network access and absence of host-modification capability, enforced by sandbox config.
  - id: RSI-41
    name: Re-verify before unsandboxed deployment
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When an agent produced by self-modification leaves the sandbox, the artifact must show re-verification results recorded before deployment.
  - id: RSI-43
    name: Sandbox resource limits on generated code
    source: Round4 RSI - isolation and safety
    severity: must
    artifacts: [code, spec]
    text: When agent-generated code executes, the artifact must show enforced timeouts and restricted internet access in the sandbox configuration.
  - id: RSI-15
    name: Promotion needs no regression on both splits
    source: Round4 RSI - evolution gates, family child of RTL-05. Merges RSI-48, RSI-49, RSI-51
    severity: must
    artifacts: [code, spec]
    text: When a promotion candidate is accepted, the artifact must show no regression on both held-in and held-out splits, a validation score strictly above its parent, and no split traded off against the other even when total pass count rises.
  - id: RSI-42
    name: Held-out split invisible to the proposer
    source: Round4 RSI - evolution gates, family child of CP-48. Merges RSI-54
    severity: must
    artifacts: [code, spec]
    text: When evaluation spans domains, the artifact must show separate held-out tasks per domain and a held-out split never shown to the proposer, used only by the promotion gate.
  - id: RSI-52
    name: Comparable run record
    source: Round4 RSI - evolution gates. Merges RSI-53
    severity: must
    artifacts: [code, spec]
    text: When a candidate is evaluated, the artifact must show recorded changed surfaces, split-wise outcomes, evaluation repeats, proposal summary, accept or reject decision, and the unchanged decoding config, budget, tool set and evaluator.
  - id: RSI-35
    name: Archive admission gate
    source: Round4 RSI - evolution gates
    severity: must
    artifacts: [code, spec]
    text: When agents are archived, the artifact must show admission conditioned on successful compilation and retained ability to edit a codebase, with failures discarded and logged.
  - id: RSI-59
    name: Differential tests against the reference before promotion
    source: Round4 RSI - evolution gates. Merges RSI-60
    severity: must
    artifacts: [code, spec]
    text: When a proposal modifies a working artifact, the artifact must show passing differential or property tests against the unmodified reference before promotion, including a randomized-input comparison when the change touches numerical code.
  - id: RSI-05
    name: Permutation crossover invariant
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a crossover operator runs on permutations, the artifact must show that offspring contain exactly the parent's elements with only order changed, verified by an element-set equality check in tests.
  - id: RSI-07
    name: Pinned confounds in comparisons
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When two methods are compared, the artifact must show the discovery agent, evaluator, initialization, and resource constraints recorded as identical for both arms.
  - id: RSI-09
    name: Declared context per stage
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a workflow has stages, the artifact must show, for each stage, the list of domain facts available to the model at that stage.
  - id: RSI-10
    name: Raw-data grounding
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When results are collected, the artifact must show evaluation inputs drawn from raw data, not from LLM-generated interpretations of the data.
  - id: RSI-11
    name: Per-module tests in decomposition
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When coding work is decomposed into modules, the artifact must show a test per module such that a failure localizes to one module without rerunning others.
  - id: RSI-22
    name: Declared dataset input contract
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a method is trained, the artifact must show the exact input dataset required, stated as a data contract such as prompt-response pairs only.
  - id: RSI-23
    name: Sole declared data source
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a method claims to reuse existing data, the artifact must show that no data source beyond the declared one was used, in a recorded data manifest.
  - id: RSI-25
    name: Declared solvability band
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When tasks are selected for a solver, the artifact must show a stated solvability band, for example the current solver's success rate between named lower and upper bounds measured on a probe set.
  - id: RSI-27
    name: Deterministic-program acceptance
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When learner-generated programs must have verifiable answers, the artifact must show acceptance restricted to the class of deterministic programs.
  - id: RSI-28
    name: Bug definition check
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a benchmark seeds bugs, the artifact must show a definition under which a bug compiles and fails at least one unit test, applied automatically to every seeded bug.
  - id: RSI-29
    name: Invalid-bug penalty and quarantine
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a generator produces candidate bugs, the artifact must show invalid ones that do not compile and fail a test penalized and withheld from the fixer, recorded in the pipeline log.
  - id: RSI-30
    name: No generator update on reference bugs
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When reference bugs exist in training, the artifact must show the generator received no update on those episodes.
  - id: RSI-38
    name: Explicit objective for self-modification
    source: Round4 RSI - task and data design
    severity: should
    artifacts: [spec, code]
    text: When a self-modification loop runs, the artifact must show it scoped to a named, measurable objective with its metric stated.
  - id: RSI-31
    name: Actionable and specific feedback
    source: Round4 RSI - feedback quality. Merges RSI-32
    severity: should
    artifacts: [agent-instruction, skill]
    text: When feedback is issued to a generator, the artifact must show each feedback item naming concrete phrases in the output to change and the concrete action expected to improve it.
  - id: RSI-33
    name: Signed inspection checklist per version
    source: Round4 RSI - feedback quality
    severity: should
    artifacts: [skill, spec]
    text: When a generated agent version ships, the artifact must show a recorded inspection checklist with a sign-off entry for that version.
  - id: RSI-44
    name: Recorded sign-off checkpoints
    source: Round4 RSI - feedback quality
    severity: should
    artifacts: [agent-instruction, handoff]
    text: When experiments run under human oversight, the artifact must show recorded review points with sign-offs at declared checkpoints.
  - id: RSI-63
    name: Claim-evidence chain verified before finalization
    source: Round4 RSI - verification and integrity. Merges RSI-64, RSI-68
    severity: must
    artifacts: [skill, spec]
    text: When a claim appears in an artifact, the artifact must show a recorded evidence chain from the claim to a grounding source, a named verifier step that checked every claim against its declared source before finalization, and a pass that removed or marked unsupported claims.
  - id: RSI-61
    name: Source and citation verification beyond existence
    source: Round4 RSI - verification and integrity. Merges RSI-62, RSI-65, RSI-71, RSI-73
    severity: must
    artifacts: [skill, spec]
    text: When a draft cites a source reported by a model, the artifact must show each original checked to exist in a scholarly or API record, described consistently with that record, and each model-produced simplification cross-checked against the original.
  - id: RSI-66
    name: Number-to-output trace
    source: Round4 RSI - verification and integrity
    severity: must
    artifacts: [skill, spec]
    text: When a numerical claim is reported, the artifact must show a trace from the reported value to a recorded output.
  - id: RSI-67
    name: Method and score conformance to the implementation
    source: Round4 RSI - verification and integrity. Merges RSI-69, RSI-70
    severity: must
    artifacts: [skill, spec]
    text: When a claim about method or score is made, the artifact must show a resolution from the method description to the implementation location and a re-run of the reported score on the golden evaluator, with evaluator reverse-engineering and hardcoded-answer shortcuts declared as violations.
  - id: RSI-72
    name: Verification criteria and their false-negative bound
    source: Round4 RSI - verification and integrity. Merges RSI-74
    severity: must
    artifacts: [skill, spec]
    text: When a verification or alignment judgement ships, the artifact must show the criterion applied to each case and an estimated or bounded false-negative rate for the check.
  - id: RSI-17
    name: File-system action space
    source: Round4 RSI - agent edit contract
    severity: must
    artifacts: [code, spec]
    text: When a harness component is editable, the artifact must show a file-system representation of that component so the full action space is enumerable from the tree.
  - id: RSI-18
    name: Falsifiable edit with next-round prediction
    source: Round4 RSI - agent edit contract
    severity: must
    artifacts: [code, spec]
    text: When an edit is proposed, the artifact must show a falsifiable file-level prediction attached to it and a record of the next round's verification outcome.
  - id: RSI-55
    name: Four-part edit record
    source: Round4 RSI - agent edit contract
    severity: must
    artifacts: [code, spec]
    text: When a harness edit is made, the artifact must show the behavior it aims to change, the surface it modifies, the evidence motivating it, and the evaluation result justifying promotion.
  - id: RSI-56
    name: Recorded, testable, reversible changes
    source: Round4 RSI - agent edit contract
    severity: must
    artifacts: [code, spec]
    text: When a harness evolves, the artifact must show each change recorded, covered by a test, and reversible, grounded in behavioral evidence rather than rationale alone.
  - id: RSI-76
    name: May and may-not instruction lists
    source: Round4 RSI - agent edit contract
    severity: must
    artifacts: [agent-instruction, code]
    text: When agent instructions are written, the artifact must show an explicit separation of permitted actions from forbidden actions.
  - id: RSI-77
    name: Single writable file declared
    source: Round4 RSI - agent edit contract. Absorbs RSI-50
    severity: must
    artifacts: [agent-instruction, code]
    text: When an agent edits code, the artifact must show the one writable file declared, and diffs touching any other file rejected.
  - id: RSI-75
    name: Explicit wall-clock budgets
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [agent-instruction, skill]
    text: When time budgets are set, the artifact must show them explicit, wall-clock measured, and stated independently of hardware.
  - id: RSI-79
    name: Declared ground-truth metric
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [spec, code]
    text: When an optimization task is defined, the artifact must show a single ground-truth metric function declared and marked immutable.
  - id: RSI-80
    name: Single declared optimization objective
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [spec, code]
    text: When an agent optimizes, the artifact must show the objective as one declared, automatically computable metric.
  - id: RSI-81
    name: Runtime-only admissibility constraint
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [spec, code]
    text: When acceptance is defined for runs, the artifact must show the admissibility constraint stated as crash-free completion within the time budget, checked on run logs.
  - id: RSI-84
    name: Kill-and-revert on timeout
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [agent-instruction, code]
    text: When a run exceeds its time limit, the artifact must show it killed and treated as a failure with discard and revert recorded.
  - id: RSI-85
    name: Fixed eval parameters for comparability
    source: Round4 RSI - objective and metric
    severity: should
    artifacts: [spec, code]
    text: When results must be comparable across configs, the artifact must show evaluation parameters such as sequence length fixed and recorded in the evaluator.
  - id: RSI-06
    name: Frozen-surface manifest
    source: Round4 RSI - oversight and harness fidelity
    severity: must
    artifacts: [skill, spec]
    text: When improvement is attributed to one component, the artifact must show a manifest listing every other component held fixed for the comparison.
  - id: RSI-24
    name: Human-ranking agreement gate
    source: Round4 RSI - oversight and harness fidelity
    severity: must
    artifacts: [agent-instruction, skill]
    text: When generated evaluations enter training, the artifact must show their score order agreeing with human rankings in the dataset before admission.
  - id: RSI-45
    name: Declared reward-hacking guardrails
    source: Round4 RSI - oversight and harness fidelity
    severity: must
    artifacts: [agent-instruction, skill]
    text: When an outer loop guards against reward hacking, the artifact must show the declared list of hacking patterns the loop guards against.
  - id: RSI-57
    name: First-class deployment requirements
    source: Round4 RSI - oversight and harness fidelity
    severity: must
    artifacts: [spec, PRD]
    text: When a self-evolving system is designed, the artifact must show privacy, consent for data retention, update reversibility, auditability, and human oversight addressed as named design requirements.
  - id: RSI-08
    name: Rejection criterion before output
    source: Round4 RSI - task qualification
    severity: must
    artifacts: [agent-instruction, skill]
    text: When a human reviews model output, the artifact must show a concrete rejection criterion for the task stated before the model output was produced.
  - id: RSI-46
    name: Solver-discrimination criterion for verifiable tasks
    source: Round4 RSI - task qualification
    severity: must
    artifacts: [spec, code]
    text: When a task is verifiable and used to discriminate solvers, the artifact must show majority vote correct over the strong solver and wrong over the weak solver as the acceptance criterion.
  - id: RSI-47
    name: Judge-measured quality gap
    source: Round4 RSI - task qualification
    severity: must
    artifacts: [spec]
    text: When a task is not verifiable, the artifact must show a quality gap measured by the judge between solvers as the acceptance criterion, with the judge named.
  - id: RSI-58
    name: Automated feedback signal prerequisite
    source: Round4 RSI - task qualification
    severity: must
    artifacts: [agent-instruction, skill]
    text: When a self-improvement loop is applied to a task, the artifact must show an automated feedback signal for that task, or the task excluded from the loop's scope.

  - id: ME-03
    name: Declare the supported input range as a contract
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, PRD]
    text: When a component's input is bounded, the artifact must show the supported range as a contract with the behaviour outside it.

  - id: ME-05
    name: Measure only inside the linear regime
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec]
    text: When a model or calibration is fitted, the artifact must show the fitting restricted to the monotonic regime and the regime boundary declared as a calibrated parameter.

  - id: ME-07
    name: Keep the drive below the regime-change threshold
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When increasing retries, timeouts, or load, the artifact must show the value kept below the point where the failure mode changes.

  - id: ME-08
    name: State the typical region, not a requirement
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, PRD]
    text: When behaviour varies, the artifact must show the typical regime and the guaranteed regime as separate statements.

  - id: ME-09
    name: Decouple coupled effects before measuring
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When two effects overlap, the artifact must show them separated so each is measured independently.

  - id: ME-10
    name: Derive the parameter from the accuracy target
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When a parameter sets sensitivity or precision, the artifact must show it derived from the required accuracy.

  - id: ME-12
    name: Match the interface to the consumer
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When two components connect, the artifact must show the interface shaped to the consumer's form, with an explicit adapter where it is not.

  - id: ME-13
    name: Truncate contributions beyond the sensing depth
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [code, spec]
    text: When only part of a signal is observable, the artifact must show the truncation bound derived from the sensing depth and stated as a parameter.

  - id: ME-16
    name: Make every threshold a derived parameter
    source: Round8 Microelectronics and RTL-to-GDS
    severity: must
    artifacts: [code]
    text: A numeric threshold that decides behaviour must be derived from a stated quantity or declared as a configuration parameter. A bare literal is a violation.

  - id: ME-19
    name: Stay below the irreversible-degradation limit
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When a process can degrade its input irreversibly, the artifact must show the operating limit below that point and the limit named.

  - id: ME-20
    name: Isolate incompatible conditions behind a boundary
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, PRD]
    text: When two required conditions conflict, the artifact must show them in separate zones with the boundary and the gradient between them stated.

  - id: ME-22
    name: Derive the buffer from the response-time budget
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [code, spec]
    text: When a buffer or queue size is chosen, the artifact must show it derived from the target response time, not picked by feel.

  - id: ME-25
    name: Give each concurrent task a disjoint write set
    source: Round8 Microelectronics and RTL-to-GDS
    severity: must
    artifacts: [code, skill]
    text: When tasks run concurrently, the artifact must show each task's write set and that no two write sets intersect.

  - id: ME-28
    name: Prove termination without assuming fairness
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [spec, code]
    text: When a concurrent system terminates, the artifact must show a termination argument that holds without assuming a fair scheduler.

  - id: ME-31
    name: Write build outputs to declared paths
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [code, spec]
    text: When a build produces artifacts, the artifact must show one declared output directory per artifact kind and no output written elsewhere.

  - id: ME-32
    name: Resolve toolchain roots from the environment
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [code]
    text: When a tool locates its toolchain, the artifact must show the root read from the environment and every path derived from that root.

  - id: ME-37
    name: Reject a bad invocation with usage and a nonzero exit
    source: Round8 Microelectronics and RTL-to-GDS
    severity: must
    artifacts: [code]
    text: When the arguments are invalid, the artifact must show a usage message on stderr and a nonzero exit code.

  - id: ME-38
    name: Validate the config against a declared schema
    source: Round8 Microelectronics and RTL-to-GDS
    severity: should
    artifacts: [code, spec]
    text: When a config file drives a run, the artifact must show a declared schema and validation against it before work starts.

  - id: NS-1
    name: Assert structural invariants explicitly
    source: Round7 Neurosymbolic Understanding
    severity: should
    artifacts: [code]
    text: A structural invariant of a data structure (e.g. alternating net/cell levels in a timing graph, hence an even level count) must be asserted where the structure is built or validated. An invariant breach must stop the run.

  - id: NS-2
    name: Disclose AI use in every pull request
    source: Round7 Neurosymbolic Understanding
    severity: should
    artifacts: [code, agent-instruction]
    text: When opening a PR, account for AI usage as required by the repo's PR template and AI policy - disclose the tool or agent used (and the model) and which files or line ranges were AI-generated. If in doubt, disclose.

  - id: NS-5
    name: Mark fully AI-generated commits
    source: Round7 Neurosymbolic Understanding
    severity: should
    artifacts: [code, agent-instruction]
    text: If an entire commit is generated by AI, specify it in the commit message; a Co-Authored-By line is sufficient. Do not include agent session links in commit messages.

  - id: NS-7
    name: Let exceptions propagate
    source: Round7 Neurosymbolic Understanding
    severity: should
    artifacts: [code]
    text: Do not silence exceptions. A library bubbles exceptions up to the caller with their full tracebacks; catching and hiding a failure masks invariant breaches (see PS-FIXER-03).

  - id: NS-8
    name: Imports at module top
    source: Round7 Neurosymbolic Understanding
    severity: should
    artifacts: [code, agent-instruction]
    text: Add imports at the top of a file, not inside functions. The only exception is an import deferred to avoid a circular import. External package imports go through the project's external-import shim.

  - id: CS-01
    name: Generated artifacts stay in step with their source
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec, skill]
    text: Every generated artifact (web app, npm package, exports) must be derived from the authoritative source and regenerated in lockstep with it. A diff that changes the source without the derived artifacts is incomplete. (XW-5)

  - id: CS-02
    name: Authoritative source, not summaries
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, skill]
    text: Author mappings and claims against the authoritative framework text (standard, regulation, specification), never against secondary summaries. Partial overlap with RSI-61, which verifies citations; this rule bans summaries as authoring input. (XW-10)

  - id: CS-03
    name: No severity change without evidence
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: A severity rating must not change without a cited external score (AIVSS, CVSS from an associated CVE, or the OWASP source list definition). Partial overlap with RSI-63. (XW-12)

  - id: CS-04
    name: Vendor-neutral by design
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, skill]
    text: Map to framework controls, not to specific vendor products or configurations. An artifact recommending a commercial product where a control reference works fails this rule. (XW-14)

  - id: CS-05
    name: Dispute needs primary source
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: A dispute over a mapping or classification is resolved only when both sides cite a primary source (framework document, CVE, project page). Partial overlap with RSI-61. (XW-18)

  - id: CS-06
    name: No vendor recommendations
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, skill]
    text: Do not recommend specific commercial vendors or paid tools; catalogue open-source options only (dual-licensed commercial-open-source allowed). (XW-19)

  - id: CS-07
    name: Deprecate, never delete
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec, skill]
    text: Superseded mappings or entries are deprecated with an explicit reason marker, never silently removed, so consumers can see what changed. Partial overlap with RSI-40. (XW-20)

  - id: CS-08
    name: Conflict-of-interest disclosure
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: A contributor employed by, or with a commercial interest in, a framework body must disclose it in the PR. (XW-21)

  - id: CS-09
    name: Incident index scope is narrow
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: An incident index records real-world deployment failures, nothing else. Partial overlap with RSI-22. (XW-22)

  - id: CS-10
    name: Lab attack is not an incident
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: A laboratory attack or a proof-of-concept the researchers ran themselves is literature, not an incident; it belongs in the research track, not the incident index. (XW-23)

  - id: CS-11
    name: Security judgment is DRAFT until a human signs it
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [agent-instruction, spec]
    text: Which taxonomy entry a benchmark, incident, or artifact exemplifies is a security judgment. An agent may propose it only as DRAFT; it becomes asserted only when a named reviewer signs off. Partial overlap with HUMAN-JUDGMENT-FINAL. (XW-26)

  - id: CS-12
    name: Kill switch outside the agent
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, agent-instruction, spec]
    text: A kill switch must live at the infrastructure layer, outside the agent's process tree and interfaces. A compromised or rogue agent cannot be trusted to honour a kill command sent through its own interface. Partial overlap with RSI-16. (XW-30)

  - id: CS-13
    name: OT severity assessed separately
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD]
    text: Do not assume IT severity translates to OT contexts. OT-facing deployments get a separate severity assessment because impact includes physical and safety consequences. (XW-33)

  - id: CS-14
    name: Scaffold files declare SME-review-required status
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, agent-instruction]
    text: A deliberately incomplete scaffold file must state that SME review is required and must not present its gaps as final content. Partial overlap with HUMAN-JUDGMENT-FINAL. (XW-38)

  - id: CS-15
    name: Agent does not author judgment columns
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, agent-instruction]
    text: Judgment columns in a mapping or rubric read DRAFT until a named human reviewer fills them; an agent must not write them. Partial overlap with HUMAN-JUDGMENT-FINAL. (XW-39)

  - id: CS-16
    name: Requirement form is "Verify that"
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, skill]
    text: Write each requirement to be independently verifiable and start it with the words "Verify that". Partial overlap with RSI-72. (XW-45)

  - id: CS-17
    name: Threat enumeration precedes control selection
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, plan]
    text: Enumerate threats (by architectural layer) before selecting controls from any framework; a control chosen before its threat is named is unanchored. (XW-50)

  - id: CS-18
    name: LLMs never in control zones
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec, PRD]
    text: An LLM component must never be deployed in ISA-62443 Zone 1 or Zone 2; any LLM integration sits behind at least one conduit from control systems. Partial overlap with RSI-39. (XW-51)

  - id: CS-19
    name: Air-gapped training for OT-deployed models
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: A training pipeline for a model deployed in OT must be air-gapped or strictly isolated — no internet-connected training infrastructure. Partial overlap with RSI-43. (XW-52)

  - id: CS-20
    name: full_internet means zero restriction
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: When a task environment declares full_internet, the machines carry no egress restrictions at all; the flag is total, not partial. Downgraded from must at merge (eval-harness specific, not a general must). (TS-7)

  - id: CS-21
    name: Aux VM and primary machine mutually reachable
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: Even under network restriction, the aux VM and the primary machine must reach each other; a design that strands one is invalid. (TS-9)

  - id: CS-22
    name: Missing capability fails the build, never degrades
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, agent-instruction]
    text: A driver or component lacking a required capability (e.g. aux-VM support) must fail the build rather than silently degrade. Partial overlap with PS-FIXER-03. (TS-10)

  - id: CS-23
    name: Agent is barred from root
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, agent-instruction]
    text: The agent must not start processes as root on the primary machine; a dedicated unprivileged user is the ceiling. Partial overlap with RSI-39. (TS-11)

  - id: CS-24
    name: Scoring modes are exclusive
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: A contract must not implement both end scoring and intermediate scoring (score vs intermediate_score/aggregate_scores); pick one mode. Partial overlap with CP-22. (TS-13)

  - id: CS-25
    name: Build-time install has internet regardless of runtime policy
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: The build/install phase gets network access even when the runtime denies it; do not leak runtime restrictions into the build. (TS-14)

  - id: CS-26
    name: Permissions default to the empty list
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, spec]
    text: Absent an explicit declaration, permissions default to the empty list — default-deny, never default-allow. Partial overlap with RSI-21. (TS-15)

  - id: CS-27
    name: Human approval gates every agent action in dangerous-capability runs
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [agent-instruction, diagnose]
    text: In an evaluation or run that exercises dangerous capabilities, every agent action requires approval from the overseeing human, with an auditable log. Partial overlap with RSI-20. (DC-3)

  - id: CS-28
    name: Weakest link caps the assurance claim
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [spec, PRD, handoff]
    text: A composite assurance claim is capped by its weakest claim-relevant dimension (weakest-link composition); do not average away a weak dimension. Partial overlap with RSI-72. (SB-5)

  - id: CS-29
    name: Agent sandbox severs production tools and substitutes mocks
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [code, agent-instruction, diagnose]
    text: A test or eval sandbox must disconnect production business tools (live email, ticketing, CRM) and substitute mock services and dummy accounts. Partial overlap with RSI-39. (RT-2)

  - id: CS-30
    name: Pass oracle lives at the runtime, not the model
    source: Round15 Cybersecurity and Isolation
    severity: should
    artifacts: [agent-instruction, spec, diagnose]
    text: A permission or safety test passes only if the runtime refuses the disallowed call; a model's refusal is not a stable oracle and can change with a version bump. Partial overlap with RTL-08. (RT-6)

---

# Principles Catalog

This file is the source of truth for `to-violations` skill.
It merges principles from `"$USER_HOME/Agentic-Engineering/.docs/PRINCIPLES_FOR_SKILLS_AND_SUBAGENTS.md"`, `"$USER_HOME/Agentic-Engineering/.docs/RTL-to-GDS_PRINCIPLES.md"` and `"$USER_HOME/Agentic-Engineering/.docs/SAKANA_DEEPSEEK_PRINCIPLES.md"` (example local checkout).

## How to use

Reference a principle by its `id` in a violation report.
Use `severity` to rank fixes.
Use `artifacts` to decide whether the principle applies to the file under review.
