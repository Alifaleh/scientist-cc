---
name: data-science-checklist
description: Comprehensive data science anti-stupidity checklists. Use when doing ANY data analysis, ML modeling, feature engineering, or statistical testing. Triggers on data loading, model training, feature creation, or results reporting. Prevents overfitting, data leakage, regime blindness, and premature conclusions.
---

# Data Science Anti-Stupidity Skill

Enforce rigorous data science methodology. This skill activates whenever Claude works with data, trains models, engineers features, or reports results.

## When to Use This Skill

Trigger when you see ANY of these:
- Loading a CSV, DataFrame, or dataset
- Creating features or indicators
- Training any ML model
- Reporting accuracy, performance, or results
- Making claims about patterns in data

## The 5-Gate System (MUST pass all before proceeding)

### Gate 1: Before Loading Data
- [ ] Hypothesis written with causal mechanism ("X predicts Y BECAUSE Z")
- [ ] Success metric defined with specific threshold
- [ ] Falsification criteria defined
- [ ] Sample size requirements calculated

### Gate 2: After Loading Data (MANDATORY AUDIT)
```python
# RUN THIS EVERY TIME
print(f"Shape: {df.shape}")
print(f"Date range: {df.index.min()} to {df.index.max()}")
print(f"Missing: {df.isnull().sum().sum()}")
print(f"Regimes: {df['regime'].value_counts() if 'regime' in df else 'NOT LABELED'}")
```
- [ ] Data shape and types documented
- [ ] Missing values addressed
- [ ] Regimes identified and labeled (30+ samples per regime)
- [ ] Distributions plotted for ALL variables
- [ ] No obvious data quality issues

### Gate 3: Before Training Any Model
- [ ] Train/test split is TEMPORAL (not random) for time series
- [ ] Normalization done AFTER split (fit on train only)
- [ ] Features checked for leakage (no future data)
- [ ] Baseline established (random, mean, naive, linear)
- [ ] Feature count < sqrt(n_train) / 2

### Gate 4: After Training (VALIDATION GAUNTLET)
- [ ] Out-of-sample performance reported (NOT in-sample)
- [ ] Performance breakdown BY REGIME
- [ ] Statistical significance: p < 0.05 with Bonferroni correction
- [ ] Confidence intervals on all metrics
- [ ] Beats ALL baselines (random, mean, naive, linear)
- [ ] Walk-forward test shows no degradation
- [ ] Sensitivity analysis: stable to ±10% parameter changes

### Gate 5: Before Reporting Results
- [ ] ALL experiments documented (including failures)
- [ ] Confidence intervals included
- [ ] Limitations stated explicitly
- [ ] No cherry-picking (report mean ± std, not best run)
- [ ] Honest assessment: "This works because..." or "This doesn't work because..."

## Red Flags (STOP immediately if you see these)

- In-sample R² > 0.9 → almost certainly overfit
- Train accuracy >> test accuracy (gap > 10%) → overfit
- Model only works in one regime → regime-dependent, not general
- Removing one feature collapses performance → possible leakage
- Results "too good to be true" (> 90% on hard problems) → check everything
- Random train/test split on time series → INVALID, redo with temporal split

## Quick Reference: Sample Size Requirements

| Analysis | Minimum per group/regime |
|----------|------------------------|
| Basic statistics | 30 |
| ML classification | 100 per class |
| Time series regime | 30 per regime |
| Neural network | 1,000+ total |
| Feature selection | 10x features |

## The 10 Commandments of Not Being Stupid

1. Thou shalt not train and test on the same data
2. Thou shalt not use random CV on time series
3. Thou shalt not report in-sample performance
4. Thou shalt not use features from future data
5. Thou shalt not normalize before splitting
6. Thou shalt not tune on the test set
7. Thou shalt not claim success without a baseline
8. Thou shalt not ignore class imbalance
9. Thou shalt not report without confidence intervals
10. Thou shalt not deploy without walk-forward testing
