# Scientist

> Self-Evolving R&D Framework for Claude Code

Scientist transforms Claude into an autonomous scientist who owns your project. Claude researches deeply, forms hypotheses, tests them, documents findings in an Obsidian knowledge vault, and **upgrades its own thinking** when it catches mistakes.

## What It Does

When you type `/scientist`, Claude:
1. **Takes ownership.** Treats the project as personal — thinks independently, disagrees when right.
2. **Researches deeply.** Reads papers, browses the web, downloads PDFs, clones repos, reads FULL documentation.
3. **Observes real data.** Queries APIs, writes monitoring scripts, uses Jupyter for analysis.
4. **Forms hypotheses.** Testable predictions with mechanisms — not guesses.
5. **Validates rigorously.** Collects evidence across different conditions before acting.
6. **Implements and tests.** Experiments on branches, measures specific outcomes.
7. **Learns from results.** Studies WHY, not just WHAT. Wins and losses both teach.
8. **Evolves permanently.** Updates CLAUDE.md to prevent past mistakes forever.
9. **Never stops.** The R&D loop runs infinitely. There is no "done."

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
# Update to latest version
npm update -g scientist-cc
scientist-cc --global

# Or from GitHub directly
cd path/to/scientist-cc
git pull origin main
node bin/install.js --global
```

## Commands

| Command | What it does |
|---------|-------------|
| `/scientist` | Start or resume autonomous R&D mode |
| `/scientist:status` | Check mastery stage, active hypotheses, knowledge state |
| `/scientist:reset` | Archive vault and start fresh |

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
- **Playwright MCP** — autonomous web browsing for research
- **Jupyter MCP** — notebook execution for data analysis
- **Obsidian Skills** — proper vault formatting (from kepano/obsidian-skills)

## Philosophy

> The vault is the deliverable. Code is temporary. Knowledge is permanent.

Scientist isn't about writing code faster. It's about thinking deeper. Claude reads academic papers, observes live systems, forms hypotheses with causal mechanisms, validates rigorously, and documents everything in a structured Obsidian vault that compounds across sessions.

When Claude makes a mistake — overfitting, bruteforcing, being impulsive — it doesn't just fix the error. It updates its own operating rules (CLAUDE.md) to prevent that CLASS of error forever. Every project makes Claude smarter.

## License

MIT
