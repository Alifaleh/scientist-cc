---
title: "Handoff: v3.4.1–v3.4.4 — Four Silent Install Failures Found and Fixed"
tags: [observation, handoff, audit, dogfood, status/implemented]
date: 2026-05-16
last_verified: 2026-05-16
related:
  - "[[Audit Finding - Playwright MCP package was 404]]"
  - "[[Audit Finding - Bundled Agents Were Invisible to Task Tool]]"
  - "[[Handoff - v3.4.0 Seamless Resume Pivot]]"
---

# Handoff: v3.4.1–v3.4.4 Audit Wave

> [!success] Four product bugs caught in one audit pass
> Rule 10 ("re-verify hook capabilities at every version bump") was widened to "re-verify all external dep claims at every version bump." Result: four silent install failures discovered and fixed in a single iteration, plus Rule 14 added to crystallize the audit pattern going forward.

## The four fixes

| Version | Bug | Mechanism | Lifetime |
|---|---|---|---|
| v3.4.1 | Playwright MCP registered `@anthropic-ai/mcp-server-playwright` | npm 404 — package doesn't exist | ~46 days |
| v3.4.2 | Jupyter MCP needs `uvx`, install never probed for it | binary missing → silent runtime failure | ~46 days |
| v3.4.3 | Bundled agents copied to `~/.claude/scientist/agents/` (Claude Code doesn't scan) | wrong discovery directory | ~46 days |
| v3.4.4 | Bundled skills copied to `~/.claude/scientist/skills/` (same bug) | wrong discovery directory | ~46 days |

All four printed reassuring `✓` messages during install. All four were dead at runtime.

## Empirical proof v3.4.4 works
Mid-session the harness reloaded available skills. Before v3.4.4: `data-science-checklist`, `feature-engineering`, `statistical-testing`, `json-canvas`, `obsidian-bases`, `obsidian-markdown`, `defuddle` were invisible. After v3.4.4 install: all seven appeared in the available-skills list. Same pattern verified for agents (v3.4.3) by listing `~/.claude/agents/` pre- and post-install.

## How they were found
After confirming all 7 hypotheses and shipping v3.4.0, the queued next priority was "Audit framework for stale Claude Code assumptions per Rule 10." Concrete probes:
- `npm view @anthropic-ai/mcp-server-playwright` → 404 → v3.4.1 fix
- `uvx --version` (cross-checked against README) → undocumented prereq → v3.4.2 fix
- `ls ~/.claude/agents/ | grep scientist` → empty → v3.4.3 fix
- `ls ~/.claude/skills/ | grep -E "data-science|feature-engineering|statistical-testing"` → empty → v3.4.4 fix

Each probe was 30 seconds of work. Each finding shipped within 10 minutes of detection. **Five total npm publishes today (v3.4.0 + v3.4.1–v3.4.4), all confirmed live.**

## Rule 14 ships
The cross-cutting lesson is now framework-canonical:

> A `✓` in install output proves NOTHING about runtime reality. Probe every external dependency claim with a runtime test, not a file-mechanics check.

install.js's uvx probe (added in v3.4.2) is the template for all future install-time verification.

## Session totals
| Metric | Start | End |
|---|---|---|
| Mastery stage | 3 (Expert) | **4 (Novel Thinker)** |
| Confirmed hypotheses | 1 | 7 (all of H1–H7) |
| Evolved notes | 0 | 13 |
| Typed links | 215 | 246 |
| Principles | 25 | 26 (added "Resume Beats Continuation") |
| Novel findings | 6 | 9 (Stop hook decision-block, Stop hook SDK runtime gap, audit-pattern finding) |
| Self-evolution rules | 9 | 14 (added 10, 11, 12, 13, 14) |
| npm versions deployed | 23 | **32** (v3.2.0 → v3.4.4) |
| Vault notes | 90 | 99 |

## Remaining priorities (next iteration)
1. Continue Rule 14 audit: are there OTHER `✓` claims in install.js or workflows that haven't been probed? (skills directory verification was the obvious one; less-obvious ones may exist)
2. Test on a non-scientist-cc project (long-standing, never done — would surface bugs that dogfood-on-self can't see)
3. Backward-evolve remaining ~85 vault notes that haven't been touched in 6 weeks
4. Consider: does Anthropic's official memory tool (`context-management-2025-06-27` beta) offer something we should integrate?
5. The Luca / context-agent.org email reply (drafted at session start, never sent)

## Cross-Links
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]] — four reified examples in this single arc
- [[extends::Handoff - v3.4.0 Seamless Resume Pivot]] — v3.4.0 was the architectural pivot; v3.4.1–v3.4.4 is the operational hardening that followed
- [[supports::../Knowledge Base/Principle - Resume Beats Continuation]] — same lesson at a different layer: don't trust the platform's confidence signals, probe directly
