---
title: "Principle: Know Your Runtime — Source Code Analysis Unlocks Hidden Capabilities"
tags: [principle, runtime, source-analysis, optimization, novel-contribution]
derived_from:
  - "[[../Research/Claude Code Source Analysis - Exploitable Patterns]]"
date: 2026-04-01
last_verified: 2026-04-01
---

# Principle: Know Your Runtime

> [!note] Core Principle
> Analyzing the source code of your host runtime (Claude Code) reveals hidden capabilities that no documentation covers: thinking token triggers, default behavior overrides, agent loop exit conditions, concurrency limits, and context loading pipelines. A framework that exploits its runtime outperforms one that treats it as a black box.

## 11 Discoveries from Source Analysis
1. **Thinking triggers:** ultrathink=31999, megathink=10000, think=4000 tokens
2. **Default overrides needed:** System prompt says "4 lines max" — must override for research
3. **Prompt caching ON:** CLAUDE.md content is cached and cheap
4. **Temperature=1:** Maximum creativity, good for research
5. **Stop hook confirmed:** additionalContext injection works
6. **Compaction mechanism:** querySonnet with summary prompt
7. **Agent loop exit:** `toolUseMessages.length === 0` terminates the loop — ROOT CAUSE of stopping
8. **Subagent thinking:** Parent message triggers affect subagent thinking budget
9. **MAX_TOOL_USE_CONCURRENCY=10:** Up to 10 parallel tool calls
10. **Context pipeline:** CLAUDE.md loaded via ripgrep, cached with memoize
11. **Thinking utility:** Checks LAST user message — command context triggers work

## Connections
- [[extends::../Research/Claude Code Source Analysis - Exploitable Patterns]]
- [[supports::Principle - Interface Quality Over Tool Quantity]] — knowing the runtime IS interface optimization
- [[supports::Principle - Anti-Stopping is the Core Challenge]] — source reveals WHY stopping happens
