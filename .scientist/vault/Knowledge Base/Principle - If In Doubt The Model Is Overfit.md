---
title: "Principle: If In Doubt, The Model Is Overfit"
tags: [principle, overfitting, ml, data-science, anti-stupidity]
derived_from:
  - "[[../Research/Why Claude Makes Stupid Data Science Decisions]]"
  - "[[../Research/Data Science Canonical Bibliography]]"
date: 2026-04-01
last_verified: 2026-04-01
---

# Principle: If In Doubt, The Model Is Overfit

> [!note] Core Principle
> When a model shows good results, the DEFAULT assumption should be that it's overfit — until proven otherwise through out-of-sample testing, regime analysis, and statistical significance. Optimism about model performance is the most expensive bias in data science.

## The Overfitting Decision Tree

```
Is train accuracy >> test accuracy?
  YES → Overfit. Reduce model complexity or get more data.
  NO ↓

Does performance vary wildly across CV folds?
  YES → Overfit to specific data subsets. Investigate.
  NO ↓

Does it work in ALL regimes?
  NO → Regime-dependent. Not generalizable.
  YES ↓

Does removing any single feature collapse performance?
  YES → Likely leaking through that feature. Investigate.
  NO ↓

Is the performance "too good to be true" (>90% on a hard problem)?
  YES → Almost certainly overfit or leaked.
  NO ↓

Does it beat a simple baseline by a REASONABLE margin (5-20%)?
  YES → Might be real. Run walk-forward test.
  NO (too much better) → Suspicious. Double-check everything.
```

## Minimum Viable Proof That It's NOT Overfit
1. Out-of-sample test on TRULY unseen data → passes
2. Performance breakdown by regime → works in ALL regimes
3. Walk-forward test → performance doesn't degrade over time
4. Different random seeds → similar results (low variance)
5. Feature ablation → no single feature is carrying everything
6. Sensitivity analysis → small input changes → small output changes

**Until ALL 6 pass, assume it's overfit.**

## Connections
- [[supports::Principle - Think Before You Compute]]
- [[supports::Principle - Rigor Over Speed]]
- [[supports::Principle - Every Regime Must Be Represented]]
