#!/usr/bin/env node
// Scientist PreCompact Hook
//
// Fires BEFORE context compaction. We pass a directive into the compaction
// prompt so the small summarizer model preserves scientist-critical state
// (loop position, recent vault notes, active hypotheses) in its summary.
// The companion `scientist-post-compact.js` hook then re-bootstraps from
// files after compaction completes.

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

if (!fs.existsSync(scientistDir)) {
  process.exit(0);
}

let state = {};
try {
  state = JSON.parse(fs.readFileSync(path.join(scientistDir, 'state.json'), 'utf-8'));
} catch (e) {}

const stateInfo =
  `loop_position=${state.loop_position || 'reflect'} | ` +
  `stage=${state.mastery_stage || 1} | ` +
  `vault_notes=${state.vault_notes || '?'} | ` +
  `total_commits=${state.total_commits || '?'}`;

const ctx =
`SCIENTIST PRE-COMPACTION DIRECTIVE: This is an autonomous scientist project running an infinite R&D loop. The post-compaction summary MUST preserve:
 (1) Current loop position and what was being worked on
 (2) Recent vault notes written this session
 (3) Active hypotheses and their status
 (4) Key findings or decisions from this context window
 (5) Any in-flight experiments or commits

State snapshot: ${stateInfo}

All persistent state lives in files (IDENTITY.md, .scientist/state.json, .scientist/vault/Index.md, .scientist/vault/vault-index.json, CLAUDE.md). After compaction, re-read these files before continuing the loop.`;

const output = {
  hookSpecificOutput: {
    hookEventName: 'PreCompact',
    additionalContext: ctx
  }
};

process.stdout.write(JSON.stringify(output));
