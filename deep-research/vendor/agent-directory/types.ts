/**
 * Types for the declarative agent directory.
 *
 * The catalog carries no field for hijacking the main system prompt: an agent
 * file defines an auxiliary role only (spec decision 3). Invalid states are made
 * unrepresentable by construction, not by a runtime check.
 */

export type AgentSource = "project" | "user";

export interface AgentDef {
  name: string;
  description: string;
  /**
   * Pi tool names the role may use. Parsed here as data only; enforcement
   * belongs to the seam that binds and calls the subagent (spec decision 2).
   */
  tools: string[];
  model?: string;
  prompt: string;
  source: AgentSource;
  /** Absolute path of the markdown file the agent came from. */
  path: string;
}

export interface LoadError {
  path: string;
  error: string;
}

export interface ShadowedName {
  name: string;
  /** Absolute path of the file that won the name. */
  shadowedBy: string;
  /** Absolute path of the losing file, so the manifest names what was dropped (RTL-09). */
  path: string;
}

export interface AgentCatalog {
  agents: AgentDef[];
  errors: LoadError[];
  shadowed: ShadowedName[];
}

export interface CatalogManifest {
  timestamp: string;
  catalog: AgentCatalog;
}
