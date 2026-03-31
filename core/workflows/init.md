# Autopilot Init Workflow

This workflow runs when `/autopilot` is called in a project that doesn't have `.autopilot/` yet.

## Phase 1: Information Gathering

Ask the user these questions using AskUserQuestion. Don't proceed until you understand the project deeply.

1. **What is this project?** What does it do, what's the goal, who is it for?
2. **What domain is this?** (e.g., trading, ML, web dev, scientific computing, game dev)
3. **What's the current state?** Is this a new project or existing codebase?
4. **What's the ultimate goal?** What does "done" look like? (Note: for R&D projects, "done" may be "mastery of the domain")
5. **What tools/languages are involved?** What's the tech stack?
6. **What does the user want ME to focus on?** Research? Implementation? Both?

If the directory is NOT empty, also:
- Map the project structure (ls, glob for key files)
- Read README.md, CLAUDE.md, package.json, or similar entry points
- Understand what already exists before creating anything

## Phase 2: Create Project Structure

```bash
mkdir -p .autopilot/{vault/{Research,Observations,Hypotheses,Experiments,"Knowledge Base"/Tools,"Knowledge Base"/Skills},tools,papers,repos,scripts,logs}
```

## Phase 3: Copy Tools

Copy from the autopilot installation directory:
- `tools/pdf_reader.py` → `.autopilot/tools/pdf_reader.py`
- `tools/repo_reader.py` → `.autopilot/tools/repo_reader.py`

## Phase 4: Create Vault Index

Create `.autopilot/vault/Index.md`:

```markdown
---
title: Knowledge Vault Index
tags: [index, vault]
---

# Knowledge Vault

## Structure
- [[Research/]] — Concepts from papers, docs, and external sources
- [[Observations/]] — Raw patterns from project data and live systems
- [[Hypotheses/]] — Testable predictions (status: untested/confirmed/falsified)
- [[Experiments/]] — What I tried, what happened, what I learned
- [[Knowledge Base/]] — Accumulated understanding
  - [[Knowledge Base/Tools/]] — Tool documentation
  - [[Knowledge Base/Skills/]] — Skills I've built

## Current Focus
*(Updated by autopilot each session)*

## Open Questions
*(Things I don't understand yet)*
```

## Phase 5: Write Project Identity

Create `IDENTITY.md` in project root. This is WHO Claude is for THIS project. It starts basic and evolves.

Template from `core/templates/PROJECT-IDENTITY.md` — fill in with gathered info:
- Project name and domain
- Current mastery stage: Stage 1 (Beginner)
- What I know so far: (nothing yet)
- What I don't know: (everything — list specific questions)
- My approach: (based on gathered info)
- Rules I've learned: (none yet — will accumulate)

## Phase 6: Update CLAUDE.md

If CLAUDE.md exists in project root:
- Append the autopilot section from `core/templates/CLAUDE-autopilot.md`
- Don't overwrite existing content

If CLAUDE.md doesn't exist:
- Create it with the autopilot template

The CLAUDE.md section must include:
- "Read IDENTITY.md at session start"
- "Never stop working — infinite loop"
- "Self-evolve — update this file when catching thinking errors"
- "The Obsidian vault is the deliverable"
- Reference to `.autopilot/vault/` as knowledge base

## Phase 7: Initialize Git

Check if `.git/` exists:
- **If yes:** Create branch `autopilot/research` from current HEAD. Don't touch main.
- **If no:** `git init`, add all files, initial commit "autopilot: init project", create `autopilot/research` branch.

## Phase 8: Create State File

Create `.autopilot/state.json`:
```json
{
  "initialized": "ISO timestamp",
  "mastery_stage": 1,
  "loop_position": "reflect",
  "total_sessions": 1,
  "hypotheses_tested": 0,
  "hypotheses_confirmed": 0,
  "hypotheses_falsified": 0,
  "skills_built": [],
  "tools_documented": [],
  "papers_read": [],
  "last_session": "ISO timestamp"
}
```

## Phase 9: Enter The Loop

DO NOT STOP. Immediately proceed to the infinite loop workflow (`core/workflows/loop.md`).
The init is just setup — the real work starts NOW.
