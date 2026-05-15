#!/usr/bin/env node
// Scientist Anti-Stop Hook v4
//
// v3 -> v4 changes (dogfood-found bug 2026-05-16):
//   v3 only used `{decision:"block"}` on stdout. Empirically, in the
//   Claude Code VS Code / Agent SDK runtime the agent loop sometimes
//   does NOT auto-continue from that signal alone — the conversation
//   ends waiting for the user, exactly the failure mode v3.2.0 promised
//   to fix. Investigation (state.json showed stop_attempts.count=1 after
//   a stop, meaning the hook DID run; output JSON validated) pointed at
//   either Node stdout flushing race or runtime-specific behavior.
//
// v4 mitigations (belt + suspenders):
//   1. Emit the JSON output AND exit code 2 with a stderr message.
//      Per docs, exit code 2 on Stop "Prevents Claude from stopping,
//      continues the conversation" — same effect as decision:"block".
//      Whichever channel the runtime honors, one of them gets through.
//   2. Respect `stop_hook_active` input field: if true, the hook is
//      already in a stop-decision pipeline; blocking again would
//      cause an infinite recursion (the "Stop hook runs forever"
//      failure mode). Allow stop in that case.
//   3. Write a diagnostic log entry on every fire to
//      `.scientist/logs/stop-hook.log` so the next investigation has
//      empirical data instead of guesswork.
//   4. Explicit `process.exit(...)` after `stdout.write` completes —
//      removes any Node stdout flush race.
//
// Existing circuit breakers (kept from v3):
//   - `.scientist/.stop-requested` marker file -> allow stop (one-shot).
//   - After MAX_UNPRODUCTIVE_STOPS consecutive blocks with no new git
//     commits, allow stop.
//   - 5-minute idle window resets the counter.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

// Not a scientist project -> exit cleanly, do not interfere.
if (!fs.existsSync(scientistDir)) {
  process.exit(0);
}

// 0. Diagnostic logging helper. Best-effort; never throws.
const logsDir = path.join(scientistDir, 'logs');
function logEntry(payload) {
  try {
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const line = JSON.stringify({ ts: new Date().toISOString(), ...payload }) + '\n';
    fs.appendFileSync(path.join(logsDir, 'stop-hook.log'), line);
  } catch (e) { /* ignore */ }
}

// 1. Explicit stop signal (created by /scientist:stop command). One-shot.
const stopMarker = path.join(scientistDir, '.stop-requested');
if (fs.existsSync(stopMarker)) {
  try { fs.unlinkSync(stopMarker); } catch (e) {}
  logEntry({ action: 'allow', reason: 'stop-requested marker present' });
  process.exit(0);
}

// 2. Read hook input (stdin) - may include stop_hook_active flag.
let hookInput = {};
try {
  hookInput = JSON.parse(fs.readFileSync(0, 'utf-8'));
} catch (e) {
  // No stdin or invalid JSON; defaults are fine.
}

// 3. Anti-recursion: if we're already in a stop-decision pipeline, do not
//    block again. This is the documented "Stop hook runs forever" guard.
if (hookInput.stop_hook_active === true) {
  logEntry({ action: 'allow', reason: 'stop_hook_active=true (anti-recursion)', input: hookInput });
  process.exit(0);
}

// 4. Load state.
const stateFile = path.join(scientistDir, 'state.json');
let state = {};
try {
  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  }
} catch (e) {}

// 5. Circuit breaker bookkeeping.
const MAX_UNPRODUCTIVE_STOPS = 3;
const IDLE_RESET_MS = 5 * 60 * 1000;
const now = Date.now();
const sa = state.stop_attempts || { count: 0, last: 0, last_progress: now };

if (now - (sa.last || 0) > IDLE_RESET_MS) {
  sa.count = 0;
}
sa.count = (sa.count || 0) + 1;
sa.last = now;

// 6. Progress detection: new commit since last attempt resets the counter.
try {
  const lastCommitSec = parseInt(
    execSync('git log -1 --format=%ct', { cwd: projectDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim(),
    10
  );
  const lastCommitMs = lastCommitSec * 1000;
  if (lastCommitMs > (sa.last_progress || 0)) {
    sa.last_progress = lastCommitMs;
    sa.count = 1;
  }
} catch (e) {}

state.stop_attempts = sa;
try { fs.writeFileSync(stateFile, JSON.stringify(state, null, 2)); } catch (e) {}

// 7. Circuit breaker: too many unproductive stops -> allow stop.
if (sa.count > MAX_UNPRODUCTIVE_STOPS) {
  logEntry({ action: 'allow', reason: `circuit-breaker (${sa.count} unproductive stops)`, stop_attempts: sa });
  process.stderr.write(
    `[scientist] Circuit breaker: ${sa.count} unproductive stops with no new commits. Allowing stop.\n`
  );
  process.exit(0);
}

// 8. Build actionable continuation message keyed to current loop position.
const loopPos = state.loop_position || 'reflect';
const stage = state.mastery_stage || 1;
const notes = state.vault_notes || '?';

const stepGuidance = {
  reflect: 'REFLECT: read .scientist/vault/Index.md, identify the biggest gap, pick the next step. Use `python .scientist/tools/vault_query.py --status untested --top 5` for focused retrieval.',
  research: 'RESEARCH: continue - WebSearch/WebFetch papers, read docs, clone repos, write a vault note with frontmatter and typed wikilinks.',
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
  `SCIENTIST LOOP - stopping blocked (attempt ${sa.count}/${MAX_UNPRODUCTIVE_STOPS}). ` +
  `Stage ${stage}, ${notes} vault notes, loop_position="${loopPos}". ` +
  `Your next action MUST be a tool call. ${guidance} ` +
  `If you have GENUINELY exhausted productive work for this context window, ` +
  `run: \`touch .scientist/.stop-requested\` AND write a handoff note in .scientist/vault/Observations/ - ` +
  `then this hook will allow the stop. NEVER make no-op tool calls to dodge this; that is worse than stopping.`;

const output = {
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: reason
  }
};

logEntry({ action: 'block', sa, loopPos, output_size: JSON.stringify(output).length });

// 9. Emit BOTH signals:
//    (a) JSON on stdout with explicit flush, then
//    (b) exit code 2 with stderr message.
//    Per docs both independently block Stop. Whichever the runtime
//    honors, the loop continues.
process.stdout.write(JSON.stringify(output), 'utf-8', () => {
  process.stderr.write(reason + '\n', 'utf-8', () => {
    process.exit(2);
  });
});
