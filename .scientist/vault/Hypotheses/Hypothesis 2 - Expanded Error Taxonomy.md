---
title: "Hypothesis 2: Module-Based Error Taxonomy Improves Self-Evolution"
tags: [hypothesis, status/untested, self-evolution]
date: 2026-03-31
related:
  - "[[../Research/AI Self-Improvement Frameworks]]"
---

# Hypothesis 2: Module-Based Error Taxonomy Improves Self-Evolution

## Statement
"When the self-evolution protocol classifies errors by originating module (Memory/Reasoning/Planning/Action) instead of just error type, the resulting rules will be more targeted and effective — because AgentDebug (2025) shows targeted correction achieves 24% higher accuracy than broad reflection."

## Mechanism (WHY)
Current taxonomy (6 types) tells you WHAT went wrong but not WHERE in the system it originated. Module classification enables:
- **Memory errors** → fix vault notes, add verification metadata
- **Reasoning errors** → add rules to CLAUDE.md, update methodology
- **Planning errors** → adjust loop, change step order or priorities
- **Action errors** → fix tool usage, add tool constraints

This is more actionable than "I was bruteforcing" because it points to the SPECIFIC system component that needs correction.

## Falsification Criteria
After implementing the expanded taxonomy:
- If rules written with module classification are no more specific than before → FALSIFIED
- If the module classification adds confusion rather than clarity → FALSIFIED
- If error classification takes significantly longer without benefit → FALSIFIED

## Confirmation Criteria
- Rules written after module classification include specific component fixes (not just "don't do X")
- Same error class doesn't recur in the same module after a rule is written
- The self-evolution reference doc becomes more useful for diagnosing new errors

## Implementation Plan
1. Expand self-evolution.md with 4-module/16-type taxonomy
2. Update EVOLVE step in loop.md to classify by module first, then type
3. Update CLAUDE.md rule template to include: Module → Type → Rule → Reason → Trigger

## Status: UNTESTED
