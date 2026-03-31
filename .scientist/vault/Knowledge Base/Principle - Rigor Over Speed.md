---
title: "Principle: Rigor Over Speed — Wrong Conclusions Are Worse Than No Conclusions"
tags: [principle, rigor, data-science, methodology]
derived_from:
  - "[[../Research/Data Science Rigor for Autonomous Agents]]"
  - "[[../Research/Cognitive Biases in LLM Agents]]"
  - "[[../Research/Hypothesis-Driven Development for AI Research]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Rigor Over Speed

> [!note] Core Principle
> A wrong conclusion that gets built on is worse than no conclusion at all. In data-driven work, always validate before acting: sample size, statistical significance, out-of-sample testing, baseline comparison. Speed means nothing if the foundation is wrong.

## Evidence
- [[../Research/Data Science Rigor for Autonomous Agents|Data science rigor]]: anti-overfitting checklist prevents cascading errors
- [[../Research/Cognitive Biases in LLM Agents|Cognitive biases]]: confirmation bias makes wrong conclusions feel right
- [[../Research/Hypothesis-Driven Development for AI Research|Hypothesis-driven development]]: 7 hypotheses, all research-backed, 0 wasted implementations

## Boundary Conditions
- Exploration phases can be less rigorous (generating hypotheses, not validating them)
- Quick prototypes are fine — but results from prototypes don't count as validated
- Don't let rigor become paralysis — validate ENOUGH, then act

## Connections
- [[supports::Principle - Targeted Correction Beats Broad Reflection]] — targeted correction requires accurate diagnosis
- [[extends::Principle - GVU Pattern Is Universal for Self-Improvement]] — the Verifier role must be rigorous
