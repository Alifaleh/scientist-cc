# Analysis Pipeline: The Exact Sequence

**This is the MANDATORY pipeline for ANY data analysis task.** Follow these steps IN ORDER. Do NOT skip steps. Do NOT jump ahead. Each step produces artifacts that the next step requires.

## Why Claude Skips Steps

Claude's training optimizes for task completion speed. When given "analyze this data," Claude wants to:
1. Load data → 2. Train model → 3. Report results

A real scientist does:
1. Plan → 2. Audit data → 3. Explore → 4. Engineer features → 5. Baseline → 6. Model → 7. Validate → 8. Stress test → 9. Report honestly

**Claude skips steps 1, 2, 3, 5, 7, 8.** That's 6 out of 9 steps. No wonder the results are garbage.

---

## Phase 0: PRE-REGISTRATION (before seeing ANY results)

**Inspired by clinical trials — declare your analysis plan BEFORE seeing data.**

Write down and COMMIT to git:
```markdown
## Pre-Registration
- **Question:** [What am I trying to answer?]
- **Hypothesis:** [What do I expect to find and WHY?]
- **Primary metric:** [ONE metric I'll use to judge success]
- **Success threshold:** [Specific number that means "it works"]
- **Baseline:** [What I'll compare against]
- **Sample size needed:** [Minimum N for statistical power]
- **Analysis plan:** [Exact steps I'll follow]
- **What would falsify this:** [Specific outcome that means "it doesn't work"]
```

**WHY:** Pre-registration prevents p-hacking, HARKing (Hypothesizing After Results are Known), and cherry-picking. If you change your analysis plan after seeing results, you're cheating.

---

## Phase 1: DATA UNDERSTANDING (minimum 30 minutes before any modeling)

### Step 1.1: Data Inventory
```python
# MANDATORY — run before anything else
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"Dtypes:\n{df.dtypes}")
print(f"Date range: {df.index.min()} to {df.index.max()}")
print(f"Missing:\n{df.isnull().sum()[df.isnull().sum() > 0]}")
```

### Step 1.2: Distribution Analysis
```python
# Plot EVERY numeric column
for col in df.select_dtypes(include='number').columns:
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))
    df[col].hist(bins=50, ax=axes[0])
    axes[0].set_title(f'{col} - Histogram')
    df[col].plot(ax=axes[1])
    axes[1].set_title(f'{col} - Time Series')
    axes[2].boxplot(df[col].dropna())
    axes[2].set_title(f'{col} - Box Plot')
    plt.tight_layout()
    plt.savefig(f'.scientist/vault/assets/dist_{col}.png')
    plt.close()
```

### Step 1.3: Regime Identification
```python
# Label every data point by regime
def identify_regimes(df, returns_col='returns', window=20):
    """Identify market regimes using rolling statistics."""
    rolling_mean = df[returns_col].rolling(window).mean()
    rolling_std = df[returns_col].rolling(window).std()
    median_std = rolling_std.median()
    
    conditions = [
        (rolling_mean > 0) & (rolling_std < median_std),      # Bull, low vol
        (rolling_mean > 0) & (rolling_std >= median_std),     # Bull, high vol
        (rolling_mean < 0) & (rolling_std < median_std),      # Bear, low vol
        (rolling_mean < 0) & (rolling_std >= median_std),     # Bear, high vol
        (rolling_mean.abs() < rolling_std * 0.5),             # Range-bound
    ]
    labels = ['bull_calm', 'bull_volatile', 'bear_calm', 'bear_volatile', 'range']
    
    df['regime'] = np.select(conditions, labels, default='unknown')
    
    # Report regime distribution
    print("Regime Distribution:")
    print(df['regime'].value_counts())
    print(f"\nMinimum samples per regime: {df['regime'].value_counts().min()}")
    
    return df
```

### Step 1.4: Correlation Analysis
```python
# Correlation matrix — look for multicollinearity and target leakage
corr = df[numeric_cols].corr()
plt.figure(figsize=(12, 10))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdBu_r', center=0)
plt.title('Feature Correlation Matrix')
plt.savefig('.scientist/vault/assets/correlation_matrix.png')
plt.close()

# Flag potential leakage
for col in features:
    r = abs(df[col].corr(df[target]))
    if r > 0.9:
        print(f"⚠️ POTENTIAL LEAKAGE: {col} has r={r:.3f} with target")
```

**CHECKPOINT 1:** Before proceeding, you MUST have:
- [ ] Shape and dtypes documented
- [ ] All distributions plotted and reviewed
- [ ] Regimes identified and counted (30+ per regime)
- [ ] Correlation matrix plotted
- [ ] No leakage detected (or documented and addressed)

---

## Phase 2: EXPLORATORY DATA ANALYSIS (Tukey's EDA)

**The goal is to UNDERSTAND the data, not to find patterns to exploit.**

### Step 2.1: Univariate Analysis
- Summary statistics for every variable (mean, median, std, skew, kurtosis)
- Identify outliers (IQR method or z-score > 3)
- Test stationarity for time series (ADF test)

### Step 2.2: Bivariate Analysis  
- Scatter plots of every feature vs target
- Conditional distributions (feature distribution GIVEN different target values)
- Lagged correlations for time series

### Step 2.3: Temporal Analysis (for time series)
- Autocorrelation (ACF) and partial autocorrelation (PACF)
- Seasonal decomposition
- Rolling statistics (mean, std) to detect regime changes
- Structural break tests (Chow test, CUSUM)

### Step 2.4: Document Surprises
Write a vault note: "What surprised me about this data?"
- Any unexpected distributions
- Any suspicious correlations
- Any missing regimes or time periods
- Any data quality issues

**CHECKPOINT 2:** Before proceeding, you MUST have:
- [ ] EDA vault note with key findings
- [ ] At least 5 visualizations saved to vault/assets/
- [ ] Surprises and anomalies documented
- [ ] Stationarity tested (if time series)

---

## Phase 3: FEATURE ENGINEERING

### Step 3.1: Domain-Driven Features
- Start with features that have a CAUSAL mechanism
- Document WHY each feature should predict the target
- Maximum 5-10 features initially (p < n rule)

### Step 3.2: Leakage Audit
For EVERY feature:
```python
def check_leakage(df, feature, target, time_col):
    """Check if feature uses future information."""
    # 1. Temporal check
    # 2. Correlation check
    # 3. Importance sanity check
    pass
```

### Step 3.3: Feature Stability Check
```python
# Check if features behave the same across regimes
for feat in features:
    for regime in df['regime'].unique():
        regime_data = df[df['regime'] == regime][feat]
        print(f"{feat} in {regime}: mean={regime_data.mean():.4f}, std={regime_data.std():.4f}")
```

**CHECKPOINT 3:** Before modeling:
- [ ] Every feature has documented causal justification
- [ ] Leakage audit passed for all features
- [ ] Feature stability across regimes verified

---

## Phase 4: BASELINE ESTABLISHMENT

**Before ANY fancy model, establish baselines:**

```python
# Baseline 1: Random predictor
random_score = evaluate(random_predictions, y_test)

# Baseline 2: Mean predictor  
mean_score = evaluate(np.full_like(y_test, y_train.mean()), y_test)

# Baseline 3: Naive predictor (last value)
naive_score = evaluate(y_test.shift(1).fillna(y_train.iloc[-1]), y_test)

# Baseline 4: Simple linear model
from sklearn.linear_model import LinearRegression
lr = LinearRegression().fit(X_train, y_train)
lr_score = evaluate(lr.predict(X_test), y_test)

print(f"Random: {random_score:.4f}")
print(f"Mean:   {mean_score:.4f}")
print(f"Naive:  {naive_score:.4f}")
print(f"Linear: {lr_score:.4f}")
```

**ANY model must beat ALL baselines to be considered useful.**

---

## Phase 5: MODELING (start simple, add complexity only when justified)

### Step 5.1: Simple Models First
1. Linear/logistic regression
2. Decision tree (max_depth=3)
3. Random forest (n_estimators=100, max_depth=5)

### Step 5.2: Complexity Only If Justified
Only use gradient boosting, neural nets, etc. IF:
- Simple models plateau
- You have enough data (see complexity table)
- The improvement is > 2% over simple model

### Step 5.3: Proper Cross-Validation
```python
# For time series: ALWAYS use temporal CV
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
scores = cross_val_score(model, X, y, cv=tscv)
print(f"CV Score: {scores.mean():.4f} ± {scores.std():.4f}")
```

---

## Phase 6: VALIDATION GAUNTLET (ALL must pass)

1. **Out-of-sample:** Holdout test set performance
2. **Per-regime:** Performance by market/system regime
3. **Walk-forward:** Rolling window test
4. **Stability:** Sensitivity to hyperparameters
5. **Ablation:** Feature importance analysis
6. **Statistical:** p-value, confidence intervals
7. **Economic:** After transaction costs (if applicable)
8. **Baseline:** Must beat ALL baselines

---

## Phase 7: HONEST REPORTING

Write a vault note with:
- Pre-registration plan vs actual results
- All experiments (including failed ones)
- Out-of-sample performance with CI
- Per-regime breakdown
- Limitations and failure modes
- What the model DOESN'T capture
