---
name: live-loop
description: "Build an agent-runnable live-test runner (feedback loop) for desktop or hybrid apps: spawn, capture, watch markers, inject faults, stress, tree-kill. Use when /skill:diagnose Phase 1 needs a live signal or a bug shows only in a real window."
disable-model-invocation: true
---

# Live Loop

A live loop is one command that runs the real app, captures everything, decides pass or fail, and cleans up. Build it before diagnosing any live-only bug.

Parent discipline: `/skill:diagnose`, Phase 1. Its words, verbatim:

> "This is the skill. Everything else is mechanical."

> "If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause."

> "Spend disproportionate effort here. Be aggressive. Be creative. Refuse to give up."

> "A 30-second flaky loop is barely better than no loop. A 2-second deterministic loop is a debugging superpower."

## Hard principles

### Scope and signal

1. **Scope lock before building.** State what the loop runs, what it never touches, and how to check success. Wait for GO.
2. **Define markers before running.** List the log lines that mean pass, fail, and progress. The loop live-filters them. No marker list, no run.

### Truth

1. **A negative result is a result.** If the bug does not reproduce, say so. Label every inference from absence as inference. Do not claim a root cause you did not observe.
2. **The agent does not self-certify.** Present logs, counts, and durations. The author or a verification gate decides what they mean.

### Capture

1. **One command, unattended.** The agent runs the loop end to end without human input. No manual windows, no clicks by hand.
2. **Capture everything, raw.** Write stdout and stderr of every layer to one timestamped log file. Never trust a death you did not record.

### Kill and forensics

1. **Know the process forest before killing.** Wrappers spawn children, so measure which pid owns the window and the output. Assume your first tree model is wrong.
2. **Tree-kill, always.** Kill the whole forest from the root. `child.kill()` on a wrapper orphans the real process.
3. **Forensics must survive the kill.** Give every spawned process its own uniquely named log file. A respawn must not overwrite the log left by the dead process.

### Signal and time

1. **Time-box every run.** Set a duration cap and an optional early-stop regex. The loop never hangs forever.
2. **Non-intrusive stress first, real input last.** Start with programmatic moves and resizes. Real mouse input is a last resort and hijacks the cursor.
3. **Fault injection beats waiting.** Do not wait for a rare crash. Kill the process externally at a chosen second to exercise respawn and recovery on demand.

## Runner contract

Core options:

| Option | Effect |
|---|---|
| `--duration N` | Kill the app N seconds in. |
| `--until <regex>` | Stop early when a log line matches. |
| `--keep-going` | Continue to `--duration` after `--until` matches. |

Stress and fault options:

| Option | Effect |
|---|---|
| `--label S` | Tag the log filename. |
| `--stress <mode>` | Run a stressor alongside the app. |
| `--kill-<target>-at N` | Externally kill a chosen process N seconds in. |

Exit code: `0` when the run completed and any `--until` marker matched. Nonzero otherwise.

## Build order

1. Read `/skill:diagnose` end to end, and restate its Phase 1 before writing code.
2. Map the launch chain and verify it with a live probe: command, wrappers, children, window owners.
3. Write the minimal runner: spawn, tee output to a timestamped log, tree-kill on timeout.
4. Add the marker filter and `--until`.
5. Add fault injection and stressors, one lever at a time.
6. Smoke-test the loop itself: marker matched, clean kill, logs complete.

## Challenge the loop

After the loop works, run `/skill:prototype` against the loop design itself. The question is: "Where am I wrong? What am I not seeing?" Attack at least:

1. Does the kill really kill? Check for orphan processes after the run.
2. Can the marker regex match a line that never comes from the real event?
3. Can the loop miss a fast death between polls?
4. Does the stressor reach the real input path, or a look-alike?
5. What did the original bug report include that the loop cannot produce?

Keep the probe throwaway. Record the answer, then delete or absorb it.

## Re-check the loop code

The runner is code, so review it as code:

1. Run a principle review on the runner and stressors.
2. Convert findings with `/skill:to-violations` into a fix spec: file, line range, acceptance criteria, one verification command per violation.
3. Fix, then re-run the loop against the original scenario.

## Done means

Run hygiene:

- [ ] One command runs the whole loop unattended.
- [ ] A full log lands on disk for every run.
- [ ] No orphan processes after the run (`tasklist` or equivalent).
- [ ] Forensics of a killed process survived its respawn.

Honesty:

- [ ] Markers fired, or the report states their absence.
- [ ] Every claim in the report cites a log file and a line.
- [ ] The report labels inferences as inferences.

## Reference implementation

`idle_calendar` repo: `.scratch/island-run.mjs` plus `.scratch/island-stress.py` and `.scratch/island-stress-real.py`. Built 2026-09-15 for a Tauri host, Godot renderer, and TS sidecar. Session report: `.docs/sessions/2026-09-15/statuses/2026-09-15_feedback-loop-renderer-soak.md`.
