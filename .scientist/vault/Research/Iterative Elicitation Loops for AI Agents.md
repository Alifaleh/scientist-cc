---
title: "Iterative Elicitation Loops: Gap Analysis Until Complete Understanding"
tags: [research, elicitation, gap-analysis, init-design, user-interaction, status/understood]
source: "User feedback + requirements engineering + dogfooding observations"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Information Elicitation Best Practices]]"
  - "[[../Knowledge Base/Principle - Listen Before Structuring]]"
  - "[[../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]"
---

# Iterative Elicitation Loops

> [!note] Key Insight
> A single round of questions is never enough. The init workflow must iterate: describe → gap analysis → ask → respond → re-analyze → ask again → until ALL gaps filled. User feedback proved that even after fixing the open-ended question, Claude skipped the follow-up questions entirely.

## The Pattern
```
WHILE knowledge_gaps > 0:
  analyze(what_i_know vs what_i_need)
  ask(biggest_gap)
  wait(user_response)
  update(knowledge)
```

## Why Single-Round Fails
- Users describe what's top-of-mind, not what's comprehensive
- Important constraints are often unstated (assumed obvious)
- Domain-specific requirements only emerge through probing

## Our Implementation
Init Step 2.5: 8-item checklist, iterative loop, minimum 3-5 questions even if description seems complete.

## Cross-Links
- [[supports::Information Elicitation Best Practices]] — iterative IS the best practice
- [[supports::../Knowledge Base/Principle - Listen Before Structuring]]
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]
