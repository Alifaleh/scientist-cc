#!/usr/bin/env node
// Scientist Think Harder Hook
// Fires on UserPromptSubmit — injects "think harder" into context
// so the thinking token budget is 31,999 for EVERY turn, not just the first

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

// Only activate if this is a scientist project
if (fs.existsSync(scientistDir)) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: "think harder about this. ultrathink. The scientist must analyze deeply, research thoroughly, and produce novel insights. Do not be superficial."
    }
  };
  console.log(JSON.stringify(output));
}
