---
title: "AgentDebug: Targeted Error Correction (24% Improvement)"
tags: [research, agentdebug, error-correction, module-classification, status/understood]
source: "AI self-improvement frameworks research + AgentDebug 2025 paper"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Self-Improvement Frameworks]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
---

# AgentDebug: Targeted Error Correction

> [!note] Key Insight
> AgentDebug (2025) demonstrates that root-cause-specific corrections achieve 24% higher accuracy than unguided self-reflection. Classifying errors by their originating module and applying targeted fixes is measurably more effective than generic "what did I do wrong?" reflection.

## Key Finding
- Broad reflection: "I made a mistake. I'll try harder next time." → weak improvement
- Targeted correction: "Memory module produced a stale fact. Fix: add last_verified to the note and re-validate." → 24% more effective

## How We Implement This
Our 4-module error taxonomy directly implements AgentDebug's insight:
- **Memory errors** → fix vault notes, add verification metadata
- **Reasoning errors** → add CLAUDE.md rules with rationale
- **Planning errors** → adjust loop or decision criteria
- **Action errors** → fix tool usage patterns

Each self-evolution rule includes Module → Type → Rule → Why → When — making every correction targeted.

## What AgentDebug Doesn't Address
- How to PREVENT errors before they happen (our adversarial validation does this)
- How to consolidate corrections across time (our meta-evolution rules-about-rules does this)
- How to enforce corrections structurally (our Stop hook does this)

## Cross-Links
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — this is the source paper for that principle
- [[extends::AI Self-Improvement Frameworks]] — AgentDebug is one of the GVU implementations
- [[supports::../Knowledge Base/Principle - Structural Enforcement Beats Instructional]] — AgentDebug corrections are instructional; we add structural enforcement
