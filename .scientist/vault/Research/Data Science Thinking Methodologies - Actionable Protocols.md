---
tags: [research, methodology, data-science, quant, protocols, thinking-frameworks]
created: 2026-04-01
sources: [datascience-pm.com, theuncertaintyproject.org, statsig.com, shap.readthedocs.io, arxiv.org]
---

# Data Science Thinking Methodologies: Actionable Protocols

> Research synthesis of world-class data science methodologies, quant research pipelines, and structured analytical thinking frameworks. Every section is a PROTOCOL, not theory.

## 1. Methodology Comparison: CRISP-DM vs TDSP vs OSEMN

### Winner: CRISP-DM (most rigorous) + TDSP (best for teams)

| Dimension | CRISP-DM | TDSP | OSEMN |
|-----------|----------|------|-------|
| **Phases** | 6 (24 sub-tasks) | 5 (iterative) | 5 (linear) |
| **Business context** | Strong (Phase 1) | Strong (Phase 1) | Missing entirely |
| **Deployment** | Explicit phase | Explicit phase | Missing entirely |
| **Team coordination** | Weak | Strong (Agile native) | None |
| **Iteration** | Bi-directional arrows | Sprint-based | Linear only |
| **Documentation** | Heavy (every task) | Moderate (templates) | Light |
| **Best for** | Solo/small team rigor | Production team projects | Learning/quick analysis |
| **Weakness** | Not a PM approach, can waterfall | Microsoft-centric | Too simple for real work |

### Verdict
- Use **CRISP-DM phases** as the analytical backbone (most complete thinking structure)
- Wrap in **TDSP's agile coordination** for team/production work
- OSEMN is only useful as a mental mnemonic for beginners

---

## 2. CRISP-DM: The Complete 24-Task Protocol

### Phase I: Business Understanding (4 tasks)
1. **Determine business objectives** - What does the stakeholder ACTUALLY want? Define success criteria in measurable terms.
2. **Assess situation** - Resources, requirements, risks, contingencies, cost-benefit analysis.
3. **Determine data mining goals** - Translate business objectives into technical success metrics (e.g., "predict churn with >80% precision").
4. **Produce project plan** - Select technologies, tools, define detailed plans per phase.

> **Claude skip risk:** Jumping straight to modeling without tasks 1-3. PREVENT by requiring a written "Problem Statement Document" before any code.

### Phase II: Data Understanding (4 tasks)
1. **Collect initial data** - Acquire and load into analysis environment.
2. **Describe data** - Document format, record count, field identities, surface properties.
3. **Explore data** - Query, visualize, identify relationships (this IS the EDA phase).
4. **Verify data quality** - Document quality issues: missing values, outliers, inconsistencies.

> **Claude skip risk:** Superficial exploration (df.describe() and moving on). PREVENT by requiring minimum 10 visualizations and written quality assessment.

### Phase III: Data Preparation (5 tasks)
1. **Select data** - Which datasets to use, document inclusion/exclusion rationale.
2. **Clean data** - Correct, impute, or remove erroneous values. THE LONGEST TASK (~80% of project).
3. **Construct data** - Derive new attributes (feature engineering).
4. **Integrate data** - Combine data from multiple sources.
5. **Format data** - Convert types, reshape as needed for modeling.

> **Claude skip risk:** Minimal cleaning, no feature engineering. PREVENT by requiring a "Data Preparation Report" documenting every transformation and WHY.

### Phase IV: Modeling (4 tasks)
1. **Select modeling techniques** - Choose algorithms based on problem type, data characteristics.
2. **Generate test design** - Train/test/validation splits, cross-validation strategy.
3. **Build model** - Execute, tune hyperparameters.
4. **Assess model** - Interpret results against domain knowledge and success criteria.

> **Claude skip risk:** Trying one model and declaring victory. PREVENT by requiring minimum 3 model families compared.

### Phase V: Evaluation (3 tasks)
1. **Evaluate results** - Do models meet BUSINESS success criteria (not just technical metrics)?
2. **Review process** - Was anything overlooked? Were all steps properly executed?
3. **Determine next steps** - Deploy, iterate further, or initiate new projects.

> **Claude skip risk:** Confusing model accuracy with business value. PREVENT by requiring stakeholder-language evaluation.

### Phase VI: Deployment (4 tasks)
1. **Plan deployment** - Document deployment strategy.
2. **Plan monitoring and maintenance** - Drift detection, retraining triggers.
3. **Produce final report** - Summary of findings and results.
4. **Review project** - Retrospective: what went well, what to improve.

> **Claude skip risk:** Stopping at "the model works." PREVENT by requiring monitoring plan before declaring done.

---

## 3. Quant Research Pipeline (Renaissance/Two Sigma/DE Shaw)

### The Systematic Alpha Discovery Protocol

World-class quant firms follow a hypothesis-driven process, NOT a data-dredging one:

#### Step 1: Hypothesis Formation
- Start from a **structural theory** or qualitative understanding of WHY a market inefficiency exists
- D.E. Shaw: "We typically start by formulating a hypothesis based on some sort of structural theory or qualitative understanding of the market"
- Examples: "Market makers widen spreads before earnings" or "Momentum persists in illiquid names due to slow information diffusion"

#### Step 2: Data Acquisition & Cleaning
- Petabyte-scale data warehouses including unconventional data (weather, satellite imagery, social media)
- Renaissance: staff with physics/signal processing backgrounds tap data peripheral to financial/economic phenomena
- Two Sigma: 60% non-financial backgrounds, 200+ PhDs, treat as technology company

#### Step 3: Statistical Testing
- Test hypothesis against historical data
- Multiple testing correction (Bonferroni, BH procedure) to avoid false discoveries
- Out-of-sample validation mandatory
- Walk-forward analysis (not just single train/test split)

#### Step 4: Rigorous Backtesting
- Transaction cost modeling (slippage, market impact, borrowing costs)
- Regime-aware testing (does it work in bull AND bear markets?)
- Capacity analysis (how much capital can this strategy absorb?)
- Drawdown analysis and tail risk assessment

#### Step 5: Paper Trading / Shadow Mode
- Run strategy in parallel with real markets, no real money
- Compare predicted fills with actual market conditions
- Identify execution challenges before going live

#### Step 6: Live Deployment with Risk Controls
- Position limits, drawdown stops, correlation monitoring
- Continuous monitoring for alpha decay
- Regular review: "Is the structural reason for this alpha still valid?"

### Key Principle: Hypothesis FIRST, Data SECOND
> The opposite of data mining. You must have a REASON before you test. If you can't articulate WHY something should work, it's probably overfitting.

### Claude-Specific Anti-Patterns to Prevent:
- **Data dredging**: Running 100 indicators and picking what "works" -- this is p-hacking
- **Survivorship bias**: Testing only on data that exists (ignoring delisted stocks, failed companies)
- **Look-ahead bias**: Using information that wasn't available at the time of the simulated decision
- **Overfitting**: Complex model that fits noise, not signal. Always prefer simpler models.

---

## 4. Pre-Mortem Analysis Protocol (Gary Klein)

### Why It Works
Research by Mitchell, Russo & Pennington (1989) found that **prospective hindsight increases ability to correctly identify reasons for future outcomes by 30%**. The brain activates a different region when thinking about the future -- the same region used for thinking about strangers -- enabling more objective analysis.

### The 7-Step Pre-Mortem Protocol

**Before ANY data science project begins:**

1. **Brief the team on the plan** - Describe the project, approach, timeline, expected deliverables.
2. **Declare failure as fact** - "It is 6 months from now. This project has FAILED completely. Not 'might fail' -- HAS failed."
3. **Individual silent generation** - Each person writes independently: "Why did it fail? What went wrong?" (5-10 minutes, no discussion)
4. **Share reasons aloud** - Each person reads their list. NO debate, NO objections. Just record everything.
5. **Group and theme** - Cluster similar failure reasons. Common themes for data science:
   - Data was worse than expected (missing, biased, wrong granularity)
   - Problem was ill-defined (stakeholder wanted something different)
   - Model didn't generalize (overfit to training data)
   - Deployment was impossible (infrastructure, latency, cost)
   - Assumptions were wrong (market regime changed, distribution shifted)
   - Timeline was unrealistic
6. **Assign probabilities** - For each failure mode, estimate P(this happens). Use mini-Delphi if needed.
7. **Create mitigation plans** - For high-probability failures, define specific prevention actions.

### Pre-Mortem Checklist for Data Science Projects

Ask these before starting:
- [ ] What if the data doesn't exist or is inaccessible?
- [ ] What if the signal-to-noise ratio is too low?
- [ ] What if the problem is fundamentally unpredictable?
- [ ] What if the model can't be deployed in production?
- [ ] What if stakeholders change requirements mid-project?
- [ ] What if the training distribution doesn't match production?
- [ ] What if a simpler heuristic outperforms our model?
- [ ] What if we can't explain the model's decisions?
- [ ] What if the data has survivorship bias or look-ahead bias?
- [ ] What if the relationship is correlational, not causal?

---

## 5. Comprehensive EDA Protocol (The 20-Point Checklist)

**MANDATORY before any modeling. No exceptions.**

### A. Structural Understanding
- [ ] 1. **What does one row represent?** If you can't explain this, STOP.
- [ ] 2. **Schema inventory**: List every column, its type, units, expected range
- [ ] 3. **First/last rows**: `df.head()`, `df.tail()` -- verify data boundaries
- [ ] 4. **Shape and memory**: How many rows/columns? Will it fit in memory?
- [ ] 5. **Data types check**: Are numbers stored as strings? Dates as objects?

### B. Quality Assessment
- [ ] 6. **Missing values**: Count per column, visualize missingness patterns (MCAR/MAR/MNAR?)
- [ ] 7. **Duplicates**: Exact duplicates AND near-duplicates
- [ ] 8. **Outliers**: IQR method, z-scores, domain-specific thresholds
- [ ] 9. **Impossible values**: Negative ages, future dates, prices of zero
- [ ] 10. **Consistency**: Same entity spelled differently, conflicting records

### C. Distribution Analysis
- [ ] 11. **Univariate distributions**: Histogram + KDE for every numeric feature
- [ ] 12. **Target variable distribution**: Is it balanced? Skewed? Zero-inflated?
- [ ] 13. **Central tendency & spread**: Mean, median, std, skewness, kurtosis
- [ ] 14. **Categorical frequencies**: Value counts, rare categories, cardinality

### D. Relationship Analysis
- [ ] 15. **Correlation matrix**: Pearson AND Spearman (captures non-linear monotonic)
- [ ] 16. **Scatter plots**: Target vs top features
- [ ] 17. **Multicollinearity**: VIF scores for highly correlated features
- [ ] 18. **Feature-target relationship**: Box plots of target across categorical features

### E. Critical Checks
- [ ] 19. **Data leakage scan**: Are any features derived from the target? Would this feature be available at prediction time?
- [ ] 20. **Temporal patterns**: If time-series, check stationarity, seasonality, trends. NEVER shuffle time-series data.

---

## 6. Feature Importance & Interpretability Protocol

### The Hierarchy (Use in Order)

#### Level 1: Inherently Interpretable Models
- Linear/logistic regression coefficients
- Decision tree feature splits
- EBM (Explainable Boosting Machine) from InterpretML
- **When to use**: Always start here. If performance is sufficient, STOP.

#### Level 2: SHAP (SHapley Additive exPlanations)
- Based on game theory (Shapley values)
- Provides BOTH global AND local explanations
- Handles non-linear relationships
- Computationally expensive
- **When to use**: Complex models where you need to understand both individual predictions AND overall feature importance
- **Key plots**: Summary plot (global), waterfall plot (local), dependence plots (interactions)

#### Level 3: LIME (Local Interpretable Model-agnostic Explanations)
- Fits local linear surrogate model around each prediction
- Fast but ONLY provides local explanations
- Can miss non-linear effects (fits linear model locally)
- **When to use**: Quick local explanations, simpler models, when SHAP is too slow

#### Level 4: Causal Inference (NEITHER SHAP NOR LIME)
- **CRITICAL**: SHAP and LIME show CORRELATIONAL importance, NOT causal
- SHAP tells you "this feature moved the prediction" -- NOT "this feature CAUSED the outcome"
- For causal questions, use: DoWhy, CausalML, instrumental variables, difference-in-differences, regression discontinuity
- **When to use**: When you need to know "what happens if we CHANGE this feature?"

### Claude Anti-Pattern Prevention
- NEVER say "Feature X causes outcome Y" based on SHAP values
- ALWAYS distinguish between "important for prediction" vs "causal driver"
- ALWAYS check for confounders before making causal claims
- Present SHAP alongside domain expertise, not as ground truth

---

## 7. Experiment Design & Sequential Testing Protocol

### The Peeking Problem
If you check results early in a standard A/B test and stop when p < 0.05, your actual false positive rate is ~21%, not 5%. This is because metric values fluctuate due to noise, and early stopping cherry-picks temporary significance.

### Sequential Testing Protocol (Always-Valid Inference)

1. **Pre-register**: Define hypothesis, primary metric, significance level, and minimum detectable effect BEFORE starting
2. **Use confidence sequences** (not fixed-horizon confidence intervals): These remain valid at ANY stopping time
3. **Adjust for peeking**: Statsig, Optimizely, and others use mSPRT (mixture Sequential Probability Ratio Test) to widen confidence intervals, keeping Type I error controlled
4. **Decision rules**:
   - If sequential CI excludes 0: Can declare significance (even early)
   - If sequential CI includes 0: Continue collecting data
   - If past maximum sample size: Accept null
5. **Monitor for regressions**: Sequential testing is especially valuable for catching unexpected negative effects early

### When Sequential Testing Is Critical
- **Opportunity cost is high**: Delaying a decision costs real money
- **Safety monitoring**: Need to detect harmful effects ASAP
- **Resource constraints**: Can't afford to wait for full sample size

### Experiment Design Checklist
- [ ] Hypothesis pre-registered with expected direction and effect size
- [ ] Primary metric defined (ONE, not five)
- [ ] Power analysis completed (minimum sample size calculated)
- [ ] Randomization unit defined (user-level, session-level?)
- [ ] Novelty/primacy effects accounted for (run long enough)
- [ ] Network effects considered (SUTVA violation check)
- [ ] Guardrail metrics defined (what MUST NOT degrade)
- [ ] Analysis plan written BEFORE data collection

---

## 8. Probabilistic Reasoning Protocol (Thinking in Bets)

### Core Framework (Annie Duke)

#### The Resulting Trap
- **Resulting** = judging decision quality by outcome quality
- Good decisions can have bad outcomes (and vice versa) due to luck
- ALWAYS evaluate the PROCESS, not the result
- Poker model > Chess model: Life has hidden information and luck

#### Protocol for Every Data Science Decision

1. **Express beliefs as probabilities**: "I'm 70% confident this model will generalize" -- never "I'm sure"
2. **Declare confidence ranges**: "I expect AUC between 0.72-0.85" -- not a point estimate
3. **Apply 10-10-10 rule**: What are consequences in 10 minutes? 10 months? 10 years?
4. **Seek disconfirming evidence**: Actively look for reasons you're WRONG
5. **Pre-mortem the decision**: Before committing, imagine it failed and ask why
6. **Backcast from success**: Imagine the project succeeded brilliantly -- what path led there?
7. **Update beliefs continuously**: Bayesian thinking -- new evidence should change your confidence

#### Truth-Seeking Group Rules (CUDOS Framework)
- **Communism**: Share data openly, even unflattering data
- **Universalism**: Evaluate claims on merit, regardless of who said them
- **Disinterestedness**: Separate ego from analysis
- **Organized Skepticism**: Structured doubt is a FEATURE, not a bug

### Claude-Specific Application
When Claude makes analytical claims, it MUST:
- State confidence level explicitly (e.g., "moderate confidence, ~65%")
- List top 3 reasons the conclusion could be WRONG
- Identify what evidence would CHANGE the conclusion
- Distinguish between "the data shows X" and "I believe X because..."

---

## 9. Data Science Project Planning Template

### Phase 0: Pre-Project (Before Writing Any Code)

```markdown
## Project Charter

### Problem Statement
- Business question in plain language: ___
- Why this matters (business impact): ___
- What success looks like (measurable): ___
- What failure looks like (pre-mortem results): ___

### Feasibility Assessment
- [ ] Data exists and is accessible
- [ ] Signal-to-noise ratio is plausible (domain expert check)
- [ ] Problem is predictable in principle (not pure randomness)
- [ ] Timeline is realistic (include data prep = 80% estimate)
- [ ] Deployment path exists (infra, latency, cost constraints known)

### Scope Definition
- In scope: ___
- Explicitly out of scope: ___
- Assumptions (each must be validated): ___
- Risks (from pre-mortem, with probability estimates): ___

### Success Criteria
- Technical metric: ___ (e.g., AUC > 0.8, RMSE < $50)
- Business metric: ___ (e.g., reduce churn by 5%, save $100K/year)
- Minimum viable: ___ (what's the "good enough" threshold?)

### Decision Points
- Go/no-go after EDA: Date ___
- Model selection checkpoint: Date ___
- Deployment readiness review: Date ___
```

---

## 10. The Unified Protocol: Combining Everything

### The World-Class Data Science Thinking Sequence

```
PRE-MORTEM (Section 4)
    |
    v
PROJECT CHARTER (Section 9)
    |
    v
CRISP-DM Phase I: Business Understanding (Section 2)
    |
    v
CRISP-DM Phase II: Data Understanding
    + EDA 20-Point Checklist (Section 5)
    + Probabilistic assessment of data quality (Section 8)
    |
    v
CRISP-DM Phase III: Data Preparation
    + Document every transformation with rationale
    |
    v
CRISP-DM Phase IV: Modeling
    + Hypothesis-driven approach from quant pipeline (Section 3)
    + Minimum 3 model families
    + Sequential testing for model comparison (Section 7)
    |
    v
CRISP-DM Phase V: Evaluation
    + SHAP/LIME for interpretability (Section 6)
    + Business metric evaluation (not just technical)
    + Probabilistic confidence in results (Section 8)
    |
    v
CRISP-DM Phase VI: Deployment
    + Monitoring plan
    + Drift detection
    + Retrospective
```

### The 5 Anti-Patterns Claude MUST Avoid

1. **Skipping to modeling** -- Always complete Phases I-III first
2. **Resulting** -- Never judge approach quality by a single outcome
3. **Data dredging** -- Always have a hypothesis BEFORE testing
4. **Correlation = Causation** -- SHAP importance is not causal evidence
5. **Premature certainty** -- Always express confidence as probabilities with ranges

---

## Key Reference Books

| Book | Author | Core Value | Key Takeaway |
|------|--------|-----------|--------------|
| Elements of Statistical Learning | Hastie, Tibshirani, Friedman | Mathematical foundations | Bias-variance tradeoff, regularization, model selection |
| Statistical Rethinking | McElreath | Bayesian thinking | Priors matter, posterior updating, causal inference with DAGs |
| Forecasting: Principles and Practice | Hyndman & Athanasopoulos | Time series rigor | Cross-validation for time series, forecast combination, uncertainty intervals |
| Feature Engineering and Selection | Kuhn & Johnson | Feature craft | Near-zero variance, encoding strategies, feature selection pipeline |
| Thinking in Bets | Annie Duke | Decision quality | Separate process from outcome, probabilistic reasoning |

*Last updated: 2026-04-01*
