---
title: "BabyAGI: Build the Simplest Thing That Can Build Itself"
tags: [research, babyagi, simplicity, self-modification, status/understood]
source: "Agent frameworks landscape research + BabyAGI philosophy"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[../Knowledge Base/Principle - GVU Pattern Is Universal for Self-Improvement]]"
---

# BabyAGI: Build the Simplest Thing That Can Build Itself

> [!note] Key Insight
> BabyAGI's philosophy: "build the simplest thing that can build itself." The core loop must be simple enough to be self-modifiable. If the loop is too complex, the agent can't improve its own methodology. scientist-cc's pure-markdown approach embodies this — Claude can read and rewrite any workflow file.

## Core Architecture
- Task creation → Task prioritization → Task execution → Repeat
- Everything is a text task — no compiled code, no binary state
- The agent can modify its own task list and priorities

## Key Insight for scientist-cc
Our framework IS self-modifiable because it's pure markdown:
- Claude can edit `loop.md` to change the R&D process
- Claude can edit `self-evolution.md` to upgrade the self-evolution mechanism
- Claude can add new reference docs to expand methodology
- This is literally what we've been doing — 143 commits of the framework modifying itself

## The Tension: Simplicity vs Completeness
- BabyAGI started ultra-simple (< 100 lines) and grew complex
- scientist-cc started at 420 lines and grew to 5,600+
- The key is: the CORE LOOP must remain simple even as the framework grows
- Our loop is still 11 steps — adding features around the loop, not inside it

## Cross-Links
- [[supports::../Knowledge Base/Principle - GVU Pattern Is Universal for Self-Improvement]] — task loop = GVU pattern
- [[extends::AI Agent Frameworks Landscape]] — simplicity principle from BabyAGI ecosystem
