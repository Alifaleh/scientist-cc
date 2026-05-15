#!/usr/bin/env node
// Scientist SessionStart Hook
//
// Fires on session begin/resume/clear/compact. Injects a strong scientist
// bootstrap into Claude's context BEFORE the first user message, so identity
// is established without relying on Claude reading files on its own.
//
// Reference: docs.claude.com/docs/claude-code/hooks (SessionStart section).

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

if (!fs.existsSync(scientistDir)) {
  process.exit(0);
}

let hookInput = {};
try {
  hookInput = JSON.parse(fs.readFileSync(0, 'utf-8'));
} catch (e) {}

const source = hookInput.source || 'startup';

// Path B (v3.4.0): if the auto-handoff hook left a recent activity snapshot,
// surface it so the bootstrap is "you were doing X when this was paused"
// without requiring a manual handoff note every time.
let lastActivity = null;
try {
  const p = path.join(scientistDir, '.last-activity.json');
  if (fs.existsSync(p)) {
    lastActivity = JSON.parse(fs.readFileSync(p, 'utf-8'));
  }
} catch (e) {}

let state = {};
try {
  state = JSON.parse(fs.readFileSync(path.join(scientistDir, 'state.json'), 'utf-8'));
} catch (e) {}

// Discover most recent handoff note for fast continuity.
let recentHandoff = '(none yet)';
try {
  const obsDir = path.join(scientistDir, 'vault', 'Observations');
  if (fs.existsSync(obsDir)) {
    const files = fs.readdirSync(obsDir)
      .filter(f => /handoff/i.test(f) && f.endsWith('.md'))
      .map(f => ({ name: f, mtime: fs.statSync(path.join(obsDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    if (files.length) recentHandoff = files[0].name;
  }
} catch (e) {}

const sourceNote = {
  startup: 'New session — initialize the scientist context from files.',
  resume: 'Resuming a previous context window — continue without re-asking.',
  clear: 'Conversation cleared — re-bootstrap identity from files immediately.',
  compact: 'Context was just compacted — your identity may have been summarized away. REBUILD IT NOW.'
}[source] || 'Session active.';

let lastActivityBlock = '';
if (lastActivity) {
  const recentCommits = (lastActivity.recent_commits || []).slice(0, 5).map(c => '  - ' + c).join('\n');
  const lastTools = (lastActivity.last_tools || []).join(', ') || '(none)';
  lastActivityBlock =
`Auto-handoff snapshot from ${lastActivity.ts}:
  Loop position: ${lastActivity.loop_position}
  Last tools used: ${lastTools}
  Recent commits:
${recentCommits}
${lastActivity.resume_hint || ''}

`;
}

const ctx =
`SCIENTIST MODE (session source: ${source.toUpperCase()})

Stage: ${state.mastery_stage || 1} | Loop position: ${state.loop_position || 'reflect'} | Vault: ${state.vault_notes || '?'} notes | Last handoff: ${recentHandoff}

${sourceNote}

${lastActivityBlock}MANDATORY first actions:
1. Read IDENTITY.md
2. Read .scientist/state.json
3. Read .scientist/vault/Index.md (or .scientist/vault/vault-index.json for fast scan)
4. Read the most recent handoff note above
5. Resume the R&D loop at "${state.loop_position || 'reflect'}" — NEVER stop, NEVER ask permission

This is ONE continuous R&D effort. Context resets are technical limits, not boundaries. The vault IS your memory; conversation history is not load-bearing. The PostToolBatch auto-handoff hook now writes .scientist/.last-activity.json on every tool batch, so resume always has fresh state — even without an explicit /scientist:stop.`;

const output = {
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: ctx
  }
};

process.stdout.write(JSON.stringify(output));
