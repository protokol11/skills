#!/usr/bin/env bash
# worktree-snapshot.sh — capture `git status --porcelain` + `git diff --stat`
# to a timestamped file; optionally diff two snapshots.
#
# Usage:
#   worktree-snapshot.sh [--label S]         # write a snapshot
#   worktree-snapshot.sh --diff a.snap b.snap  # show what changed between two
#
# Exit: 0 = written, non-zero on error.

set -uo pipefail

SNAP_DIR="${MLR_SNAP_DIR:-.scratch/}"
mkdir -p "$SNAP_DIR"

if [ "$#" -ge 1 ] && [ "$1" = "--diff" ]; then
  if [ "$#" -lt 3 ]; then
    echo "usage: worktree-snapshot.sh --diff <a.snap> <b.snap>" >&2
    exit 2
  fi
  a="$2"; b="$3"
  echo "=== removed/present in a but not b ==="
  diff "$a" "$b" || true
  exit 0
fi

label="${2:-}"
if [ "$#" -ge 1 ] && [ "$1" = "--label" ] && [ -n "$label" ]; then
  label="${2:-}"
  shift 2
fi

ts="$(date +%Y%m%d-%H%M%S)"
out="${SNAP_DIR}worktree-${ts}${label:+-$label}.snap"

{
  echo "# worktree snapshot $ts"
  echo "# label: ${label:-<none>}"
  echo "# branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  echo "## git status --porcelain"
  git status --porcelain 2>&1
  echo "## git diff --stat"
  git diff --stat 2>&1
} > "$out"

echo "$out"
exit 0
