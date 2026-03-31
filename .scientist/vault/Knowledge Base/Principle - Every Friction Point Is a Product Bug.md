---
title: "Principle: Every Friction Point Is a Product Bug When Dogfooding"
tags: [principle, dogfooding, product-quality, user-experience]
derived_from:
  - "[[../Research/Dogfooding Methodology for Framework Development]]"
  - "[[../Observations/User Feedback - Init Phase and Data Science Capabilities]]"
  - "[[../Observations/Tool Verification - Session 1]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Every Friction Point Is a Product Bug

> [!note] Core Principle
> When using a tool to improve itself, EVERY friction point the scientist encounters IS a product bug that must be fixed — not worked around. This R&D effort found 6 bugs through dogfooding that no test would catch, plus 2 UX issues from user feedback (init questions, AskUserQuestion vs plain text).

## Evidence
- 6 bugs found through dogfooding (tools install, Jupyter MCP, npm cache, pdf_reader Unicode, MCP npmignore, init questions)
- 2 UX improvements from user feedback (open-ended first, no AskUserQuestion for descriptions)
- Every bug fix became a framework improvement committed and deployed

## Connections
- [[extends::../Research/Dogfooding Methodology for Framework Development]]
- [[supports::Principle - Dogfooding Is Superior Testing]]
- [[supports::Principle - Listen Before Structuring]]
