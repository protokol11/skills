#!/usr/bin/env node
// run-gates.mjs — parse "## Gates" from a spec, run each command, record a JSONL verdict.
//
// Usage:
//   node run-gates.mjs <spec-path> [--jsonl-out .scratch/gates.jsonl]
//
// Gate format in spec:
//   1. npm test -> PASS >= 48, fail == 0
//   2. npm run typecheck -> exit 0
//
// Expected-result grammar (after ->):
//   "PASS >= N[, fail == M]"   -> count occurrences of /pass|ok|✓|passed/i in stdout
//   "exit N"                    -> check process exit code
//   "exit 0"                    -> check process exit code == 0
//
// Exit: 0 if all gates pass, 1 if any gate fails, 1 on parse/run error.

import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Usage: node run-gates.mjs <spec-path> [--jsonl-out path]`);
}

function parseArgs(argv) {
  const out = { spec: null, jsonl: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--jsonl-out") out.jsonl = argv[++i];
    else if (argv[i] === "--help" || argv[i] === "-h") { usage(); process.exit(2); }
    else if (out.spec === null) out.spec = argv[i];
  }
  return out;
}

function parseSpec(text) {
  const gates = [];
  const m = text.match(/##\s*Gates([\s\S]*?)(?=\n##\s|$)/i);
  if (!m) return gates;
  const lines = m[1].split("\n");
  for (const line of lines) {
    const t = line.trim();
    const num = t.match(/^(\d+)\.\s+(.+?)\s*->\s*(.+)$/);
    if (num) {
      // Builders sometimes wrap gate commands in markdown code spans. Strip them so
      // the shell does not treat backticks as command substitution.
      const clean = (s) => s.trim().replace(/^`+/, "").replace(/`+$/, "").trim();
      gates.push({ number: num[1], command: clean(num[2]), expect: clean(num[3]) });
    }
  }
  return gates;
}

function runCommand(cmd) {
  return new Promise((resolve) => {
    // Use a shell so "npx", "&&", env vars work as in a terminal.
    const isWindows = process.platform === "win32";
    const shell = isWindows ? (process.env.COMSPEC || "cmd.exe") : "/bin/sh";
    const child = spawn(cmd, { shell, cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    const timer = setTimeout(() => { child.kill(); resolve({ exit: 124, stdout, stderr, timedOut: true }); }, 300000);
    child.on("error", (e) => { clearTimeout(timer); resolve({ exit: 127, stdout, stderr, error: e.message }); });
    child.on("exit", (code) => { clearTimeout(timer); resolve({ exit: code ?? 0, stdout, stderr }); });
  });
}

function checkExpect(expect, result) {
  const ex = expect.trim();
  if (ex.startsWith("exit")) {
    const want = Number(ex.replace(/^exit\s*/i, ""));
    const ok = result.exit === want;
    return { ok, reason: `exit wanted ${want}, got ${result.exit}`, passCount: null };
  }
  if (ex.toLowerCase().startsWith("pass") || ex.toLowerCase().startsWith("tests")) {
    // count pass-like tokens in stdout
    const combined = result.stdout + "\n" + result.stderr;
    const passCount = (combined.match(/pass|ok|✓|passed/gi) || []).length;
    let ok = true, reasonParts = [];
    const conds = ex.split(",").map((s) => s.trim());
    for (const c of conds) {
      const mm = c.match(/^(pass|fail|tests)\s*(>=|<=|==|>|<|=)?\s*(\d+)$/i);
      if (!mm) { ok = false; reasonParts.push(`unparseable condition "${c}"`); continue; }
      const [key, op, valStr] = [mm[1].toLowerCase(), mm[2] || ">=", Number(mm[3])];
      const actual = key === "pass" ? passCount : key === "fail" ? (countFail(combined)) : passCount;
      const cmp = { ">=": actual >= valStr, "<=": actual <= valStr, ">": actual > valStr, "<": actual < valStr, "=": actual === valStr, "==": actual === valStr }[op || ">="];
      if (!cmp) ok = false;
      reasonParts.push(`${key} ${op} ${valStr} -> got ${actual}`);
    }
    return { ok, reason: reasonParts.join("; "), passCount };
  }
  // unknown grammar: treat nonzero exit as pass, but record unverified
  return { ok: result.exit === 0, reason: `unparseable expect "${ex}", treated as exit 0 (got ${result.exit})`, passCount: null };
}

function countFail(s) {
  return (s.match(/fail|✗|✘|failed/i) || []).length;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.spec) { usage(); process.exit(2); }

  const specText = readFileSync(args.spec, "utf8");
  const gates = parseSpec(specText);
  if (gates.length === 0) {
    console.error(`No "## Gates" found in ${args.spec}`);
    process.exit(1);
  }

  const results = [];
  let allPass = true;
  for (const g of gates) {
    const r = await runCommand(g.command);
    const chk = checkExpect(g.expect, r);
    results.push({ gate: g.number, command: g.command, expected: g.expect, exit: r.exit, passCount: chk.passCount, status: chk.ok ? "pass" : "fail", reason: chk.reason });
    if (!chk.ok) allPass = false;
    console.log(`[gate ${g.number}] ${chk.ok ? "PASS" : "FAIL"} :: ${g.command} :: ${chk.reason}`);
  }

  if (args.jsonl) {
    mkdirSync(dirname(resolve(args.jsonl)), { recursive: true });
    for (const r of results) {
      appendFileSync(args.jsonl, JSON.stringify({ ts: new Date().toISOString(), kind: "gate", ...r }) + "\n");
    }
  }

  const summary = { spec: args.spec, total: results.length, passed: results.filter((r) => r.status === "pass").length, allPass, results };
  console.log(JSON.stringify(summary));
  process.exit(allPass ? 0 : 1);
}

main();
