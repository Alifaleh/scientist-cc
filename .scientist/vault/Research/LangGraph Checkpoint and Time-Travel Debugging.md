---
title: "LangGraph: Checkpointing and Time-Travel Debugging"
tags: [research, langgraph, checkpointing, time-travel, graph-workflow, status/understood]
source: "Agent frameworks landscape research + LangGraph documentation"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[Experiment Checkpointing via Git]]"
---

# LangGraph: Checkpointing and Time-Travel Debugging

> [!note] Key Insight
> LangGraph's checkpoint-based persistence enables time-travel debugging: replay any past agent state, branch from it, and compare outcomes. We implemented this with `git tag checkpoint/pre-[name]` — simpler but equally effective for our markdown-based workflow.

## LangGraph's Approach
- Graph-based workflow: nodes = agent steps, edges = transitions
- Every node execution saved as a checkpoint
- Can replay from any checkpoint with modified inputs
- Enables branching: "what if I had taken a different path at step 3?"

## Our git-Based Equivalent
- `git tag checkpoint/pre-experiment` = save state before experiment
- `scientist/experiment/<name>` branch = isolated experiment
- `git diff checkpoint/pre..checkpoint/post` = compare states
- `git checkout checkpoint/pre-experiment` = replay from checkpoint

## What LangGraph Does Better
- Automatic checkpointing at every step (we only checkpoint at experiment boundaries)
- Visual graph representation of the workflow
- Built-in branching from any checkpoint

## What We Do Better
- Zero infrastructure (git vs. their persistence layer)
- Human-readable history (git log vs. opaque checkpoints)
- Full vault context at every checkpoint (our notes persist, their node state is ephemeral)

## Cross-Links
- [[supports::Experiment Checkpointing via Git]] — our approach validated by LangGraph's patterns
- [[extends::AI Agent Frameworks Landscape]] — LangGraph insight applied to our workflow
