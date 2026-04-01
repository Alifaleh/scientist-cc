---
title: "Root Cause Analysis: Why Claude Makes Stupid Data Science Decisions"
tags: [research, root-cause, data-science, claude-behavior, anti-stupidity, status/in-progress, priority/high]
source: "First-principles analysis + Claude Code source analysis + user feedback"
date: 2026-04-01
last_verified: 2026-04-01
related:
  - "[[Claude Code Source Analysis - Exploitable Patterns]]"
  - "[[../Knowledge Base/Principle - Rigor Over Speed]]"
  - "[[Data Science Rigor for Autonomous Agents]]"
---

# Why Claude Makes Stupid Data Science Decisions

> [!note] Key Insight
> Claude's data science failures stem from 5 root causes: (1) training bias toward completing tasks over verifying quality, (2) no built-in statistical intuition, (3) default system prompt rewards brevity over rigor, (4) no concept of "regimes" or data representativeness, and (5) pattern-matching on surface features instead of understanding causal mechanisms.

## The 5 Root Causes

### 1. Task Completion Bias (Training → Impulsiveness)
Claude is trained to be helpful by completing tasks. When given "analyze this data and find an edge," the training incentive is to PRODUCE an answer, not to VERIFY the answer is valid. This creates:
- Jumping to implementation before understanding the data
- Reporting any pattern found as if it's meaningful
- Treating the first result as the final result
- Not questioning whether the approach is fundamentally flawed

**Module: Planning → Impulsiveness**

### 2. No Statistical Intuition (Reasoning → Overfitting)
Claude has memorized statistical formulas but doesn't have INTUITION about:
- What a "large enough sample" feels like (30? 100? 10,000? Depends on effect size!)
- When a pattern is real vs. noise (p < 0.05 isn't enough with multiple comparisons)
- Why training accuracy means NOTHING without out-of-sample testing
- How rare events require exponentially more data to model reliably

**Module: Reasoning → Overfitting + Narrative Fallacy**

### 3. Default Brevity Override (Action → Robot Behavior)
Claude Code's system prompt says "4 lines max" and "minimize tokens." This actively PREVENTS the deep analysis needed for data science. A real scientist would:
- Write pages of exploratory analysis before concluding anything
- Generate dozens of plots before forming a hypothesis
- Question every assumption explicitly in writing
- Document negative results as thoroughly as positive ones

**Module: Action → Robot behavior (executing steps mechanically)**

### 4. No Regime Awareness (Memory → Hallucination)
Claude has no built-in concept of data representativeness. When given a dataset:
- It doesn't check: "Does this data cover bull, bear, sideways, and volatile periods?"
- It doesn't check: "Is the training period representative of future conditions?"
- It doesn't check: "Are there structural breaks that invalidate the whole sample?"
- It treats whatever data is available as "the data" without questioning completeness

**Module: Memory → Hallucination (treating partial data as complete)**

### 5. Pattern-Matching Over Mechanism (Reasoning → Confirmation Bias)
Claude finds ANY correlation and treats it as meaningful:
- "Feature X correlates with target Y, therefore X predicts Y" — ignoring spurious correlation
- "Model achieves 80% accuracy" — not asking "on what data? what baseline? what's the cost of errors?"
- "Adding this feature improved the model" — not checking for data leakage
- Reporting R² of 0.95 as success without checking if it's overfit

**Module: Reasoning → Confirmation Bias + Narrative Fallacy**

## The Anti-Stupidity Protocol (Draft)

For EVERY data science task, Claude MUST follow these steps IN ORDER. Skipping any step = stupid decision.

### Phase 0: UNDERSTAND (before touching any code)
- [ ] What is the question we're trying to answer? (Write it as a hypothesis)
- [ ] What would a WRONG answer look like? (Define failure modes)
- [ ] What would a CORRECT answer look like? (Define success criteria with numbers)
- [ ] What data do we need? (Size, features, time period, regimes)

### Phase 1: DATA AUDIT (before any analysis)
- [ ] How much data do we have? (Rows, columns, time span)
- [ ] What's the distribution of the target variable?
- [ ] Are ALL regimes represented? (Bull, bear, sideways, volatile, crisis)
- [ ] Are there structural breaks? (COVID, policy changes, market structure changes)
- [ ] Missing data? Outliers? Data quality issues?
- [ ] Is the data survivor-biased? (Only includes entities that survived)

### Phase 2: FEATURE ENGINEERING (with anti-leakage checks)
- [ ] Can this feature be computed at prediction time? (No future data!)
- [ ] Does this feature contain the target? (Target leakage!)
- [ ] Is this feature stable across regimes? (Or does it only work in one regime?)
- [ ] Feature correlation matrix — are features redundant?
- [ ] Feature importance — do features make CAUSAL sense?

### Phase 3: MODELING (with anti-overfitting checks)
- [ ] Train/validation/test split (TEMPORAL for time series — never random!)
- [ ] Cross-validation (time-series CV, not k-fold for temporal data!)
- [ ] Start with simplest model (linear regression, decision tree)
- [ ] Compare against baseline (random, mean, buy-and-hold)
- [ ] Regularization (L1/L2/dropout — appropriate for model type)
- [ ] Learning curves — does more data help? (If not, model is too simple or data is noise)

### Phase 4: VALIDATION (the most important phase)
- [ ] Out-of-sample performance (NEVER report in-sample results)
- [ ] Performance by regime (Does it work in ALL regimes or just one?)
- [ ] Statistical significance (p < 0.01 after Bonferroni correction)
- [ ] Economic significance (Even if statistically significant, is the effect large enough to matter?)
- [ ] Sensitivity analysis (Small changes to parameters → small changes to results?)
- [ ] Walk-forward test (Apply the model to progressively newer data)

### Phase 5: HONEST REPORTING
- [ ] Report ALL experiments, not just successful ones
- [ ] Include confidence intervals for ALL metrics
- [ ] State limitations and assumptions explicitly
- [ ] Compare against the best known alternative approach
- [ ] Acknowledge what the model DOESN'T capture

## What Needs to Change in the Framework

1. **New reference doc:** `data-science-comprehensive.md` — the FULL anti-stupidity protocol
2. **Update OBSERVE step:** Must include Data Audit as mandatory sub-step
3. **Update VALIDATE step:** Must include regime analysis and out-of-sample testing
4. **Update HYPOTHESIZE step:** Must require mechanism, not just correlation
5. **New thinking methodology:** "Before analyzing data, THINK about what you expect to find and WHY"
