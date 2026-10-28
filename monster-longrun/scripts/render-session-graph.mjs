#!/usr/bin/env node
// render-session-graph.mjs — read a session-graph JSONL and render an HTML tree:
// which phase failed, drill into the session/agent events.
//
// Usage:
//   node render-session-graph.mjs <graph.jsonl> [--out graph.html]
//
// Exit: 0 = rendered, non-zero on error.

import { readFileSync, writeFileSync } from "node:fs";

function usage() {
  console.error(`Usage: node render-session-graph.mjs <graph.jsonl> [--out graph.html]`);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function main() {
  const argv = process.argv.slice(2);
  if (!argv[0] || argv[0] === "--help" || argv[0] === "-h") { usage(); process.exit(2); }
  const inPath = argv[0];
  let outPath = "graph.html";
  const outIdx = argv.indexOf("--out");
  if (outIdx !== -1) outPath = argv[outIdx + 1];

  const lines = readFileSync(inPath, "utf8").split("\n").filter((l) => l.trim());
  const events = [];
  for (const l of lines) {
    try { events.push(JSON.parse(l)); } catch { /* skip malformed */ }
  }
  if (events.length === 0) {
    console.error(`no events in ${inPath}`);
    process.exit(1);
  }

  // Group by phase, preserve order.
  const byPhase = new Map();
  for (const e of events) {
    const p = String(e.phase ?? "unphased");
    if (!byPhase.has(p)) byPhase.set(p, []);
    byPhase.get(p).push(e);
  }

  const phases = [...byPhase.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));

  let rows = "";
  for (const [phase, evs] of phases) {
    const failed = evs.some((e) => e.verdict === "fail" || e.status === "fail");
    const cls = failed ? "phase-fail" : "phase-ok";
    let sub = "";
    for (const e of evs) {
      sub += `<li class="ev ${e.verdict === "fail" || e.status === "fail" ? "ev-fail" : ""}">
        <span class="role">${esc(e.role ?? "?")}</span>
        ${e.agent_no !== undefined ? `<span class="no">#${esc(e.agent_no)}</span>` : ""}
        ${e.model ? `<span class="model">${esc(e.model)}</span>` : ""}
        <span class="verdict">${esc(e.verdict ?? e.status ?? "")}</span>
        ${e.command ? `<code>${esc(e.command)}</code>` : ""}
        ${e.reason ? `<span class="reason">${esc(e.reason)}</span>` : ""}
        <span class="ts">${esc(e.ts ?? "")}</span>
      </li>`;
    }
    rows += `<div class="phase ${cls}"><h3>Phase ${esc(phase)}</h3><ul>${sub}</ul></div>`;
  }

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>session-graph</title>
<style>
body{font-family:system-ui,sans-serif;margin:20px;background:#0f1115;color:#e6e6e6}
.phase{border:1px solid #333;border-radius:6px;padding:10px 14px;margin:10px 0}
.phase-ok{border-left:4px solid #3fb950}
.phase-fail{border-left:4px solid #f85149}
h3{margin:2px 0 8px;font-size:14px;color:#a5a5a5}
ul{list-style:none;padding:0;margin:0}
li.ev{padding:3px 0;font-size:13px;border-top:1px solid #222}
li.ev:first-child{border-top:none}
li.ev-fail{color:#f85149}
.role{display:inline-block;min-width:70px;color:#79c0ff;font-weight:600}
.no{color:#ffa657;margin-right:6px}
.model{color:#8b949e;margin-right:8px}
.verdict{font-weight:700;margin-right:8px}
code{background:#1c2128;padding:1px 5px;border-radius:4px;margin-right:8px}
.reason{color:#a5a5a5}
.ts{float:right;color:#6e7681;font-size:11px}
</style></head><body>
<h1>session-graph</h1>
<p>${esc(events.length)} events across ${esc(phases.length)} phases</p>
${rows}
</body></html>`;

  writeFileSync(outPath, html);
  console.log(`rendered ${events.length} events -> ${outPath}`);
  process.exit(0);
}

main();
