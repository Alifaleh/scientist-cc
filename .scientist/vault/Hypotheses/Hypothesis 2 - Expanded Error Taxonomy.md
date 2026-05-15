---
title: "Hypothesis 2: Module-Based Error Taxonomy Improves Self-Evolution"
tags: [hypothesis, status/confirmed, self-evolution]
date: 2026-03-31
last_verified: 2026-05-16
evolved_on: 2026-05-16
related:
  - "[[../Research/AI Self-Improvement Frameworks]]"
  - "[[../Observations/Dogfood Bug - v3.2.0 Stop Hook Didn't Actually Block]]"
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

## Status: CONFIRMED (2026-05-16, after 6 weeks of accumulated evidence)

## Empirical Evidence (post-implementation)
The 4-module taxonomy has been live in `core/references/self-evolution.md` and `core/templates/CLAUDE-scientist.md` since v0.6 (April 2026). After 6 weeks of accumulated evidence:

**Confirmation criterion 1: rules include specific component fixes — MET.**
Every rule in CLAUDE.md (Rules 1–11) opens with `[Module → Type]` and includes both a `**Why:**` causal narrative and a `**When:**` applicability condition. Examples:
- Rule 1: `[Reasoning → confirmation bias]`
- Rule 8: `[Action → automation bias]`
- Rule 10: `[Memory → stale knowledge / Action → tool misuse]`
- Rule 11: `[Memory → memory poisoning / Reasoning → distractor susceptibility]`

The Module classification consistently points at the SPECIFIC subsystem to fix. Rule 10 (added 2026-05-15) is a clean case: classified as Memory → stale knowledge, the fix was to add a re-verification cadence to external-platform assumptions — not a general "be careful" instruction.

**Confirmation criterion 2: same error class doesn't recur in the same module after a rule — MET.**
Rule 9 (Action → degenerate behavior) addressed the `echo "∞"` no-op loop pattern. In subsequent sessions including this one, the pattern has not recurred. When productive work runs out the framework writes a handoff or finds new work — never no-op tool calls.

**Confirmation criterion 3: self-evolution.md is more useful for diagnosing errors — MET.**
The Error Taxonomy by Module table in `thinking-methodology.md` has been referenced during real-time evolution decisions throughout v3.2/v3.3 iterations. Each dogfood-discovered bug was diagnosed by walking the table; the module determined WHERE the fix lived (hooks vs templates vs workflows vs tools).

**Falsification criteria reviewed: none triggered.** Classification has not added confusion; rules written with module tags are more specific, not less. Error classification adds minimal overhead (one line of metadata).

## Cross-Links Added Post-Confirmation
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]
- [[supports::../Knowledge Base/Principle - The Vault IS the Product]]
- [[extends::../Research/AgentDebug Targeted Error Correction]]
