#!/usr/bin/env bash
# gate-commit.sh — verify the tree is green before a commit is accepted.
# Reads commands to run from arguments, or falls back to package.json scripts.
#
# Usage:
#   gate-commit.sh                 # runs typecheck, test, build from package.json
#   gate-commit.sh "npm run lint" "npm test"   # explicit commands
#
# Exit: 0 = all commands passed, non-zero = a command failed.

set -uo pipefail

commands=()

if [ "$#" -gt 0 ]; then
  commands=("$@")
else
  # Try package.json scripts in order; skip missing ones.
  for name in typecheck test build; do
    if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts['$name'] ? 0 : 1)" 2>/dev/null; then
      commands+=("npm run $name")
    fi
  done
  if [ "${#commands[@]}" -eq 0 ]; then
    echo "gate-commit: no args and no package.json scripts (typecheck/test/build) found" >&2
    echo "usage: gate-commit.sh [cmd1] [cmd2] ..." >&2
    exit 2
  fi
fi

for cmd in "${commands[@]}"; do
  echo "gate-commit: running -> $cmd"
  if ! eval "$cmd"; then
    echo "gate-commit: FAILED -> $cmd" >&2
    echo "commits with a red tree are not accepted. resume the builder; do not analyze on the fly." >&2
    exit 1
  fi
done

echo "gate-commit: all green (${#commands[@]} commands)"
exit 0
