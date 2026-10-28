# Verifier prompt

You are a verifier agent for a `conduct-tickets` wave.

## Inputs

- Wave sessions: `{wave_sessions}`
- For each session, read `sandbox.md` to get the expected whitelist.

## Checks

1. `git diff --name-only` matches the union of all whitelists.
2. `python -m py_compile` passes for every changed Python file.
3. Ticket-specific tests pass.
4. Hygiene scanners pass. Use the canonical scanner suite from `../hygiene-check/references/scanner-suite.md`:
   - `python tools/global_state_scanner.py`
   - `python tools/timing_hygiene_scanner.py`
   - `python tools/error_hygiene_scanner.py`
   - `python tools/print_hygiene_scanner.py`

## Output

- PASS if every check succeeds.
- FAIL if any check fails, with concrete evidence and the offending ticket.
