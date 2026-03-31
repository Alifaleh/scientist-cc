# Scientist Init Workflow

This workflow runs when `/scientist` is called in a project that doesn't have `.scientist/` yet.

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
mkdir -p .scientist/{vault/{Research,Observations,Hypotheses,Experiments,"Knowledge Base"/Tools,"Knowledge Base"/Skills},tools,papers,repos,scripts,logs}
```

## Phase 2.5: Create .gitignore for Scientist Artifacts

Create `.scientist/.gitignore` to prevent binary artifacts from bloating git:

```gitignore
# Track vault notes (the deliverable), ignore artifacts
papers/
repos/
logs/
scripts/
vault/assets/*.png
vault/assets/*.jpg
vault/assets/*.svg
```

Also add these patterns to the project's root `.gitignore` if not already present.

## Phase 3: Copy Tools

Copy from `~/.claude/scientist/tools/` (the installation directory):
- `~/.claude/scientist/tools/pdf_reader.py` → `.scientist/tools/pdf_reader.py`
- `~/.claude/scientist/tools/repo_reader.py` → `.scientist/tools/repo_reader.py`

If `~/.claude/scientist/tools/` doesn't exist (local install), try the npm package path or skip — tools can be installed later.

## Phase 4: Create Vault Index

Create `.scientist/vault/Index.md`:

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
*(Updated by scientist each session)*

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

## Phase 6: Create/Update CLAUDE.md (CRITICAL)

**CLAUDE.md is the MOST IMPORTANT file in the entire framework.** It's the ONLY file guaranteed to be loaded into Claude's context at every session start. If this file is missing, weak, or incomplete, Claude will forget who it is and what it's doing. Treat CLAUDE.md creation as critical infrastructure.

**If CLAUDE.md exists in project root:**
1. Read the existing content — preserve everything the user has written
2. Check if the scientist section already exists (look for "Scientist Mode Active")
3. If scientist section missing: **PREPEND** the scientist template to the TOP of the file (not append — it must be the first thing Claude reads)
4. If scientist section exists but is outdated: replace it with the latest template
5. The existing user content goes AFTER the scientist section

**If CLAUDE.md doesn't exist:**
1. Create it with a project header: `# {project-name} — CLAUDE.md`
2. Write the FULL scientist template from `core/templates/CLAUDE-scientist.md`
3. Add a `## Project Context` section below with: repo URL, tech stack, description

**The CLAUDE.md scientist section MUST include (non-negotiable):**
- Session startup protocol (read IDENTITY.md, vault Index, state.json)
- The complete infinite loop overview (all 11 steps including CONSOLIDATE)
- Core identity rules (never stop, never ask, never stop on errors)
- Self-evolution rules section (accumulates over sessions)
- Adversarial validation mandate
- Module-based error classification reference

**Verify after creation:** Read back the CLAUDE.md and confirm ALL of these sections exist:
- [ ] "Scientist Mode Active" header
- [ ] "Session Startup (MANDATORY)" with the 3 files to read
- [ ] "Core Identity" with the 5 identity rules
- [ ] "The Infinite Loop" with all 11 steps listed
- [ ] "Key Rules" section
- [ ] "Self-Evolution Rules" section at the bottom

If ANY section is missing or truncated, rewrite it. CLAUDE.md is the single most important file — a broken CLAUDE.md means Claude forgets who it is.

## Phase 7: Initialize Git

Check if `.git/` exists:
- **If yes:** Create branch `scientist/research` from current HEAD. Don't touch main.
- **If no:** `git init`, add all files, initial commit "scientist: init project", create `scientist/research` branch.

## Phase 8: Create State File

Create `.scientist/state.json`:
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
  "last_session": "ISO timestamp",
  "last_consolidation": "ISO timestamp"
}
```

## Phase 8.5: Generate Vault Index

Run the vault index generator to create the machine-readable index:
```bash
python .scientist/tools/generate_index.py
```
This creates `.scientist/vault/vault-index.json` — enabling fast structured queries during REFLECT.

## Phase 9: Enter The Loop

DO NOT STOP. Immediately proceed to the infinite loop workflow (`core/workflows/loop.md`).
The init is just setup — the real work starts NOW.
