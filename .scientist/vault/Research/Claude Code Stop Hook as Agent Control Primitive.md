---
title: "Claude Code Stop Hook: A New Agent Control Primitive"
tags: [research, stop-hook, agent-control, claude-code, original-knowledge, status/understood]
source: "Original discovery through dogfooding + Claude Code hook documentation"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Anti-Stopping Patterns for Autonomous Agents]]"
  - "[[../Knowledge Base/Principle - Structural Enforcement Beats Instructional]]"
  - "[[../Observations/Literature Gap - Anti-Stopping Not Addressed]]"
---

# Claude Code Stop Hook: A New Agent Control Primitive

> [!note] Key Insight (ORIGINAL)
> Claude Code's Stop event hook is a previously unexplored agent control primitive. By injecting continuation context when the model stops, it creates a feedback loop: model stops → hook fires → context injected → model continues. This is the first documented use of the Stop hook for autonomous agent persistence, and it addresses a gap no published paper covers.

## The Primitive
```json
{"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "node anti-stop.js"}]}]}}
```
When Claude stops responding, the hook runs and returns `additionalContext` that gets injected back into the conversation, prompting continuation.

## Why This Is a New Primitive
- Other hooks (PreToolUse, PostToolUse) modify tool behavior
- The Stop hook modifies STOPPING behavior — a fundamentally different control dimension
- No published framework uses this pattern
- It's the structural solution to a training-level problem (models trained to produce complete responses)

## Cross-Links
- [[supports::Anti-Stopping Patterns for Autonomous Agents]] — this IS the structural pattern
- [[supports::../Knowledge Base/Principle - Structural Enforcement Beats Instructional]]
- [[supports::../Observations/Literature Gap - Anti-Stopping Not Addressed]]
