# Machine Learning Thinking Protocol

**How Claude MUST think when doing ANY machine learning task.** This protocol prevents the stupid mistakes that happen when you jump to code before thinking.

## The Golden Rule

**If you can't explain WHY a feature should predict the target using a causal mechanism, you are fitting noise.**

Correlation is not causation. Patterns in historical data are not predictions. A model that works on training data proves NOTHING. The only thing that matters is out-of-sample, out-of-regime, statistically significant, economically meaningful performance.

## Before Writing ANY ML Code

### Step 1: State the Causal Hypothesis
"I believe [feature X] predicts [target Y] BECAUSE [mechanism Z]."

**Bad:** "I'll try random forest on all features and see what works"
**Good:** "High VPIN predicts short-term reversals because informed flow creates temporary imbalances that mean-revert as liquidity providers adjust quotes (Kyle 1985)"

### Step 2: Define Success BEFORE You Start
- What metric? (accuracy? Sharpe? F1? precision? profit after costs?)
- What threshold? (Must beat baseline by how much?)
- On what data? (Out-of-sample, specific time period, all regimes)
- At what confidence? (p < 0.05? 95% CI excludes zero?)

### Step 3: List Everything That Could Go Wrong
1. Data leakage (using future info)
2. Survivorship bias (only analyzing winners)
3. Overfitting (memorizing noise)
4. Regime dependency (only works in bull markets)
5. Transaction costs (edge disappears after costs)
6. Concept drift (relationships change over time)
7. Selection bias (cherry-picked time period)

## During ML Work

### The 10 Commandments of Not Being Stupid

1. **Thou shalt not train and test on the same data.** EVER. Not even "just to check."
2. **Thou shalt not use random cross-validation on time series.** Time flows forward only.
3. **Thou shalt not report in-sample performance.** It means NOTHING.
4. **Thou shalt not use features computed from future data.** Check EVERY feature for temporal leakage.
5. **Thou shalt not normalize before splitting.** Split FIRST, then fit scaler on train only.
6. **Thou shalt not tune hyperparameters on the test set.** Use a separate validation set.
7. **Thou shalt not claim success without a baseline.** Random? Mean? Naive? What beats doing nothing?
8. **Thou shalt not ignore class imbalance.** 99% accuracy on 99% majority class = useless.
9. **Thou shalt not report accuracy without confidence intervals.** Point estimates are meaningless.
10. **Thou shalt not deploy without walk-forward testing.** Backtests lie. Walk-forward is truth.

### Feature Engineering Protocol

**For every feature you create, answer these THREE questions:**

1. **Is it causal?** Does changing this feature actually CAUSE the target to change? Or is it just correlated?
   - If just correlated → it WILL stop working when the correlation breaks
   
2. **Is it timely?** Can you compute this feature BEFORE you need the prediction?
   - If not → you have data leakage
   
3. **Is it stable?** Does this feature behave the same way in different regimes?
   - If not → your model is regime-dependent

### Model Complexity Guidelines

| Dataset Size | Max Model Complexity | Why |
|-------------|---------------------|-----|
| < 100 rows | Linear regression, logistic regression | Not enough data for anything else |
| 100-1,000 | Decision tree, random forest (shallow) | Trees can overfit quickly |
| 1,000-10,000 | Gradient boosting, SVM, medium neural net | More flexibility justified |
| 10,000-100,000 | Deep neural nets, transformers | Enough data for complex patterns |
| 100,000+ | Whatever you want | But still validate rigorously! |

**If your complex model beats a simple model by < 2%, use the simple model.** Complexity = fragility.

## After ML Work

### The Validation Gauntlet (ALL must pass)

1. **Out-of-sample test:** Performance on truly unseen data
2. **Regime test:** Performance broken down by market/system regime
3. **Stability test:** Small input changes → small output changes
4. **Ablation test:** Remove each feature — which ones matter?
5. **Adversarial test:** What inputs break the model?
6. **Baseline test:** How much better than random/naive/mean?
7. **Economic test:** Does the edge survive transaction costs, slippage, fees?
8. **Temporal test:** Walk-forward performance — does it degrade over time?

### Interpreting Results

**What good results look like:**
- Consistent performance across regimes (not just one)
- Modest but stable improvement over baseline (5-15%, not 200%)
- Features that make causal sense
- Smooth degradation when conditions change
- Reproducible results with different random seeds

**What garbage results look like:**
- Amazing in-sample, terrible out-of-sample
- Only works in one regime
- Depends on 1-2 magic features
- Extremely sensitive to hyperparameters
- Different results with different random seeds
- "Too good to be true" performance (> 80% accuracy on hard problems)

## Common ML Mistakes Claude Makes (and How to Prevent Them)

### Mistake 1: Insufficient Data Per Condition
**What happens:** Claude trains on 50 samples across 3 regimes and claims the model "works"
**Why it's wrong:** 50/3 ≈ 17 samples per regime → not enough for ANY statistical conclusion
**Prevention:** ALWAYS check: n_samples_per_regime >= 30 minimum, ideally 100+

### Mistake 2: Random Train/Test Split on Time Series
**What happens:** Claude does `train_test_split(X, y, test_size=0.2)` on time series
**Why it's wrong:** This shuffles time, so training data includes future information
**Prevention:** ALWAYS use temporal splits: train on past, test on future

### Mistake 3: Normalizing Before Splitting
**What happens:** Claude runs `StandardScaler().fit_transform(X)` on ALL data, then splits
**Why it's wrong:** The scaler learns the mean/std of test data → information leakage
**Prevention:** Split FIRST, then `scaler.fit(X_train)`, then `scaler.transform(X_test)`

### Mistake 4: Using ALL Features Without Justification
**What happens:** Claude throws 50 features into a model without checking any of them
**Why it's wrong:** More features + limited data = guaranteed overfitting
**Prevention:** Start with 3-5 features with clear causal mechanisms. Add more only if justified.

### Mistake 5: Reporting Best Run Instead of Average
**What happens:** Claude tries 10 random seeds and reports the best one
**Why it's wrong:** This is selection bias — you're selecting for luck, not skill
**Prevention:** Report mean ± std across all runs. If variance is high, the model is unreliable.

### Mistake 6: Not Testing Transaction Costs
**What happens:** Claude finds a strategy with 0.1% daily return but ignores costs
**Why it's wrong:** If transaction costs are 0.05% per trade and you trade 5x/day, costs eat the edge
**Prevention:** ALWAYS subtract realistic transaction costs before claiming profitability

### Mistake 7: Treating Correlation as Prediction
**What happens:** Claude finds feature X correlates with target Y and declares victory
**Why it's wrong:** Correlation in historical data does NOT mean X predicts Y going forward
**Prevention:** Require: (1) causal mechanism, (2) out-of-sample test, (3) multiple time periods
