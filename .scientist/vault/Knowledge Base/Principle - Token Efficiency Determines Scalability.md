---
title: "Principle: Token Efficiency Determines Agent Memory Scalability"
tags: [principle, token-efficiency, scalability, memory]
derived_from:
  - "[[../Research/Token Efficiency in Agent Memory Systems]]"
  - "[[../Research/Context Engineering for AI Agents]]"
  - "[[../Research/A-MEM Deep Dive - Agentic Memory]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Token Efficiency Determines Scalability

> [!note] Core Principle
> An agent memory system that requires reading ALL notes to find relevant ones will fail at scale. Structured indexes (vault-index.json at ~500 tokens for 80 notes) are 95% cheaper than full replay. Token efficiency IS the scalability constraint.

## Evidence
- A-MEM: 85-93% token reduction via structured metadata
- vault-index.json: ~500 tokens for 80 notes vs ~16,000 for full replay
- Three-tier progressive disclosure: index → frontmatter → full body

## Connections
- [[extends::../Research/Token Efficiency in Agent Memory Systems]]
- [[supports::Principle - Knowledge Density Is the Ultimate Metric]]
- [[supports::../Research/Context Engineering for AI Agents]]
