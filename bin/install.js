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
    console.log('  ✓ Obsidian skills (markdown, bases, canvas, defuddle)');
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

  // Playwright MCP — uses public npm package, no local files needed
  settings.mcpServers['scientist-playwright'] = {
    command: 'npx',
    args: ['-y', '@anthropic-ai/mcp-server-playwright'],
    description: 'Scientist: Browser control for web research'
  };
  console.log('  ✓ MCP: Playwright (browser control)');

  // Jupyter MCP — uses public uvx package, no local files needed
  settings.mcpServers['scientist-jupyter'] = {
    command: 'uvx',
    args: ['jupyter-mcp-server', 'start'],
    description: 'Scientist: Jupyter notebook execution'
  };
  console.log('  ✓ MCP: Jupyter (notebook execution)');

  // Anti-stop hook — fires when Claude stops, injects continuation reminder
  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks.Stop) settings.hooks.Stop = [];

  // Check if scientist anti-stop hook already exists
  const hasAntiStop = settings.hooks.Stop.some(h =>
    h.hooks && h.hooks.some(hk => hk.command && hk.command.includes('scientist-anti-stop'))
  );
  if (!hasAntiStop) {
    settings.hooks.Stop.push({
      hooks: [{
        type: 'command',
        command: `node "${path.join(configDir, 'hooks', 'scientist-anti-stop.js')}"`,
        timeout: 5
      }]
    });
    console.log('  ✓ Anti-stop hook registered');
  } else {
    console.log('  ○ Anti-stop hook already registered');
  }

  // Think-harder hook (UserPromptSubmit) — injects "ultrathink" on every turn
  if (!settings.hooks.UserPromptSubmit) settings.hooks.UserPromptSubmit = [];
  const hasThinkHarder = settings.hooks.UserPromptSubmit.some(h =>
    h.hooks && h.hooks.some(hk => hk.command && hk.command.includes('scientist-think-harder'))
  );
  if (!hasThinkHarder) {
    settings.hooks.UserPromptSubmit.push({
      hooks: [{
        type: 'command',
        command: `node "${path.join(configDir, 'hooks', 'scientist-think-harder.js')}"`,
        timeout: 5
      }]
    });
    console.log('  ✓ Think-harder hook registered (31,999 thinking tokens per turn)');
  } else {
    console.log('  ○ Think-harder hook already registered');
  }

  // PreCompact hook — preserves scientist context during compaction
  if (!settings.hooks.PreCompact) settings.hooks.PreCompact = [];
  const hasPreCompact = settings.hooks.PreCompact.some(h =>
    h.hooks && h.hooks.some(hk => hk.command && hk.command.includes('scientist-pre-compact'))
  );
  if (!hasPreCompact) {
    settings.hooks.PreCompact.push({
      hooks: [{
        type: 'command',
        command: `node "${path.join(configDir, 'hooks', 'scientist-pre-compact.js')}"`,
        timeout: 5
      }]
    });
    console.log('  ✓ Pre-compact hook registered (context preservation)');
  } else {
    console.log('  ○ Pre-compact hook already registered');
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

  // Install anti-stop hook globally
  const hooksDir = path.join(configDir, 'hooks');
  ensureDir(hooksDir);
  const hookSrc = path.join(PACKAGE_ROOT, '.claude', 'hooks', 'scientist-anti-stop.js');
  if (fs.existsSync(hookSrc)) {
    fs.copyFileSync(hookSrc, path.join(hooksDir, 'scientist-anti-stop.js'));
    console.log('  ✓ Anti-stop hook installed');
  }
  const thinkSrc = path.join(PACKAGE_ROOT, '.claude', 'hooks', 'scientist-think-harder.js');
  if (fs.existsSync(thinkSrc)) {
    fs.copyFileSync(thinkSrc, path.join(hooksDir, 'scientist-think-harder.js'));
    console.log('  ✓ Think-harder hook installed');
  }
  const compactSrc = path.join(PACKAGE_ROOT, '.claude', 'hooks', 'scientist-pre-compact.js');
  if (fs.existsSync(compactSrc)) {
    fs.copyFileSync(compactSrc, path.join(hooksDir, 'scientist-pre-compact.js'));
    console.log('  ✓ Pre-compact hook installed');
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
      // Remove hooks
      if (settings.hooks) {
        if (settings.hooks.Stop) {
          settings.hooks.Stop = settings.hooks.Stop.filter(h =>
            !h.hooks?.some(hk => hk.command?.includes('scientist-'))
          );
          if (!settings.hooks.Stop.length) delete settings.hooks.Stop;
        }
        if (settings.hooks.UserPromptSubmit) {
          settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit.filter(h =>
            !h.hooks?.some(hk => hk.command?.includes('scientist-'))
          );
          if (!settings.hooks.UserPromptSubmit.length) delete settings.hooks.UserPromptSubmit;
        }
        if (settings.hooks.PreCompact) {
          settings.hooks.PreCompact = settings.hooks.PreCompact.filter(h =>
            !h.hooks?.some(hk => hk.command?.includes('scientist-'))
          );
          if (!settings.hooks.PreCompact.length) delete settings.hooks.PreCompact;
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
