---
title: "Hypothesis 4: Two-Phase Linking Improves Vault Knowledge Discovery"
tags: [hypothesis, status/implemented, knowledge-management, a-mem]
date: 2026-03-31
related:
  - "[[../Research/A-MEM Deep Dive - Agentic Memory]]"
  - "[[../Research/Knowledge Management for AI Agents]]"
  - "[[../Knowledge Base/Principle - Consolidation Is the Missing Step]]"
---

# Hypothesis 4: Two-Phase Linking Improves Vault Knowledge Discovery

## Statement
"When the CONSOLIDATE step includes a two-phase linking process (cheap tag/entity filter → LLM reasoning for final links), the vault will develop richer cross-connections that surface during REFLECT — because A-MEM's mechanism shows this is how agentic memory achieves Zettelkasten-like emergence without a vector database."

## Mechanism (WHY)
Current vault notes have wikilinks but they're manually chosen during writing. A systematic linking pass would:
1. For each new note, scan ALL existing notes for tag overlap and shared entities (cheap)
2. Present top-5 candidates to Claude with: "Should these be linked? What type?" (expensive)
3. Write typed bidirectional links: `[[supports::X]]`, `[[contradicts::Y]]`, `[[extends::Z]]`
4. This creates connections the scientist wouldn't have thought of, enabling emergent insights

## Adversarial Challenges
1. **Could be noise:** If the cheap filter matches too broadly, LLM will waste time on irrelevant candidates
   - Mitigation: Require 2+ shared tags OR 1+ shared entity for candidacy
2. **Extra cost:** 3 LLM calls per note is expensive for a markdown framework
   - Mitigation: Only run linking on CONSOLIDATE step (not every note), batch process
3. **May not surface during REFLECT:** Even with better links, if REFLECT doesn't traverse them, no value
   - Mitigation: Update REFLECT to follow `related` frontmatter links when reading priority notes

## Falsification Criteria
After implementing and running for 3 sessions:
- If no new cross-connections are discovered by the linking process → FALSIFIED
- If discovered connections don't inform any hypothesis or research direction → FALSIFIED
- If the linking overhead (time spent) exceeds the value of connections found → FALSIFIED

## Confirmation Criteria
- At least 1 genuinely surprising connection discovered per session
- REFLECT step uses linked notes to inform prioritization
- Vault graph density increases measurably (more links per note)

## Implementation Plan
Add two-phase linking to the CONSOLIDATE step in loop.md:
```
For each new note this cycle:
  1. Scan vault: find notes with 2+ shared tags or 1+ shared entity
  2. Take top-5 candidates by tag overlap count
  3. For each candidate, assess: "Link type? (supports/contradicts/extends/none)"
  4. Write bidirectional typed wikilinks to both notes
```

## Empirical Support (A-MEM Paper Ablation)
- Without link generation: Multi-hop F1 = 9.65 (baseline)
- With link generation: Multi-hop F1 = 21.35 (2.2x improvement)
- Links are the BIGGEST single contributor to multi-hop retrieval performance
- Our dogfooding found A-MEM↔self-evolution connection on first run — qualitative early signal

## Status: IMPLEMENTED (empirical evidence supports mechanism)
