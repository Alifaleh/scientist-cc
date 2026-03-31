---
title: "Knowledge Management for AI Agents"
tags: [research, knowledge-management, zettelkasten, ai-memory, status/understood]
source: "Multi-source web research — A-MEM (NeurIPS 2025), MIRIX, MemGPT, Synapse"
date: 2026-03-31
related:
  - "[[../Observations/Framework Self-Analysis]]"
  - "[[../Hypotheses/Hypothesis 1 - Consolidation Step]]"
---

# Knowledge Management for AI Agents

> [!note] Key Insight
> The **critical missing piece** in scientist-cc is an explicit episodic-to-semantic consolidation step. Every major AI memory paper identifies this transformation as THE mechanism for long-term learning. We record observations and experiments but never consolidate them into generalized principles.

## What I Learned

### 1. Zettelkasten Principles Apply Directly to AI Agents
- **A-MEM paper (NeurIPS 2025)** implements Zettelkasten for LLM agents
- 4 automated linking strategies: entity co-occurrence, semantic similarity, tag overlap, LLM reasoning
- Scientist-cc currently uses PARA-style organization (by type: Research/, Observations/, etc.)
- Zettelkasten organizes by **atomic idea** with bidirectional links — enables emergence
- **Implication:** We should shift toward atomic notes with mandatory cross-links

### 2. Obsidian's Linked-Markdown Is Competitive
- LLMs natively process markdown — no serialization/deserialization overhead
- Obsidian's backlinks approximate a knowledge graph
- **Gap:** No typed relationships. A link `[[concept]]` doesn't say HOW it relates
- **Fix:** Add link conventions: `[[supports::Hypothesis 1]]`, `[[contradicts::Old Theory]]`, `[[extends::Base Concept]]`
- **Gap:** No temporal queries. Can't ask "what did I learn last week?"
- **Fix:** Use frontmatter: `last_verified`, `validity_window`, `superseded_by`

### 3. Episodic-to-Semantic Consolidation (THE Critical Gap)
- Every major memory architecture paper identifies this:
  - **A-MEM**: Automatic memory consolidation with Zettelkasten linking
  - **MIRIX**: 6 memory types + multi-agent coordination (35% improvement over RAG baselines)
  - **MemGPT**: Hierarchical memory with explicit consolidation
  - **Synapse**: Consolidation as core mechanism
- Scientist-cc records episodic data (observations, experiments) but NEVER consolidates
- The LEARN step (Step 8) studies results but doesn't extract generalizable principles
- **Missing step:** A CONSOLIDATE phase that extracts patterns across multiple observations/experiments

### 4. Knowledge Rot Is a Real Threat
- Outdated vault notes can degrade agent performance
- **Mitigation:** Add metadata to every note:
  - `last_verified: YYYY-MM-DD` — when was this last confirmed true?
  - `validity_window: Xd` — how long before this should be re-checked?
  - `superseded_by: [[New Note]]` — explicit deprecation chain
- **Mitigation:** Add a vault health audit command that flags stale notes

### 5. Spaced Review for AI Agents
- Not flashcard review — periodic re-validation of knowledge
- Calibrate review intervals per note type:
  - Observations: verify within 7 days (data may change)
  - Hypotheses: re-test after new data arrives
  - Knowledge Base: review quarterly (stable knowledge)
- Could be implemented as a REFLECT sub-step: "check for stale notes before planning"

## What I Can Use (Actionable for scientist-cc)

1. **Add CONSOLIDATE step to the loop** (between LEARN and EVOLVE)
2. **Add typed wikilinks** to vault conventions (`supports::`, `contradicts::`, `extends::`)
3. **Add temporal frontmatter** (`last_verified`, `validity_window`, `superseded_by`)
4. **Add vault health audit** to `/scientist:status` command
5. **Shift vault structure** toward atomic notes (one concept per note) vs. current type-based folders
6. **Study A-MEM paper deeply** — it's the closest existing implementation to what we need

## What Contradicts My Understanding

- I assumed PARA-style organization (by type) was correct for the vault. The research suggests **Zettelkasten-style** (by concept, with links) produces better emergent understanding. However, type-based folders still serve as useful entry points — hybrid approach may be best.

## Questions This Raises

- Can we implement A-MEM's 4-strategy linking in pure markdown (without a vector database)?
- Should consolidation happen every session or only when sufficient episodic data accumulates?
- How do we measure vault quality objectively? What metrics would tell us if the vault is "good"?

## Key Numbers

- **MIRIX: 35% improvement** over RAG baselines with multi-agent memory coordination
- **A-MEM: 4 linking strategies** — entity, semantic, tag, LLM reasoning
- **6 memory types** in MIRIX architecture (episodic, semantic, procedural, working, social, meta)
