---
title: "MemGPT Architecture Mapping to scientist-cc"
tags: [research, memgpt, memory-architecture, context-engineering, status/understood]
source: "MemGPT paper (arxiv 2310.08560), pages 2-4"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[A-MEM Deep Dive - Agentic Memory]]"
  - "[[Knowledge Management for AI Agents]]"
  - "[[Vault Navigation Patterns for AI Agents]]"
---

# MemGPT Architecture Mapping to scientist-cc

> [!note] Key Insight
> MemGPT's 3-tier prompt structure (system instructions / working context / FIFO queue) maps directly to our architecture: CLAUDE.md / IDENTITY.md+Index / current loop notes. This validates our approach and suggests formalizing the tiers.

## MemGPT's Memory Hierarchy

| MemGPT | Our Equivalent | Behavior |
|--------|---------------|----------|
| System instructions (static) | CLAUDE.md | Read-only, loaded every time, contains rules |
| Working context (LLM-editable) | IDENTITY.md + vault Index | Updated by the scientist, reflects current understanding |
| FIFO Queue | Current iteration notes | Recent observations, active hypothesis, loop state |
| External context (disk) | Full vault (vault-index.json) | Retrieved on demand via two-phase linking |

## Key Mechanism: LLM Manages Its Own Memory
- MemGPT gives the LLM function calls to move data between tiers
- We do the same: the scientist reads/writes vault notes, updates IDENTITY.md, evolves CLAUDE.md
- The critical difference: MemGPT does this within a single conversation. We do it across context window resets via persistent files.

## What We Can Adopt
- **Memory pressure signals:** MemGPT alerts the LLM when context is getting full. We could add a context budget check during REFLECT.
- **Explicit eviction:** When context is limited, deliberately choose what to DROP, not just what to add.

## Cross-Links (two-phase linking)
- [[extends::A-MEM Deep Dive - Agentic Memory]] — A-MEM's note structure is the atomic unit; MemGPT's tiers organize how those units enter context
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — MemGPT shows that HOW you structure context matters more than how much you have
