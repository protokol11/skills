#!/usr/bin/env node
// Render compliance artifacts from the principle catalog.
// No external dependencies.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_CATALOG = join('C:', 'Users', 'HOME', '.agents', 'skills', 'to-violations', 'PRINCIPLES.md');
const ROLES = ['coder', 'tester', 'fixer', 'explore', 'plan'];

function parseCatalog(text) {
  const parts = text.split(/\n---\n/);
  const yamlPart = parts[0].replace(/^---\n?/, '');
  const lines = yamlPart.split('\n');
  const principles = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();

    if (line.startsWith('  - id:')) {
      if (current) principles.push(current);
      current = { id: trimmed.replace('- id:', '').trim() };
      continue;
    }

    if (!current || !line.startsWith('    ')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    if (key === 'artifacts') {
      value = value.replace(/^\[/, '').replace(/\]$/, '');
      current[key] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else if (['id', 'name', 'source', 'severity', 'text'].includes(key)) {
      current[key] = value;
    }
  }

  if (current) principles.push(current);
  return principles;
}

function validate(principles) {
  const MIN_EXPECTED = 62; // floor: catches accidental truncation; catalog growth is allowed
  if (principles.length < MIN_EXPECTED) {
    throw new Error(`Expected at least ${MIN_EXPECTED} principles, got ${principles.length}`);
  }
  for (const p of principles) {
    for (const key of ['id', 'name', 'source', 'severity', 'artifacts', 'text']) {
      if (p[key] === undefined) {
        throw new Error(`Principle ${p.id || '(unknown)'} missing field ${key}`);
      }
    }
  }
}

function catalogVersion(catalogPath) {
  try {
    const catalogDir = dirname(catalogPath);
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: catalogDir,
      encoding: 'utf8',
      timeout: 5000,
    }).trim();
    return sha;
  } catch {
    return 'unknown';
  }
}

function renderMustCard(principles, catalogPath, version) {
  const filtered = principles.filter(p => p.artifacts.includes('agent-instruction'));
  const lines = [
    '# Must-card',
    '',
    `Catalog: ${catalogPath}`,
    `Version: ${version}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Apply these principles to agent instructions, handoffs, specs, and PRDs.',
    '',
  ];
  for (const p of filtered) {
    lines.push(`## ${p.id}: ${p.name}`);
    lines.push('');
    lines.push(p.text);
    lines.push('');
  }
  return lines.join('\n') + '\n';
}

function roleForPrinciple(p) {
  if (p.id.startsWith('PS-CODER-')) return ['coder'];
  if (p.id.startsWith('PS-TESTER-')) return ['tester'];
  if (p.id.startsWith('PS-FIXER-')) return ['fixer'];
  return [];
}

function isSharedCode(p) {
  if (p.id.startsWith('PS-CODER-')) return false;
  if (p.id.startsWith('PS-TESTER-')) return false;
  if (p.id.startsWith('PS-FIXER-')) return false;
  if (p.artifacts.includes('agent-instruction')) return false;
  return p.severity === 'must' && p.artifacts.includes('code');
}

function isGeneral(p) {
  if (p.id.startsWith('PS-CODER-')) return false;
  if (p.id.startsWith('PS-TESTER-')) return false;
  if (p.id.startsWith('PS-FIXER-')) return false;
  if (p.artifacts.includes('agent-instruction')) return false;
  if (isSharedCode(p)) return false;
  return true;
}

function renderRolePrompts(principles) {
  const byRole = Object.fromEntries(ROLES.map(r => [r, []]));

  for (const p of principles) {
    const direct = roleForPrinciple(p);
    for (const r of direct) {
      if (byRole[r]) byRole[r].push({ section: 'role-specific', principle: p });
    }
    if (isSharedCode(p)) {
      byRole.coder.push({ section: 'shared-code', principle: p });
      byRole.tester.push({ section: 'shared-code', principle: p });
      byRole.fixer.push({ section: 'shared-code', principle: p });
    }
    if (isGeneral(p)) {
      byRole.explore.push({ section: 'general', principle: p });
      byRole.plan.push({ section: 'general', principle: p });
    }
  }

  const files = {};
  for (const role of ROLES) {
    const entries = byRole[role];
    const roleSpecific = entries.filter(e => e.section === 'role-specific').map(e => e.principle);
    const shared = entries.filter(e => e.section !== 'role-specific').map(e => e.principle);
    const lines = [`# Role prompt: ${role}`, ''];

    if (roleSpecific.length > 0) {
      lines.push('## Role-specific principles');
      lines.push('');
      for (const p of roleSpecific) {
        lines.push(`### ${p.id}: ${p.name}`);
        lines.push('');
        lines.push(p.text);
        lines.push('');
      }
    }

    if (shared.length > 0) {
      lines.push('## Shared principles');
      lines.push('');
      for (const p of shared) {
        lines.push(`### ${p.id}: ${p.name}`);
        lines.push('');
        lines.push(p.text);
        lines.push('');
      }
    }

    files[`${role}.md`] = lines.join('\n') + '\n';
  }

  return files;
}

function renderLintRules(principles) {
  const lintable = [
    { id: 'CHOOSE-PRECISE-NAMES', check: 'No vague labels or banned synonyms.', tool: 'ste-lint.py (banned_word, vague_noun)' },
    { id: 'PS-01', check: 'Reject ad-hoc hacks in skills.', tool: 'human-judged' },
    { id: 'PS-04', check: 'Design decision stated before code.', tool: 'human-judged' },
    { id: 'PS-06', check: 'Every factual claim has trusted tool or human evidence.', tool: 'human-judged' },
    { id: 'PS-CODER-02', check: 'Diff compared against acceptance criteria.', tool: 'human-judged' },
    { id: 'PS-TV-06', check: 'Regression test for every confirmed bug.', tool: 'human-judged' },
    { id: 'RTL-08', check: 'Numeric/factual results come from trusted tools.', tool: 'human-judged' },
    { id: 'RTL-2.1-03', check: 'Regression tests pass after refactor.', tool: 'human-judged' },
  ];

  const mechanical = [
    { id: 'VOICE-20', check: 'Sentences under 20 words.', tool: 'ste-lint.py (long_sentence)' },
    { id: 'VOICE-SEMICOLON', check: 'No semicolons.', tool: 'ste-lint.py (semicolon)' },
    { id: 'VOICE-CONTRACTION', check: 'No contractions.', tool: 'ste-lint.py (contraction)' },
    { id: 'VOICE-PASSIVE', check: 'Active voice preferred.', tool: 'ste-lint.py (passive_voice)' },
    { id: 'VOICE-MARKETING', check: 'No marketing adjectives.', tool: 'ste-lint.py (marketing_adjective)' },
  ];

  const lines = [
    '# Lint rules',
    '',
    'Mechanical checks run by the compliance gate.',
    '',
    '## Mechanical voice checks',
    '',
    '| ID | Check | Tool |',
    '|---|---|---|',
  ];
  for (const r of mechanical) {
    lines.push(`| ${r.id} | ${r.check} | ${r.tool} |`);
  }
  lines.push('');
  lines.push('## Principle-linked checks');
  lines.push('');
  lines.push('| ID | Principle | Check | Tool |');
  lines.push('|---|---|---|---|');
  for (const r of lintable) {
    const p = principles.find(x => x.id === r.id);
    const name = p ? p.name : '-';
    lines.push(`| ${r.id} | ${name} | ${r.check} | ${r.tool} |`);
  }
  lines.push('');
  lines.push('## Human-judged principles');
  lines.push('');
  const human = principles.filter(p =>
    p.severity === 'must' &&
    !mechanical.some(m => m.id === p.id) &&
    !lintable.some(l => l.id === p.id)
  );
  for (const p of human) {
    lines.push(`- ${p.id}: ${p.name}`);
  }
  lines.push('');

  return lines.join('\n') + '\n';
}

function renderCpCorpus(principles, catalogPath) {
  const cps = principles
    .filter((p) => p.id.startsWith('CP-') && p.artifacts.includes('code'))
    .map((p) => ({ id: p.id, severity: p.severity, statement: p.text }));
  return JSON.stringify({ generated_from: catalogPath, cps }, null, 2) + '\n';
}

function renderSpecTemplate() {
  return `# Spec template

Status: draft
Area: <area>

## Goal

One sentence describing the outcome.

## Acceptance criteria

### Criterion 1

- Behavior: <what the system does>
- Verification command: <one re-runnable command>

### Criterion 2

- Behavior: <what the system does>
- Verification command: <one re-runnable command>

## Out of scope

- <item 1>

## Open questions

- <question>

## Notes

Add design notes here. Do not skip verification commands.
`;
}

function main() {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf('--out');
  const outDir = outIndex !== -1 ? args[outIndex + 1] : 'rendered';
  if (!outDir) {
    console.error('Usage: node render.mjs [--out <dir>]');
    process.exit(1);
  }

  const catalogPath = args.find((_, i) => args[i - 1] === '--catalog') || DEFAULT_CATALOG;
  const catalogText = readFileSync(catalogPath, 'utf8');
  const principles = parseCatalog(catalogText);
  validate(principles);

  const absoluteOut = resolve(outDir);
  mkdirSync(absoluteOut, { recursive: true });
  mkdirSync(join(absoluteOut, 'role-prompts'), { recursive: true });

  const version = catalogVersion(catalogPath);

  writeFileSync(join(absoluteOut, 'must-card.md'), renderMustCard(principles, catalogPath, version));

  const rolePrompts = renderRolePrompts(principles);
  for (const [filename, content] of Object.entries(rolePrompts)) {
    writeFileSync(join(absoluteOut, 'role-prompts', filename), content);
  }

  writeFileSync(join(absoluteOut, 'lint-rules.md'), renderLintRules(principles));
  writeFileSync(join(absoluteOut, 'cp-corpus.json'), renderCpCorpus(principles, catalogPath));
  writeFileSync(join(absoluteOut, 'spec-template.md'), renderSpecTemplate());

  console.log(`Rendered ${principles.length} principles to ${absoluteOut}`);
  console.log(`Must-card: ${principles.filter(p => p.artifacts.includes('agent-instruction')).map(p => p.id).join(', ')}`);
}

main();
