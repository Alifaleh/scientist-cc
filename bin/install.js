#!/usr/bin/env node
/**
 * Scientist installer for Claude Code.
 *
 * Registers /scientist commands and bundled MCP servers.
 *
 * Usage:
 *   scientist-cc --global    # Install to ~/.claude/commands/ (all projects)
 *   scientist-cc --local     # Install to .claude/commands/ (this project)
 *   scientist-cc --uninstall # Remove commands
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const COMMANDS_SRC = path.join(PACKAGE_ROOT, 'commands', 'scientist');
const AGENTS_SRC = path.join(PACKAGE_ROOT, 'agents');
const SKILLS_SRC = path.join(PACKAGE_ROOT, 'skills');
const CORE_SRC = path.join(PACKAGE_ROOT, 'core');
const TOOLS_SRC = path.join(PACKAGE_ROOT, 'tools');
const MCP_SRC = path.join(PACKAGE_ROOT, 'mcp');

const MARKER = '# Scientist Configuration — managed by scientist-cc installer';

function getClaudeConfigDir(global) {
  if (global) {
    return path.join(os.homedir(), '.claude');
  }
  return path.join(process.cwd(), '.claude');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // Skip .git directories
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installCommands(configDir) {
  const commandsDir = path.join(configDir, 'commands');
  ensureDir(commandsDir);

  // Copy command files
  const commands = fs.readdirSync(COMMANDS_SRC).filter(f => f.endsWith('.md'));
  for (const cmd of commands) {
    const src = path.join(COMMANDS_SRC, cmd);
    const dest = path.join(commandsDir, cmd);
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Command: /${cmd.replace('.md', '').replace('scientist-', 'scientist:')}`);
  }

  return commands.length;
}

function installCore(configDir) {
  const scientistDir = path.join(configDir, 'scientist');

  // Copy core (workflows, templates, references)
  copyDir(CORE_SRC, path.join(scientistDir, 'core'));
  console.log('  ✓ Core workflows, templates, and references');

  // Copy skills (optional — may not exist in npm package)
  if (fs.existsSync(SKILLS_SRC)) {
    copyDir(SKILLS_SRC, path.join(scientistDir, 'skills'));
    const skillDirs = fs.readdirSync(path.join(scientistDir, 'skills')).filter(f =>
      fs.statSync(path.join(scientistDir, 'skills', f)).isDirectory()
    );
    console.log(`  ✓ ${skillDirs.length} skills: ${skillDirs.join(', ')}`);
  } else {
    console.log('  ○ Obsidian skills not bundled (install from GitHub for full package)');
  }

  // Copy agents (optional)
  if (fs.existsSync(AGENTS_SRC)) {
    copyDir(AGENTS_SRC, path.join(scientistDir, 'agents'));
    console.log('  ✓ Agent definitions');
  }

  // Copy tools (pdf_reader, repo_reader)
  if (fs.existsSync(TOOLS_SRC)) {
    copyDir(TOOLS_SRC, path.join(scientistDir, 'tools'));
    console.log('  ✓ Tools (pdf_reader, repo_reader)');
  }

  // MCP reference docs (optional — only in git, not npm)
  if (fs.existsSync(MCP_SRC)) {
    console.log('  ✓ MCP server reference docs available');
  }
}

function installMCP(configDir) {
  // Register bundled MCP servers in Claude Code settings
  const settingsPath = path.join(configDir, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch (e) {
      settings = {};
    }
  }

  if (!settings.mcpServers) {
    settings.mcpServers = {};
  }

  // Playwright MCP — uses Microsoft's official @playwright/mcp package.
  // Earlier versions registered `@anthropic-ai/mcp-server-playwright` which
  // does not exist on npm (404). Discovered via Rule 10 audit 2026-05-16.
  settings.mcpServers['scientist-playwright'] = {
    command: 'npx',
    args: ['-y', '@playwright/mcp@latest'],
    description: 'Scientist: Browser control for web research (@playwright/mcp by Microsoft)'
  };
  console.log('  ✓ MCP: Playwright (browser control)');

  // Jupyter MCP — uses public uvx package, no local files needed
  settings.mcpServers['scientist-jupyter'] = {
    command: 'uvx',
    args: ['jupyter-mcp-server', 'start'],
    description: 'Scientist: Jupyter notebook execution'
  };
  console.log('  ✓ MCP: Jupyter (notebook execution)');

  // Register all scientist hooks.
  // The six-hook anti-stop / context-preservation stack:
  //   Stop              -> active stop-blocking via decision:"block" (v3.2.0)
  //   StopFailure       -> log API errors for resilience analysis
  //   UserPromptSubmit  -> inject "ultrathink" trigger every turn (31,999 tokens)
  //   SessionStart      -> bootstrap scientist identity at session begin/resume/clear/compact
  //   PreCompact        -> tell the summarizer what scientist state to preserve
  //   PostCompact       -> re-bootstrap identity from files after compaction
  if (!settings.hooks) settings.hooks = {};

  const hookSpecs = [
    { event: 'Stop',             file: 'scientist-anti-stop.js',     label: 'Anti-stop (decision:block + circuit breakers)' },
    { event: 'StopFailure',      file: 'scientist-stop-failure.js',  label: 'Stop-failure logger (API error observability)' },
    { event: 'UserPromptSubmit', file: 'scientist-think-harder.js',  label: 'Think-harder (31,999 thinking tokens per turn)' },
    { event: 'SessionStart',     file: 'scientist-session-start.js', label: 'Session-start bootstrap (identity restore + auto-handoff snapshot)' },
    { event: 'PreCompact',       file: 'scientist-pre-compact.js',   label: 'Pre-compact directive (preserve scientist state)' },
    { event: 'PostCompact',      file: 'scientist-post-compact.js',  label: 'Post-compact re-bootstrap (re-read state files)' },
    { event: 'PostToolBatch',    file: 'scientist-auto-handoff.js',  label: 'Auto-handoff snapshot (.last-activity.json on every tool batch)' }
  ];

  for (const spec of hookSpecs) {
    if (!settings.hooks[spec.event]) settings.hooks[spec.event] = [];
    const already = settings.hooks[spec.event].some(h =>
      h.hooks && h.hooks.some(hk => hk.command && hk.command.includes(spec.file))
    );
    if (already) {
      console.log(`  ○ ${spec.event} hook already registered (${spec.file})`);
      continue;
    }
    settings.hooks[spec.event].push({
      hooks: [{
        type: 'command',
        command: `node "${path.join(configDir, 'hooks', spec.file)}"`,
        timeout: 5
      }]
    });
    console.log(`  ✓ ${spec.event} hook registered — ${spec.label}`);
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function installGlobalIdentity() {
  const globalDir = path.join(os.homedir(), '.scientist');
  ensureDir(globalDir);

  const identityPath = path.join(globalDir, 'GLOBAL-IDENTITY.md');
  if (!fs.existsSync(identityPath)) {
    const template = path.join(CORE_SRC, 'templates', 'GLOBAL-IDENTITY.md');
    if (fs.existsSync(template)) {
      fs.copyFileSync(template, identityPath);
      console.log('  ✓ Global identity created at ~/.scientist/GLOBAL-IDENTITY.md');
    }
  } else {
    console.log('  ○ Global identity already exists (preserved)');
  }

  // Install all six scientist hook scripts.
  const hooksDir = path.join(configDir, 'hooks');
  ensureDir(hooksDir);
  const hookFiles = [
    'scientist-anti-stop.js',
    'scientist-stop-failure.js',
    'scientist-think-harder.js',
    'scientist-session-start.js',
    'scientist-pre-compact.js',
    'scientist-post-compact.js',
    'scientist-auto-handoff.js'
  ];
  for (const file of hookFiles) {
    const src = path.join(PACKAGE_ROOT, '.claude', 'hooks', file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(hooksDir, file));
      console.log(`  ✓ Hook installed: ${file}`);
    }
  }
}

function uninstall(configDir) {
  const commandsDir = path.join(configDir, 'commands');
  const scientistDir = path.join(configDir, 'scientist');

  // Remove command files
  if (fs.existsSync(commandsDir)) {
    const files = fs.readdirSync(commandsDir).filter(f => f.startsWith('scientist'));
    for (const f of files) {
      fs.unlinkSync(path.join(commandsDir, f));
      console.log(`  ✗ Removed ${f}`);
    }
  }

  // Remove hook files
  const hooksDir = path.join(configDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hookFiles = fs.readdirSync(hooksDir).filter(f => f.startsWith('scientist-'));
    for (const f of hookFiles) {
      fs.unlinkSync(path.join(hooksDir, f));
      console.log(`  ✗ Removed hook ${f}`);
    }
  }

  // Remove core
  if (fs.existsSync(scientistDir)) {
    fs.rmSync(scientistDir, { recursive: true });
    console.log('  ✗ Removed scientist core');
  }

  // Remove MCP entries from settings
  const settingsPath = path.join(configDir, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      if (settings.mcpServers) {
        delete settings.mcpServers['scientist-playwright'];
        delete settings.mcpServers['scientist-jupyter'];
        console.log('  ✗ Removed MCP server entries');
      }
      // Remove all scientist hook registrations across every event.
      if (settings.hooks) {
        const events = ['Stop', 'StopFailure', 'UserPromptSubmit', 'SessionStart', 'PreCompact', 'PostCompact', 'PostToolBatch'];
        for (const ev of events) {
          if (!settings.hooks[ev]) continue;
          settings.hooks[ev] = settings.hooks[ev].filter(h =>
            !h.hooks?.some(hk => hk.command?.includes('scientist-'))
          );
          if (!settings.hooks[ev].length) delete settings.hooks[ev];
        }
        if (!Object.keys(settings.hooks).length) delete settings.hooks;
        console.log('  ✗ Removed scientist hooks');
      }
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (e) {}
  }

  console.log('\nScientist uninstalled.');
}

// --- Main ---

const args = process.argv.slice(2);
const isGlobal = args.includes('--global') || args.includes('-g');
const isLocal = args.includes('--local') || args.includes('-l');
const isUninstall = args.includes('--uninstall') || args.includes('-u');
const isAll = args.includes('--all');

if (!isGlobal && !isLocal && !isUninstall) {
  console.log(`
Scientist — Self-Evolving R&D Framework for Claude Code

Usage:
  scientist-cc --global     Install globally (~/.claude/)
  scientist-cc --local      Install locally (.claude/)
  scientist-cc --uninstall  Remove scientist

Run with bypass permissions enabled. Scientist requires full system access
to install tools, browse the web, manage files, and operate autonomously.
`);
  process.exit(0);
}

const configDir = getClaudeConfigDir(isGlobal);

if (isUninstall) {
  console.log(`\nUninstalling scientist from ${configDir}...\n`);
  uninstall(configDir);
  process.exit(0);
}

console.log(`\nInstalling scientist to ${configDir}...\n`);

const cmdCount = installCommands(configDir);
installCore(configDir);
installMCP(configDir);
installGlobalIdentity();

console.log(`
✓ Scientist installed successfully!

  ${cmdCount} commands registered
  Core workflows and references copied
  MCP servers configured
  Global identity initialized

Usage:
  Type /scientist in Claude Code to activate autonomous R&D mode.
  Type /scientist:status to check your knowledge state.
  Type /scientist:reset to start fresh.

IMPORTANT: Run Claude Code with bypass permissions for full autonomy.
`);
