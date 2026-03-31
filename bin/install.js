#!/usr/bin/env node
/**
 * Autopilot installer for Claude Code.
 *
 * Registers /autopilot commands and bundled MCP servers.
 *
 * Usage:
 *   autopilot-cc --global    # Install to ~/.claude/commands/ (all projects)
 *   autopilot-cc --local     # Install to .claude/commands/ (this project)
 *   autopilot-cc --uninstall # Remove commands
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const COMMANDS_SRC = path.join(PACKAGE_ROOT, 'commands', 'autopilot');
const AGENTS_SRC = path.join(PACKAGE_ROOT, 'agents');
const SKILLS_SRC = path.join(PACKAGE_ROOT, 'skills');
const CORE_SRC = path.join(PACKAGE_ROOT, 'core');
const MCP_SRC = path.join(PACKAGE_ROOT, 'mcp');

const MARKER = '# Autopilot Configuration — managed by autopilot-cc installer';

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
    console.log(`  ✓ Command: /${cmd.replace('.md', '').replace('autopilot-', 'autopilot:')}`);
  }

  return commands.length;
}

function installCore(configDir) {
  const autopilotDir = path.join(configDir, 'autopilot');

  // Copy core (workflows, templates, references)
  copyDir(CORE_SRC, path.join(autopilotDir, 'core'));
  console.log('  ✓ Core workflows, templates, and references');

  // Copy skills
  copyDir(SKILLS_SRC, path.join(autopilotDir, 'skills'));
  console.log('  ✓ Obsidian skills (markdown, bases, canvas, defuddle)');

  // Copy agents
  if (fs.existsSync(AGENTS_SRC)) {
    copyDir(AGENTS_SRC, path.join(autopilotDir, 'agents'));
    console.log('  ✓ Agent definitions');
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

  // Playwright MCP
  const playwrightPath = path.join(MCP_SRC, 'playwright');
  if (fs.existsSync(playwrightPath)) {
    settings.mcpServers['autopilot-playwright'] = {
      command: 'npx',
      args: ['-y', '@anthropic-ai/mcp-server-playwright'],
      description: 'Autopilot: Browser control for web research'
    };
    console.log('  ✓ MCP: Playwright (browser control)');
  }

  // Jupyter MCP
  const jupyterPath = path.join(MCP_SRC, 'jupyter');
  if (fs.existsSync(jupyterPath)) {
    settings.mcpServers['autopilot-jupyter'] = {
      command: 'uvx',
      args: ['jupyter-mcp-server'],
      description: 'Autopilot: Jupyter notebook execution'
    };
    console.log('  ✓ MCP: Jupyter (notebook execution)');
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function installGlobalIdentity() {
  const globalDir = path.join(os.homedir(), '.autopilot');
  ensureDir(globalDir);

  const identityPath = path.join(globalDir, 'GLOBAL-IDENTITY.md');
  if (!fs.existsSync(identityPath)) {
    const template = path.join(CORE_SRC, 'templates', 'GLOBAL-IDENTITY.md');
    if (fs.existsSync(template)) {
      fs.copyFileSync(template, identityPath);
      console.log('  ✓ Global identity created at ~/.autopilot/GLOBAL-IDENTITY.md');
    }
  } else {
    console.log('  ○ Global identity already exists (preserved)');
  }
}

function uninstall(configDir) {
  const commandsDir = path.join(configDir, 'commands');
  const autopilotDir = path.join(configDir, 'autopilot');

  // Remove command files
  if (fs.existsSync(commandsDir)) {
    const files = fs.readdirSync(commandsDir).filter(f => f.startsWith('autopilot'));
    for (const f of files) {
      fs.unlinkSync(path.join(commandsDir, f));
      console.log(`  ✗ Removed ${f}`);
    }
  }

  // Remove core
  if (fs.existsSync(autopilotDir)) {
    fs.rmSync(autopilotDir, { recursive: true });
    console.log('  ✗ Removed autopilot core');
  }

  // Remove MCP entries from settings
  const settingsPath = path.join(configDir, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      if (settings.mcpServers) {
        delete settings.mcpServers['autopilot-playwright'];
        delete settings.mcpServers['autopilot-jupyter'];
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        console.log('  ✗ Removed MCP server entries');
      }
    } catch (e) {}
  }

  console.log('\nAutopilot uninstalled.');
}

// --- Main ---

const args = process.argv.slice(2);
const isGlobal = args.includes('--global') || args.includes('-g');
const isLocal = args.includes('--local') || args.includes('-l');
const isUninstall = args.includes('--uninstall') || args.includes('-u');
const isAll = args.includes('--all');

if (!isGlobal && !isLocal && !isUninstall) {
  console.log(`
Autopilot — Self-Evolving R&D Framework for Claude Code

Usage:
  autopilot-cc --global     Install globally (~/.claude/)
  autopilot-cc --local      Install locally (.claude/)
  autopilot-cc --uninstall  Remove autopilot

Run with bypass permissions enabled. Autopilot requires full system access
to install tools, browse the web, manage files, and operate autonomously.
`);
  process.exit(0);
}

const configDir = getClaudeConfigDir(isGlobal);

if (isUninstall) {
  console.log(`\nUninstalling autopilot from ${configDir}...\n`);
  uninstall(configDir);
  process.exit(0);
}

console.log(`\nInstalling autopilot to ${configDir}...\n`);

const cmdCount = installCommands(configDir);
installCore(configDir);
installMCP(configDir);
installGlobalIdentity();

console.log(`
✓ Autopilot installed successfully!

  ${cmdCount} commands registered
  Core workflows and references copied
  MCP servers configured
  Global identity initialized

Usage:
  Type /autopilot in Claude Code to activate autonomous R&D mode.
  Type /autopilot:status to check your knowledge state.
  Type /autopilot:reset to start fresh.

IMPORTANT: Run Claude Code with bypass permissions for full autonomy.
`);
