---
title: "Spaced Repetition Adapted for AI Agent Vaults"
tags: [research, spaced-repetition, knowledge-decay, validation, status/understood]
source: "Spaced repetition research + Leitner system + vault analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Knowledge Management for AI Agents]]"
  - "[[AutoDream Consolidation Mechanism]]"
  - "[[../Knowledge Base/Principle - Consolidation Is the Missing Step]]"
---

# Spaced Repetition Adapted for AI Agent Vaults

> [!note] Key Insight
> Spaced repetition for AI agents isn't reviewing flashcards — it's periodically re-validating knowledge at calibrated intervals per note type. Volatile knowledge (APIs, deps) needs frequent re-checks; stable knowledge (architecture, principles) needs infrequent review. Our `last_verified` and `validity_window` frontmatter already support this.

## Leitner-Style Buckets for Vault Notes
- **Bucket 1 (1 day):** API responses, tool versions, config values
- **Bucket 2 (1 week):** Observations, recent findings
- **Bucket 3 (1 month):** Hypotheses, experimental results
- **Bucket 4 (3 months):** Principles, architecture decisions
- **Bucket 5 (never):** Mathematical proofs, formal definitions

## Implementation via Frontmatter
```yaml
last_verified: 2026-03-31
validity_window: 7d  # re-check after 7 days
confidence: high     # verified/likely-stale/unverified
```

## Cross-Links
- [[extends::Knowledge Management for AI Agents]] — spaced repetition is knowledge maintenance
- [[supports::AutoDream Consolidation Mechanism]] — consolidation includes re-validation
- [[supports::../Knowledge Base/Principle - Consolidation Is the Missing Step]]
