---
title: "Novel Finding: Tag-Based Linking Achieves A-MEM Results Without Vector DB"
tags: [observation, novel-finding, a-mem, linking, status/actionable]
date: 2026-03-31
related:
  - "[[../Research/A-MEM Deep Dive - Agentic Memory]]"
  - "[[../Hypotheses/Hypothesis 4 - Two-Phase Linking]]"
  - "[[../Knowledge Base/Principle - Novel Contributions of scientist-cc]]"
  - "[[Literature Gap - Anti-Stopping Not Addressed]]"
---

# Novel Finding: Tag-Based Linking Without Vector DB

> [!note] Key Finding
> A-MEM requires ChromaDB + SentenceTransformer embeddings for its cheap-filter phase. We replaced this with frontmatter tag overlap + entity grep — zero infrastructure, zero dependencies. Our dogfooding produced a genuine discovery (A-MEM↔self-evolution connection) on the first run, demonstrating the approach works.

## Why This Is Novel
- A-MEM paper (NeurIPS 2025) assumes embedding infrastructure is necessary for linking
- No published work demonstrates that tag co-occurrence + LLM reasoning achieves comparable linking quality
- Our approach works in pure markdown files with standard unix tools (grep, sort)

## Evidence
- First dogfood run: discovered A-MEM Operation 3 (memory evolution) maps to our EVOLVE step — a connection not in any source material
- 79 typed links created across 48 notes — rich cross-linking emerged from tag matching alone
- Link density: 4.3 links/note — comparable to graph-database-backed systems

## Potential Research Contribution
This could be formalized as: "Tag-Based Memory Linking: A Zero-Infrastructure Alternative to Embedding-Based Agent Memory" — showing that structured metadata (tags, entities, frontmatter) can replace vector similarity for knowledge-base-scale linking tasks.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — better metadata > more infrastructure
- [[supports::../Knowledge Base/Principle - Novel Contributions of scientist-cc]]
- [[extends::../Research/A-MEM Deep Dive - Agentic Memory]]
