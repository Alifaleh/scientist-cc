---
title: "Context Engineering for AI Agents (Anthropic)"
tags: [research, context-engineering, anthropic, status/understood]
source: "Anthropic official docs, context engineering guides 2025-2026"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[MemGPT Architecture Mapping]]"
  - "[[Vault Navigation Patterns for AI Agents]]"
---

# Context Engineering for AI Agents

> [!note] Key Insight
> Complexity should live in the knowledge store, not the prompt. Keep CLAUDE.md concise with identity rules; let the vault hold the detail. Use markdown (not JSON) for prose — it's what the model sees naturally on the internet.

## Anthropic's 4 Techniques for Context Pressure
1. **Tool search:** Defer tool schemas; load on demand (we don't control this but it validates lazy loading)
2. **Programmatic tool calling:** Collapse multi-step into single code blocks (our generate_index.py does this)
3. **Prompt caching:** Cache stable prefixes (CLAUDE.md is naturally cached as system prompt)
4. **Context editing:** Strip spent tool results from history (handled by Claude Code automatically)

## What Goes Where
- **System prompt (CLAUDE.md):** Stable identity, rules, behavioral instructions — general, not prescriptive
- **Retrieved context (vault):** Task-specific knowledge pulled on demand via vault-index.json
- **Tool results:** Ephemeral — don't depend on tool results persisting in context

## Validated Approaches
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — "invest as much in ACI as HCI"
- [[supports::../Knowledge Base/Principle - Novel Contributions of scientist-cc]] — vault-based persistence is the right architecture
- Our weighted retrieval (recency/importance/staleness) matches Anthropic's recommended prioritization
- Markdown over JSON for vault notes — confirmed as optimal format for LLM comprehension
