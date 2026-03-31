# Scientist Init Workflow

This workflow runs when `/scientist` is called in a project that doesn't have `.scientist/` yet.

## Phase 1: Information Gathering (Adaptive)

### Step 1: Automatic Codebase Analysis (BEFORE asking questions)
If the directory is NOT empty:
- Map the project structure (ls, glob for key files)
- Read README.md, CLAUDE.md, package.json, pyproject.toml, or similar entry points
- Identify: language, framework, dependencies, data files, model files, test files
- Check for existing datasets (.csv, .json, .parquet, .db)
- Check for ML artifacts (models/, checkpoints/, notebooks/)
- Check git history for recent activity

### Step 2: Let the User Describe Their Vision (FIRST — before any structured questions)

**Ask ONE open-ended question first:**
"Tell me everything about what you want to build. Describe the project, your goals, what you're trying to achieve, any constraints, and what success looks like. Write as much as you want — I'll read everything and ask follow-up questions."

**Wait for a long-form response.** Do NOT show multiple-choice options yet. Let the user write freely in their own words. This is the most important input — it tells you their mental model, priorities, and language.

**Parse the response for:**
- Project description (what it is)
- Domain (infer from their description, don't force a category)
- Goal (what they want to achieve)
- Constraints (budget, timeline, data availability, tech stack)
- Focus (research vs implementation — infer from their words)

### Step 2.5: Clarifying Questions (based on what's MISSING from their description)

Only ask about things their description DIDN'T cover. Use AskUserQuestion for specific clarifications:
- If domain unclear: "What domain is this?" (trading, ML, web dev, etc.)
- If goal vague: "What does success look like specifically?"
- If focus unclear: "Should I focus on research, implementation, or both?"
- If tech stack not mentioned: "What tools/languages are involved?"

**Do NOT re-ask things they already answered in their description.**

### Step 3: Domain-Adaptive Deep Questions
Based on the domain answer, ask targeted follow-ups:

**If data/ML/trading domain:**
- What data do you have? (files, APIs, databases, size, format)
- What metrics define success? (accuracy, profit, latency, etc.)
- Any known pitfalls or failed approaches?
- What statistical confidence level is required? (e.g., p < 0.05)
- Is there a baseline to beat?

**If web/app development:**
- What's the architecture? (frontend/backend/API)
- What's the deployment target?
- Performance requirements?

**If scientific computing/research:**
- What papers or prior art exist?
- What datasets are available or need to be created?
- What reproducibility requirements exist?

### Step 4: Data Assessment
For ANY project with data analysis:
- **What data exists?** Size, format, quality, completeness
- **What data is MISSING?** Identify gaps that need datasets
- **Where to get more data?** Kaggle, HuggingFace, APIs, web scraping, synthetic generation
- **Sample size adequacy?** Is there enough data for the planned analysis?
- **Known biases?** Selection bias, survivorship bias, look-ahead bias

### Step 5: Install Domain Dependencies
Based on gathered info, auto-install needed Python packages:
```bash
# Base (always): pip install matplotlib seaborn pandas numpy
# ML projects: pip install scikit-learn scipy statsmodels
# Deep learning: pip install torch transformers
# Data acquisition: pip install kaggle datasets requests
```
Install what's needed — don't warn, install.

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
vault/.obsidian/
```

Also add these patterns to the project's root `.gitignore` if not already present:
```gitignore
.scientist/papers/
.scientist/repos/
.scientist/logs/
.scientist/scripts/
.scientist/vault/assets/*.png
.scientist/vault/.obsidian/
.playwright-mcp/
```

## Phase 3: Copy Tools

Copy from `~/.claude/scientist/tools/` (the installation directory):
- `~/.claude/scientist/tools/pdf_reader.py` → `.scientist/tools/pdf_reader.py`
- `~/.claude/scientist/tools/repo_reader.py` → `.scientist/tools/repo_reader.py`
- `~/.claude/scientist/tools/generate_index.py` → `.scientist/tools/generate_index.py`

If `~/.claude/scientist/tools/` doesn't exist (local install), try the npm package path or skip — tools can be installed later.

## Phase 3.5: Install Python Dependencies

Install required Python packages for data analysis and visualization:
```bash
pip install PyMuPDF matplotlib seaborn pandas numpy jupyter nbconvert
```
If `pip` fails, try `python -m pip install` or the specific Python path. These packages are needed for:
- **PyMuPDF** — pdf_reader.py dependency
- **matplotlib/seaborn** — visualization (mandatory in OBSERVE and LEARN steps)
- **pandas/numpy** — data analysis
- **jupyter/nbconvert** — notebook execution

**Don't skip this.** If installation fails, diagnose and fix — don't continue without visualization capability.

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

## Phase 6.5: Install Anti-Stop Hook

Create `.claude/hooks/scientist-anti-stop.js`:
```javascript
const fs = require('fs');
const path = require('path');
if (fs.existsSync(path.join(process.cwd(), '.scientist'))) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: "ANTI-STOPPING: You just stopped. The scientist loop NEVER stops. Continue immediately with the next action."
    }
  }));
}
```

Create or update `.claude/settings.json` with the Stop hook:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node \".claude/hooks/scientist-anti-stop.js\"",
        "timeout": 5
      }]
    }]
  }
}
```

This hook fires every time Claude stops responding and injects a continuation reminder. It's the structural enforcement that prevents the #1 failure mode.

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
