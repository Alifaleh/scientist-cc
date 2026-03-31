---
title: "MIRIX: 6 Memory Types with Multi-Agent Coordination"
tags: [research, mirix, memory-architecture, multi-agent, status/understood]
source: "Knowledge management research + MIRIX paper analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Knowledge Management for AI Agents]]"
  - "[[CrewAI 4-Layer Memory Architecture]]"
  - "[[../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]]"
---

# MIRIX: 6 Memory Types with Multi-Agent Coordination

> [!note] Key Insight
> MIRIX achieves 35% improvement over RAG baselines using 6 specialized memory types and multi-agent coordination. Our 3-agent model (Researcher/Observer/Experimenter) partially implements this pattern — each agent contributes to different memory types (research notes, observations, experiments).

## 6 Memory Types
1. **Episodic** — specific events/observations (≈ our vault Observations/)
2. **Semantic** — generalized knowledge (≈ our vault Knowledge Base/)
3. **Procedural** — how-to knowledge (≈ our reference docs + skills)
4. **Working** — current task context (≈ our loop state + active hypothesis)
5. **Social** — knowledge about people/roles (≈ our agent definitions)
6. **Meta** — knowledge about the memory system itself (≈ our meta-metrics)

## 35% Improvement Mechanism
- Specialized memory types enable targeted retrieval (don't search everything for everything)
- Multi-agent coordination: different agents write to different memory types
- This is why our 3-agent model works — each agent produces a different knowledge type

## Cross-Links
- [[extends::Knowledge Management for AI Agents]] — MIRIX is the most comprehensive memory architecture studied
- [[supports::../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]] — 6 layers validates multi-tier approach
- [[supports::CrewAI 4-Layer Memory Architecture]] — CrewAI has 4 layers, MIRIX has 6 — more specialization helps
