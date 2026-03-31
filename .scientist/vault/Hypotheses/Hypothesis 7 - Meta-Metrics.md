---
title: "Hypothesis 7: Meta-Metrics Enable Objective Progress Tracking"
tags: [hypothesis, status/untested, metacognition, phase-4]
date: 2026-03-31
related:
  - "[[../Research/AI Self-Improvement Frameworks]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
---

# Hypothesis 7: Meta-Metrics Enable Objective Progress Tracking

## Statement
"When the framework tracks meta-metrics (vault growth rate, link density, principle extraction rate, hypothesis confirmation ratio, error frequency trend), the scientist can objectively measure whether the R&D loop is producing real progress — preventing the illusion of productivity from high commit counts alone."

## Mechanism (WHY)
Currently we measure: commit count, version number, note count. These are activity metrics, not progress metrics. Real progress = knowledge quality improving. Proposed meta-metrics:

1. **Link density** — average links per note (higher = more connected knowledge)
2. **Principle extraction rate** — principles per N observations (higher = better consolidation)
3. **Hypothesis confirmation ratio** — confirmed / (confirmed + falsified) (too high = not testing risky enough hypotheses)
4. **Error frequency trend** — self-evolution rules per iteration (should decrease over time)
5. **Vault coverage** — % of open questions that have related research notes

## Implementation
Add a `--metrics` flag to generate_index.py that computes and prints these meta-metrics from vault-index.json and state.json.

## Status: UNTESTED
