---
name: feature-engineering
description: Anti-leakage feature engineering protocol. Use when creating features, indicators, transformers, or any derived variables for ML models. Prevents temporal leakage, target leakage, and train-test leakage. Ensures causal validity.
---

# Feature Engineering Anti-Leakage Skill

## The 3 Questions (EVERY feature must pass)

### 1. Is it CAUSAL?
Does changing this feature actually CAUSE the target to change?
- YES → Keep it, document the mechanism
- NO (just correlated) → It WILL stop working. Remove or document as fragile.

### 2. Is it TIMELY?
Can you compute this feature BEFORE you need the prediction?
- YES → Safe to use
- NO → You have TEMPORAL LEAKAGE. Remove immediately.

### 3. Is it STABLE?
Does this feature behave the same way across different regimes?
- YES → Robust feature
- NO → Regime-dependent. Document which regimes it works in.

## The 3 Types of Leakage

| Type | Detection | Prevention |
|------|-----------|------------|
| **Target leakage** | `corr(feature, target) > 0.95` | Never derive features from target |
| **Temporal leakage** | Feature uses data from after prediction time | Enforce `feature_time <= prediction_time` |
| **Train-test leakage** | Scaler fit on full data before split | ALWAYS: split → fit(train) → transform(both) |

## Leakage Audit Code

```python
def audit_features(df, features, target, time_col=None):
    """Run BEFORE training any model."""
    print("=== FEATURE LEAKAGE AUDIT ===")
    
    for feat in features:
        # Target leakage check
        r = abs(df[feat].corr(df[target]))
        if r > 0.95:
            print(f"🚨 TARGET LEAKAGE: {feat} (r={r:.3f})")
        elif r > 0.8:
            print(f"⚠️ SUSPICIOUS: {feat} (r={r:.3f}) — investigate")
        
        # Stability check across regimes
        if 'regime' in df.columns:
            regime_means = df.groupby('regime')[feat].mean()
            regime_stds = df.groupby('regime')[feat].std()
            cv = (regime_stds / regime_means.abs()).max()
            if cv > 2.0:
                print(f"⚠️ UNSTABLE: {feat} varies >2x across regimes")
    
    print("=== AUDIT COMPLETE ===")
```

## Feature Creation Checklist

- [ ] Feature has documented causal mechanism
- [ ] Feature uses only past data (no look-ahead)
- [ ] Correlation with target < 0.95 (no target leakage)
- [ ] Normalization will be done AFTER train/test split
- [ ] Feature is stable across regimes (or documented as regime-specific)
- [ ] Total features < sqrt(n_samples) / 2 (prevent overfitting)
