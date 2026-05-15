# Scientist

[![npm version](https://img.shields.io/npm/v/scientist-cc.svg)](https://www.npmjs.com/package/scientist-cc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Self-Evolving R&D Framework for Claude Code

Scientist transforms Claude into an autonomous scientist who owns your project. Claude researches deeply, forms hypotheses, tests them, documents findings in an Obsidian knowledge vault, and **upgrades its own thinking** when it catches mistakes.

## What It Does

When you type `/scientist`, Claude:
1. **Takes ownership.** Treats the project as personal — thinks independently, disagrees when right.
2. **Researches deeply.** Reads papers, browses the web, downloads PDFs, clones repos, reads FULL documentation.
3. **Observes real data.** Queries APIs, writes monitoring scripts, uses Jupyter for analysis and visualization.
4. **Forms hypotheses.** Testable predictions with mechanisms — not guesses.
5. **Validates with adversarial challenge.** Red-teams every hypothesis before accepting. Seeks disconfirming evidence.
6. **Implements and tests.** Experiments on branches, measures specific outcomes.
7. **Learns from results.** Studies WHY, not just WHAT. Wins and losses both teach.
8. **Consolidates knowledge.** Extracts generalizable principles across experiments. Episodic → semantic.
9. **Evolves permanently.** Classifies errors by module (Memory/Reasoning/Planning/Action), writes targeted rules to CLAUDE.md.
10. **Never stops (or resumes from nothing).** The R&D loop runs infinitely in CLI Claude Code via active stop-blocking hooks. In Agent SDK runtimes where the runtime doesn't honor block signals, every turn-end is a cheap checkpoint with `.scientist/.last-activity.json` updated continuously — any user input restarts with zero context loss.

## Requirements

**Run Claude Code with bypass permissions enabled.** Scientist requires full system access to:
- Install Python packages, system tools, and dependencies
- Browse the web with Playwright
- Download research papers and clone repositories
- Write monitoring scripts and manage files across the system
- Run Jupyter notebooks for data analysis

**Optional prerequisites for full MCP capability:**
- **`uv` / `uvx`** — required for the Jupyter MCP server. Install via `pipx install uv`, `brew install uv` (macOS), or see [astral.sh/uv](https://astral.sh/uv). The scientist installer detects uvx and warns if missing; without it the Jupyter MCP registers but silently fails at runtime.
- **Node.js 18+** — needed for the installer itself and the Playwright MCP (`@playwright/mcp` is launched via `npx`).

## Installation

```bash
# Global (all projects)
npm install -g scientist-cc
scientist-cc --global

# Local (this project only)
npm install scientist-cc
npx scientist-cc --local
```

## Update

```bash
# Update to latest version (use install @latest, not update — avoids npm cache issues)
npm cache clean --force
npm install -g scientist-cc@latest
scientist-cc --global

# Or from GitHub directly
cd path/to/scientist-cc
git pull origin main
node bin/install.js --global
```

## Uninstall

```bash
scientist-cc --uninstall
# Or for local:
npx scientist-cc --uninstall
```

This removes commands from `~/.claude/commands/`, deletes the scientist core from `~/.claude/scientist/`, and removes MCP server entries from settings.json. Your project's `.scientist/` vault is preserved.

## Commands

| Command | What it does |
|---------|-------------|
| `/scientist` | Start or resume autonomous R&D mode |
| `/scientist:status` | Check mastery stage, active hypotheses, knowledge state |
| `/scientist:stop` | Gracefully pause the loop — saves state, writes handoff note |
| `/scientist:continue` | Resume after a graceful stop |
| `/scientist:reset` | Archive vault and start fresh |

## First Run

1. Open any project in Claude Code with bypass permissions enabled
2. Type `/scientist`
3. Claude asks about your project (domain, goal, tech stack)
4. Creates `.scientist/` vault structure, `IDENTITY.md`, updates `CLAUDE.md`
5. Enters the infinite R&D loop immediately — research → hypothesize → validate → implement → learn → consolidate → evolve → repeat
6. Claude will browse the web, download papers, write monitoring scripts, and build a knowledge vault without stopping

**Claude will not ask for permission.** It acts autonomously — researching, committing, deploying. Interrupt it if you need to redirect.

## What Gets Created

In your project:
```
.scientist/
├── vault/           # Obsidian knowledge vault (THE deliverable)
├── tools/           # PDF reader, repo reader
├── papers/          # Downloaded research PDFs
├── repos/           # Cloned reference repositories
├── scripts/         # Monitoring/observation scripts
├── logs/            # Output from monitoring scripts
└── state.json       # Session state and progress
```

Plus `IDENTITY.md` (project-specific evolving identity) and updates to `CLAUDE.md`.

## Evolution Stages

Claude evolves through mastery stages:

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Beginner | Reading papers, making mistakes, forming naive hypotheses |
| 2 | Practitioner | Tested hypotheses, knows what works, sees patterns from papers |
| 3 | Expert | Predicts outcomes, identifies literature gaps, vault teaches others |
| 4 | Novel Thinker | Discovers NEW patterns, creates original knowledge, surpasses papers |

## Bundled Tools

- **PDF Reader** — reads papers in 3-page chunks for systematic study
- **Repo Reader** — clones and maps documentation structure
- **Vault Index Generator** — machine-readable JSON index with weighted relevance scoring
- **7 Claude Code Hooks** (covering the full agent lifecycle):
  - **Anti-Stop Hook** (Stop event) — emits `decision:"block"` + exit code 2 with circuit breakers (3-strike unproductive-stop counter, `.scientist/.stop-requested` graceful exit). Honored by CLI Claude Code; the Agent SDK runtime is platform-conditional — see [Resume Beats Continuation](.scientist/vault/Knowledge%20Base/Principle%20-%20Resume%20Beats%20Continuation.md).
  - **Stop-Failure Hook** (StopFailure) — logs API errors (rate_limit, server_error, etc.) to `state.json` for resilience analysis
  - **Think-Harder Hook** (UserPromptSubmit) — injects "ultrathink" trigger every turn for 31,999 thinking tokens
  - **Session-Start Hook** (SessionStart) — bootstraps scientist identity on startup/resume/clear/compact and surfaces the auto-handoff snapshot
  - **Pre-Compact Hook** (PreCompact) — tells the summarizer what scientist state to preserve through compaction
  - **Post-Compact Hook** (PostCompact) — re-bootstraps identity from files after compaction completes
  - **Auto-Handoff Hook** (PostToolBatch) — writes `.scientist/.last-activity.json` on every tool batch, so resume always has fresh state without an explicit `/scientist:stop`
- **Playwright MCP** — autonomous web browsing for research
- **Jupyter MCP** — notebook execution for data analysis
- **Obsidian Skills** — proper vault formatting (from kepano/obsidian-skills)

## What Makes This Different

Most AI agent frameworks lose everything between sessions. Scientist solves this with:

- **Persistent knowledge vault** — Obsidian markdown with wikilinks, frontmatter, and typed relationships (`[[supports::]]`, `[[contradicts::]]`, `[[extends::]]`)
- **Two-phase linking** (A-MEM inspired) — cheap tag filter + LLM reasoning discovers connections you'd miss manually
- **Backward evolution** — new findings automatically update old notes' metadata, so accumulated knowledge gets smarter over time
- **4-module error taxonomy** — classifies mistakes by origin (Memory/Reasoning/Planning/Action) for 24% more effective self-correction
- **Adversarial validation** — every hypothesis gets red-teamed before implementation
- **Consolidation triggers** — episodic→semantic knowledge transformation runs automatically based on note count and session thresholds

Built on research from A-MEM (NeurIPS 2025), AutoDream, CrewAI, SWE-agent, MetaGPT, and 10+ other frameworks.

### Runtime Optimization (from Claude Code source analysis)

We reverse-engineered Claude Code's source to optimize at the deepest level:

- **31,999 thinking tokens per turn** — UserPromptSubmit hook injects "ultrathink" trigger word detected by `getMaxThinkingTokens()` in the runtime
- **Default behavior overrides** — Claude Code's system prompt says "4 lines max" and "minimize tokens." We explicitly override these for research mode.
- **Anti-stop mechanism** — `toolUseMessages.length === 0` exits the agent loop (per `query.ts`). The Stop hook returns `decision:"block"` + exit code 2 to actively prevent stopping in supported runtimes (CLI Claude Code). **In the Agent SDK runtime this is platform-conditional** — empirical testing showed the block signal is ignored, so the framework ALSO ships seamless-resume infrastructure (`PostToolBatch` auto-handoff + `SessionStart` snapshot reader). Two layers: prevent the stop when the runtime supports it, make resume instant otherwise.
- **Context preservation** — PreCompact hook ensures scientist state survives compaction
- **Parallel exploitation** — `MAX_TOOL_USE_CONCURRENCY=10` from source, used for parallel research agents

## Built with Scientist: Real Results

Scientist was used to improve itself (dogfooding). In one continuous R&D effort:

| Metric | Value |
|--------|-------|
| Commits | 257+ (continuous, autonomous) |
| Research domains | 8+ (knowledge management, AI self-improvement, agent frameworks, A-MEM, vault navigation, MemGPT, context engineering, Claude Code source) |
| Papers downloaded & read | 3 (A-MEM 28pp, MemGPT 13pp, Reflexion) |
| Source code discoveries | 14 (Claude Code runtime reverse-engineering) |
| Hypotheses formed | 7+ (all implemented) |
| Principles consolidated | 22 (cross-linked with typed relationships) |
| Self-evolution rules | 9 (each with module, trigger, rationale) |
| Bugs found via dogfooding | 6+ (silent failures no test would catch) |
| Vault notes | 90+ (with weighted relevance scoring) |
| Link density | 4.8+ links/note |
| Typed links | 170+ (supports/contradicts/extends) |
| Framework versions shipped | v0.1.1 → v1.9.1 |
| Lifecycle hooks | 3 (Stop, UserPromptSubmit, PreCompact) |

## Philosophy

> The vault is the deliverable. Code is temporary. Knowledge is permanent.

Scientist isn't about writing code faster. It's about thinking deeper. Claude reads academic papers, observes live systems, forms hypotheses with causal mechanisms, validates rigorously, and documents everything in a structured Obsidian vault that compounds across sessions.

When Claude makes a mistake, it doesn't just fix the error — it classifies the error by module, writes a targeted rule with rationale, and updates CLAUDE.md to prevent that CLASS of error forever. Every iteration makes Claude permanently smarter.

## Research

The framework is built on research from:
- [A-MEM: Agentic Memory (NeurIPS 2025)](https://arxiv.org/abs/2502.12110) — two-phase linking, memory evolution
- [MemGPT: LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — tiered memory architecture
- [AgentDebug (2025)](https://arxiv.org/abs/2504.16125) — targeted correction is 24% more effective
- AutoDream/claude-dream — consolidation triggers
- CrewAI, LangGraph, SWE-agent, MetaGPT, BabyAGI — framework landscape analysis

Full research docs: [`docs/`](docs/)

## License

MIT
