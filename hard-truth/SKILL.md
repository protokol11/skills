---
name: hard-truth
description: User reports a bug or "does not work as I wanted" and suspects the real cause is feature depth or module boundaries, not the visible symptom.
disable-model-invocation: true
---

# hard-truth

Find the first cause of a feature complaint and decide where the boundary of the module must move. Explore only. Change no code.

## Done

The skill is done when:

1. The symptom is reproduced and the first cause is located with evidence.
2. The user's actual intent is stated in domain terms.
3. A verdict is chosen and justified against the deep module reference.
4. The output is a verdict and a plan. No code changed.

## Phases

1. Locate the first cause. Reproduce the symptom. Trace it past the layer where the user reported it. The cause often sits in a different module than the complaint. Done when you can point at the line or design decision that makes the feature behave this way.
2. State the intent. Write what the user actually wanted in domain terms. One or two sentences. Compare it with what the current module's interface offers. Done when the gap between intent and interface is named.
3. Choose the verdict. Three options. (a) The feature design is sufficient. The code is wrong. Fix the code. (b) The feature is too shallow. Deepen it. Hide complexity behind a smaller interface. (c) The capability belongs in a separate module. See [REFERENCE.md](REFERENCE.md) for the deep module tests that separate (b) from (c).
4. Report the truth. Give the verdict, the evidence, and the plan. If the verdict is (b) or (c), the plan describes the new or deepened interface. The plan does not contain edits. Done when the user can accept or reject the verdict without further questions.

## Verdict fork

- (a) Code fix. No design change.
- (b) Deepen the existing module. Small interface, deep implementation.
- (c) Separate module. The capability varies or stands alone under the deletion test.

Never pre-limit the scale. If the truth is a new module, say so.
