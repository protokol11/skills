/**
 * Fixture tests for the agent directory loader.
 *
 * Every case builds its own temp tree, so the repository is never mutated.
 * Run: node --experimental-strip-types tests/loader.test.ts
 */

import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { after, test } from "node:test";

import { loadAgentDirectory } from "../loader.ts";
import type { AgentCatalog, CatalogManifest } from "../types.ts";

const roots: string[] = [];

after(() => {
  for (const root of roots) {
    rmSync(root, { recursive: true, force: true });
  }
});

interface Scopes {
  projectRoot: string;
  userRoot: string;
}

function makeScopes(): Scopes {
  const root = mkdtempSync(join(tmpdir(), "agent-directory-"));
  roots.push(root);
  const projectRoot = join(root, "project");
  const userRoot = join(root, "user");
  mkdirSync(join(projectRoot, ".pi", "agents"), { recursive: true });
  mkdirSync(join(userRoot, ".agents", "agents"), { recursive: true });
  return { projectRoot, userRoot };
}

function writeProject(scopes: Scopes, name: string, content: string): string {
  const path = join(scopes.projectRoot, ".pi", "agents", name);
  writeFileSync(path, content, "utf8");
  return path;
}

function writeUser(scopes: Scopes, name: string, content: string): string {
  const path = join(scopes.userRoot, ".agents", "agents", name);
  writeFileSync(path, content, "utf8");
  return path;
}

function agentFile(fields: Record<string, string>, body: string): string {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join("\n")}\n---\n${body}\n`;
}

function manifestPathFor(scopes: Scopes): string {
  return join(scopes.projectRoot, ".pi", "agent-directory", "catalog.json");
}

function readManifest(scopes: Scopes): CatalogManifest {
  return JSON.parse(readFileSync(manifestPathFor(scopes), "utf8")) as CatalogManifest;
}

interface CapturedRun<T> {
  result: T;
  warnings: string[];
}

function withCapturedWarnings<T>(run: () => T): CapturedRun<T> {
  const original = console.warn;
  const warnings: string[] = [];
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map((value) => String(value)).join(" "));
  };
  try {
    const result = run();
    return { result, warnings };
  } finally {
    console.warn = original;
  }
}

function names(catalog: AgentCatalog): string[] {
  return catalog.agents.map((agent) => agent.name).sort();
}

test("two scopes merge into one catalog with source and path", () => {
  const scopes = makeScopes();
  const projectPath = writeProject(
    scopes,
    "reviewer.md",
    agentFile(
      { name: "reviewer", description: "Read-only reviewer", tools: "read, grep" },
      "Review the diff.",
    ),
  );
  const userPath = writeUser(
    scopes,
    "planner.md",
    agentFile({ name: "planner", description: "Plans work", tools: "read" }, "Plan the work."),
  );

  const { result, warnings } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["planner", "reviewer"]);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.shadowed, []);
  assert.deepEqual(warnings, []);

  const reviewer = result.agents.find((agent) => agent.name === "reviewer");
  assert.ok(reviewer);
  assert.equal(reviewer.source, "project");
  assert.equal(reviewer.path, projectPath);
  assert.deepEqual(reviewer.tools, ["read", "grep"]);
  assert.equal(reviewer.prompt, "Review the diff.");
  assert.equal(reviewer.model, undefined);

  const planner = result.agents.find((agent) => agent.name === "planner");
  assert.ok(planner);
  assert.equal(planner.source, "user");
  assert.equal(planner.path, userPath);
});

test("project agent shadows same-name user agent", () => {
  const scopes = makeScopes();
  const projectPath = writeProject(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "Project reviewer" }, "Project prompt."),
  );
  const userPath = writeUser(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "User reviewer" }, "User prompt."),
  );

  const { result, warnings } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["reviewer"]);
  assert.equal(result.agents[0].description, "Project reviewer");
  assert.equal(result.agents[0].source, "project");
  assert.deepEqual(result.shadowed, [
    { name: "reviewer", shadowedBy: projectPath, path: userPath },
  ]);
  assert.equal(warnings.length, 1);
  // The warning must name the winner, not just the contested name (RTL-09).
  assert.match(warnings[0], /shadowed by .*reviewer\.md/);
  assert.ok(warnings[0].includes(projectPath));
});

test("malformed frontmatter is reported and the rest still loads", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "good.md",
    agentFile({ name: "good", description: "Loads fine" }, "Good prompt."),
  );
  const brokenPath = writeProject(scopes, "broken.md", "---\nname: broken\ndescription: no close\n");

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["good"]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, brokenPath);
  assert.match(result.errors[0].error, /closing ---/);
});

test("unknown frontmatter key is rejected per file", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "kept.md",
    agentFile({ name: "kept", description: "Kept" }, "Kept prompt."),
  );
  const badPath = writeProject(
    scopes,
    "scope-escape.md",
    agentFile({ name: "escape", description: "Has extra key", scope: "project" }, "Escape prompt."),
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["kept"]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, badPath);
  assert.match(result.errors[0].error, /unknown frontmatter key "scope"/);
});

test("missing required field and empty prompt are reported, not silent", () => {
  const scopes = makeScopes();
  const noName = writeProject(scopes, "no-name.md", agentFile({ description: "Nameless" }, "Body."));
  const noBody = writeProject(
    scopes,
    "no-body.md",
    agentFile({ name: "no-body", description: "Empty body" }, "   "),
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(result.agents, []);
  assert.deepEqual(
    result.errors.map((entry) => entry.path).sort(),
    [noBody, noName].sort(),
  );
  assert.match(result.errors.find((entry) => entry.path === noName)!.error, /"name"/);
  assert.match(result.errors.find((entry) => entry.path === noBody)!.error, /prompt body/);
});

test("non-markdown files are ignored", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "Reviewer" }, "Review."),
  );
  writeProject(scopes, "notes.txt", "---\nname: notes\n---\nNot an agent.\n");
  writeProject(scopes, "README", "plain text");

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["reviewer"]);
  assert.deepEqual(result.errors, []);
});

test("block-list tools and quoted model parse as typed data", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "auditor.md",
    [
      "---",
      "name: auditor",
      'description: "Audits changes"',
      "tools:",
      "  - read",
      '  - "grep"',
      "model: fast-model",
      "---",
      "Audit only.",
      "",
    ].join("\n"),
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.agents[0].tools, ["read", "grep"]);
  assert.equal(result.agents[0].description, "Audits changes");
  assert.equal(result.agents[0].model, "fast-model");
});

test("user-scope agents with collision-free names all load", () => {
  const scopes = makeScopes();
  writeUser(scopes, "alpha.md", agentFile({ name: "alpha", description: "A" }, "A prompt."));
  writeUser(scopes, "beta.md", agentFile({ name: "beta", description: "B" }, "B prompt."));

  const { result, warnings } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["alpha", "beta"]);
  assert.deepEqual(result.shadowed, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(warnings, []);
  assert.ok(result.agents.every((agent) => agent.source === "user"));
});

test("manifest is written atomically at the default path with a full catalog", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "Project reviewer" }, "Project prompt."),
  );
  const userReviewerPath = writeUser(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "User reviewer" }, "User prompt."),
  );
  writeUser(scopes, "planner.md", agentFile({ name: "planner", description: "Planner" }, "Plan."));

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  const target = manifestPathFor(scopes);
  assert.ok(existsSync(target));
  assert.deepEqual(readdirSync(join(scopes.projectRoot, ".pi", "agent-directory")), ["catalog.json"]);

  const manifest = readManifest(scopes);
  assert.match(manifest.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.deepEqual(manifest.catalog, result);
  assert.deepEqual(names(manifest.catalog), ["planner", "reviewer"]);
  assert.deepEqual(manifest.catalog.shadowed, [
    {
      name: "reviewer",
      shadowedBy: join(scopes.projectRoot, ".pi", "agents", "reviewer.md"),
      path: userReviewerPath,
    },
  ]);
});

test("explicit manifestPath is honored and a failed write does not throw", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "Reviewer" }, "Review."),
  );

  const nested = join(scopes.projectRoot, "custom", "deep", "catalog.json");
  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({
      projectRoot: scopes.projectRoot,
      userRoot: scopes.userRoot,
      manifestPath: nested,
    }),
  );

  assert.deepEqual(names(result), ["reviewer"]);
  const written = JSON.parse(readFileSync(nested, "utf8")) as CatalogManifest;
  assert.deepEqual(written.catalog, result);

  // A directory where the temp file must go makes the write fail; the catalog still returns.
  const blocker = join(scopes.projectRoot, "blocked");
  writeFileSync(blocker, "not a directory", "utf8");
  const failed = withCapturedWarnings(() =>
    loadAgentDirectory({
      projectRoot: scopes.projectRoot,
      userRoot: scopes.userRoot,
      manifestPath: join(blocker, "catalog.json"),
    }),
  );

  assert.deepEqual(names(failed.result), ["reviewer"]);
  assert.equal(failed.warnings.length, 1);
  assert.match(failed.warnings[0], /manifest write failed/);
});

test("within-scope duplicate names keep the first sorted file and record the loser", () => {
  const scopes = makeScopes();
  const firstPath = writeProject(
    scopes,
    "a-first.md",
    agentFile({ name: "dup", description: "First sorted" }, "First prompt."),
  );
  const secondPath = writeProject(
    scopes,
    "b-second.md",
    agentFile({ name: "dup", description: "Second sorted" }, "Second prompt."),
  );

  const { result, warnings } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["dup"]);
  assert.equal(result.agents[0].description, "First sorted");
  assert.equal(result.agents[0].path, firstPath);
  assert.deepEqual(result.shadowed, [
    { name: "dup", shadowedBy: firstPath, path: secondPath },
  ]);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /shadowed by .*a-first\.md/);
});

test("inline bracket tool list parses into separate tools", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "inline.md",
    agentFile({ name: "inline", description: "Inline tools", tools: "[read, grep]" }, "Body."),
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.agents[0].tools, ["read", "grep"]);
});

test("BOM and CRLF line endings load like a plain file", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "bom.md",
    "\uFEFF---\r\nname: bom\r\ndescription: Windows file\r\ntools: [read, grep]\r\n---\r\nWindows body.\r\n",
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(names(result), ["bom"]);
  assert.equal(result.agents[0].description, "Windows file");
  assert.deepEqual(result.agents[0].tools, ["read", "grep"]);
  assert.equal(result.agents[0].prompt, "Windows body.");
});

test("duplicate frontmatter key is rejected per file", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "kept.md",
    agentFile({ name: "kept", description: "Kept" }, "Kept prompt."),
  );
  const duplicatePath = writeProject(
    scopes,
    "duplicate-key.md",
    "---\nname: duplicate\ndescription: First\ndescription: Second\n---\nBody.\n",
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["kept"]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, duplicatePath);
  assert.match(result.errors[0].error, /duplicate key "description"/);
});

test("missing description is rejected per file", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "kept.md",
    agentFile({ name: "kept", description: "Kept" }, "Kept prompt."),
  );
  const noDescription = writeProject(
    scopes,
    "no-description.md",
    "---\nname: silent\n---\nBody.\n",
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  assert.deepEqual(names(result), ["kept"]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, noDescription);
  assert.match(result.errors[0].error, /"description"/);
});

test("manifest replaces a pre-existing catalog.json instead of appending", () => {
  const scopes = makeScopes();
  writeProject(
    scopes,
    "reviewer.md",
    agentFile({ name: "reviewer", description: "Reviewer" }, "Review."),
  );
  const target = manifestPathFor(scopes);
  mkdirSync(join(scopes.projectRoot, ".pi", "agent-directory"), { recursive: true });
  writeFileSync(target, '{"stale": true, "catalog": {"agents": [1, 2, 3]}}', "utf8");

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot: scopes.projectRoot, userRoot: scopes.userRoot }),
  );

  const manifest = readManifest(scopes) as CatalogManifest & { stale?: boolean };
  assert.equal(manifest.stale, undefined);
  assert.deepEqual(manifest.catalog, result);
  assert.deepEqual(names(manifest.catalog), ["reviewer"]);
  // A unique temp name must still be renamed away, not left behind.
  assert.deepEqual(readdirSync(join(scopes.projectRoot, ".pi", "agent-directory")), [
    "catalog.json",
  ]);
});

test("a scope path that exists as a file is reported and the catalog still loads", () => {
  const root = mkdtempSync(join(tmpdir(), "agent-directory-"));
  roots.push(root);
  const projectRoot = join(root, "project");
  const userRoot = join(root, "user");
  mkdirSync(join(projectRoot, ".pi"), { recursive: true });
  mkdirSync(join(userRoot, ".agents", "agents"), { recursive: true });
  const blocker = join(projectRoot, ".pi", "agents");
  writeFileSync(blocker, "not a directory", "utf8");
  writeUser(
    { projectRoot, userRoot },
    "planner.md",
    agentFile({ name: "planner", description: "Planner" }, "Plan."),
  );

  const { result } = withCapturedWarnings(() =>
    loadAgentDirectory({ projectRoot, userRoot }),
  );

  assert.deepEqual(names(result), ["planner"]);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, resolve(blocker));
  assert.match(result.errors[0].error, /ENOTDIR/);
  assert.ok(existsSync(join(projectRoot, ".pi", "agent-directory", "catalog.json")));
});
