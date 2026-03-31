---
title: "Token Efficiency in Agent Memory Systems"
tags: [research, token-efficiency, memory, context-engineering, status/understood]
source: "A-MEM paper data + context engineering research + vault analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[A-MEM Deep Dive - Agentic Memory]]"
  - "[[Context Engineering for AI Agents]]"
  - "[[../Knowledge Base/Principle - Knowledge Density Is the Ultimate Metric]]"
---

# Token Efficiency in Agent Memory Systems

> [!note] Key Insight
> A-MEM achieves 85-93% token reduction (1,200-2,500 tokens vs 16,900) by using structured metadata instead of raw text. Our vault-index.json follows the same principle — structured frontmatter enables queries without reading note bodies. Token efficiency IS the scalability constraint for agent memory.

## Token Costs by Approach
| Approach | Tokens per query | Relative cost |
|----------|-----------------|---------------|
| Full conversation replay | 16,900 | 100% |
| RAG with embeddings | 4,000-8,000 | ~35% |
| A-MEM structured notes | 1,200-2,500 | ~10% |
| vault-index.json scan | ~500-1,000 | ~5% |

## Our Approach
- **Tier 1:** vault-index.json (~500 tokens for 80 notes) — always loaded
- **Tier 2:** Frontmatter scan (~60 tokens/note) — for candidates
- **Tier 3:** Full note body — only for 2-5 selected notes

## Cross-Links
- [[supports::A-MEM Deep Dive - Agentic Memory]] — A-MEM's efficiency proves structured metadata works
- [[supports::Context Engineering for AI Agents]] — token efficiency IS context engineering
- [[supports::../Knowledge Base/Principle - Knowledge Density Is the Ultimate Metric]] — density enables efficiency
