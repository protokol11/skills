/**
 * Pure loader for declarative markdown agents.
 *
 * Two scopes only: project `<projectRoot>/.pi/agents/*.md` beats user
 * `<userRoot>/.agents/agents/*.md` on a name collision (spec decision 1).
 * Frontmatter is parsed by a hand-rolled reader because the extension carries no
 * dependencies and the schema is closed (CP-22): the parser accepts nothing the
 * catalog type cannot represent.
 *
 * No pi imports by design. The loader never spawns anything.
 */

import {
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

import type {
  AgentCatalog,
  AgentDef,
  AgentSource,
  CatalogManifest,
  LoadError,
  ShadowedName,
} from "./types.ts";

const ALLOWED_KEYS = ["name", "description", "tools", "model"] as const;

type AllowedKey = (typeof ALLOWED_KEYS)[number];

/** A frontmatter value before typing: a scalar, or the items already seen. */
type RawValue = string | string[];

const PROJECT_AGENT_DIR = join(".pi", "agents");
const USER_AGENT_DIR = join(".agents", "agents");
const DEFAULT_MANIFEST_DIR = join(".pi", "agent-directory");
const DEFAULT_MANIFEST_NAME = "catalog.json";

export interface LoadOptions {
  projectRoot: string;
  userRoot?: string;
  manifestPath?: string;
}

interface FrontmatterSplit {
  block: string;
  body: string;
}

const LIST_ITEM = /^\s*-\s+(.*)$/;
const KEY_LINE = /^([A-Za-z0-9_-]+):(.*)$/;

function isAllowedKey(key: string): key is AllowedKey {
  return (ALLOWED_KEYS as readonly string[]).includes(key);
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' || first === "'") && last === first) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function splitFrontmatter(text: string): FrontmatterSplit {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  if (lines[0] === undefined || lines[0].trim() !== "---") {
    throw new Error("missing opening --- frontmatter fence");
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) {
    throw new Error("missing closing --- frontmatter fence");
  }
  return {
    block: lines.slice(1, end).join("\n"),
    body: lines.slice(end + 1).join("\n"),
  };
}

function parseFrontmatterBlock(block: string): Map<AllowedKey, RawValue> {
  const data = new Map<AllowedKey, RawValue>();
  const lines = block.split("\n");
  let pendingKey: AllowedKey | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const lineNumber = index + 2;
    if (raw.trim() === "" || raw.trimStart().startsWith("#")) {
      continue;
    }

    const item = LIST_ITEM.exec(raw);
    if (item) {
      if (pendingKey === null) {
        throw new Error(`frontmatter line ${lineNumber}: list item without a key`);
      }
      const entry = unquote(item[1]);
      const current = data.get(pendingKey);
      if (Array.isArray(current)) {
        if (entry !== "") {
          current.push(entry);
        }
      } else if (current === "") {
        data.set(pendingKey, entry === "" ? [] : [entry]);
      } else {
        throw new Error(
          `frontmatter line ${lineNumber}: list item under scalar key "${pendingKey}"`,
        );
      }
      continue;
    }

    const match = KEY_LINE.exec(raw);
    if (!match) {
      throw new Error(`frontmatter line ${lineNumber}: cannot parse "${raw.trim()}"`);
    }
    const key = match[1];
    if (!isAllowedKey(key)) {
      throw new Error(
        `unknown frontmatter key "${key}" (allowed: ${ALLOWED_KEYS.join(", ")})`,
      );
    }
    if (data.has(key)) {
      throw new Error(`frontmatter line ${lineNumber}: duplicate key "${key}"`);
    }
    pendingKey = key;
    data.set(key, unquote(match[2]));
  }

  return data;
}

function asScalar(key: AllowedKey, value: RawValue | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    throw new Error(`frontmatter key "${key}" must be a string, got a list`);
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function asToolList(value: RawValue | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  const parts = Array.isArray(value)
    ? value
    : value.trim() === ""
      ? []
      : value.trimStart().startsWith("[") && value.trimEnd().endsWith("]")
        ? value.slice(value.indexOf("[") + 1, value.lastIndexOf("]")).split(",")
        : value.split(",");
  const tools: string[] = [];
  for (const part of parts) {
    const tool = unquote(part);
    if (tool !== "") {
      tools.push(tool);
    }
  }
  return tools;
}

function parseAgentText(text: string, absolutePath: string, source: AgentSource): AgentDef {
  const { block, body } = splitFrontmatter(text);
  const data = parseFrontmatterBlock(block);

  const name = asScalar("name", data.get("name"));
  if (name === undefined) {
    throw new Error('missing required string field "name"');
  }
  const description = asScalar("description", data.get("description"));
  if (description === undefined) {
    throw new Error('missing required string field "description"');
  }
  const prompt = body.trim();
  if (prompt === "") {
    throw new Error("missing prompt body after frontmatter");
  }

  const agent: AgentDef = {
    name,
    description,
    tools: asToolList(data.get("tools")),
    prompt,
    source,
    path: absolutePath,
  };
  const model = asScalar("model", data.get("model"));
  if (model !== undefined) {
    agent.model = model;
  }
  return agent;
}

function readAgentDir(dir: string, source: AgentSource, errors: LoadError[]): AgentDef[] {
  let names: string[];
  try {
    names = readdirSync(dir, { withFileTypes: true })
      .filter((entry) => !entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ENOENT") {
      return [];
    }
    // ENOTDIR means the scope path exists but is a file: a misconfiguration, not
    // an empty scope, so it must surface instead of loading an empty catalog
    // (PS-FIXER-03).
    errors.push({ path: dir, error: error instanceof Error ? error.message : String(error) });
    return [];
  }

  const agents: AgentDef[] = [];
  for (const name of names) {
    if (!name.toLowerCase().endsWith(".md")) {
      continue;
    }
    const absolutePath = join(dir, name);
    try {
      const text = readFileSync(absolutePath, "utf8");
      agents.push(parseAgentText(text, absolutePath, source));
    } catch (error) {
      errors.push({
        path: absolutePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return agents;
}

function mergeScopes(project: AgentDef[], user: AgentDef[]): {
  agents: AgentDef[];
  shadowed: ShadowedName[];
} {
  const winners = new Map<string, AgentDef>();
  const shadowed: ShadowedName[] = [];

  for (const agent of [...project, ...user]) {
    const winner = winners.get(agent.name);
    if (winner !== undefined) {
      shadowed.push({ name: agent.name, shadowedBy: winner.path, path: agent.path });
      console.warn(
        `[agent-directory] "${agent.name}" from ${agent.path} is shadowed by ${winner.path}`,
      );
      continue;
    }
    winners.set(agent.name, agent);
  }

  return { agents: [...winners.values()], shadowed };
}

function writeManifest(manifestPath: string, catalog: AgentCatalog): void {
  const manifest: CatalogManifest = {
    timestamp: new Date().toISOString(),
    catalog,
  };
  // Unique per writer and per attempt: two loads racing on the same manifest
  // must not rename each other's half-written temp file.
  const tempPath = `${manifestPath}.${process.pid}-${Date.now()}.tmp`;
  try {
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    renameSync(tempPath, manifestPath);
  } catch (error) {
    // The catalog stays usable without a trace file, so a failed write must not
    // abort the load; it is reported loudly instead of swallowed.
    try {
      rmSync(tempPath, { force: true });
    } catch {
      // The temp file may never have been created.
    }
    console.warn(
      `[agent-directory] manifest write failed at ${manifestPath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export function loadAgentDirectory(opts: LoadOptions): AgentCatalog {
  // Absolute paths are part of the catalog contract: AgentDef.path and
  // ShadowedName paths are published in the manifest and must be usable as-is.
  const projectRoot = resolve(opts.projectRoot);
  const userRoot = resolve(opts.userRoot ?? homedir());
  const manifestPath =
    opts.manifestPath ?? join(projectRoot, DEFAULT_MANIFEST_DIR, DEFAULT_MANIFEST_NAME);

  const errors: LoadError[] = [];
  const projectAgents = readAgentDir(join(projectRoot, PROJECT_AGENT_DIR), "project", errors);
  const userAgents = readAgentDir(join(userRoot, USER_AGENT_DIR), "user", errors);
  const { agents, shadowed } = mergeScopes(projectAgents, userAgents);

  const catalog: AgentCatalog = { agents, errors, shadowed };
  writeManifest(manifestPath, catalog);
  return catalog;
}
