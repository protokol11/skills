# Model catalog

Deterministic role→model selection. Source of truth is the user's model-eval data, NOT guesses:

- `$USER_HOME/Desktop/model-eval/.docs/models-specifics/catalog.md` — free-model table (`[ours]` = tested in our rotations, `[web]` = web benchmarks).
- `$USER_HOME/Desktop/model-eval/.docs/models-specifics/` (individual model files) — role/thinking advice per model.
- `$USER_HOME/Desktop/model-eval/.docs/pipeline-rules.md` — role rules (builder=thinking/high, critic=off, never mix).
- `$USER_HOME/Desktop/model-eval/.docs/comparison.md` — reviewer verdicts.

If a model changes or a new rotation lands a verdict, update this file from that source.

## Deterministic selection (pre-fill for the ask tool)

| Role | Model | Thinking | Why (eval verdict) |
|---|---|---|---|
| Builder (implement) | `deepseek/deepseek-flash` | high (features) / low (specs) | proven; nemotron built 6 mechanics but self-review missed critical |
| Slice-coder (final) | `kimi-coding/kimi-for-coding` | low | proven slice-coder (NOBADPDF + rotations) |
| Reviewer (OFF critic) | `deepseek/deepseek-v4-pro` | **off** | **best reviewer in eval: 9 violations incl. critical V001, missed nothing** |
| Verifier / critic (free) | `thinkingmachines/inkling:free` | off | symptom-strong, root-cause weak → root-cause needs grep/human |
| Eyes (vision) | `deepseek/deepseek-v4-flash-vision-exp` | low | owner-chosen vision lane |
| Scout (recon) | `nvidia/nemotron-3-ultra-550b-a55b:free` or `google/gemma-4-26b-a4b-it:free` | low | free recon, rotation 01 ✅ |

## Free fallbacks (from catalog, `[ours]`/`[web]`)

| Role | Free fallback | Note |
|---|---|---|
| Builder | `nvidia/nemotron-3-ultra-550b-a55b:free` (high) | rotation 01 ✅ two-mode |
| Builder | `nvidia/nemotron-3-super-120b-a12b:free`, `qwen/qwen3.8-27b:free` | `[web]` |
| Critic | `thinkingmachines/inkling:free` (off), `thinkingmachines/inkling-small:free` (off) | rotation 06/07: catches symptoms, root-cause weak |
| Eyes | `dots-studio/dots-3-note-preview:free` | vision fallback |

## Budget

- Paid default. `deepseek-flash` and `deepseek-v4-pro` (off) are cheap; the eval ran v4-pro review on ~68k tokens.
- Free models = fallback/recon ONLY. A free-only long run collapses on OpenRouter rate limits (overload, finish_reason error, 403) — already observed.
- The owner sets the budget in the ask tool. If they cap cost, downgrade builders first, NEVER the reviewer (v4-pro OFF is the only critic that caught critical V001).

## Rules

1. **Never mix roles.** Builder = thinking/high, critic = OFF. Builder does not self-review; critic does not write code (pipeline-rules.md).
2. Reviewer is always OFF. `deepseek-v4-pro:off` is the deterministic reviewer; free `inkling:free:off` only when the owner forces free.
3. The owner may override any role in the ask tool. The table above is the pre-fill, not a lock.
4. Model is pinned per slice; changing it = a new slice with fresh context.
5. Store the confirmed role table once; the whole session reads it.
