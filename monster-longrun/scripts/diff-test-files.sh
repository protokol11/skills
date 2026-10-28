#!/usr/bin/env bash
# diff-test-files.sh — show the diff of test files since a base ref.
# Catches a builder that deleted/weakened a test (gate cheating).
#
# Usage:
#   diff-test-files.sh [base]     # base defaults to HEAD (unstaged+staged)
#
# Exit: 0 = diff produced (or none), non-zero on git error.

set -uo pipefail

base="${1:-HEAD}"

if ! git rev-parse --verify "$base" >/dev/null 2>&1; then
  echo "diff-test-files: invalid base ref '$base'" >&2
  exit 2
fi

echo "=== test-file changes vs $base ==="
# staged + unstaged + committed since base
git diff "$base" -- '*.test.*' '*.spec.*' '*.test.ts' '*.spec.ts' '*.test.tsx' '*.spec.tsx' '*.test.js' '*.spec.js' '*.test.mjs' '*.spec.mjs' 2>&1
git diff --cached -- '*.test.*' '*.spec.*' 2>&1
exit 0
