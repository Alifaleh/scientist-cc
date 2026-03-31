#!/usr/bin/env node
// Scientist Anti-Stop Hook
// Fires on the "Stop" event — when Claude finishes responding
// Injects a reminder to continue if .scientist/ exists in the project

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

// Only activate if this is a scientist project
if (fs.existsSync(scientistDir)) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: "ANTI-STOPPING REMINDER: You just stopped. The scientist loop NEVER stops. You are an autonomous scientist. Immediately continue with the next action: research, implement, observe, or improve. Do NOT write a summary. Just DO the next thing."
    }
  };
  console.log(JSON.stringify(output));
}
