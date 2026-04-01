# Comprehensive Data Science Protocol

**This is the MANDATORY reference for ALL data-driven work.** Every step must be followed. Skipping steps = producing garbage that looks like science. A real scientist follows rigorous methodology — Claude must too.

## Part 1: Before You Touch Any Data

### 1.1 Define the Question as a Hypothesis
Before loading a single CSV or querying a single API:

**Write down:**
1. What specifically are you trying to predict/classify/understand?
2. WHY do you believe this is predictable? (mechanism, not hope)
3. What would DISPROVE your belief? (falsification criteria)
4. What's the baseline performance? (random, mean, naive model)
5. What's the MINIMUM improvement that would be practically useful?

**Red flag:** If you can't answer #2 (the mechanism), you're about to overfit to noise.

### 1.2 Understand the Data Generation Process
- WHO created this data and WHY?
- WHEN was it collected? (Time period matters enormously)
- HOW was it measured? (Measurement error, precision, frequency)
- WHAT is missing? (Survivorship bias, selection bias, missing regimes)

**Critical for financial data:** Is this data adjusted for splits, dividends, survivorship? Does it include delisted instruments?

### 1.3 Plan Your Experimental Design BEFORE Analyzing
- How will you split train/validation/test?
- What cross-validation scheme? (k-fold? time-series? nested?)
- What metrics will you use? (accuracy? Sharpe? F1? Which one and WHY?)
- What statistical tests will you run?
- How many experiments will you run? (For Bonferroni correction)

## Part 2: Data Audit Protocol

### 2.1 Size Assessment
| Data Size | What You Can Do | What You CANNOT Do |
|-----------|----------------|-------------------|
| < 30 rows | Descriptive statistics only | ANY modeling |
| 30-100 rows | Simple linear models, bootstrap CI | Neural networks, complex ensembles |
| 100-1,000 rows | Tree models, cross-validated | Deep learning, many features |
| 1,000-10,000 rows | Most ML methods viable | Marginal improvements from complexity |
| 10,000+ rows | Full ML toolkit available | Still need out-of-sample validation! |

### 2.2 Regime Coverage (CRITICAL for time series)
**Every time series has regimes. You MUST identify and sample from each:**

| Regime | Characteristics | How to Identify |
|--------|----------------|-----------------|
| Trending up | Sustained positive returns, low volatility | SMA slope > 0, ATR decreasing |
| Trending down | Sustained negative returns, fear spikes | SMA slope < 0, VIX > 20 |
| Range-bound | Oscillating, mean-reverting | ADX < 20, Bollinger Band width narrow |
| High volatility | Large swings both ways | ATR > 2x median, VIX > 30 |
| Crisis/shock | Extreme moves, correlations spike | Returns > 3σ, correlation > 0.8 |
| Low volatility | Grinding, small moves | ATR < 0.5x median, VIX < 15 |

**Anti-stupidity check:** If your training data only covers 1-2 regimes (e.g., only a bull market), your model WILL fail in other regimes. This is the #1 mistake.

**Protocol:**
1. Label every data point with its regime
2. Count samples per regime — minimum 30 per regime
3. If any regime has < 30 samples, get more data or acknowledge the gap
4. Stratify your train/test split BY REGIME (not random!)
5. Report performance PER REGIME, not just overall

### 2.3 Data Quality Checks
```python
# Run EVERY TIME before analysis
def data_audit(df):
    print(f"Shape: {df.shape}")
    print(f"Date range: {df.index.min()} to {df.index.max()}")
    print(f"Missing values:\n{df.isnull().sum()}")
    print(f"Duplicate rows: {df.duplicated().sum()}")
    print(f"Dtypes:\n{df.dtypes}")
    
    # Numeric columns
    for col in df.select_dtypes(include='number'):
        q1, q99 = df[col].quantile([0.01, 0.99])
        outliers = ((df[col] < q1) | (df[col] > q99)).sum()
        print(f"{col}: mean={df[col].mean():.4f}, std={df[col].std():.4f}, outliers={outliers}")
    
    # Check for look-ahead bias in features
    # If any feature has a future timestamp, STOP
```

### 2.4 Distribution Analysis
- Plot histogram of EVERY feature
- Plot histogram of target variable
- Check for class imbalance (if classification)
- Check for stationarity (if time series) — ADF test, KPSS test
- Check for autocorrelation — ACF/PACF plots

## Part 3: Feature Engineering (Without Leaking)

### 3.1 The Three Types of Data Leakage
| Type | What It Is | How to Detect | How to Prevent |
|------|-----------|--------------|----------------|
| **Target leakage** | Feature contains the answer | Correlation > 0.95 with target | Remove features derived from target |
| **Temporal leakage** | Feature uses future data | Feature timestamp > prediction time | Enforce causal ordering |
| **Train-test leakage** | Test data info in training | Normalization before split | ALWAYS split FIRST, then transform |

### 3.2 Feature Engineering Checklist
- [ ] Can this feature be computed using ONLY past data at prediction time?
- [ ] Is this feature independent of the target? (correlation < 0.95)
- [ ] Was normalization/scaling done AFTER train/test split?
- [ ] Were any aggregations (mean, std) computed only on training data?
- [ ] Is this feature meaningful? (Does it have a CAUSAL mechanism?)
- [ ] Is this feature stable? (Does its distribution change across regimes?)

### 3.3 Feature Selection Protocol
1. Start with domain knowledge — what SHOULD predict the target?
2. Compute correlation matrix — remove highly correlated features (> 0.8)
3. Use importance measures (permutation importance, SHAP) — but on VALIDATION data
4. Apply the "p < n" rule — fewer features than training samples
5. Test with and without each feature — if removing it doesn't hurt, remove it

## Part 4: Modeling (The Scientific Way)

### 4.1 Model Selection Hierarchy
**Always start simple and add complexity only when justified:**

1. **Baseline:** Random predictor, mean predictor, naive predictor (last value)
2. **Linear:** Linear/logistic regression — interpretable, hard to overfit
3. **Tree-based:** Decision tree, random forest, gradient boosting — handles non-linearity
4. **Complex:** Neural networks, transformers — ONLY if simpler models plateau AND you have enough data

**If a complex model beats a simple model by < 2%, use the simple model.**

### 4.2 Cross-Validation for Time Series (NEVER use random k-fold!)

```
Time Series CV (Walk-Forward):
  Train: [====]
  Test:         [==]
  
  Train: [========]
  Test:             [==]
  
  Train: [============]
  Test:                 [==]
```

**Rules:**
- NEVER shuffle time series data
- ALWAYS train on past, test on future
- Use expanding or sliding window — match your deployment strategy
- Minimum 5 test periods
- Each test period should cover at least 1 full market cycle

### 4.3 Regularization Decision Tree
- Linear model → L1 (Lasso) for feature selection, L2 (Ridge) for stability
- Tree model → max_depth, min_samples_leaf, max_features
- Neural network → Dropout, weight decay, early stopping
- ALL models → Never train to convergence on training data alone

### 4.4 Hyperparameter Tuning (Without Overfitting)
- Use nested cross-validation (outer loop for evaluation, inner for tuning)
- Try < 20 hyperparameter combinations (more = overfitting to validation set)
- Use Bayesian optimization over grid search
- Report performance of FINAL model, not best-of-N trials

## Part 5: Validation (The Most Important Part)

### 5.1 Out-of-Sample Testing Protocol
1. **Hold out 20-30% of data that you NEVER touch until final evaluation**
2. Train/tune on the remaining data
3. Run final model ONCE on holdout set
4. Report this result — it's your TRUE performance
5. If holdout performance is much worse than CV performance → YOU OVERFIT

### 5.2 Statistical Significance Testing
| Situation | Test | Threshold |
|-----------|------|-----------|
| Is model better than baseline? | Paired t-test on fold results | p < 0.05 |
| Multiple model comparison | Friedman + Nemenyi post-hoc | p < 0.05 |
| Is metric different from zero? | Bootstrap confidence interval | 95% CI excludes zero |
| Multiple hypotheses tested | Bonferroni: p < 0.05/N | Adjusted threshold |

### 5.3 Performance by Regime (MANDATORY)
```
Overall accuracy: 65%    ← This number is MEANINGLESS alone

By regime:
  Bull market:    72% (n=500)  ← Good
  Bear market:    45% (n=200)  ← WORSE THAN RANDOM!
  Range-bound:    58% (n=300)  ← Barely better than baseline
  High volatility: 52% (n=100) ← Not enough samples to conclude
```

**If the model only works in one regime, it's NOT a general model — it's a regime-specific bet.**

### 5.4 Sensitivity Analysis
- Vary each hyperparameter ±10% — does performance change dramatically?
- Remove each feature — does performance collapse? (If yes, check for leakage)
- Change the train/test split date — does conclusion change?
- Add noise to features — does the model degrade gracefully?

### 5.5 Walk-Forward Validation (for deployment decisions)
1. Train on data up to time T
2. Predict T+1 to T+N
3. Record actual performance
4. Advance window, repeat
5. Plot cumulative performance over time — look for degradation

## Part 6: Honest Reporting

### 6.1 What to Include in Every Analysis Report
- [ ] Clear hypothesis with mechanism
- [ ] Data description: source, size, time range, regimes covered
- [ ] Feature list with causal justification
- [ ] Model choice with justification
- [ ] Cross-validation scheme and results (with standard deviation)
- [ ] Out-of-sample performance with confidence intervals
- [ ] Performance breakdown by regime
- [ ] Comparison to baseline and alternative approaches
- [ ] Limitations and assumptions
- [ ] What the model DOESN'T capture

### 6.2 Red Flags That Your Analysis Is Garbage
- In-sample R² > 0.9 (almost certainly overfit)
- No out-of-sample testing
- Performance reported without confidence intervals
- No baseline comparison
- Features that couldn't be computed at prediction time
- Training and testing on the same data
- Only testing on one regime
- Reporting best-of-N without correction
- "The model works" without defining "works"

## Part 7: Thinking Methodology for Data Science

### 7.1 Before Starting Analysis — THINK
1. What is the prior probability of finding a real signal? (Most patterns are noise)
2. How many people have looked at this data before? (The more, the less likely you find something new)
3. What's the mechanism? (No mechanism = probably noise)
4. What would a skeptic say? (Play devil's advocate BEFORE analyzing)

### 7.2 During Analysis — CHECK
1. Am I looking at the data I think I'm looking at? (Print head, describe, plot)
2. Am I comparing the right things? (Apples to apples, same conditions)
3. Could there be a simpler explanation? (Occam's razor)
4. Am I seeing what I want to see? (Confirmation bias check)

### 7.3 After Analysis — VERIFY
1. Would this result replicate on new data? (If you can't test, you can't claim)
2. Is the effect size practically meaningful? (Statistical significance ≠ practical significance)
3. Have I reported honestly? (Including all failed experiments)
4. What could go wrong in deployment? (Concept drift, regime change, data quality)

## Quick Reference: Sample Size Requirements

| Analysis Type | Minimum Samples | Ideal Samples |
|--------------|----------------|---------------|
| Mean estimation | 30 | 100+ |
| Proportion estimation | n·p > 5, n·(1-p) > 5 | 100+ |
| Two-group comparison | 30 per group | 100+ per group |
| Correlation | 30 pairs | 100+ pairs |
| Simple regression | 10 per predictor | 50+ per predictor |
| Multiple regression | 20 per predictor | 50+ per predictor |
| Classification (balanced) | 100 per class | 500+ per class |
| Classification (imbalanced) | 100 of minority class | 500+ of minority class |
| Time series regime | 30 per regime | 100+ per regime |
| Neural network | 1000+ total | 10,000+ total |
