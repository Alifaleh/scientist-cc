---
title: "Principle: Layered Memory Systems Complement, Don't Compete"
tags: [principle, memory-architecture, persistence]
derived_from:
  - "[[../Research/Claude Code Auto-Memory vs Scientist Vault]]"
  - "[[../Research/MemGPT Architecture Mapping]]"
  - "[[../Research/Knowledge Management for AI Agents]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Layered Memory Systems Complement, Don't Compete

> [!note] Core Principle
> Multiple memory systems (auto-memory, CLAUDE.md, vault) work best when each serves a distinct purpose at a distinct tier. Don't store everything in one system — split by access pattern: always-loaded (CLAUDE.md) vs on-demand (vault) vs cross-project (auto-memory).

## Evidence
- [[../Research/MemGPT Architecture Mapping|MemGPT]]: 3-tier architecture (system/working/external) outperforms flat memory
- [[../Research/Claude Code Auto-Memory vs Scientist Vault|Three systems analysis]]: CLAUDE.md + auto-memory + vault each serve different needs
- [[../Research/Knowledge Management for AI Agents|A-MEM/MIRIX]]: Multi-tier memory with different access patterns improves retrieval quality

## Boundary Conditions
- Too many tiers adds complexity without benefit (3 is enough for our use case)
- Each tier needs a clear access pattern — if two tiers serve the same purpose, merge them
- The "always-loaded" tier must be small (CLAUDE.md < 500 lines) to avoid context bloat

## Connections
- [[extends::Principle - Consolidation Is the Missing Step]] — consolidation transforms tier-3 episodic data into tier-2 semantic knowledge
- [[supports::Principle - Novel Contributions of scientist-cc]] — our 3-tier approach is validated by MemGPT + MIRIX research
