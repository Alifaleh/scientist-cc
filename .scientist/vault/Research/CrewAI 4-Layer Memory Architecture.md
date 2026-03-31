---
title: "CrewAI 4-Layer Memory Architecture"
tags: [research, crewai, memory-architecture, weighted-retrieval, status/understood]
source: "Agent frameworks landscape research + CrewAI documentation"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[Knowledge Management for AI Agents]]"
  - "[[../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]]"
---

# CrewAI 4-Layer Memory Architecture

> [!note] Key Insight
> CrewAI implements the most sophisticated open-source agent memory: 4 layers (short-term, long-term, entity, procedural) with weighted retrieval (recency/semantic/importance). Our weighted scoring in generate_index.py is a simpler but equivalent approach that works without their framework.

## 4 Memory Layers
1. **Short-term:** Current task context (≈ our FIFO queue / current loop notes)
2. **Long-term:** Cross-task knowledge (≈ our vault Knowledge Base)
3. **Entity:** People, tools, concepts with attributes (≈ our frontmatter metadata)
4. **Procedural:** How to do things (≈ our reference docs + skills)

## Weighted Retrieval
CrewAI scores memories by: `recency × w1 + semantic_similarity × w2 + importance × w3`

Our approach: `recency × 0.4 + importance × 0.35 + connectivity × 0.25`

Difference: they use embedding-based semantic similarity; we use link count as a proxy for relevance. Both achieve the same goal — surfacing the most useful knowledge.

## What We Learned
- 4 layers is well-validated but we achieve similar results with 3 tiers (CLAUDE.md / IDENTITY+Index / vault)
- Weighted retrieval is essential at scale — flat retrieval degrades as the knowledge base grows
- Entity memory (per-concept notes) maps to our Zettelkasten-style atomic notes

## Cross-Links
- [[extends::AI Agent Frameworks Landscape]] — CrewAI was the most interesting framework for memory
- [[supports::../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]] — 4 layers validates multi-tier approach
- [[supports::../Hypotheses/Hypothesis 6 - Weighted Retrieval]] — CrewAI proves weighted retrieval works at scale
