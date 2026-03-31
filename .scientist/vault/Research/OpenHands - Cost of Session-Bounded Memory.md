---
title: "OpenHands: The Cost of Session-Bounded Memory"
tags: [research, openhands, memory-loss, persistence, status/understood]
source: "Agent frameworks landscape research + OpenHands (formerly OpenDevin)"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[../Knowledge Base/Principle - Novel Contributions of scientist-cc]]"
  - "[[../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]]"
---

# OpenHands: The Cost of Session-Bounded Memory

> [!note] Key Insight
> OpenHands (65k stars, formerly OpenDevin) demonstrates what happens when an autonomous coding agent has NO persistent memory: every new conversation starts from scratch. Despite being one of the most capable open-source agents, it cannot learn from past projects or accumulate domain expertise. This is the problem scientist-cc solves.

## The Problem
- OpenHands creates a sandboxed environment per task
- Environment is destroyed after task completion
- No learning persists between tasks
- Each conversation rediscovers patterns the agent found before

## Why This Matters
- SWE-bench performance improves with context, but that context is lost
- Bugs fixed once get re-introduced because the fix rationale isn't saved
- Domain expertise built during debugging evaporates at session end

## What scientist-cc Provides That OpenHands Doesn't
1. **Vault persistence** — knowledge survives across context windows
2. **Self-evolution rules** — mistakes become permanent improvements
3. **Consolidation** — episodic experience becomes semantic knowledge
4. **Handoff notes** — explicit context transfer between context windows

## Cross-Links
- [[supports::../Knowledge Base/Principle - Novel Contributions of scientist-cc]] — persistent vault is our #1 differentiator
- [[supports::../Knowledge Base/Principle - Layered Memory Systems Complement Each Other]] — OpenHands has 0 layers; we have 3
- [[extends::AI Agent Frameworks Landscape]] — OpenHands is the cautionary tale for session-bounded agents
