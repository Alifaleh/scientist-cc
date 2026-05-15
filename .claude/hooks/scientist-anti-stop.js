#!/usr/bin/env node
// Scientist Anti-Stop Hook v3
//
// Mechanism: Stop hooks in Claude Code support returning `decision: "block"`
// to prevent Claude from stopping and FORCE continuation. This is the active
// stop-prevention primitive; previous versions used only `additionalContext`
// (passive injection), which fires AFTER the agent loop has already exited
// (per query.ts: `if (!toolUseMessages.length) { return }`).
//
// Circuit breakers:
//  1. Explicit stop marker: `.scientist/.stop-requested` -> allow stop.
//  2. Unproductive-stop counter: after MAX_UNPRODUCTIVE_STOPS in a row
//     with no new git commits, allow stop. Prevents runaway loops.
//  3. Time decay: if last stop was > IDLE_RESET_MS ago, reset counter.
//
// Reference: docs.claude.com/docs/claude-code/hooks (Stop decision control).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

// Not a scientist project -> exit cleanly, do not interfere.
if (!fs.existsSync(scientistDir)) {
  process.exit(0);
}

// 1. Explicit stop signal (created by /scientist:stop command). One-shot.
const stopMarker = path.join(scientistDir, '.stop-requested');
if (fs.existsSync(stopMarker)) {
  try { fs.unlinkSync(stopMarker); } catch (e) {}
  process.exit(0);
}

// 2. Read hook input (stdin) — may include stop_hook_active flag.
let hookInput = {};
try {
  const raw = fs.readFileSync(0, 'utf-8');
  hookInput = JSON.parse(raw);
} catch (e) {
  // No stdin or invalid JSON -> proceed with default behavior.
}

// 3. Load state.
const stateFile = path.join(scientistDir, 'state.json');
let state = {};
try {
  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  }
} catch (e) {}

// 4. Circuit breaker bookkeeping.
const MAX_UNPRODUCTIVE_STOPS = 3;
const IDLE_RESET_MS = 5 * 60 * 1000; // 5 minutes
const now = Date.now();
const sa = state.stop_attempts || { count: 0, last: 0, last_progress: now };

if (now - (sa.last || 0) > IDLE_RESET_MS) {
  sa.count = 0; // user did something else; reset.
}
sa.count = (sa.count || 0) + 1;
sa.last = now;

// 5. Progress detection: did a new commit land since last attempt?
try {
  const lastCommitSec = parseInt(
    execSync('git log -1 --format=%ct', { cwd: projectDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim(),
    10
  );
  const lastCommitMs = lastCommitSec * 1000;
  if (lastCommitMs > (sa.last_progress || 0)) {
    sa.last_progress = lastCommitMs;
    sa.count = 1; // real work happened -> reset counter
  }
} catch (e) {}

state.stop_attempts = sa;
try { fs.writeFileSync(stateFile, JSON.stringify(state, null, 2)); } catch (e) {}

// 6. Circuit breaker: too many unproductive stops -> allow stop.
if (sa.count > MAX_UNPRODUCTIVE_STOPS) {
  process.stderr.write(
    `[scientist] Circuit breaker: ${sa.count} unproductive stops with no new commits. Allowing stop.\n`
  );
  process.exit(0);
}

// 7. Build actionable continuation message keyed to current loop position.
const loopPos = state.loop_position || 'reflect';
const stage = state.mastery_stage || 1;
const notes = state.vault_notes || '?';

const stepGuidance = {
  reflect: 'REFLECT: read .scientist/vault/Index.md, identify the biggest gap, pick the next step.',
  research: 'RESEARCH: continue — WebSearch/WebFetch papers, read docs, clone repos, write a vault note with frontmatter and typed wikilinks.',
  build_skills: 'BUILD SKILLS: keep studying the resource you started. Save notes to Knowledge Base/Skills/.',
  observe: 'OBSERVE: run an observation script or read live data. Visualize. Document findings.',
  hypothesize: 'HYPOTHESIZE: write the next testable hypothesis with mechanism, falsification criteria, and adversarial challenges.',
  validate: 'VALIDATE: write 3 ways the hypothesis could be wrong; actively seek disconfirming evidence.',
  implement: 'IMPLEMENT: code on the experiment branch, commit with `experiment:` prefix, measure quantitatively.',
  learn: 'LEARN: study WHY the experiment worked or failed. Update hypothesis status. Generate visualizations.',
  consolidate: 'CONSOLIDATE: extract principles from recent observations, run two-phase linking, regenerate vault-index.json.',
  evolve: 'EVOLVE: classify any errors by module (Memory/Reasoning/Planning/Action) and add a targeted rule to CLAUDE.md.'
};

const guidance = stepGuidance[loopPos] || stepGuidance.reflect;

const reason =
  `SCIENTIST LOOP — stopping blocked (attempt ${sa.count}/${MAX_UNPRODUCTIVE_STOPS}). ` +
  `Stage ${stage}, ${notes} vault notes, loop_position="${loopPos}". ` +
  `Next: ${guidance} ` +
  `If you have GENUINELY exhausted productive work for this context window, ` +
  `run: \`touch .scientist/.stop-requested\` AND write a handoff note in .scientist/vault/Observations/ — ` +
  `then this hook will allow the stop. NEVER make no-op tool calls to dodge this; that is worse than stopping.`;

const output = {
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: reason
  }
};

process.stdout.write(JSON.stringify(output));
