---
title: "Audit Finding: Bundled Subagents Were Invisible to the Task Tool Since v0"
tags: [observation, audit, dogfood, bug, subagents, status/implemented]
date: 2026-05-16
last_verified: 2026-05-16
related:
  - "[[Audit Finding - Playwright MCP package was 404]]"
  - "[[../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]"
---

# Audit Finding: Bundled Subagents Were Invisible to the Task Tool

> [!bug] Third audit finding in the v3.4.1–v3.4.3 wave
> The framework bundles three custom subagent definitions: `scientist-researcher`, `scientist-experimenter`, `scientist-observer`. `bin/install.js` copied them to `~/.claude/scientist/agents/` — a directory Claude Code DOES NOT scan for Task subagent types. Claude Code reads `~/.claude/agents/` (where gsd-* and other plugins correctly live). Net effect: every workflow that called for "launch 3 research agents simultaneously" silently fell back to `general-purpose`. Bundled subagent types have been dead code since v0.

## How it was caught
Continuing the Rule 10 audit (after Playwright 404 and uvx silent failure). Inspection of the session's available-agents list at conversation start: it included `claude`, `Explore`, `general-purpose`, `Plan`, and the `gsd-*` family — but NOT `scientist-researcher`, `scientist-experimenter`, or `scientist-observer`. Cross-checked by listing both `~/.claude/agents/` (where gsd-* are) and `~/.claude/scientist/agents/` (where scientist-* are). Confirmation: the directory mismatch is the root cause.

## The fix (v3.4.3)
`bin/install.js` now copies bundled agents to BOTH:
1. `~/.claude/scientist/agents/` (kept for reference / uninstall tracking — same as before)
2. `~/.claude/agents/` (NEW — the actual discovery location)

Uninstall logic also updated to clean up `~/.claude/agents/scientist-*.md` when removing.

## How long the bug was live
First registration of bundled agents traces to v0 (March 31, 2026). **~46 days of silent failure**, identical timeline to the Playwright 404. The agents were:
- Documented in README ("Bundled Tools" section)
- Visible in npm package listing
- Copied during install with a `✓ Agent definitions` success message
- Referenced in workflow templates ("launch parallel research agents")
- And never reachable from Task because the copy location was wrong.

## Why no test caught it
- Install success was reported on file copy completion, not on Claude Code agent discovery.
- Smoke tests of the framework didn't include a Task tool invocation with a scientist-* type.
- When workflows fell back to general-purpose, results LOOKED similar to what scientist-researcher would produce — masking the failure.
- Dogfooded research in this very session used Task with default agent types and got useful results, further masking the issue.

## Pattern across the three audit findings
- **v3.4.1**: Playwright MCP — wrong npm package name (404). Install reports ✓, server never starts.
- **v3.4.2**: Jupyter MCP — uvx binary required, install doesn't probe for it. Install reports ✓, server fails at runtime.
- **v3.4.3**: Bundled agents — wrong installation directory. Install reports ✓, agents never discoverable.

All three are **install-time silent failures with reassuring ✓ messages.** The deeper Rule 10 lesson: **a ✓ in the install output proves nothing about runtime reality.** Tests must probe the actual runtime path, not just file mechanics.

## Self-evolution Rule 14 candidate
"Every framework dependency claim in install output must be backed by a runtime probe, not just a file-mechanics check." Pending consolidation across multiple iterations.

## Cross-Links
- [[supports::Audit Finding - Playwright MCP package was 404]] — same class of bug
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]
- [[extends::../Knowledge Base/Principle - Resume Beats Continuation]] — same lesson at a different layer: claims about platform behavior need empirical verification, not aspirational docs reading
