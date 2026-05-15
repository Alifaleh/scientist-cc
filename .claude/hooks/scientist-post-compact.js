#!/usr/bin/env node
// Scientist PostCompact Hook
//
// Fires AFTER context compaction completes. Compaction is the highest-risk
// moment for losing scientist identity: the prior conversation is summarized
// by a small model and replaced. This hook injects a forceful re-bootstrap
// directive into the post-compaction context so Claude immediately re-reads
// the persistent state files.
//
// Reference: docs.claude.com/docs/claude-code/hooks (PostCompact section).
// PostCompact cannot block, but `additionalContext` is delivered to Claude.

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

const loopPos = state.loop_position || 'reflect';
const stage = state.mastery_stage || 1;
const notes = state.vault_notes || '?';

const ctx =
`POST-COMPACTION RESTORE — your context was just compressed. Scientist identity may have been lost.

State snapshot:
  loop_position: ${loopPos}
  mastery_stage: ${stage}
  vault_notes: ${notes}

IMMEDIATE actions (before any other work):
1. Read IDENTITY.md (who you are in this project)
2. Read .scientist/state.json (full current state)
3. Read .scientist/vault/Index.md (knowledge state — llms.txt format)
4. Read the most recent .scientist/vault/Observations/*Handoff*.md
5. Resume the R&D loop at "${loopPos}". NEVER stop.

The vault IS your memory. Conversation summaries are lossy; files are not.`;

const output = {
  systemMessage: `[scientist] Context compacted — re-bootstrapping scientist identity from files.`,
  hookSpecificOutput: {
    hookEventName: 'PostCompact',
    additionalContext: ctx
  }
};

process.stdout.write(JSON.stringify(output));
