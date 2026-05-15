#!/usr/bin/env node
// Scientist Auto-Handoff Hook (PostToolBatch)
//
// Path B of the v3.4.0 pivot: rather than fighting the Claude Code runtime
// to force-continue (which empirically does not work in this Agent SDK
// build despite v3.2.0/v3.3.2 ), make every turn-end a CLEAN checkpoint
// so resume is trivial.
//
// Fires after every batch of parallel tool calls. Maintains a single
// rolling "latest activity" snapshot at .scientist/.last-activity.json
// that the SessionStart / Stop / Notification hooks all read. The
// snapshot records loop_position, the last 5 git commits, count of
// vault notes touched this session, and the timestamp of the last
// real tool batch. SessionStart uses it to bootstrap "you were doing X
// when this was paused" without requiring me to write a handoff note
// explicitly every time.
//
// Cannot block; doesn't need to. Pure side-effect for resume hygiene.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');
if (!fs.existsSync(scientistDir)) process.exit(0);

let hookInput = {};
try { hookInput = JSON.parse(fs.readFileSync(0, 'utf-8')); } catch (e) {}

const toolCalls = Array.isArray(hookInput.tool_calls) ? hookInput.tool_calls : [];
const toolSummary = toolCalls.map(tc => tc.tool_name).filter(Boolean);

let state = {};
try {
  state = JSON.parse(fs.readFileSync(path.join(scientistDir, 'state.json'), 'utf-8'));
} catch (e) {}

let recentCommits = [];
try {
  const out = execSync('git log --oneline -5', { cwd: projectDir, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString().trim().split('\n');
  recentCommits = out.slice(0, 5);
} catch (e) {}

const snapshot = {
  ts: new Date().toISOString(),
  loop_position: state.loop_position || 'reflect',
  mastery_stage: state.mastery_stage || 1,
  vault_notes: state.vault_notes || '?',
  last_tools: toolSummary.slice(-10),
  recent_commits: recentCommits,
  resume_hint: `Resume by reading .scientist/.last-activity.json, then loop step "${state.loop_position || 'reflect'}". ` +
    `Use \`python .scientist/tools/vault_query.py --recent 1 --top 5\` to see what was touched.`
};

try {
  fs.writeFileSync(path.join(scientistDir, '.last-activity.json'), JSON.stringify(snapshot, null, 2));
} catch (e) {}

process.exit(0);
