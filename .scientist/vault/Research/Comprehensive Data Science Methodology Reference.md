---
title: "Comprehensive Data Science & Statistical Analysis Methodology Reference"
tags: [research, data-science, methodology, statistics, checklist, reference, status/complete, priority/critical]
source: "Synthesized from CRISP-DM, cross-validation literature, sample size determination theory, bootstrap/permutation test methodology, data leakage best practices, p-hacking prevention, regime detection via HMM"
date: 2026-04-01
last_verified: 2026-04-01
related:
  - "[[Data Science Rigor for Autonomous Agents]]"
  - "[[Why Claude Makes Stupid Data Science Decisions]]"
  - "[[Cognitive Biases in LLM Agents]]"
  - "[[Hypothesis-Driven Development for AI Research]]"
---

# Comprehensive Data Science & Statistical Analysis Methodology Reference

> [!tip] Purpose
> Actionable checklists, thresholds, and protocols for an autonomous AI scientist performing data analysis. Every section contains EXACT rules, not theory summaries. This is a reference document — consult it BEFORE and DURING any analysis.

---

## 1. DATA SCIENCE METHODOLOGY CHECKLIST (CRISP-DM Extended)

Based on CRISP-DM (the most widely-used analytics methodology), extended with AI-specific guardrails.

### Phase 1: Business/Research Understanding
- [ ] **State the question in ONE sentence.** If you can't, you don't understand it yet.
- [ ] **Define the success metric BEFORE touching data.** What number needs to improve? By how much?
- [ ] **Write the null hypothesis explicitly.** "There is no difference between X and Y."
- [ ] **Define what "failure" looks like.** What result would DISPROVE your hypothesis?
- [ ] **Identify confounders.** What else could explain the result besides your hypothesis?
- [ ] **Set the analysis plan BEFORE looking at data.** Pre-registration prevents p-hacking.

> [!danger] Red Flag
> If the success metric changes after seeing results, the analysis is invalid. This is called "moving the goalposts" and is a form of p-hacking.

### Phase 2: Data Understanding
- [ ] **Row count and column count.** How much data exists?
- [ ] **Time span covered.** Does it cover ALL relevant conditions?
- [ ] **Distribution of target variable.** Is it balanced? Skewed? Multi-modal?
- [ ] **Missing data audit.** What % is missing? Is missingness random or systematic?
- [ ] **Outlier detection.** IQR method or z-score >3. Are outliers real or errors?
- [ ] **Regime audit.** (See Section 3.) Does data cover all operating regimes?
- [ ] **Survivorship bias check.** Does the dataset only include "winners"?
- [ ] **Look-ahead bias check.** Could any data point only be known AFTER the prediction time?
- [ ] **Temporal ordering verification.** Is the data correctly sorted by time?

### Phase 3: Data Preparation
- [ ] **Train/validation/test split BEFORE any processing.** Typical: 60/20/20 or 70/15/15.
- [ ] **For time series: NEVER shuffle.** Use temporal splits only.
- [ ] **Fit transformations on training data ONLY.** Apply learned parameters to val/test.
- [ ] **Handle missing data with method appropriate to mechanism:** MCAR -> mean/median; MAR -> multiple imputation; MNAR -> model-based or domain expertise.
- [ ] **Encode categoricals consistently** across train/val/test (handle unseen categories).
- [ ] **Document every transformation** with rationale.

### Phase 4: Modeling
- [ ] **Start with a baseline.** Mean prediction, random, or simple heuristic.
- [ ] **Train on training set ONLY.**
- [ ] **Tune hyperparameters on validation set ONLY** (or use nested CV).
- [ ] **NEVER use the test set for any decision.** It is touched exactly ONCE, at the very end.
- [ ] **Compare multiple model families** (don't assume the first one is best).
- [ ] **Track ALL experiments** including failures.

### Phase 5: Evaluation
- [ ] **Report test set performance** (the held-out set never used in training or tuning).
- [ ] **Report confidence intervals**, not just point estimates.
- [ ] **Statistical significance test** vs baseline (see Section 7).
- [ ] **Effect size** alongside p-value (see Section 7).
- [ ] **Check performance across regimes** (see Section 3).
- [ ] **Residual analysis.** Are errors random or patterned?
- [ ] **Calibration check.** Does the model's confidence match actual accuracy?

### Phase 6: Deployment/Documentation
- [ ] **Document assumptions and limitations.**
- [ ] **Define monitoring metrics** and drift detection thresholds.
- [ ] **Set retraining triggers** (performance degradation thresholds).
- [ ] **Version the model, data, and code together.**

---

## 2. COMMON DATA SCIENCE MISTAKES BY AI AGENTS

These are the specific failure modes when an AI (including Claude) performs data analysis autonomously.

### Mistake 1: Confirmation Bias in Analysis
- **What happens:** Agent forms a hypothesis, then selectively reports evidence supporting it.
- **How to detect:** Check if negative results are reported. Check if alternative hypotheses were tested.
- **Prevention:** ALWAYS report results that CONTRADICT the hypothesis. Require adversarial validation — actively try to break your own conclusion.

### Mistake 2: Data Leakage
- **What happens:** Future information leaks into training data, producing unrealistically good results.
- **Sources of leakage:**
  - Target leakage: Feature is derived from or correlated with the target.
  - Train-test contamination: Preprocessing (scaling, imputation, feature selection) fit on full dataset.
  - Temporal leakage: Future data used to predict the past.
  - Group leakage: Same entity appears in both train and test sets.
- **Signs of leakage:** Accuracy >95% on a hard problem. Performance drops dramatically in production.
- **Prevention checklist:**
  - [ ] Split data BEFORE any preprocessing.
  - [ ] Fit all transformers on training data only.
  - [ ] For time series: train on past, test on future, NEVER the reverse.
  - [ ] Check if any feature has suspiciously high correlation (>0.95) with target.
  - [ ] Ask: "Would this feature be available at prediction time in production?"

### Mistake 3: P-Hacking / Data Dredging
- **What happens:** Testing many hypotheses until one is "significant" by chance.
- **How to detect:** Count the number of tests run. At alpha=0.05, 1 in 20 tests will be significant by chance.
- **Prevention:**
  - Pre-register hypotheses before analysis.
  - Apply Bonferroni correction: divide alpha by number of tests (alpha_adj = 0.05 / N_tests).
  - Or use Benjamini-Hochberg FDR procedure (less conservative): rank p-values, compare each to (rank/N_tests) * alpha.
  - Report ALL tests run, not just significant ones.

### Mistake 4: Overfitting to Noise
- **What happens:** Model memorizes training data patterns that don't generalize.
- **Signs:** Large gap between training performance and validation performance.
- **Prevention:** Use proper cross-validation (Section 5). Prefer simpler models. Regularize.

### Mistake 5: Survivorship Bias
- **What happens:** Analyzing only successful cases (stocks that still exist, companies that survived, strategies that worked).
- **Prevention:** Explicitly ask: "What is NOT in this dataset that should be?" Include failed cases.

### Mistake 6: Ignoring Base Rates
- **What happens:** Reporting a "99% accurate" model when the base rate is 99% (predicting majority class).
- **Prevention:** Always compare against a baseline. Use metrics appropriate for class imbalance (F1, AUC-ROC, precision-recall curve).

### Mistake 7: Narrative Fallacy
- **What happens:** Agent constructs a plausible story around random results.
- **Prevention:** Every causal claim requires: (a) statistical significance, (b) effect size, (c) a plausible mechanism. Without all three, it's correlation, not causation.

### Mistake 8: Impulsive Parameter Tuning
- **What happens:** Changing parameters without understanding WHY the current value is wrong.
- **Prevention (The Bruteforce Ban):**
  - Before changing ANY parameter, write: (1) Why the current value is wrong, (2) What the new value should be and WHY, (3) What you PREDICT will change.
  - If you can't do all three, go RESEARCH instead.

### Mistake 9: Single-Split Evaluation
- **What happens:** Evaluating on one train/test split and reporting that single number.
- **Prevention:** Use cross-validation. Report mean +/- standard deviation across folds.

### Mistake 10: Premature Conclusion
- **What happens:** Declaring a result after insufficient analysis.
- **Prevention:** Use the MANDATORY STOPPING CRITERIA below.

> [!warning] MANDATORY: Before Concluding ANY Analysis
> 1. Is the sample size sufficient? (Section 4)
> 2. Is the result statistically significant? (Section 7)
> 3. Is the effect size meaningful? (Section 7)
> 4. Does the result hold across regimes? (Section 3)
> 5. Has the result been validated out-of-sample? (Section 5)
> 6. Have alternative hypotheses been tested?
> 7. Has the result survived adversarial challenge?
> If ANY answer is NO, the conclusion is PREMATURE.

---

## 3. REGIME DETECTION AND COVERAGE

### What Are Regimes?
A "regime" is a distinct operating state of a system where the underlying dynamics change. In financial markets: bull, bear, sideways, high-volatility, low-volatility, crisis. In systems: normal operation, degraded, overloaded, recovery.

### Why Regime Coverage Matters
A model trained only on bull-market data WILL fail in bear markets. Any analysis that doesn't account for regime changes is fundamentally flawed. Results that hold in only one regime are regime-specific, not generalizable.

### Regime Detection Methods

**Method 1: Hidden Markov Models (HMM)**
- Standard approach for regime detection in time series.
- Models the system as switching between unobservable states (regimes), each with its own emission distribution.
- Use the Baum-Welch algorithm (EM) to fit parameters; Viterbi algorithm for most likely state sequence.
- Start with 2-3 states; use BIC/AIC to select optimal number.
- Implementation: `hmmlearn` (Python), `depmixS4` (R).

**Method 2: Rolling Statistics**
- Compute rolling mean, volatility, correlation over windows (e.g., 20, 60, 252 days).
- Classify regimes by thresholds: e.g., rolling vol > 1.5x median = "high volatility regime."
- Simpler than HMM but requires manual threshold setting.

**Method 3: Structural Break Detection**
- Chow test, CUSUM, Bai-Perron method for detecting breakpoints.
- Tests whether the relationship between variables changes at specific points in time.
- Use `ruptures` (Python), `strucchange` (R).

**Method 4: Clustering-Based**
- Extract features from rolling windows (returns, volatility, skewness, kurtosis, correlation).
- Cluster windows using k-means or DBSCAN.
- Each cluster = a regime. Label post-hoc based on characteristics.

### Regime Coverage Checklist
- [ ] **Identify all regimes** using at least one method above.
- [ ] **Count samples per regime.** Each regime needs >= 30 samples for basic statistics, >= 200 for reliable modeling.
- [ ] **Label regime boundaries** in your dataset.
- [ ] **Report results PER REGIME**, not just overall.
- [ ] **If any regime has <30 samples:** Flag as "insufficient data for this regime." Do NOT generalize.
- [ ] **Test if your model/strategy works in EVERY regime,** not just the dominant one.
- [ ] **Check for regime-dependent feature importance.** Features that matter in regime A may be noise in regime B.

> [!danger] Red Flags
> - Your dataset covers only 1-2 regimes (e.g., only bull market data since 2009).
> - 80%+ of your data is from a single regime (results will be dominated by that regime).
> - You have no crisis/extreme-event data (the model has never seen what it most needs to handle).
> - Performance varies >50% between regimes (the model is regime-dependent, not general).

### Minimum Data Requirements by Regime Type
| Regime Type | Minimum Samples | Recommended | Notes |
|---|---|---|---|
| Normal/dominant | 200+ | 1000+ | Usually not the problem |
| Secondary (e.g., bear) | 50+ | 200+ | Often underrepresented |
| Crisis/extreme | 30+ | 100+ | Rarest but most important |
| Transition periods | 30+ | 100+ | Often ignored entirely |

---

## 4. SAMPLE SIZE REQUIREMENTS

### General Rules of Thumb

| Analysis Type | Minimum Per Group | Recommended | Power Target |
|---|---|---|---|
| Two-sample t-test (large effect, d=0.8) | 26 | 42+ | 0.80 / 0.95 |
| Two-sample t-test (medium effect, d=0.5) | 64 | 105+ | 0.80 / 0.95 |
| Two-sample t-test (small effect, d=0.2) | 393 | 651+ | 0.80 / 0.95 |
| Chi-square test | 5+ per cell (expected) | 10+ per cell | N/A |
| Correlation significance | 30+ | 100+ | Depends on r |
| Regression (per predictor) | 10-20 per predictor | 50+ per predictor | Rule of thumb |
| Time series modeling | 50+ observations | 200+ | Depends on seasonality |
| Bootstrap | 20+ (absolute minimum) | 50+ original samples | N/A |
| Permutation test | 10+ per group | 20+ per group | Exact for small n |

### Cohen's d Reference Table (Two-Sample t-Test, alpha=0.05)

From sample size determination literature:

| Power | Small (d=0.2) | Medium (d=0.5) | Large (d=0.8) |
|---|---|---|---|
| 0.50 | 193 | 32 | 13 |
| 0.70 | 310 | 50 | 20 |
| 0.80 | 393 | 64 | 26 |
| 0.90 | 526 | 85 | 34 |
| 0.95 | 651 | 105 | 42 |
| 0.99 | 920 | 148 | 58 |

**These are PER GROUP.** Total sample = 2x for two-group comparison.

### Power Analysis Protocol
1. **Estimate expected effect size** from prior research or pilot study. If unknown, use d=0.5 (medium) as conservative default.
2. **Set desired power.** Standard: 0.80. High-stakes: 0.95.
3. **Set alpha.** Standard: 0.05. With multiple comparisons: apply Bonferroni.
4. **Calculate required n** using the formula or table above.
5. **If your actual n < required n:** DO NOT proceed with that test. Either collect more data or use a non-parametric alternative.

### Sample Size Formulas

**For comparing two means:**
```
n_per_group = (Z_alpha/2 + Z_beta)^2 * 2 * sigma^2 / delta^2
```
Where: Z_alpha/2 = 1.96 (for alpha=0.05), Z_beta = 0.842 (for power=0.80), sigma = standard deviation, delta = minimum detectable difference.

**For estimating a proportion:**
```
n = (Z^2 * p * (1-p)) / E^2
```
Where: Z = 1.96, p = estimated proportion (use 0.5 if unknown), E = margin of error.

### Practical Implementation (Python)
```python
from scipy.stats import norm
import numpy as np

def required_sample_size_two_means(effect_size_d, alpha=0.05, power=0.80):
    """Calculate required n PER GROUP for two-sample t-test."""
    z_alpha = norm.ppf(1 - alpha/2)
    z_beta = norm.ppf(power)
    n = 2 * ((z_alpha + z_beta) / effect_size_d) ** 2
    return int(np.ceil(n))

# Examples:
# Small effect: required_sample_size_two_means(0.2)  -> 394
# Medium effect: required_sample_size_two_means(0.5) -> 64
# Large effect: required_sample_size_two_means(0.8)  -> 26
```

> [!danger] Red Flags
> - n < 30 for any statistical test (except exact tests designed for small samples).
> - n < 10 per predictor in regression.
> - Claiming "significance" with n < 20.
> - Not reporting sample size at all.
> - Using a large-sample test (z-test) when n < 30 (use t-test instead).

---

## 5. CROSS-VALIDATION BEST PRACTICES

### Method Selection Guide

| Data Type | Recommended CV Method | NEVER Use |
|---|---|---|
| IID data (no time/spatial) | k-Fold (k=5 or 10) | N/A |
| Time series | Walk-forward (expanding/sliding window) | Random k-fold (breaks temporal order!) |
| Spatial data | Spatial blocking | Random k-fold (spatial autocorrelation!) |
| Small dataset (n < 100) | Leave-One-Out (LOOCV) | k-fold with k > n/5 |
| Hyperparameter tuning | **Nested CV** (MANDATORY) | Single-loop CV (optimistic bias!) |
| Grouped data (patients, users) | Group k-fold | Random k-fold (group leakage!) |
| Class imbalanced | Stratified k-fold | Regular k-fold (folds may miss minority class) |

### Nested Cross-Validation (CRITICAL for Model Selection)

**Why:** If you use the same CV loop to both select hyperparameters AND estimate performance, your performance estimate is optimistically biased. Nested CV eliminates this.

**Structure:**
```
Outer loop (k=5): Estimates generalization performance
  Inner loop (k=5): Selects best hyperparameters
    For each outer fold:
      1. Hold out outer test fold
      2. Run inner CV on remaining data to find best hyperparams
      3. Train model with best hyperparams on all non-test data
      4. Evaluate on outer test fold
  Report: mean +/- std of outer fold scores
```

**When nested CV is MANDATORY:**
- Comparing multiple model families (e.g., random forest vs. gradient boosting).
- Tuning hyperparameters and reporting performance in the same study.
- Any published or high-stakes result.

### Time Series Cross-Validation

**Walk-Forward (Expanding Window):**
```
Fold 1: Train [0..100],   Test [101..120]
Fold 2: Train [0..120],   Test [121..140]
Fold 3: Train [0..140],   Test [141..160]
...
```

**Sliding Window:**
```
Fold 1: Train [0..100],   Test [101..120]
Fold 2: Train [21..120],  Test [121..140]
Fold 3: Train [41..140],  Test [141..160]
...
```

**Rules for time series CV:**
- [ ] Training data is ALWAYS before test data temporally.
- [ ] Include a gap between train and test to prevent look-ahead (e.g., skip 1-5 periods).
- [ ] Test window should match your actual prediction horizon.
- [ ] Minimum 5 folds for stable estimates.
- [ ] Report performance across folds — if it degrades over time, the model is not stable.

### Cross-Validation Checklist
- [ ] **Choose the right CV method** based on data type (see table above).
- [ ] **Use stratification** for classification tasks.
- [ ] **Use nested CV** when tuning hyperparameters.
- [ ] **Never shuffle time series data.**
- [ ] **Report mean AND standard deviation** across folds.
- [ ] **Check fold-to-fold variance.** High variance = unstable model. CV std > 10% of mean = concern.
- [ ] **Verify no data leakage** between folds (preprocessing fitted per-fold, not globally).
- [ ] **k=5 or k=10** for standard problems. k=5 for expensive models, k=10 for cheap models.
- [ ] **For LOOCV:** Only use when n < 100 or when every sample matters. Beware: high variance estimator.

> [!danger] Red Flags
> - Using random k-fold on time series data.
> - Reporting a single train/test split as the final result.
> - Tuning hyperparameters inside the same CV loop used to report performance (needs nested CV).
> - CV score much better than held-out test score (data leakage in CV).
> - Very low CV variance (suspicious — may indicate leakage).

---

## 6. FEATURE ENGINEERING ANTI-OVERFITTING PROTOCOL

### The Leakage Taxonomy

| Leakage Type | Description | How to Detect | Prevention |
|---|---|---|---|
| **Target leakage** | Feature derived from or strongly correlated with target | Correlation > 0.95 with target; feature importance = 1 dominant feature | Ask: "Is this available BEFORE the outcome?" |
| **Train-test contamination** | Scaling/imputation/encoding fitted on full dataset | Performance drops when pipeline is refitted per-fold | Use sklearn Pipelines; fit ONLY on train |
| **Temporal leakage** | Future data used as feature | Feature uses future timestamps | Verify all features use only t-1 or earlier |
| **Group leakage** | Same entity in train and test | Duplicate entity IDs across splits | Use GroupKFold; split by entity |
| **Feature-selection leakage** | Feature selection using full dataset, then cross-validate | Remove feature selection from pipeline | Include feature selection INSIDE the CV loop |

### Feature Engineering Checklist

**Before creating ANY feature:**
- [ ] **State the causal hypothesis.** WHY should this feature predict the target?
- [ ] **Check temporal validity.** Is this feature available at prediction time?
- [ ] **Check for target contamination.** Is this feature derived from the target (directly or indirectly)?

**During feature creation:**
- [ ] **Compute on training set only.** Rolling averages, z-scores, etc. must not see validation/test data.
- [ ] **Use pipelines.** Wrap all transformations in sklearn Pipelines or equivalent.
- [ ] **Limit feature count.** Rule of thumb: n_features < n_samples / 10. More features than this increases overfitting risk sharply.
- [ ] **Group correlated features.** If features are >0.9 correlated, keep only one or use PCA.

**After feature creation:**
- [ ] **Feature importance sanity check.** If one feature dominates (>50% importance), investigate for leakage.
- [ ] **Permutation importance test.** Shuffle each feature and measure performance drop. True important features cause significant drops.
- [ ] **Cross-regime stability.** Does feature importance change across regimes? Regime-dependent features are fragile.
- [ ] **Null importance test.** Train model on shuffled target. Any feature that still appears "important" is spurious.

### Common Feature Engineering Mistakes for AI Agents

1. **Using the full dataset to compute rolling statistics** (should be training set only).
2. **Creating hundreds of interaction terms** then selecting "best" (p-hacking via feature space).
3. **Encoding categorical variables using target statistics** (target encoding) without proper regularization and within-fold computation.
4. **Not handling unseen categories** in test data.
5. **Using future data in lag features** (off-by-one errors in indexing).
6. **Computing features that embed the answer** (e.g., using "time until event" as a feature when predicting if event occurs).

> [!danger] Red Flags
> - A feature has >0.95 correlation with target.
> - Adding one feature improves performance by >20%.
> - Feature importance is concentrated in one or two features.
> - Model works perfectly on cross-validation but fails on truly new data.
> - Features include any future-derived information.

---

## 7. STATISTICAL SIGNIFICANCE TESTING — COMPLETE GUIDE

### Test Selection Flowchart

```
Is data normally distributed?
  YES → Are you comparing 2 groups?
    YES → Are groups independent?
      YES → Two-sample t-test (Student's or Welch's)
      NO  → Paired t-test
    NO → Are you comparing 3+ groups?
      YES → One-way ANOVA (then post-hoc: Tukey HSD)
  NO → Are you comparing 2 groups?
    YES → Are groups independent?
      YES → Mann-Whitney U test
      NO  → Wilcoxon signed-rank test
    NO → Are you comparing 3+ groups?
      YES → Kruskal-Wallis test (then post-hoc: Dunn's)

Not sure about distribution?
  → Use bootstrap confidence intervals (always valid)
  → Use permutation test (always valid, exact)
```

### Test-by-Test Reference

#### Student's / Welch's t-test
- **When:** Comparing means of 2 independent groups, approximately normal data.
- **Welch's preferred** when group variances may differ (use Welch's by default).
- **Assumptions:** Independence, approximately normal (robust if n > 30), continuous data.
- **Minimum n:** 20+ per group (10+ if effect is large). Use Welch's for unequal group sizes.
- **Report:** t-statistic, degrees of freedom, p-value, confidence interval, Cohen's d.

#### Mann-Whitney U Test
- **When:** Comparing 2 independent groups, ordinal or non-normal continuous data.
- **Assumptions:** Independence, ordinal or continuous, similar shape (for location shift interpretation).
- **Minimum n:** 10+ per group for meaningful results. With n < 20, use exact p-value (not asymptotic).
- **Effect size:** r = Z / sqrt(N), or probability of superiority = U / (n1 * n2).
- **Report:** U-statistic, p-value, effect size r, sample sizes.
- **Advantage over t-test:** Robust to outliers and non-normality. Use when in doubt.

#### Paired t-test / Wilcoxon Signed-Rank
- **When:** Before/after measurements on the same subjects.
- **Paired t-test:** If differences are approximately normal.
- **Wilcoxon signed-rank:** If differences are not normal.
- **Minimum n:** 15+ pairs for paired t-test; 10+ pairs for Wilcoxon.

#### Bootstrap Confidence Intervals
- **When:** Any situation. Distribution-free. Works for ANY statistic (mean, median, ratio, Sharpe ratio, etc.).
- **Method:**
  1. Resample with replacement from original data, B times.
  2. Compute statistic of interest for each resample.
  3. Use percentile method (2.5th and 97.5th percentile) for 95% CI.
  4. For more accuracy: use BCa (bias-corrected and accelerated) method.
- **Number of resamples (B):**
  - B = 1,000: Minimum for rough CI.
  - B = 5,000: Standard for publication.
  - B = 10,000+: For precise p-values or BCa intervals.
- **Minimum original sample:** 20+ for percentile method; 50+ for BCa.
- **Report:** Point estimate, 95% CI [lower, upper], number of bootstrap samples.

#### Permutation Test
- **When:** Any hypothesis test. Exact (no distributional assumptions). Gold standard for small samples.
- **Method:**
  1. Compute observed test statistic (e.g., difference in means).
  2. Pool all observations; randomly reassign to groups.
  3. Compute test statistic for each permutation.
  4. p-value = proportion of permuted statistics >= observed statistic.
- **Number of permutations:**
  - Exact: All possible permutations (feasible if n1 + n2 < 20).
  - Approximate: 10,000+ random permutations.
- **Minimum sample:** 5+ per group (exact test). Even works with very small n.
- **Advantage:** No assumptions about distribution. Exact p-values for small samples.
- **Report:** Observed statistic, p-value, number of permutations.

### Multiple Comparisons Correction

When running N tests, the probability of at least one false positive = 1 - (1 - alpha)^N.

| N tests | P(at least 1 false positive) at alpha=0.05 |
|---|---|
| 1 | 5.0% |
| 5 | 22.6% |
| 10 | 40.1% |
| 20 | 64.2% |
| 50 | 92.3% |
| 100 | 99.4% |

**Correction methods (in order of conservatism):**

1. **Bonferroni:** Divide alpha by N. Simple but very conservative. Use when N < 20.
   - alpha_adj = 0.05 / N
2. **Holm-Bonferroni (step-down):** Less conservative than Bonferroni, still controls FWER.
   - Sort p-values ascending. Compare smallest to alpha/N, second to alpha/(N-1), etc.
   - Stop when first non-rejection.
3. **Benjamini-Hochberg (FDR):** Controls false discovery rate, not family-wise error rate. More powerful.
   - Sort p-values ascending. For rank i, compare p_i to (i/N)*alpha.
   - Find largest i where p_i <= (i/N)*alpha. Reject all hypotheses 1..i.
   - **Use this as default** for exploratory analysis with many tests.

### Effect Size Reference

**Cohen's d (difference in means):**
| d | Interpretation |
|---|---|
| 0.01 | Very small |
| 0.20 | Small |
| 0.50 | Medium |
| 0.80 | Large |
| 1.20 | Very large |
| 2.00 | Huge |

**Correlation coefficient r:**
| r | Interpretation |
|---|---|
| 0.10 | Small |
| 0.30 | Medium |
| 0.50 | Large |

**Eta-squared (ANOVA):**
| eta^2 | Interpretation |
|---|---|
| 0.01 | Small |
| 0.06 | Medium |
| 0.14 | Large |

### Statistical Significance Checklist
- [ ] **Choose the right test** using the flowchart above.
- [ ] **Check assumptions** (normality, independence, equal variances).
- [ ] **Set alpha BEFORE testing.** Default: 0.05. Exploratory: 0.10. Confirmatory: 0.01.
- [ ] **Apply multiple comparisons correction** if running more than one test.
- [ ] **Report BOTH p-value AND effect size.** Statistical significance without practical significance is useless.
- [ ] **Report confidence intervals.** They are more informative than p-values.
- [ ] **For borderline results (0.01 < p < 0.10):** Report as "suggestive" or "marginal." NEVER as "significant" or "not significant" — these are arbitrary boundaries.
- [ ] **For non-significant results:** This means "not enough evidence to reject H0," NOT "H0 is true."
- [ ] **When in doubt:** Use bootstrap CI + permutation test. They work for everything.

> [!danger] Red Flags
> - Reporting p-value without effect size.
> - Reporting "significant" result without specifying alpha or correction method.
> - p-value of exactly 0.05 or 0.049 (suspicious precision).
> - Claiming significance after running 20+ tests without correction.
> - Using parametric test on clearly non-normal data with n < 30.
> - Interpreting non-significance as "no effect" rather than "insufficient evidence."
> - Cherry-picking which comparisons to report.

---

## 8. MASTER ANALYSIS PROTOCOL (COMPLETE WORKFLOW)

This is the step-by-step protocol an autonomous AI scientist MUST follow for ANY data analysis.

### PRE-ANALYSIS (Do Once, Before Touching Data)
1. Write the research question in one sentence.
2. Write the null hypothesis.
3. Write the alternative hypothesis.
4. Define the success metric and minimum meaningful effect size.
5. Choose the statistical test(s) you will use.
6. Calculate required sample size (Section 4).
7. Define what would DISPROVE your hypothesis.

### ANALYSIS (Execute Sequentially)
8. Load and audit data (Section 1, Phase 2).
9. Detect regimes (Section 3).
10. Split data: train/val/test (Section 1, Phase 3).
11. Engineer features on training set only (Section 6).
12. Build baseline model.
13. Build candidate model(s).
14. Cross-validate with appropriate method (Section 5).
15. Select best model via nested CV.

### POST-ANALYSIS (Before Drawing ANY Conclusion)
16. Evaluate on held-out test set (touched for the first time).
17. Run statistical significance test vs baseline (Section 7).
18. Calculate effect size (Section 7).
19. Check performance per regime (Section 3).
20. Apply multiple comparisons correction if applicable (Section 7).
21. Run adversarial validation: actively try to break the result.
22. Check residuals for patterns.

### REPORTING (Mandatory Items)
23. Sample size (total and per group/regime).
24. All tests run (including non-significant ones).
25. P-values with correction method.
26. Effect sizes with interpretation.
27. Confidence intervals.
28. Performance per regime.
29. Known limitations and assumptions.
30. What would change the conclusion.

---

## Cross-Links
- [[supports::Data Science Rigor for Autonomous Agents]] — this document provides the detailed reference that note's checklists are based on
- [[supports::Why Claude Makes Stupid Data Science Decisions]] — Section 2 directly addresses every failure mode identified there
- [[supports::Hypothesis-Driven Development for AI Research]] — the Master Protocol (Section 8) is hypothesis-driven by design
- [[supports::Cognitive Biases in LLM Agents]] — Section 2 maps each bias to detection and prevention methods

*Last updated: 2026-04-01*
