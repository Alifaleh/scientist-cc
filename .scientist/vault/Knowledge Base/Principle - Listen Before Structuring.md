---
title: "Principle: Listen Before Structuring — Let Users Describe, Then Categorize"
tags: [principle, ux, init, user-experience]
derived_from:
  - "[[../Observations/User Feedback - Init Phase and Data Science Capabilities]]"
  - "[[../Research/SWE-agent Agent-Computer Interface Design]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Listen Before Structuring

> [!note] Core Principle
> When gathering information from users, ask an open-ended question FIRST and let them describe in their own words. Then ask structured follow-ups only for what's missing. Forcing categories before understanding the user's mental model loses critical context.

## Evidence
- User feedback: "the framework didn't let me describe what I want" — forced selections skipped their vision
- SWE-agent ACI insight: interfaces should match how people think, not how systems categorize
- Init workflow fixed: open-ended "tell me everything" → then targeted clarifications

## Boundary Conditions
- Some users prefer structured choices — but starting open-ended captures MORE information
- Long descriptions need parsing — extract domain, goal, constraints from free text
- Follow-up questions should only cover gaps, never re-ask answered topics

## Connections
- [[supports::../Research/SWE-agent Agent-Computer Interface Design]] — ACI should match user mental models
- [[supports::Principle - Interface Quality Over Tool Quantity]] — the init IS an interface
