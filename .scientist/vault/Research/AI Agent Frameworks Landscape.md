---
title: "AI Agent Frameworks Landscape (March 2026)"
tags: [research, ai-agents, frameworks, competitive-analysis, status/understood]
source: "10 frameworks compared — AutoGPT, CrewAI, LangGraph, OpenHands, Devin, Claude Code, Aider, SWE-agent, MetaGPT, BabyAGI"
date: 2026-03-31
related:
  - "[[Knowledge Management for AI Agents]]"
  - "[[AI Self-Improvement Frameworks]]"
  - "[[../Observations/Framework Self-Analysis]]"
---

# AI Agent Frameworks Landscape (March 2026)

> [!note] Key Insight
> scientist-cc's vault-based persistence solves the **#1 unsolved problem** in the field: session-bounded memory. Most frameworks lose everything between sessions. Our approach is unique and validated. The biggest gaps are in **weighted retrieval**, **experiment checkpointing**, and **tool interface design**.

## What I Learned

### Our Competitive Position
scientist-cc occupies a unique niche: **research-oriented autonomous agent** with persistent knowledge. No other framework combines:
1. Hypothesis-driven methodology (scientific method)
2. Persistent markdown vault (survives sessions)
3. Self-evolution via CLAUDE.md (learns from mistakes)
4. Domain-agnostic R&D loop

### Key Lessons from Each Framework

| Framework | Stars | Key Lesson for scientist-cc |
|-----------|-------|---------------------------|
| **AutoGPT** | 182k | Unbounded autonomy fails. Our structured loop avoids this. Study their vector DB for knowledge retrieval. |
| **CrewAI** | 45.9k | 4-layer memory (short/long/entity/procedural) + weighted retrieval (recency/semantic/importance). We should adopt layered memory. |
| **LangGraph** | — | Time-travel debugging + checkpoint-based persistence. We need experiment checkpointing for replay/branching. |
| **OpenHands** | — | Demonstrates cost of session-bounded memory — exactly what we solve. |
| **Devin** | — | Closed-source, but shows autonomous coding agent viability. |
| **Claude Code** | — | Our host platform. Integration is our advantage. |
| **Aider** | — | Auto-test-and-fix loop as inner experiment loop. Simple but effective self-correction. |
| **SWE-agent** | — | **Tool interface design matters as much as the model.** Invest in HOW we read papers, run experiments, visualize — not just adding more tools. |
| **MetaGPT** | — | SOP-as-code philosophy: encoding process discipline into structured artifacts at each stage reduces errors. Our loop IS an SOP. |
| **BabyAGI** | — | "Build the simplest thing that can build itself." Keep the core loop simple enough to self-modify. |

### Recommended Evolution Roadmap

```
Phase 1 — Memory Enhancement:
  - Weighted retrieval for vault queries (recency, relevance, importance)
  - Post-session consolidation (AutoDream-inspired) ← DONE (H1)
  - Experiment checkpointing for replay/branching

Phase 2 — Knowledge Graph Layer:
  - Typed relationships between concepts/papers/experiments ← PARTIALLY DONE (typed wikilinks)
  - Semantic search over accumulated knowledge
  - Knowledge health monitoring (stale/contradictory detection) ← DONE (resume workflow)

Phase 3 — Structured Research Pipeline:
  - Enforce structured artifacts at each loop stage (MetaGPT-inspired)
  - Auto-validation after experiment execution (Aider-inspired)
  - Explicit GVU pattern (Generator=experiment, Verifier=validation, Updater=vault)

Phase 4 — Metacognitive Evolution:
  - Framework evaluates and modifies its own methodology
  - Meta-metrics: how well is the learning process improving?
  - Self-modify tool interfaces based on usage patterns
```

## What I Can Use (Actionable)

1. **CrewAI's weighted retrieval** — prioritize which vault notes to surface during REFLECT
2. **LangGraph's checkpointing** — save experiment state for replay and branching
3. **SWE-agent's ACI insight** — improve tool interfaces (pdf_reader, repo_reader) not just add tools
4. **MetaGPT's SOP discipline** — require structured artifacts at each loop step
5. **Aider's test-and-fix loop** — inner loop within IMPLEMENT for rapid iteration
6. **BabyAGI's simplicity principle** — keep core loop simple enough to self-modify

## What Contradicts My Understanding

- I assumed more tools = better. SWE-agent shows **better interfaces > more tools**. The quality of pdf_reader and repo_reader matters more than adding 10 new tools.
- I assumed multi-agent (our 3 roles) is strictly better than single-agent. AutoGPT's experience shows multi-agent coordination introduces failure modes. Our single-agent-with-roles approach may be the right balance.

## Questions This Raises

- Should we implement weighted retrieval (recency/semantic/importance) for vault notes?
- Should experiment checkpointing use git branches (current) or a separate state system?
- How do we measure tool interface quality? (SWE-agent ACI insight)
- Is our current 3-agent role decomposition optimal, or should we consolidate to pure single-agent?
