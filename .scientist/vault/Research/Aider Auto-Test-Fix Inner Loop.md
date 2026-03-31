---
title: "Aider: Auto-Test-and-Fix Inner Loop for Experiments"
tags: [research, aider, testing, inner-loop, auto-fix, status/understood]
source: "Agent frameworks landscape research + Aider documentation"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[../Knowledge Base/Principle - Continuous Deployment Accelerates Learning]]"
---

# Aider: Auto-Test-and-Fix Inner Loop

> [!note] Key Insight
> Aider's auto-test-and-fix loop (write code → run tests → fix failures → repeat) is a simple but effective self-correction pattern. scientist-cc could adopt this as the inner loop within IMPLEMENT: after each code change, run tests, fix failures automatically, then measure results.

## The Pattern
```
WHILE tests fail:
  analyze failure
  fix code
  run tests again
```

## What Makes Aider Effective
- Single focused interface (code editing only — ACI principle)
- Automatic test detection and execution
- No cross-experiment learning (limitation we don't have)

## Application to scientist-cc
Our IMPLEMENT step could include an inner loop:
1. Make change → 2. Run relevant tests → 3. If fails, fix → 4. Repeat until green → 5. Then measure experiment results

This is complementary to our outer R&D loop — the inner loop handles implementation quality while the outer loop handles research direction.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Continuous Deployment Accelerates Learning]] — tight feedback loops accelerate all learning
- [[extends::AI Agent Frameworks Landscape]] — Aider's simplicity is its strength
