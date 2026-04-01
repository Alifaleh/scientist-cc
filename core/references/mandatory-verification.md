# Mandatory Verification Protocol

**Claude's #1 failure: skipping tests and verification to "finish faster."** This protocol makes verification NON-OPTIONAL. Every analysis MUST pass ALL checks before the scientist can claim results.

## Why Claude Skips Tests

1. **Task completion bias:** Training rewards finishing tasks, not verifying them
2. **Token economy:** Verification takes tokens, Claude's default minimizes output
3. **Optimism bias:** Claude assumes code works correctly without checking
4. **No consequence for skipping:** Without structural enforcement, there's no penalty for skipping

## The Fix: MANDATORY Checkpoints

The scientist CANNOT proceed to the next loop step without completing the verification checklist for the current step. Each checkpoint has specific, measurable criteria.

---

## Checkpoint 1: After Data Loading (before ANY analysis)

**YOU MUST RUN AND DOCUMENT ALL OF THESE:**

```python
# === MANDATORY DATA AUDIT ===
import pandas as pd
import numpy as np

def mandatory_data_audit(df, target_col=None):
    """Run this EVERY TIME you load data. No exceptions."""
    
    print("=" * 60)
    print("MANDATORY DATA AUDIT")
    print("=" * 60)
    
    # 1. Shape and types
    print(f"\n1. SHAPE: {df.shape[0]} rows x {df.shape[1]} columns")
    print(f"   Dtypes: {dict(df.dtypes.value_counts())}")
    
    # 2. Missing values
    missing = df.isnull().sum()
    if missing.any():
        print(f"\n2. MISSING VALUES (CRITICAL):")
        for col in missing[missing > 0].index:
            pct = missing[col] / len(df) * 100
            print(f"   {col}: {missing[col]} ({pct:.1f}%)")
    else:
        print(f"\n2. MISSING VALUES: None ✓")
    
    # 3. Duplicates
    dupes = df.duplicated().sum()
    print(f"\n3. DUPLICATES: {dupes} {'⚠️ INVESTIGATE' if dupes > 0 else '✓'}")
    
    # 4. Date range (if datetime index)
    if hasattr(df.index, 'min') and hasattr(df.index, 'max'):
        print(f"\n4. DATE RANGE: {df.index.min()} to {df.index.max()}")
        if hasattr(df.index, 'freq'):
            print(f"   Frequency: {df.index.freq}")
    
    # 5. Target distribution
    if target_col and target_col in df.columns:
        print(f"\n5. TARGET ({target_col}):")
        print(f"   Mean: {df[target_col].mean():.4f}")
        print(f"   Std:  {df[target_col].std():.4f}")
        if df[target_col].nunique() < 10:
            print(f"   Distribution: {dict(df[target_col].value_counts())}")
    
    # 6. Numeric summary
    print(f"\n6. NUMERIC SUMMARY:")
    for col in df.select_dtypes(include='number').columns[:10]:
        q01, q99 = df[col].quantile([0.01, 0.99])
        outliers = ((df[col] < q01) | (df[col] > q99)).sum()
        print(f"   {col}: [{df[col].min():.2f}, {df[col].max():.2f}] mean={df[col].mean():.2f} outliers={outliers}")
    
    print("\n" + "=" * 60)
    print("AUDIT COMPLETE — Review above before proceeding")
    print("=" * 60)
```

**DO NOT SKIP THIS.** If you load data and don't run the audit, you WILL make mistakes later.

---

## Checkpoint 2: After Feature Engineering (before modeling)

**YOU MUST VERIFY:**

- [ ] **Temporal integrity:** For EVERY feature, verify it uses only past data
  ```python
  # For each feature: assert feature_timestamp <= prediction_timestamp
  ```
- [ ] **No target leakage:** Correlation between features and target < 0.95
  ```python
  correlations = df[features].corrwith(df[target]).abs()
  leaky = correlations[correlations > 0.95]
  assert len(leaky) == 0, f"LEAKAGE DETECTED: {leaky}"
  ```
- [ ] **Feature distributions:** Plot histogram of EVERY feature — look for anomalies
- [ ] **Feature stability:** Check if feature distributions are similar across train/test
  ```python
  from scipy.stats import ks_2samp
  for feat in features:
      stat, p = ks_2samp(train[feat].dropna(), test[feat].dropna())
      if p < 0.05:
          print(f"⚠️ {feat}: distribution shift detected (p={p:.4f})")
  ```

---

## Checkpoint 3: After Model Training (before claiming results)

**YOU MUST VERIFY ALL OF THESE — NO EXCEPTIONS:**

- [ ] **Train vs test performance gap:**
  ```python
  gap = train_score - test_score
  if gap > 0.1:  # 10% gap
      print("⚠️ LIKELY OVERFIT: train-test gap > 10%")
  ```

- [ ] **Cross-validation variance:**
  ```python
  cv_scores = cross_val_score(model, X, y, cv=5)
  if cv_scores.std() > 0.1:
      print("⚠️ HIGH VARIANCE: model unstable across folds")
  ```

- [ ] **Baseline comparison:**
  ```python
  baseline_score = compute_baseline(y_test)  # random/mean/naive
  improvement = test_score - baseline_score
  print(f"Improvement over baseline: {improvement:.4f}")
  if improvement < 0.02:
      print("⚠️ MARGINAL: improvement < 2% over baseline")
  ```

- [ ] **Statistical significance:**
  ```python
  from scipy.stats import ttest_rel
  stat, p = ttest_rel(model_scores, baseline_scores)
  print(f"p-value: {p:.6f}")
  if p > 0.05:
      print("⚠️ NOT SIGNIFICANT at 95% confidence")
  ```

- [ ] **Performance by regime:**
  ```python
  for regime in df['regime'].unique():
      mask = df['regime'] == regime
      regime_score = evaluate(model, X[mask], y[mask])
      n_samples = mask.sum()
      print(f"Regime {regime}: score={regime_score:.4f} (n={n_samples})")
      if n_samples < 30:
          print(f"  ⚠️ INSUFFICIENT SAMPLES for this regime")
  ```

- [ ] **Confidence intervals:**
  ```python
  # Bootstrap confidence interval
  scores = []
  for _ in range(1000):
      idx = np.random.choice(len(y_test), len(y_test), replace=True)
      scores.append(evaluate(model, X_test[idx], y_test[idx]))
  ci_low, ci_high = np.percentile(scores, [2.5, 97.5])
  print(f"95% CI: [{ci_low:.4f}, {ci_high:.4f}]")
  ```

---

## Checkpoint 4: Before Reporting Results

**FINAL VERIFICATION — the scientist CANNOT report without:**

- [ ] All experiments documented (including FAILED ones)
- [ ] Out-of-sample results (not in-sample)
- [ ] Confidence intervals on all metrics
- [ ] Per-regime breakdown
- [ ] Baseline comparison
- [ ] Limitations stated explicitly
- [ ] Reproducibility: random seeds fixed, code documented

---

## How This Integrates with the Loop

| Loop Step | Required Checkpoint |
|-----------|-------------------|
| OBSERVE | Checkpoint 1 (Data Audit) |
| HYPOTHESIZE | Pre-hypothesis screening (5 gates) |
| VALIDATE | Checkpoint 2 (Feature Verification) + 9-point validation |
| IMPLEMENT | ML Pre-Flight (6 gates) + Checkpoint 3 (Model Verification) |
| LEARN | Checkpoint 4 (Reporting Verification) |

**Skipping ANY checkpoint = producing garbage. There are no shortcuts in science.**
