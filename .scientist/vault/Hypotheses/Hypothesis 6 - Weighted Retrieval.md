---
title: "Hypothesis 6: Weighted Retrieval Improves REFLECT Prioritization"
tags: [hypothesis, status/untested, retrieval, novel-contribution]
date: 2026-03-31
related:
  - "[[../Research/A-MEM Deep Dive - Agentic Memory]]"
  - "[[../Research/MemGPT Architecture Mapping]]"
  - "[[../Research/AI Agent Frameworks Landscape]]"
---

# Hypothesis 6: Weighted Retrieval Improves REFLECT Prioritization

## Statement
"When vault note retrieval weights recency and access frequency alongside tag matching, REFLECT will surface more relevant notes — because A-MEM tracks `retrieval_count` and `last_accessed` but doesn't use them in scoring (a gap we can fill), and CrewAI's weighted retrieval (recency/semantic/importance) shows this pattern works."

## Mechanism (WHY)
Current REFLECT: reads vault-index.json and filters by status/tags. All matching notes are treated equally.

Weighted retrieval would score each note: `score = tag_overlap * 0.4 + recency * 0.3 + access_count * 0.2 + importance * 0.1`

Where:
- `tag_overlap`: how many tags match the current query
- `recency`: days since last modification (newer = higher)
- `access_count`: how many times this note was read/linked (more = higher)
- `importance`: manual tag `priority/high` or principle notes

This is a **potential novel contribution** — A-MEM doesn't do this, CrewAI does it with embeddings, but we'd do it in pure markdown with frontmatter metadata.

## Implementation
Add to `generate_index.py`: compute a `relevance_score` per note and sort by it. Add `access_count` and `last_accessed` frontmatter to vault templates.

## Adversarial Challenges
1. **Popularity bias:** frequently accessed notes dominate, new insights get buried
   - Mitigation: boost notes with `status/untested` regardless of access count
2. **Stale popularity:** old popular notes outrank new important ones
   - Mitigation: recency has 0.3 weight, ensuring fresh notes surface
3. **Overcomplicated:** for a small vault (<50 notes) this is overkill
   - Mitigation: only activate weighting when vault exceeds 30 notes

## Status: UNTESTED
