---
title: "Framework Self-Analysis: Structural Gaps in scientist-cc v0.1.1"
tags: [observation, framework/gaps, status/actionable]
date: 2026-03-31
related:
  - "[[../Index]]"
---

# Framework Self-Analysis: Structural Gaps

> [!note] Key Insight
> The framework has 4 critical structural gaps that would block a user's first session from running smoothly. The biggest theme: **the loop promises more than the tooling delivers**, especially around visualization, state management, and MCP servers.

## Critical Findings

### 1. Loop Step Tracking Incomplete
- `state.json` tracks `loop_position` but loop.md only updates it for steps 5-10
- Steps 1-4 (REFLECT, RESEARCH, BUILD SKILLS, OBSERVE) don't have explicit state save instructions
- **Impact:** Resume workflow can't reliably pick up mid-loop

### 2. Tool Source Paths Undefined in Init
- `init.md` says "copy tools/pdf_reader.py" but doesn't define where from
- `bin/install.js` defines COMMANDS_SRC, CORE_SRC, SKILLS_SRC but NOT TOOLS_SRC
- **Impact:** Init workflow would fail trying to copy tools

### 3. Visualization Agent Gap
- Loop steps 4 (OBSERVE) and 8 (LEARN) mandate matplotlib/seaborn visualization
- NO agent is designated for this — Observer focuses on raw data, Researcher on papers
- No "data-visualization" skill exists in skills/
- **Impact:** Visualization instructions exist but tooling doesn't support them

### 4. Jupyter MCP Server Incomplete
- Full Jupyter MCP repo exists in mcp/jupyter/ but has NO package.json at root
- Can't be built or installed via npm
- Loop says "use Jupyter for data exploration" but server isn't functional
- **Impact:** Core capability referenced in loop is broken

## Medium Findings

### 5. Mastery Stage Never Auto-Updates
- state.json has `mastery_stage: 1` but no workflow step says "check graduation criteria and update"
- EVOLVE step mentions checking but doesn't say to write back to state.json

### 6. Agent Tool Permissions Undifferentiated
- All 3 agents have identical tool access
- Observer shouldn't be editing code; Researcher shouldn't write vault without formatting rules
- No permissions matrix exists

### 7. Resume Workflow Is Thin
- Only 7 steps, mostly "read file X"
- No handling for partial state, corrupted vault, or mid-step interruption

### 8. Template Accumulation Not Instructed
- GLOBAL-IDENTITY.md has sections that should accumulate but no workflow step says to update them

### 9. Missing Skills
- No data-visualization skill
- No Python-for-science skill
- No statistics skill (loop requires statistical analysis)

### 10. No Uninstall Path
- README shows install but not uninstall/cleanup

## Pattern: Promise vs. Delivery Gap

The framework's **workflows are ambitious and well-designed**, but the **supporting infrastructure lags behind**. The loop describes a sophisticated 10-step process but the agents, tools, skills, and state management don't fully cover what the loop requires.

> [!warning] This is a common pattern in v0.x products
> Vision outpaces infrastructure. The fix is NOT to reduce the vision — it's to systematically close the gaps, starting with the ones that block the first session.

## Questions This Raises
- Should we add a 4th agent role (Data Analyst / Visualizer)?
- Should state.json be replaced with a more robust state machine?
- Should MCP servers be optional vs. bundled?
- Is the current skills/ system sufficient or does it need a plugin architecture?
