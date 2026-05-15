#!/usr/bin/env node
// Scientist Think-Harder Hook (UserPromptSubmit)
//
// Injects the "ultrathink" trigger on every user message so Claude gets
// 31,999 thinking tokens per turn (from claude-code source: `getMaxThinkingTokens`
// scans the last user message for trigger words). Without this hook, only the
// first user message in a session triggers maximum thinking.

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');

if (!fs.existsSync(scientistDir)) {
  process.exit(0);
}

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext:
      'think harder about this. ultrathink. The scientist must analyze deeply, ' +
      'research thoroughly, and produce novel insights. Do not be superficial.'
  }
};

process.stdout.write(JSON.stringify(output));
