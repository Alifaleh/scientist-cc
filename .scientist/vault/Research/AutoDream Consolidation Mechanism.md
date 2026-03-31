---
title: "AutoDream: Between-Session Memory Consolidation"
tags: [research, autodream, consolidation, triggers, sleep-compute, status/understood]
source: "claude-dream GitHub + A-MEM deep dive analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[A-MEM Deep Dive - Agentic Memory]]"
  - "[[Knowledge Management for AI Agents]]"
  - "[[../Knowledge Base/Principle - Consolidation Is the Missing Step]]"
---

# AutoDream: Between-Session Memory Consolidation

> [!note] Key Insight
> AutoDream models memory consolidation after REM sleep: between sessions, a background agent reviews accumulated memories, merges duplicates, resolves contradictions, promotes patterns, and prunes stale references. Our CONSOLIDATE step implements this within-session; AutoDream shows it should also run between context windows.

## 10-Phase Consolidation Process
1. Gather — collect notes from recent context windows
2. Analyze — identify themes, patterns, contradictions
3. Consolidate — merge duplicates, resolve conflicts
4. Synthesize — extract principles from patterns
5. Organize — restructure vault sections if needed
6. Enrich — add cross-references and context
7. Verify — check accuracy of consolidated knowledge
8. Index — update search indexes
9. Report — log what was consolidated
10. Reset — reset consolidation timer

## Trigger Thresholds
- `minSessions: 5` — at least 5 context windows since last consolidation
- `minHours: 24` — at least 24 hours since last consolidation
- Both must be met before auto-trigger

## Our Implementation vs AutoDream
| AutoDream | scientist-cc |
|-----------|-------------|
| Runs between sessions as background agent | Runs within-loop as CONSOLIDATE step |
| Triggered by session count + time | Triggered by note count + contradictions |
| Full 10-phase process | Simplified: review + link + extract + evolve |
| Requires server infrastructure | Pure markdown, no infrastructure |

## Cross-Links
- [[extends::A-MEM Deep Dive - Agentic Memory]] — A-MEM's evolution + AutoDream's consolidation = complete memory lifecycle
- [[supports::../Knowledge Base/Principle - Consolidation Is the Missing Step]] — AutoDream confirms consolidation is essential
- [[supports::../Knowledge Base/Principle - Continuous Deployment Accelerates Learning]] — frequent deploys = frequent consolidation opportunities
