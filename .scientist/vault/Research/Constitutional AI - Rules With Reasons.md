---
title: "Constitutional AI: Rules With Reasons Generalize Better"
tags: [research, constitutional-ai, anthropic, rules, reasons, status/understood]
source: "AI self-improvement research + Anthropic 2026 publication"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Self-Improvement Frameworks]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
---

# Constitutional AI: Rules With Reasons Generalize Better

> [!note] Key Insight
> Anthropic's 2026 Constitutional AI research confirms: rules that include explanations (WHY the rule exists) generalize to novel situations better than bare rules. Every CLAUDE.md self-evolution rule should include Rule + Why + When — not just the rule itself.

## The Finding
- Bare rule: "Don't overfit" → agent doesn't know when it applies
- Rule with reason: "Don't overfit. **Why:** implemented from 1 day of data. **When:** any time you act on a data pattern." → agent generalizes to new situations

## Our Implementation
Every self-evolution rule in CLAUDE.md follows: Module → Type → Rule → Why → When
- **Module:** which system component produced the error
- **Type:** classification within the module
- **Rule:** the specific, actionable directive
- **Why:** the triggering mistake (story)
- **When:** applicability conditions

This is MORE structured than Constitutional AI's approach — we add module classification + applicability conditions on top of the reason.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — reasons make corrections more targeted
- [[extends::AI Self-Improvement Frameworks]] — Constitutional AI is one approach to self-alignment
