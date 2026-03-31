---
title: "Anti-Stopping Patterns for Autonomous Agents"
tags: [research, anti-stopping, autonomy, hooks, status/understood]
source: "Dogfooding analysis + Claude Code Stop hook documentation"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[../Knowledge Base/Principle - Anti-Stopping is the Core Challenge]]"
  - "[[Context Engineering for AI Agents]]"
---

# Anti-Stopping Patterns for Autonomous Agents

> [!note] Key Insight
> LLM agents stop because the model is trained to produce complete responses. No amount of instructional text can fully override this. The only effective mitigation is **structural enforcement** — using hooks, loops, or external orchestrators that detect stopping and force continuation.

## Why LLMs Stop
1. **Training objective:** Models are trained to produce helpful, complete responses — not continuous streams
2. **Turn-based architecture:** LLM APIs expect request→response, not continuous execution
3. **Summarization instinct:** After completing a task, the model naturally wants to report results
4. **Context pressure:** As context fills, the model becomes more conservative

## Mitigation Patterns (ordered by effectiveness)

### 1. External Orchestrator (AutoGPT, BabyAGI)
- Python loop that calls the LLM repeatedly with updated context
- Agent never "stops" — the orchestrator keeps calling it
- **Limitation:** Loses conversation context between calls

### 2. Stop Event Hook (scientist-cc approach)
- Claude Code's `Stop` hook fires when the model finishes responding
- Hook injects continuation reminder into context
- **Advantage:** Works within the native conversation, preserves context
- **Novel:** No other framework uses this pattern

### 3. Instructional Reinforcement (weakest)
- Rules in CLAUDE.md saying "never stop"
- Repeated reminders in the system prompt
- **Limitation:** Competes against model weights — text instructions lose

### 4. Structural Test (scientist-cc Rule 9)
- "Every response must end with a tool call — text-only = stopping"
- Makes stopping a visible, checkable error
- **Limitation:** The model can still generate text-only responses

## Our Solution Stack (layered defense)
1. **CLAUDE.md rules** — instructional (weakest but always present)
2. **Anti-stopping protocol in template** — explicit test before response
3. **Stop hook** — structural enforcement via Claude Code events
4. **/scientist:stop** — explicit user command for intentional stops

## Cross-Links
- [[supports::../Knowledge Base/Principle - Anti-Stopping is the Core Challenge]] — this research confirms the principle
- [[extends::Context Engineering for AI Agents]] — anti-stopping is a context engineering problem
