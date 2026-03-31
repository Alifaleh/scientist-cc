---
title: "A-MEM Deep Dive: Agentic Memory for LLM Agents"
tags: [research, a-mem, memory-architecture, linking, status/understood]
source: "A-MEM (NeurIPS 2025), source code analysis, MemGPT/Letta, AutoDream"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Knowledge Management for AI Agents]]"
  - "[[../Hypotheses/Hypothesis 4 - Two-Phase Linking]]"
---

# A-MEM Deep Dive: Agentic Memory for LLM Agents

> [!note] Key Insight
> A-MEM does NOT use 4 independent linking strategies. It uses a **two-phase approach**: cheap filter (tags/embeddings) to find candidates, then LLM reasoning to decide links. This is directly implementable in markdown without a vector database.

## Architecture: 3 LLM Operations Per Memory

Each new experience triggers 3 sequential LLM calls:

### Operation 1: Note Construction
- Takes raw input and constructs a structured note with: title, content, tags, entity links
- **Note structure:** Each memory is an atomic Zettelkasten-style note with metadata
- **Key:** Notes are SMALL and ATOMIC — one concept per note

### Operation 2: Two-Phase Link Generation
**Phase A — Cheap candidate retrieval:**
- Tag overlap between new note and existing notes
- Embedding similarity (SentenceTransformer all-MiniLM-L6-v2 via ChromaDB)
- Returns top-5 candidates

**Phase B — LLM reasoning for final links:**
- Present candidates to LLM with the new note
- LLM decides which connections are meaningful
- Returns typed links with reasoning

> [!warning] Correction
> I initially assumed A-MEM had "4 linking strategies" (entity, semantic, tag, LLM reasoning). In reality, the first 3 are just the candidate retrieval filter, and LLM reasoning is the decision step. Two phases, not four strategies.

### Operation 3: Memory Evolution
- After linking, check if any existing notes should be UPDATED based on new information
- Evolution threshold: after N new memories, trigger consolidation
- Consolidation rebuilds the index with updated metadata

## scientist-cc Implementation (No Vector DB Needed)

### For Linking (can implement NOW):
1. **Cheap filter:** Scan vault notes by `tags` and `related` frontmatter for overlap
2. **Match by entity:** Grep for shared entity names across notes
3. **LLM reasoning:** Present top-5 candidates and ask: "Which of these should be linked to the new note? What type of link? (supports, contradicts, extends, relates)"
4. **Write links:** Add `[[type::Target Note]]` wikilinks to both notes (bidirectional)

### For Evolution:
- After every 5 new notes, run an evolution pass
- Check each recent note: "Does this change anything I previously wrote?"
- Update affected notes with new information, add `last_verified` date

### For Consolidation (AutoDream-inspired):
- **Trigger:** Every 5 sessions OR 24 hours since last consolidation
- **10-phase process from AutoDream:**
  1. Gather — collect all notes from recent sessions
  2. Analyze — identify themes, patterns, contradictions
  3. Consolidate — merge duplicates, resolve contradictions
  4. Synthesize — extract principles from patterns
  5. Organize — restructure vault sections if needed
  6-10. Cleanup, verify, index, log, reset timer

## Key Numbers
- **Top-5 candidates** per linking operation
- **3 LLM calls** per new memory
- **SentenceTransformer all-MiniLM-L6-v2** for embeddings (384-dim)
- **Evolution threshold:** configurable, default triggers after N memories
- **AutoDream trigger:** 5 sessions AND 24 hours since last consolidation

## Exact Prompts (from appendix, pages 19-20)

### Note Construction Prompt (Ps1)
Input: raw content from a conversation/observation
Output: JSON with `keywords` (nouns/verbs/concepts, 3+ ordered by importance), `context` (1 sentence: topic + arguments + audience), `tags` (domain/format/type categories, 3+)

Our equivalent: frontmatter template with `tags`, `title`, `related`, and `> [!note]` callout summary. We do this manually during note writing — could be automated.

### Link Generation Prompt (Ps2)
Same agent prompt as evolution but focused on: "Given the new note + nearest neighbors, should connections be created?"
Our equivalent: two-phase linking in CONSOLIDATE step. Already implemented.

### Memory Evolution Prompt (Ps3)
The LLM receives:
- New memory's `context`, `content`, `keywords`
- Nearest neighbor memories

And decides:
- `should_evolve: true/false`
- Actions: `strengthen` (add connections) or `update_neighbor` (rewrite neighbor's context+tags)
- Returns JSON with: `suggested_connections`, `tags_to_update`, `new_context_neighborhood`, `new_tags_neighborhood`

Key: the LLM rewrites BOTH the new note's tags AND the old neighbors' context+tags. This is why backward evolution works — old knowledge genuinely gets smarter.

## Cross-Links (discovered via two-phase linking)
- [[extends::../Research/AI Self-Improvement Frameworks]] — A-MEM's Operation 3 (memory evolution) is structurally identical to our EVOLVE step: LLM decides when existing knowledge needs updating based on new evidence. Both are GVU Updater implementations.
- [[supports::../Knowledge Base/Principle - Consolidation Is the Missing Step]] — A-MEM's consolidation mechanism confirms: periodic memory maintenance (rebuild index, resolve contradictions) is essential, not optional.

## What This Means for scientist-cc
The two-phase approach is the key insight: we don't need embeddings or a vector DB. Tag overlap + frontmatter matching IS the cheap filter. LLM reasoning IS the expensive filter. We already have both capabilities — we just need to wire them into the loop.
