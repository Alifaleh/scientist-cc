---
title: "Principle: Interface Quality Over Tool Quantity"
tags: [principle, tool-design, architecture]
derived_from:
  - "[[../Research/AI Agent Frameworks Landscape]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Interface Quality Over Tool Quantity

> [!note] Core Principle
> How an agent interfaces with its tools matters as much as the model's capability. Better interfaces to fewer tools outperforms more tools with poor interfaces. (SWE-agent ACI insight)

## Evidence
- [[../Research/AI Agent Frameworks Landscape|Frameworks research]]: SWE-agent's custom Agent-Computer Interface showed that interface design significantly affects agent performance
- [[../Observations/Framework Self-Analysis|Self-analysis]]: Loop references visualization but no skill teaches how to do it well — the interface is missing
- AutoGPT added many tools but struggled with coordination; Aider focused on one interface (code editing) and excels

## Boundary Conditions
- This applies to R&D workflows, not general-purpose agents that need broad tool access
- Sometimes a new tool IS the right answer (e.g., Jupyter for data analysis)
- Interface quality means: clear inputs, predictable outputs, good error messages, handles edge cases

## Connections
- [[supports::Principle - Dogfooding Is Superior Testing]]
- [[extends::SWE-agent ACI design philosophy]]
