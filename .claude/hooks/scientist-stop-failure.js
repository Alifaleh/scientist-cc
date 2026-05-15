#!/usr/bin/env node
// Scientist StopFailure Hook
//
// Fires when a turn ends due to an API error (rate_limit, server_error, etc.).
// Cannot block (per docs, output and exit code are ignored). Used purely for
// observability — records failures to state.json so the next session can see
// patterns (e.g., repeated rate limits -> back off and try later).
//
// Reference: docs.claude.com/docs/claude-code/hooks (StopFailure section).

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const scientistDir = path.join(projectDir, '.scientist');
if (!fs.existsSync(scientistDir)) process.exit(0);

let hookInput = {};
try {
  hookInput = JSON.parse(fs.readFileSync(0, 'utf-8'));
} catch (e) {}

const errorType = hookInput.error_type || 'unknown';
const stateFile = path.join(scientistDir, 'state.json');
let state = {};
try {
  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  }
} catch (e) {}

if (!Array.isArray(state.api_errors)) state.api_errors = [];
state.api_errors.push({ type: errorType, time: new Date().toISOString() });
// Cap history at 50 entries.
if (state.api_errors.length > 50) {
  state.api_errors = state.api_errors.slice(-50);
}

try { fs.writeFileSync(stateFile, JSON.stringify(state, null, 2)); } catch (e) {}
process.exit(0);
