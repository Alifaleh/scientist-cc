#!/usr/bin/env node
// Scientist Anti-Stop Hook v2
// Fires on the "Stop" event — when Claude finishes responding
// Checks state.json for incomplete loop and BLOCKS stopping if needed

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

// Only activate if this is a scientist project
if (fs.existsSync(scientistDir)) {
  let reason = 'ANTI-STOPPING: You stopped. The scientist loop NEVER stops. Continue immediately.';

  // Check state.json for loop position
  try {
    const stateFile = path.join(scientistDir, 'state.json');
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      reason = `ANTI-STOPPING: You stopped at loop position "${state.loop_position || 'unknown'}". ` +
        `The scientist loop NEVER stops. Stage: ${state.mastery_stage || 1}. ` +
        `Vault: ${state.vault_notes || '?'} notes. Continue immediately — DO the next thing.`;
    }
  } catch (e) {
    // Keep default reason
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: reason
    }
  };
  console.log(JSON.stringify(output));
}
