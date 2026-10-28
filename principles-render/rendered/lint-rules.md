# Lint rules

Mechanical checks run by the compliance gate.

## Mechanical voice checks

| ID | Check | Tool |
|---|---|---|
| VOICE-20 | Sentences under 20 words. | ste-lint.py (long_sentence) |
| VOICE-SEMICOLON | No semicolons. | ste-lint.py (semicolon) |
| VOICE-CONTRACTION | No contractions. | ste-lint.py (contraction) |
| VOICE-PASSIVE | Active voice preferred. | ste-lint.py (passive_voice) |
| VOICE-MARKETING | No marketing adjectives. | ste-lint.py (marketing_adjective) |

## Principle-linked checks

| ID | Principle | Check | Tool |
|---|---|---|---|
| CHOOSE-PRECISE-NAMES | One name for one thing | No vague labels or banned synonyms. | ste-lint.py (banned_word, vague_noun) |
| PS-01 | Zero tolerance for ad-hoc hacks | Reject ad-hoc hacks in skills. | human-judged |
| PS-04 | Design before code | Design decision stated before code. | human-judged |
| PS-06 | Do not trust a result without verification | Every factual claim has trusted tool or human evidence. | human-judged |
| PS-CODER-02 | Verify before returning | Diff compared against acceptance criteria. | human-judged |
| PS-TV-06 | Find bugs once | Regression test for every confirmed bug. | human-judged |
| RTL-08 | Trusted tool computes, LLM orchestrates, verification gate decides | Numeric/factual results come from trusted tools. | human-judged |
| RTL-2.1-03 | LEC gate checks regression equivalence | Regression tests pass after refactor. | human-judged |

## Human-judged principles

- RTL-01: Pipeline is a sequence of lowering stages
- RTL-02: Plan resources before detailed work
- RTL-03: Preserve machine-readable intermediate representation
- RTL-04: Every phase transition is a gate
- RTL-05: Optimization without regression is breakage
- RTL-06: State is a first-class citizen
- RTL-07: Agents communicate through typed channels
- RTL-09: Every step leaves a trace
- RTL-2.1-01: DRC gate checks lint, type, and architecture rules
- RTL-2.1-02: LVS gate compares PRD and implementation
- RTL-2.3-01: Model state machines explicitly
- RTL-2.3-03: Preserve invariants at every step
- RTL-2.3-04: Abstain when confidence is low
- PS-02: Deep modules beat wide modules
- PS-03: Hide information and do not repeat
- PS-05: Iterate with fast feedback
- PS-07: Separate concerns
- PS-08: Structured state and tool feedback
- PS-10: Human is final authority in assurance
- PS-WF-01: Work iteratively
- PS-WF-03: Stage gates and sequential dependency
- PS-TV-01: Solver-grounded design
- PS-TV-02: Safe failure and abstention
- PS-TV-03: Clear division of labor
- PS-TV-04: Read versus write distinction
- PS-CODER-01: Design first
- PS-CODER-04: Write or update tests
- PS-CODER-05: Stay calm on failures
- PS-TESTER-01: Argument each failure or risk
- PS-TESTER-02: Verify evidence relevance
- PS-TESTER-03: Cover edge states
- PS-TESTER-04: Report is input to human judgment
- PS-FIXER-01: Focus on root cause
- PS-FIXER-02: Reproduce before fixing
- PS-FIXER-03: Crash early on invariant violation
- PS-FIXER-04: Explain why the fix works
- PS-FIXER-05: Re-run regression checks
- HALT: Read before write
- FOG-OF-WAR: Treat diagnosis as hypothesis
- SCOPE-LOCK: One task per artifact
- VERIFY-BEFORE-RETURN: Verify claims before done
- HUMAN-JUDGMENT-FINAL: Agent does not self-certify
- SK-01: Coordination is a learned ability, not a hand-designed scaffold
- SK-02: Specify workflows in natural language
- SK-03: "Separate roles: Thinker, Worker, Verifier"
- SK-10: Reward must be verifiable
- SK-11: Trace source-to-sink and separate data from authority
- SK-12: Capability is model plus scaffold
- SK-ORCH-01: Emergent coordination from end-to-end reward
- SK-ORCH-02: Communication topology as an explicit design object
- SK-ORCH-03: Verifier is the terminal condition
- SK-ORCH-07: Configurable pools encode constraints
- SK-RL-01: Progressive format and correctness rewards
- SK-RL-03: Remove manual constraints on strategy
- DS-SEC-01: Model indirect injection as source-to-sink
- DS-SEC-02: Preserve provenance at the model boundary
- DS-SEC-03: Authorize sensitive sinks independently
- DS-SEC-04: Treat skills and integrations as code-adjacent assets
- CP-02: Reuse objects instead of re-creating them
- CP-03: Null out obsolete references in self-managed memory
- CP-06: Obey the equals contract
- CP-07: Override hashCode whenever equals is overridden
- CP-11: Do not use raw types
- CP-14: Use the Override annotation consistently
- CP-15: Program defensively with defensive copies
- CP-17: Enable noImplicitAny in new projects
- CP-18: Understand the dangers of any before using it
- CP-19: Prefer type declarations to type assertions
- CP-20: Prefer type aliases for internal types
- CP-25: Prefer narrower types over string
- CP-27: Ask for a precise type before any
- CP-28: Use unknown instead of any
- CP-29: Synchronize access to shared mutable state
- CP-30: Confine mutable data to avoid sharing
- CP-31: Publish shared objects safely
- CP-32: Make compound actions atomic
- CP-33: Synchronize for memory visibility
- CP-35: Do not let this escape during construction
- CP-36: Avoid client-side locking on foreign objects
- CP-37: Do not swallow InterruptedException
- CP-39: Acquire locks in a fixed global order
- CP-40: Return Task, not async void
- CP-41: Synchronize without serializing the program
- CP-42: Do not lock on this or public objects
- CP-43: Prefer timed waits on locks
- CP-44: Do not rely on WhenAny for large task sets
- CP-45: Do not parallelize order-sensitive loops
- CP-46: Release the thread during async I/O
- CP-47: Do not evaluate a model on its training data
- RSI-04: Irreversible-effect deployment gate
- RSI-16: Security outside self-edit loop
- RSI-19: Evaluator outside evolving loop
- RSI-20: Named approval gate before irreversible action
- RSI-21: Role-scoped agent permissions
- RSI-26: Sensitive-package blocklist
- RSI-34: Containerized execution of generated code
- RSI-36: Sandboxed self-modification
- RSI-37: Per-execution time limit
- RSI-39: Sandbox network and host restrictions
- RSI-41: Re-verify before unsandboxed deployment
- RSI-43: Sandbox resource limits on generated code
- RSI-15: Promotion needs no regression on both splits
- RSI-42: Held-out split invisible to the proposer
- RSI-52: Comparable run record
- RSI-35: Archive admission gate
- RSI-59: Differential tests against the reference before promotion
- RSI-63: Claim-evidence chain verified before finalization
- RSI-61: Source and citation verification beyond existence
- RSI-66: Number-to-output trace
- RSI-67: Method and score conformance to the implementation
- RSI-72: Verification criteria and their false-negative bound
- RSI-17: File-system action space
- RSI-18: Falsifiable edit with next-round prediction
- RSI-55: Four-part edit record
- RSI-56: Recorded, testable, reversible changes
- RSI-76: May and may-not instruction lists
- RSI-77: Single writable file declared
- RSI-06: Frozen-surface manifest
- RSI-24: Human-ranking agreement gate
- RSI-45: Declared reward-hacking guardrails
- RSI-57: First-class deployment requirements
- RSI-08: Rejection criterion before output
- RSI-46: Solver-discrimination criterion for verifiable tasks
- RSI-47: Judge-measured quality gap
- RSI-58: Automated feedback signal prerequisite
- ME-16: Make every threshold a derived parameter
- ME-25: Give each concurrent task a disjoint write set
- ME-37: Reject a bad invocation with usage and a nonzero exit

