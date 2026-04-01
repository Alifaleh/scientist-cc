---
title: "Handoff: v1.8.1 — Source-Optimized Framework, 250 Commits"
tags: [observation, handoff, status/actionable]
date: 2026-04-01
---

# Handoff: v1.8.1 Source-Optimized

> [!note] Quick Context
> Cloned Claude Code source, found 14 exploitable patterns, implemented all. Framework now has maximum thinking tokens (31,999/turn via hook), default behavior overrides, and parallel research guidance. 250 commits total.

## 14 Source Discoveries (ALL IMPLEMENTED)
1. ultrathink=31999, megathink=10000, think=4000 thinking tokens
2. Default overrides: 4-line limit, minimize tokens, never commit → ALL overridden
3. Prompt caching ON (CLAUDE.md cached)
4. Temperature=1
5. Stop hook additionalContext confirmed working
6. Compaction: querySonnet with summary
7. **ROOT CAUSE: toolUseMessages.length===0 exits agent loop**
8. Subagent thinking: parent triggers affect budget
9. MAX_TOOL_USE_CONCURRENCY=10
10. Context pipeline: CLAUDE.md via ripgrep, memoized
11. Thinking utility checks LAST user message
12. Slash commands ARE user messages → triggers work
13. ThinkTool DISABLES thinking triggers → never enable
14. ThinkTool is feature-gated (THINK_TOOL env + Statsig gate)

## Hooks Installed
- **Stop:** Anti-stop hook injects continuation reminder
- **UserPromptSubmit:** Think-harder hook injects "ultrathink" every turn

## Next Actions
1. Test on different project (IIB Mobile Banking or orderflow_scalper)
2. Verify think-harder hook produces deeper analysis
3. PreCompact hook to preserve scientist context
4. Experiment checkpointing via git tags
5. Continue A-MEM + MemGPT paper reading
