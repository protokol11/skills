#!/usr/bin/env node
// docs-index — derive the shared doc indexes from session records and spec frontmatter.
// ADR-0042. Modes: --write rebuilds, --check prints a diff and exits 1.
//
// Sources: .docs/sessions/*/statuses/*.md, .docs/SPECS/**/*.md, .docs/status.json.
// Targets: .docs/CURRENT_STATUS.md (whole file), .docs/SPECS/README.md (table rows only).

import fs from "node:fs"
import path from "node:path"

const STREAMS = ["ORCH", "PRIPL", "SKILLS", "LAB", "DRILL"]
const LATEST_COUNT = 3

// Ordered: the first matching rule wins, the rest fall through to Active.
const SECTIONS = [
  { heading: "## First slice (superseded by ralph-orchestrator)", match: (s) => s.area === "rtl-to-gds" },
  { heading: "## Ready for agent", match: (s) => s.area === "ralph-orchestrator" && s.status === "ready-for-agent" },
  { heading: "### planmd", match: (s) => s.area === "planmd" },
  {
    heading: "## Done",
    match: (s) => s.status === "done" && (s.area === "mental-tree" || s.area === "principles-compliance-system"),
  },
  { heading: "## Wontfix", match: (s) => s.status === "wontfix" },
  { heading: "## Superseded", match: (s) => s.status === "superseded" },
]
const ACTIVE = "## Active"

function parseArgs(argv) {
  const out = { repo: process.cwd(), mode: "check", verbose: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--write") out.mode = "write"
    else if (a === "--check") out.mode = "check"
    else if (a === "--verbose") out.verbose = true
    else if (a === "--repo") out.repo = argv[++i]
    else if (a.startsWith("--repo=")) out.repo = a.slice(7)
    else if (a === "--help" || a === "-h") out.help = true
  }
  return out
}

function read(file) {
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n")
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return plainFields(text)
  const fields = {}
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) continue
    fields[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "")
  }
  return fields
}

// Older specs (and two area READMEs) carry `Status: x` / `Area: y` as plain lines.
function plainFields(text) {
  const fields = {}
  for (const key of ["status", "title", "area", "date", "stream", "summary", "next"]) {
    const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, "im"))
    if (m) fields[key] = m[1].trim().replace(/^["']|["']$/g, "")
  }
  return fields
}

// "# STREAM — summary — 2026-10-18" or "# STREAM — summary"
function parseHeading(line) {
  const m = line.match(/^#\s+([A-Z][A-Z0-9_-]*)\s+—\s+(.+)$/)
  if (!m) return {}
  const rest = m[2]
  const dated = rest.match(/^(.*?)\s+—\s+(\d{4}-\d{2}-\d{2})$/)
  return dated ? { stream: m[1], summary: dated[1], date: dated[2] } : { stream: m[1], summary: rest }
}

function readStatuses(repo) {
  const root = path.join(repo, ".docs", "sessions")
  if (!fs.existsSync(root)) return []
  const records = []
  for (const file of walk(root)) {
    if (!/statuses[/\\][^/\\]+\.md$/.test(file)) continue
    const text = read(file)
    const fm = frontmatter(text)
    const h1 = text.split("\n").find((l) => l.startsWith("# ")) || ""
    const heading = parseHeading(h1)
    const base = path.basename(file, ".md")
    const pathDate = (base.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1]
    const pathStream = (base.match(/^\d{4}-\d{2}-\d{2}_([A-Za-z0-9]+)_/) || [])[1]
    const date = fm.date || heading.date || pathDate
    if (!date) continue
    records.push({
      date,
      stream: (fm.stream || heading.stream || pathStream || "OTHER").toUpperCase(),
      summary: fm.summary || heading.summary || base,
      next: fm.next || firstNextBullet(text),
      order: fs.statSync(file).mtimeMs,
      file: path.relative(repo, file).replace(/\\/g, "/"),
    })
  }
  return records.sort((a, b) =>
    a.date === b.date ? b.order - a.order || a.file.localeCompare(b.file) : b.date.localeCompare(a.date),
  )
}

// Legacy status files carry the forward plan as a `## Next` list instead of a `next:` field.
function firstNextBullet(text) {
  const m = text.match(/^##\s+Next\s*\n([\s\S]*?)(?=\n##\s|\n*$)/m)
  if (!m) return ""
  const line = m[1]
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 2)
  if (!line) return ""
  return line.replace(/^[-*]\s*(\[[ x]\]\s*)?/, "").trim()
}

function readSpecs(repo) {
  const root = path.join(repo, ".docs", "SPECS")
  if (!fs.existsSync(root)) return []
  const specs = []
  for (const file of walk(root)) {
    if (!file.endsWith(".md")) continue
    // Skip only the index itself; a spec may legitimately be a README (principles-compliance-system).
    if (path.resolve(file) === path.resolve(root, "README.md")) continue
    const text = read(file)
    const fm = frontmatter(text)
    if (!fm.status) continue
    // Area index pages opt out with `index: true`; a nested spec may still be a README.
    if (fm.index === "true") continue
    const rel = path.relative(root, file).replace(/\\/g, "/")
    const area = rel.includes("/") ? rel.split("/")[0] : "(root)"
    const heading = text.split("\n").find((l) => l.startsWith("# ")) || ""
    specs.push({
      path: rel,
      area,
      status: fm.status,
      title: (fm.title || heading.replace(/^#\s+/, "")).trim(),
    })
  }
  return specs.sort((a, b) => a.path.localeCompare(b.path))
}

function sectionFor(spec) {
  for (const rule of SECTIONS) if (rule.match(spec)) return rule.heading
  return ACTIVE
}

function existingRows(text) {
  // section heading -> ordered spec paths, plus path -> label
  const bySection = new Map()
  const labels = new Map()
  let heading = ""
  for (const line of text.split("\n")) {
    if (/^#{2,3}\s/.test(line)) heading = line.trim()
    const m = line.match(/^\|\s*\[([^\]]+)\]\(([^)]+)\)/)
    if (!m) continue
    labels.set(m[2], m[1])
    if (!bySection.has(heading)) bySection.set(heading, [])
    bySection.get(heading).push(m[2])
  }
  return { bySection, labels }
}

function renderSpecsIndex(repo) {
  const file = path.join(repo, ".docs", "SPECS", "README.md")
  const text = read(file)
  const specs = readSpecs(repo)
  const { bySection, labels } = existingRows(text)

  const buckets = new Map()
  for (const spec of specs) {
    const key = sectionFor(spec)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(spec)
  }

  // Existing rows keep their position. New rows land at the end, sorted by path.
  const ordered = new Map()
  for (const [heading, bucket] of buckets) {
    const present = new Map(bucket.map((s) => [s.path, s]))
    const kept = (bySection.get(heading) || []).filter((p) => present.has(p)).map((p) => present.get(p))
    const keptPaths = new Set(kept.map((s) => s.path))
    const added = bucket.filter((s) => !keptPaths.has(s.path)).sort((a, b) => a.path.localeCompare(b.path))
    ordered.set(heading, [...kept, ...added])
  }
  buckets.clear()

  const lines = text.split("\n")
  let heading = ""
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^#{2,3}\s/.test(line)) heading = line.trim()
    const isTableHead = /^\|\s*Spec\s*\|\s*Status\s*\|\s*Area\s*\|$/.test(line.trim())
    if (isTableHead) {
      // keep header + separator, replace the body
      let j = i + 2
      while (j < lines.length && lines[j].trim().startsWith("|")) j++
      const rows = (ordered.get(heading) || []).map(
        (s) => `| [${labels.get(s.path) || s.title}](${s.path}) | ${s.status} | ${s.area} |`,
      )
      if (rows.length === 0) rows.push("| _(none)_ | | |")
      lines.splice(i + 2, j - (i + 2), ...rows)
      ordered.delete(heading)
      i = i + 2 + rows.length
      continue
    }
    i++
  }
  return lines.join("\n")
}

function renderCurrentStatus(repo) {
  const statuses = readStatuses(repo)
  const dataFile = path.join(repo, ".docs", "status.json")
  if (!fs.existsSync(dataFile)) throw new Error(`missing ${path.relative(repo, dataFile)}`)
  const data = JSON.parse(read(dataFile))

  const latest = statuses.slice(0, LATEST_COUNT)
  const lastDate = statuses.length ? statuses[0].date : "unknown"

  const nextByStream = new Map()
  for (const rec of statuses) {
    if (!rec.next) continue
    if (!STREAMS.includes(rec.stream)) continue
    if (!nextByStream.has(rec.stream)) nextByStream.set(rec.stream, rec)
  }
  const streams = [...nextByStream.keys()].sort(
    (a, b) => STREAMS.indexOf(a) - STREAMS.indexOf(b),
  )

  const out = ["# Current Status", "", `Last updated: ${lastDate}`, "", "## Latest", ""]
  for (const rec of latest) {
    out.push(`- **${rec.stream} — ${rec.summary} (${rec.date})**`)
    out.push(`  → \`${rec.file}\``)
  }
  out.push("", "## Active blockers", "")
  for (const b of data.blockers || []) out.push(`- ${b.text}${b.link ? ` → \`${b.link}\`` : ""}`)
  out.push("", "## Open questions", "")
  for (const q of data.questions || []) out.push(`- ${q.text}${q.link ? ` → \`${q.link}\`` : ""}`)
  out.push("", "## Next", "")
  for (const s of streams) {
    const rec = nextByStream.get(s)
    out.push(`- **${s}:** ${rec.next} → \`${rec.file}\``)
  }
  out.push("", "## Source of truth", "")
  for (const s of data.source_of_truth || []) out.push(`- ${s.text}`)
  out.push("")
  return out.join("\n")
}

function diff(before, after, file) {
  const a = before.split("\n")
  const b = after.split("\n")
  const out = [`--- ${file} (on disk)`, `+++ ${file} (generated)`]
  let shown = 0
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max && shown < 40; i++) {
    if (a[i] === b[i]) continue
    out.push(`@@ line ${i + 1}`)
    if (a[i] !== undefined) out.push(`- ${a[i]}`)
    if (b[i] !== undefined) out.push(`+ ${b[i]}`)
    shown++
  }
  return out.join("\n")
}

function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    console.log("usage: docs-index.mjs [--repo <path>] [--write|--check] [--verbose]")
    return
  }
  const repo = path.resolve(opts.repo)
  const targets = [
    { file: path.join(repo, ".docs", "SPECS", "README.md"), build: () => renderSpecsIndex(repo) },
    { file: path.join(repo, ".docs", "CURRENT_STATUS.md"), build: () => renderCurrentStatus(repo) },
  ]

  let drift = 0
  for (const target of targets) {
    const before = fs.existsSync(target.file) ? read(target.file) : ""
    const after = target.build()
    const rel = path.relative(repo, target.file).replace(/\\/g, "/")
    if (before === after) {
      if (opts.verbose) console.log(`ok   ${rel}`)
      continue
    }
    drift++
    if (opts.mode === "write") {
      fs.writeFileSync(target.file, after)
      console.log(`write ${rel}`)
    } else {
      console.log(diff(before, after, rel))
      console.log(`drift ${rel}`)
    }
  }

  if (opts.mode === "check" && drift > 0) {
    console.log(`\n${drift} file(s) out of date. Run: node ${path.basename(import.meta.filename)} --write`)
    process.exit(1)
  }
}

main()
