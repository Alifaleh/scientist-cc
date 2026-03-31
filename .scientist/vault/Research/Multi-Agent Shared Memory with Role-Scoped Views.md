---
title: "Multi-Agent Memory: Shared Vault + Role-Scoped Views"
tags: [research, multi-agent, memory, role-scoping, status/understood]
source: "arxiv 2603.10062, OpenReview Intrinsic Memory Agents, TechRxiv survey"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[MIRIX 6-Memory-Type Architecture]]"
  - "[[CrewAI 4-Layer Memory Architecture]]"
  - "[[../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]]"
---

# Multi-Agent Memory: Shared Vault + Role-Scoped Views

> [!note] Key Insight
> The 2026 consensus: role-specialized agents should share ONE vault but read/write through role-tagged namespaces. Our vault already does this: `Research/` for Researcher, `Observations/` for Observer, `Experiments/` for Experimenter. Validated by arxiv 2603.10062.

## The Pattern
- Shared long-term vault (our `.scientist/vault/`)
- Role-scoped namespaces (our folders: `Research/`, `Observations/`, `Experiments/`)
- Per-task scratchpad (our current loop iteration notes)

## Why Pure Sharing Fails
- Overwrite conflicts — agents write contradictory updates
- Stale reads — one agent reads before another writes

## Why Pure Separation Fails
- State divergence — agents build separate, incompatible worldviews
- No cross-pollination — Researcher findings never reach Experimenter

## Our Hybrid Is Correct
Our vault folders ARE role-scoped views on a shared store. Two-phase linking creates cross-role connections.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]]
- [[extends::MIRIX 6-Memory-Type Architecture]]
- [[extends::CrewAI 4-Layer Memory Architecture]]
