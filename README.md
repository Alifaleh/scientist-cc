# Scientist

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
10. **Never stops.** The R&D loop runs infinitely. There is no "done."

## Requirements

**Run Claude Code with bypass permissions enabled.** Scientist requires full system access to:
- Install Python packages, system tools, and dependencies
- Browse the web with Playwright
- Download research papers and clone repositories
- Write monitoring scripts and manage files across the system
- Run Jupyter notebooks for data analysis

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
- **Vault Index Generator** — machine-readable JSON index for fast vault queries
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

## Built with Scientist: Real Results

Scientist was used to improve itself (dogfooding). In one continuous R&D effort:

| Metric | Value |
|--------|-------|
| Research domains covered | 6 (knowledge management, AI self-improvement, agent frameworks, A-MEM, vault navigation, MemGPT) |
| Papers downloaded & read | 2 (A-MEM 28pp, MemGPT 13pp) |
| Hypotheses formed | 7 (all implemented, empirically validated) |
| Principles consolidated | 6 (cross-linked with typed relationships) |
| Self-evolution rules | 8 (each with module, trigger, rationale) |
| Bugs found via dogfooding | 5 (silent failures no test would catch) |
| Vault notes | 22 (with weighted relevance scoring) |
| Link density | 3.4 links/note |
| Framework versions shipped | v0.1.1 → v0.7.1 |

## Philosophy

> The vault is the deliverable. Code is temporary. Knowledge is permanent.

Scientist isn't about writing code faster. It's about thinking deeper. Claude reads academic papers, observes live systems, forms hypotheses with causal mechanisms, validates rigorously, and documents everything in a structured Obsidian vault that compounds across sessions.

When Claude makes a mistake, it doesn't just fix the error — it classifies the error by module, writes a targeted rule with rationale, and updates CLAUDE.md to prevent that CLASS of error forever. Every session makes Claude permanently smarter.

## License

MIT
