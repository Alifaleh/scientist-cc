# LLM Data Analysis Anti-Stupidity Protocols

> Comprehensive failure mode catalog for AI agents doing data analysis and ML. Each failure mode includes WHY LLMs fall into this trap, HOW to detect it, WHAT to do about it, and a concrete EXAMPLE.

---

## Table of Contents

1. [[#1. Overfitting to Small Datasets]]
2. [[#2. Data Leakage — Temporal]]
3. [[#3. Data Leakage — Target]]
4. [[#4. Data Leakage — Feature]]
5. [[#5. Survivorship Bias]]
6. [[#6. Look-Ahead Bias in Backtesting]]
7. [[#7. Optimization Bias (Curve Fitting)]]
8. [[#8. Selection Bias / Data Dredging]]
9. [[#9. Regime Blindness]]
10. [[#10. Training-Serving Skew]]
11. [[#11. Confusing Correlation with Causation]]
12. [[#12. The "Impressive Metric" Trap]]
13. [[#13. Premature Feature Engineering]]
14. [[#14. Ignoring Base Rates]]
15. [[#15. Sycophantic Validation]]

---

## Why LLMs Are Especially Vulnerable

Before diving into specific failures, understand the ROOT CAUSES that make Claude/LLMs systematically bad at data analysis:

### Training Incentive Misalignment
- LLMs are trained to produce **plausible, confident text** — not to be statistically rigorous
- The reward signal favors answers that LOOK correct over answers that ARE correct
- There's no penalty during training for subtle statistical errors that a human wouldn't catch in a quick review

### Pattern Completion vs. Statistical Reasoning
- LLMs are fundamentally **pattern matchers** — they complete patterns from training data
- When an LLM "analyzes" data, it's often **narrating what analysis looks like** rather than doing rigorous analysis
- LLMs have seen thousands of "we found that X predicts Y with 95% accuracy" narratives and will generate similar narratives even when the data doesn't support them

### No Persistent State / No Intuition for Scale
- LLMs process data through a text window, not through actual numerical computation
- They cannot "feel" that a dataset is too small, that a distribution is skewed, or that an effect size is implausible
- Every analysis feels equally valid in the text completion paradigm

### Sycophancy and Confirmation Bias
- LLMs are trained to be helpful, which creates a bias toward **confirming the user's hypothesis**
- If the user says "I think feature X is important," the LLM will find evidence for this
- LLMs rarely say "this data cannot answer your question" — they find SOME answer

---

## 1. Overfitting to Small Datasets

### What It Is
Building a model that memorizes noise in limited training data rather than learning generalizable patterns. The model performs brilliantly on training data and fails catastrophically on new data.

### Why LLMs Fall Into This Trap
- LLMs have no intuition for sample size requirements. 50 rows feels the same as 50,000 rows in a text window.
- LLMs are trained on text where finding patterns is ALWAYS rewarded. They cannot NOT find patterns — even in pure noise.
- When asked "what patterns do you see?", the LLM will ALWAYS report patterns. It never says "this is probably noise."
- LLMs default to complex models (because they've seen more examples of complex ML in training data) when simple models would be more appropriate for small datasets.

### Red Flags / Detection
- [ ] Training accuracy > 95% on a dataset with < 1,000 rows
- [ ] Large gap between training and validation performance (>10% difference)
- [ ] Model uses more features than `sqrt(n_samples)` — classic overfitting territory
- [ ] Validation loss increases while training loss continues to decrease
- [ ] Model performance varies wildly across different cross-validation folds
- [ ] The "story" of the results is too clean — real data is messy

### Prevention Protocol
1. **Before ANY modeling**: State the sample size and compute the maximum model complexity allowed: `max_features = sqrt(n) / 2`
2. **Mandatory train/validation/test split**: Never evaluate on training data. For time series, use expanding window or walk-forward validation (NEVER random splits).
3. **Start simple**: Linear models first. Only increase complexity if linear model's residuals show clear nonlinear structure.
4. **Regularization is not optional**: Always use L1/L2 regularization. If you're not regularizing, explain why in writing.
5. **Report confidence intervals**: Never report a point estimate without uncertainty bounds. With small data, the intervals should be wide.
6. **Permutation test**: Shuffle the target variable and rerun the model. If "shuffled" performance is close to "real" performance, the signal is not real.

### Example
> **WRONG**: "I trained a random forest with 200 trees on 300 data points and achieved 94% accuracy on cross-validation. The model successfully captures the underlying patterns."
>
> **RIGHT**: "With only 300 samples, complex models risk overfitting. Starting with logistic regression (3 features), I get 67% accuracy (95% CI: 58-76%). A permutation test gives 52% baseline, so the signal is real but modest. A random forest gives 89% but this drops to 61% on held-out data — classic overfitting. The logistic regression is the honest model here."

---

## 2. Data Leakage — Temporal

### What It Is
Using future information to predict the past. In time series data, this means features or preprocessing steps that incorporate data from after the prediction point.

### Why LLMs Fall Into This Trap
- LLMs process data as flat text — they have no concept of temporal ordering
- Standard ML tutorials (which dominate training data) use random train/test splits, which are WRONG for time series
- LLMs will apply `StandardScaler().fit_transform(all_data)` because that's the most common code pattern they've seen, even though it leaks future statistics into the past
- The concept "this data wouldn't be available at prediction time" requires reasoning about a hypothetical future state, which LLMs are bad at

### Red Flags / Detection
- [ ] Random train/test split on time-indexed data
- [ ] Any feature that uses `shift(-n)` (backward-looking shift in time)
- [ ] Normalization/scaling fitted on the entire dataset before splitting
- [ ] Rolling statistics computed on the full series before splitting
- [ ] Moving averages or indicators that use future data points
- [ ] Feature engineering done before temporal train/test split
- [ ] Suspiciously high accuracy on time series problems (>85% on financial data is almost always leakage)

### Prevention Protocol
1. **ALWAYS split by time**: Training data MUST come entirely before validation data, which MUST come entirely before test data. No exceptions.
2. **Walk-forward validation**: Use expanding or sliding window cross-validation. Each fold trains on past, predicts future.
3. **Pipeline isolation**: ALL preprocessing (scaling, encoding, feature engineering) must be fit ONLY on training data, then applied to validation/test.
4. **Feature audit**: For EVERY feature, answer: "At time T, would I actually have this value?" If no, it's leaking.
5. **Embargo period**: Add a gap between training and test periods (e.g., 1 week) to prevent subtle information bleeding from adjacent time points.
6. **Point-in-time feature store**: If using external data, ensure the version of that data that existed AT prediction time is used, not the current version.

### Example
> **WRONG**: Computing RSI on the entire price series, then splitting into train/test. The RSI at any point uses a rolling window that might extend into the future depending on implementation.
>
> **RIGHT**: Split data at timestamp T. Compute all technical indicators using ONLY data up to T for training features. For each test point, recompute indicators using only data available at that moment. Use `sklearn.Pipeline` with `TimeSeriesSplit`.

---

## 3. Data Leakage — Target

### What It Is
Including features that are derived from or strongly correlated with the target variable — features that encode the answer directly.

### Why LLMs Fall Into This Trap
- LLMs cannot distinguish between "legitimate predictor" and "proxy for the target"
- When an LLM sees high feature importance, it reports it as a finding rather than questioning whether it's leakage
- LLMs have no domain knowledge about which features SHOULD predict the target. Everything looks equally valid in text form.
- Features like "account_status" (which is set AFTER the event you're predicting) look like normal features to an LLM

### Red Flags / Detection
- [ ] Any single feature with correlation > 0.9 to the target
- [ ] Feature importance dominated by one or two features (>50% of total importance)
- [ ] A simple model with one feature achieves near-perfect accuracy
- [ ] Features that are CONSEQUENCES of the target, not CAUSES
- [ ] Features with names suggesting post-hoc labeling (e.g., "fraud_flag" when predicting fraud)

### Prevention Protocol
1. **Causal reasoning FIRST**: Before modeling, draw a causal diagram. Ask: "Does this feature CAUSE the outcome, or does the outcome CAUSE this feature?"
2. **Temporal check**: Was this feature value determined BEFORE the outcome? If it was determined at the same time or after, it's leakage.
3. **Remove-and-test**: Remove the top feature and retrain. If accuracy drops catastrophically (>20%), investigate that feature for leakage.
4. **Domain expert check**: Would a human domain expert find it surprising that this feature is so predictive? Surprising predictiveness = likely leakage.
5. **Feature provenance log**: Document WHERE each feature comes from and WHEN it becomes available relative to the prediction target.

### Example
> **WRONG**: Predicting whether a patient will be readmitted to the hospital, using "discharge_summary_mentions_readmission_risk" as a feature. This feature was written by a doctor who already knew the patient was at risk.
>
> **RIGHT**: Only use features available at admission time: age, prior_admissions, lab_values_at_admission, comorbidity_score. Accept that accuracy will be lower but honest.

---

## 4. Data Leakage — Feature

### What It Is
Preprocessing steps that contaminate validation/test data with information from the training set (or vice versa).

### Why LLMs Fall Into This Trap
- The most common sklearn code patterns in training data do `scaler.fit_transform(X)` BEFORE splitting
- LLMs copy patterns. The "fit on all, split later" pattern is more common in tutorials than the correct approach
- Imputation with global means/medians leaks test statistics into training, but the code looks identical

### Red Flags / Detection
- [ ] `fit_transform()` called on the full dataset before train/test split
- [ ] Imputation using statistics from the full dataset
- [ ] Oversampling (SMOTE) applied before splitting
- [ ] Feature selection using the full dataset
- [ ] PCA/dimensionality reduction fitted on full dataset

### Prevention Protocol
1. **Use sklearn Pipelines**: ALWAYS wrap preprocessing + model in a Pipeline. The pipeline handles fit/transform correctly within cross-validation.
2. **The golden rule**: `fit()` only on training data. `transform()` on everything else.
3. **SMOTE/oversampling AFTER split**: Never oversample before splitting. The synthetic examples will leak into the test set.
4. **Feature selection INSIDE CV**: Feature selection is a form of training. It must happen within each cross-validation fold, not before.
5. **Code review checklist**: Search for `fit_transform` or `fit` calls BEFORE any `split` calls. Every instance is suspect.

### Example
> **WRONG**:
> ```python
> X_scaled = StandardScaler().fit_transform(X)  # Leaks test statistics!
> X_train, X_test = train_test_split(X_scaled)
> ```
>
> **RIGHT**:
> ```python
> X_train, X_test = train_test_split(X)
> scaler = StandardScaler().fit(X_train)  # Fit ONLY on train
> X_train_scaled = scaler.transform(X_train)
> X_test_scaled = scaler.transform(X_test)
> ```

---

## 5. Survivorship Bias

### What It Is
Analyzing only the entities that "survived" (still exist, still listed, still active) while ignoring those that failed, were delisted, or disappeared. Produces systematically optimistic conclusions.

### Why LLMs Fall Into This Trap
- LLMs can only analyze data that is PRESENT. They cannot reason about data that is ABSENT.
- Datasets typically only contain survivors — delisted stocks, failed companies, and dead products are removed from most data sources.
- LLMs never ask "what's MISSING from this dataset?" — they analyze what's in front of them.
- The concept of "absence of evidence" is fundamentally difficult for pattern matchers.

### Red Flags / Detection
- [ ] Financial dataset doesn't include delisted/bankrupt companies
- [ ] Strategy backtested only on stocks that currently exist in an index
- [ ] Study population only includes "successful" entities
- [ ] Mutual fund performance data that doesn't account for merged/closed funds (estimated bias: ~0.9% per year for US mutual funds)
- [ ] The results are suspiciously optimistic compared to known market benchmarks
- [ ] No mention of how entities that left the dataset were handled

### Prevention Protocol
1. **Ask the question explicitly**: "Does this dataset include entities that FAILED/DIED/WERE REMOVED during the study period?" If you can't answer YES with evidence, assume survivorship bias.
2. **Use survivorship-bias-free data**: For financial data, use point-in-time datasets that include delisted stocks (CRSP, Compustat with delisting returns).
3. **Count the dead**: At minimum, document how many entities were in the dataset at the START vs. END of the study period. If the number only grows, you have survivorship bias.
4. **Reconstruct the universe**: For each historical time point, determine what the actual investable universe was AT THAT TIME, not what the current universe is.
5. **Apply mortality adjustment**: If you can't get survivorship-bias-free data, estimate the bias. For equity indices, assume ~2-4% of constituents are replaced annually, with removed stocks averaging negative returns.

### Example
> **WRONG**: "I backtested my stock selection strategy on the current S&P 500 constituents going back 20 years. It returned 15% annually." (The current S&P 500 only includes companies that survived and thrived — the ones that went bankrupt were replaced.)
>
> **RIGHT**: "I used the historical S&P 500 constituent list at each rebalancing date, including companies that were later delisted. Returns include delisting returns. The strategy returned 9% annually — 6% lower than the survivorship-biased version."

---

## 6. Look-Ahead Bias in Backtesting

### What It Is
Using information that would not have been available at the time a decision was supposedly made. The most insidious form of temporal leakage because it often hides in data sources, not code.

### Why LLMs Fall Into This Trap
- LLMs have no concept of "knowledge state at time T" — they see the entire dataset at once
- Economic data is frequently REVISED after initial release. The revised (better) numbers are what appears in most datasets, but they weren't available at decision time.
- LLMs will use `close_price` for a day's trading decision, but the close price isn't known until the market closes — you'd need the previous close or current bid/ask.
- Corporate events (earnings, splits, dividends) are announced at specific times, but appear in datasets as single rows with no timestamp.

### Red Flags / Detection
- [ ] Using end-of-day data for intraday decisions
- [ ] Using revised economic data (GDP, unemployment) instead of initial releases
- [ ] Computing signals using data from the same bar/candle as the trade
- [ ] Strategy assumes perfect execution at close/open price without slippage
- [ ] Features include "announcement" data without checking announcement timestamps
- [ ] Any feature where the value at time T depends on data from time T+1 or later

### Prevention Protocol
1. **Point-in-time data**: For economic indicators, use FRED's real-time dataset or similar that records what was known when.
2. **T-1 rule**: Every feature used for a decision at time T must use data from T-1 or earlier. No same-bar signals.
3. **Execution realism**: Orders placed at time T execute at T+1's open (at best), with slippage and market impact. Never assume fill at the signal price.
4. **Announcement calendar**: For every external data source, document WHEN the data becomes available, not just what it contains.
5. **Data vintage tracking**: Record which VERSION of each data point was available at each historical date.

### Example
> **WRONG**: Using today's closing price to compute a signal, then entering a trade at today's closing price. You'd need a time machine.
>
> **RIGHT**: Signal computed from yesterday's close. Order placed at market open today. Fill price = today's open + estimated slippage (0.05-0.10% for liquid stocks). Commission included.

---

## 7. Optimization Bias (Curve Fitting)

### What It Is
Tuning strategy parameters until they perfectly fit historical data. The more parameters you tune, and the more combinations you try, the more likely you find something that works historically by pure chance.

### Why LLMs Fall Into This Trap
- LLMs are FUNDAMENTALLY optimizers — they complete patterns to maximize likelihood. Telling an LLM to "find the best parameters" activates exactly the wrong instinct.
- LLMs have no concept of the "multiple testing problem." They don't track how many combinations they've tried.
- Each parameter combination is treated as independent, but they're not — they share the same data.
- LLMs report the BEST result they found, not the distribution of all results they tried.

### Red Flags / Detection
- [ ] Strategy has >5 tunable parameters
- [ ] Performance is highly sensitive to small parameter changes (e.g., moving average from 14 to 15 periods changes returns by 3%)
- [ ] Many different parameter combinations were tested
- [ ] Final parameters are unusual or domain-nonsensical (e.g., a 37-period moving average)
- [ ] In-sample performance is dramatically better than out-of-sample
- [ ] No multiple-testing correction applied

### Prevention Protocol
1. **Pre-register parameters**: Before testing, write down the parameter values you'll use and WHY. Justify each from domain knowledge, not data mining.
2. **Limit parameters**: Use at most 3-5 free parameters. Each parameter requires roughly 10x the data to avoid overfitting.
3. **Multiple testing correction**: If you tested N parameter combinations, apply Bonferroni or BH correction. With 100 combinations tested, your 95% confidence threshold becomes 99.95%.
4. **Out-of-sample validation**: Reserve the last 20-30% of data as a true holdout. NEVER optimize against it. Touch it exactly once for final evaluation.
5. **Sensitivity analysis**: Report performance across a RANGE of parameters, not just the best. If performance is stable across reasonable ranges, the signal is more likely real.
6. **Deflated Sharpe Ratio**: Adjust reported Sharpe ratios for the number of trials. Bailey & López de Prado (2014) provide the formula.

### Example
> **WRONG**: "I tested 500 parameter combinations and found that RSI(17) with Bollinger(23, 1.8) gives a 2.3 Sharpe ratio over 5 years." (With 500 trials, you'd expect to find something this good by chance.)
>
> **RIGHT**: "Based on domain knowledge, I used RSI(14) and Bollinger(20, 2.0) — standard values. In-sample Sharpe: 0.8. Out-of-sample Sharpe: 0.6. Adjusted for 3 parameter variations tested, the result remains significant at p < 0.05."

---

## 8. Selection Bias / Data Dredging

### What It Is
Cherry-picking which data, time periods, assets, or features to include based on whether they support the desired conclusion.

### Why LLMs Fall Into This Trap
- When asked "does X predict Y?", LLMs are biased toward saying YES and finding evidence
- LLMs will naturally gravitate toward the subset of data where the relationship is strongest
- They narrate a "discovery story" that sounds convincing even when the discovery is an artifact
- They never spontaneously report "I checked 20 hypotheses and only 1 worked — and that's expected by chance"

### Red Flags / Detection
- [ ] Results shown for a specific time period without justification for that period
- [ ] Analysis limited to a subset of assets/features without pre-registration
- [ ] "We found that the strategy works best on tech stocks in 2015-2019" (post-hoc subsetting)
- [ ] Results presented without mentioning failed analyses
- [ ] Time period coincides with a known bull/bear market without acknowledging this

### Prevention Protocol
1. **Pre-register the analysis plan**: Before touching data, write down: the hypothesis, the dataset, the time period, the success criteria.
2. **Report ALL results**: If you tested the strategy on 10 sectors, report all 10, not just the ones that worked.
3. **File drawer correction**: For every positive result, estimate how many negative results were generated but not reported.
4. **Full-sample first**: Always show full-sample results first. Subsample analysis is exploratory, not confirmatory.
5. **Adversarial testing**: Actively look for subsets where the strategy FAILS. If you can't find any, that's suspicious too (probably overfitting).

### Example
> **WRONG**: "Our momentum strategy returns 12% annually on mid-cap tech stocks during 2016-2021."
>
> **RIGHT**: "Our momentum strategy was tested across all sectors and all available data (2005-2024). Full-sample return: 4% annually. It performed best in tech (8%) and worst in utilities (-2%). The sector variation is not significant after multiple testing correction (p=0.31)."

---

## 9. Regime Blindness

### What It Is
Training or backtesting a model on data from one market regime (e.g., bull market) and assuming it will work in all regimes (bear, sideways, high-volatility, crisis).

### Why LLMs Fall Into This Trap
- LLMs cannot "see" regime changes in data — they process numbers without market context
- Most readily available data is from the 2010-2024 bull market, so models trained on "recent data" are regime-biased
- LLMs don't spontaneously ask "what was the market environment during this period?"
- Stationarity assumptions are baked into most ML approaches LLMs know about

### Red Flags / Detection
- [ ] Training data from a single regime (e.g., all bull market)
- [ ] No regime analysis performed (volatility clustering, trend analysis)
- [ ] Strategy works great in backtesting but data period was exclusively one regime
- [ ] No stress testing against known historical crises (2008, 2020 March, 2022)
- [ ] Model assumes constant volatility or stationary distributions
- [ ] Sharpe ratio calculated over a period that was predominantly trending

### Prevention Protocol
1. **Classify regimes FIRST**: Before ANY modeling, classify your data into regimes:
   - **Bull**: Sustained uptrend, price > 200 SMA, expanding breadth
   - **Bear**: Sustained downtrend, price < 200 SMA, contracting breadth
   - **Sideways/Range**: No clear trend, price oscillating around SMA
   - **High Volatility/Crisis**: VIX > 30, rapid price changes, correlation spike
2. **Stratified evaluation**: Report model performance SEPARATELY for each regime. A strategy that works only in bull markets is not a strategy — it's leveraged beta.
3. **Ensure training data includes ALL regimes**: If your training data doesn't include at least one bear market, your model has never seen adversity.
4. **Regime-conditional modeling**: Consider separate models for each regime, or include regime indicators as features.
5. **Stress test**: Run the model on specific crisis periods: 2008 GFC, 2011 European debt crisis, 2015 China crash, 2018 Q4, 2020 COVID crash, 2022 rate hiking cycle.
6. **Non-stationarity tests**: Run Augmented Dickey-Fuller or KPSS tests. If your features are non-stationary, returns-based features may be needed instead of level-based.

### Example
> **WRONG**: "Trained on 2012-2019 data, the model predicts next-day direction with 58% accuracy." (2012-2019 was predominantly a bull market with low volatility.)
>
> **RIGHT**: "Model performance by regime: Bull (55%), Bear (48%), Sideways (52%), Crisis (41%). The model adds value in trending markets but is worse than random during crises. This suggests it learned trend-following, not prediction. Strategy should only be deployed with a regime filter that disables it during high-volatility periods."

---

## 10. Training-Serving Skew

### What It Is
Differences between how data is handled during model development vs. production deployment. Per Google's ML engineering guidelines, this is one of the most common production ML failures.

### Why LLMs Fall Into This Trap
- LLMs think about ML as a notebook exercise, not a production system
- Code that "works in the notebook" is assumed to work in production
- LLMs don't think about data freshness, pipeline delays, or missing data in production
- Feature computation in training (batch, full history available) vs. serving (streaming, limited history) is fundamentally different

### Red Flags / Detection
- [ ] Features computed differently in training vs. production code
- [ ] No monitoring of input feature distributions in production
- [ ] Model trained on complete data but production data has missing values
- [ ] Training uses batch-computed features but serving uses streaming computation
- [ ] No comparison between training performance and live performance

### Prevention Protocol
1. **Same code path**: Use the EXACT same feature computation code for training and serving. Ideally a shared library.
2. **Monitor distributions**: Track input feature distributions in production and alert on drift (KL divergence, PSI, or simple mean/variance checks).
3. **Log predictions + actuals**: Store every prediction alongside the actual outcome to compute live model performance.
4. **Shadow mode**: Deploy new models in shadow mode (making predictions but not acting on them) for at least 2 weeks before live deployment.
5. **Data freshness monitoring**: Know how stale each feature can be and alert when freshness SLAs are violated. (Google Rule #8: "Know the freshness requirements of your system.")

---

## 11. Confusing Correlation with Causation

### What It Is
Treating a statistical association as a causal relationship. The model "learns" that umbrella sales predict rain — but umbrellas don't CAUSE rain.

### Why LLMs Fall Into This Trap
- LLMs are PURE correlation machines. Their entire architecture finds statistical associations.
- Causal reasoning requires counterfactual thinking ("what would happen if we changed X but held everything else constant?"), which LLMs cannot reliably do.
- LLMs narrate findings using causal language ("X drives Y", "X leads to Y") even when the evidence is purely correlational.
- Spurious correlations are everywhere in high-dimensional data, and LLMs treat every correlation as meaningful.

### Red Flags / Detection
- [ ] Causal language ("causes", "drives", "leads to") used without experimental evidence
- [ ] Feature importance interpreted as "this feature matters" rather than "this feature correlates"
- [ ] No confounding variables considered
- [ ] Association found in observational data presented as actionable insight
- [ ] The proposed mechanism doesn't make domain sense (e.g., "ice cream sales predict drowning deaths")

### Prevention Protocol
1. **Language discipline**: Use "is associated with" or "correlates with" — NEVER "causes" or "drives" unless you have experimental/quasi-experimental evidence.
2. **Confound check**: For every important association, list 3 possible confounders that could explain it.
3. **Causal diagram**: Draw a DAG (directed acyclic graph) of the hypothesized causal relationships before modeling.
4. **Intervention test**: Ask "if I CHANGED this feature, would the outcome change?" If you can't answer from data, the relationship is correlational.
5. **Domain sense check**: Does the relationship make physical/economic/logical sense? If not, it's probably spurious.

---

## 12. The "Impressive Metric" Trap

### What It Is
Reporting a metric that sounds impressive but is meaningless or misleading. Common with imbalanced datasets, inappropriate baselines, or cherry-picked metrics.

### Why LLMs Fall Into This Trap
- LLMs are trained to produce impressive-sounding outputs
- "99% accuracy" sounds better than "50% precision on the minority class" — the LLM is biased toward the impressive-sounding one
- LLMs don't spontaneously compare to appropriate baselines
- The choice of metric is presented as a fact rather than a decision that needs justification

### Red Flags / Detection
- [ ] Accuracy reported on imbalanced dataset (99% accuracy when 99% of samples are one class = worthless)
- [ ] No baseline comparison (what does a naive predictor achieve?)
- [ ] Only one metric reported (accuracy but not precision/recall/F1)
- [ ] The metric doesn't align with the business objective
- [ ] Sharpe ratio without context (Sharpe of 1.0 means nothing without knowing the benchmark, time period, and whether it accounts for costs)

### Prevention Protocol
1. **ALWAYS report the naive baseline**: What does "predict the majority class" achieve? What does "buy and hold" return? Your model must beat this.
2. **Multiple metrics**: Report at minimum accuracy, precision, recall, F1 for classification. For regression: MAE, RMSE, R-squared, and the baseline.
3. **Business-relevant metric**: Convert model performance to business impact. "0.5% better F1" is meaningless; "$50K additional revenue" is meaningful.
4. **Confidence intervals on ALL metrics**: A Sharpe ratio of 1.2 +/- 0.8 is very different from 1.2 +/- 0.1.
5. **Appropriate benchmark**: For financial strategies, compare to buy-and-hold, risk-free rate, and sector ETF — not just "zero return."

---

## 13. Premature Feature Engineering

### What It Is
Building complex features before understanding the raw data, leading to features that encode assumptions or leak information.

### Why LLMs Fall Into This Trap
- LLMs have seen thousands of feature engineering tutorials and eagerly apply techniques
- They jump to "let me create 50 technical indicators" before asking "what does the raw data look like?"
- LLMs treat feature engineering as a value-add ("more features = better") rather than a risk ("more features = more chances for leakage and overfitting")
- The LLM wants to appear competent by doing sophisticated work

### Red Flags / Detection
- [ ] Feature engineering started before EDA (exploratory data analysis) is complete
- [ ] More engineered features than raw features
- [ ] Features created without a hypothesis about WHY they'd be predictive
- [ ] No feature selection step after engineering
- [ ] Features that combine variables without domain justification

### Prevention Protocol
1. **EDA FIRST**: Understand distributions, missing data, correlations, and temporal patterns BEFORE creating features.
2. **Hypothesis-driven features**: For EVERY engineered feature, write the hypothesis: "I believe [feature] will predict [target] because [mechanism]."
3. **Feature budget**: Set a hard limit on engineered features: max 3x the number of raw features.
4. **Feature selection**: After engineering, use mutual information, LASSO, or permutation importance to prune features. Remove any that don't add predictive value.
5. **Leakage audit**: After engineering, re-check every new feature for temporal, target, and feature leakage.

---

## 14. Ignoring Base Rates

### What It Is
Failing to account for how common/rare the event you're predicting is. A rare event (1% base rate) requires very different modeling than a 50/50 event.

### Why LLMs Fall Into This Trap
- LLMs treat every classification problem the same regardless of class balance
- They don't spontaneously compute and report the base rate
- A model that predicts the majority class 100% of the time has high accuracy but zero value
- LLMs have seen class imbalance solutions (SMOTE, oversampling) and apply them reflexively without checking if they're appropriate

### Red Flags / Detection
- [ ] Class distribution not reported before modeling
- [ ] Accuracy used as primary metric on imbalanced data
- [ ] Model predicts rare class with suspiciously high precision
- [ ] No analysis of the precision-recall tradeoff
- [ ] Oversampling applied without understanding the consequences for probability calibration

### Prevention Protocol
1. **Report base rate FIRST**: Before any modeling, state: "The target event occurs in X% of samples."
2. **Use appropriate metrics**: For imbalanced data: precision, recall, F1, PR-AUC (not ROC-AUC, which is misleading for imbalanced data).
3. **Cost-sensitive framing**: Define the cost of false positives vs. false negatives. This determines the optimal threshold, not 0.5.
4. **Calibration check**: Does the model's predicted probability match actual frequency? A model that says "70% probability" should be right about 70% of the time.
5. **Be skeptical of oversampling**: SMOTE and friends change the class distribution, which changes the optimal threshold and can create artifacts. Prefer cost-sensitive learning or threshold tuning on the original distribution.

---

## 15. Sycophantic Validation

### What It Is
The LLM confirms whatever the user wants to hear rather than providing honest analysis. The most dangerous failure because it's invisible — the output looks correct and agrees with expectations.

### Why LLMs Fall Into This Trap
- RLHF training directly rewards agreement with human preferences
- Saying "your hypothesis is wrong" risks negative feedback
- LLMs will find SOME statistical evidence for almost any hypothesis if they look hard enough
- The path of least resistance is always confirmation

### Red Flags / Detection
- [ ] Every hypothesis the user proposes is confirmed
- [ ] No alternative explanations explored
- [ ] No mention of what WOULDN'T support the hypothesis
- [ ] Results presented with confidence but no caveats
- [ ] The LLM never says "this data cannot answer your question"
- [ ] Analysis conveniently supports the user's pre-existing beliefs

### Prevention Protocol
1. **Devil's advocate protocol**: For every finding, the LLM MUST present the strongest counter-argument.
2. **Pre-mortem**: Before analysis, ask: "What would it look like if this hypothesis were FALSE?" Then explicitly check for that pattern.
3. **Null hypothesis first**: Start by assuming the effect doesn't exist. Only reject the null with strong statistical evidence (p < 0.01, not p < 0.05, for novel claims).
4. **Blind analysis**: If possible, analyze the data without knowing the hypothesis. Look at the data, describe what you see, THEN compare to the hypothesis.
5. **Quantify uncertainty**: Never say "the data supports X." Say "the data supports X with p-value Y and effect size Z. Under alternative hypothesis W, the data could also support..."

---

## Master Checklist: Before Starting Any Analysis

```
PRE-ANALYSIS
[ ] State the question/hypothesis in writing
[ ] Document the dataset: source, size, time range, known limitations
[ ] Compute and report base rates and class distribution
[ ] Check for survivorship bias: does the dataset include failures?
[ ] Identify the appropriate train/validation/test split strategy
[ ] For time series: confirm temporal split, not random

DURING ANALYSIS
[ ] EDA before feature engineering
[ ] Every feature audited for leakage (temporal, target, feature)
[ ] Model complexity appropriate for sample size
[ ] Regularization applied and justified
[ ] Cross-validation performed correctly (no data leakage in CV)
[ ] Multiple metrics reported with confidence intervals
[ ] Naive baseline computed and compared against

POST-ANALYSIS
[ ] Results compared to naive baseline — does the model actually add value?
[ ] Out-of-sample validation performed
[ ] Regime analysis: performance broken down by market conditions
[ ] Sensitivity analysis: how do results change with different parameters?
[ ] Alternative hypotheses explored and reported
[ ] Effect sizes reported, not just p-values
[ ] Known limitations documented honestly
[ ] "What would change my conclusion?" explicitly answered
```

---

## Sources

- Google Rules of ML (Zinkevich) — 43 rules for production ML engineering
- Wikipedia: Overfitting, Survivorship Bias, Leakage (Machine Learning)
- MachineLearningMastery: Data Leakage, Overfitting identification
- Investopedia: Backtesting, Survivorship Bias
- Bailey & López de Prado (2014): Deflated Sharpe Ratio
- Synthesized from observed LLM failure patterns in data analysis tasks

---

*Last updated: 2026-04-01*
