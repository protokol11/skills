# Wave planning

Rules for splitting a feature into specs and waves. Source: `.docs/PROTOTYPING PIPELINE.md`.

## Split specs by seam

One spec covers one seam and one owner. Split by code seams, not by user stages.

Order inside the set:

1. Pure refactors first. They are cheap, parallel, and de-risk later waves. Their result is a regression gate.
2. New mechanics isolated in a prototype.
3. Production integration last. It moves verified code only.

Several specs is the normal output. A single seam may need one spec.

## Waves

A wave is a set of specs that unblock the next wave.

- Specs inside a wave touch different files and stay independent.
- Wave N+1 waits for the verified result of wave N. The gate is a command, a case, or a recorded verdict.
- Every wave names one intermediate artifact: harness cases, a headless verifier, a prototype with screenshots, or an author verdict.

## Permanent prototypes

A prototype lives on after its verdict.

- **Inheritance.** A new prototype copies the verified frame of the previous one and adds one question.
- **Verdict is an artifact.** The author verdict and the final parameter JSON go into the prototype NOTES.
- **The prototype is the spec of the mechanic.** The production spec links to the NOTES. It does not duplicate the values.
- Prototype verifiers stay part of the pipeline. Run them on every iteration.

## Gates

1. **Spec gate** (before code). References verified by reconnaissance. Seam named. Out of scope explicit. Acceptance criteria are commands, not words.
2. **Wave gate.** Regression passed (typecheck, harness, grep gates). Intermediate artifact recorded in a session status or the prototype NOTES.
3. **Mechanic gate.** Author verdict recorded verbatim in the prototype NOTES. The agent does not certify readability.
4. **Transfer gate.** One source of the mechanic in production code (DRY grep). Production defaults equal the verdict values.
