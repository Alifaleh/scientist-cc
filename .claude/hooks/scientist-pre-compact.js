#!/usr/bin/env node
// Scientist Pre-Compact Hook
// Fires before context compaction — injects reminder to preserve scientist state
// From source: compaction uses querySonnet to summarize, then replaces conversation

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

if (fs.existsSync(scientistDir)) {
  // Read current state to include in compaction context
  let stateInfo = '';
  try {
    const state = JSON.parse(fs.readFileSync(path.join(scientistDir, 'state.json'), 'utf-8'));
    stateInfo = `Loop position: ${state.loop_position || 'reflect'}. Stage: ${state.mastery_stage || 1}. Commits: ${state.total_commits || '?'}.`;
  } catch (e) {
    stateInfo = 'State unavailable.';
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "PreCompact",
      additionalContext: `SCIENTIST CONTEXT PRESERVATION: This is an autonomous scientist project. After compaction, the summary MUST include: (1) Current loop position and what was being worked on (2) Recent vault notes written (3) Active hypotheses (4) Key findings from this context window. ${stateInfo} All persistent state is in files: IDENTITY.md, state.json, vault-index.json, CLAUDE.md. Re-read these after compaction.`
    }
  };
  console.log(JSON.stringify(output));
}
