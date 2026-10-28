#!/usr/bin/env node
// session-graph.mjs — append-only JSONL trace of the pipeline.
// One line per event (phase, gate, subagent). trace_id == runId (Ralph contract).
//
// Usage:
//   node session-graph.mjs --run-id R --phase 6 --role builder --agent-no 3 \
//        --model deepseek/deepseek-flash --verdict pass --jsonl .scratch/session-graph.jsonl
//
//   # generic append (arbitrary fields):
//   node session-graph.mjs --jsonl .scratch/session-graph.jsonl --set '{"phase":"0","role":"scout","verdict":"pass"}'
//
// Exit: 0 = appended, non-zero on error.

import { appendFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

function usage() {
  console.error(`Usage: node session-graph.mjs --jsonl F [--run-id R] [--phase N] [--role R] [--agent-no N] [--model M] [--verdict V] [--reason S] [--set JSON]`);
}

function pick(obj, key, fn) {
  if (obj[key] !== undefined) obj[key] = fn(obj[key]);
}

function main() {
  const argv = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) { flags[k] = next; i++; }
      else flags[k] = true;
    }
  }

  if (!flags.jsonl) { usage(); process.exit(2); }

  let rec = {};
  if (flags.set) {
    try { rec = JSON.parse(flags.set); } catch (e) { console.error(`bad --set JSON: ${e.message}`); process.exit(2); }
  }

  rec.trace_id = rec.trace_id || flags["run-id"] || randomUUID();
  rec.span_id = rec.span_id || randomUUID();
  rec.ts = rec.ts || new Date().toISOString();
  if (flags.phase !== undefined) rec.phase = flags.phase;
  if (flags.role !== undefined) rec.role = flags.role;
  if (flags["agent-no"] !== undefined) rec.agent_no = Number(flags["agent-no"]);
  if (flags.model !== undefined) rec.model = flags.model;
  if (flags.verdict !== undefined) rec.verdict = flags.verdict;
  if (flags.reason !== undefined) rec.reason = flags.reason;

  appendFileSync(flags.jsonl, JSON.stringify(rec) + "\n");
  console.log(rec.trace_id);
  process.exit(0);
}

main();
