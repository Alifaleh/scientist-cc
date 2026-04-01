---
title: "Advanced Data Analysis Planning & Procedure Frameworks"
tags: [research, data-science, methodology, planning, frameworks, pre-registration, EDA, DOE, DMAIC, sequential-analysis, sensitivity-analysis, status/complete, priority/critical]
source: "Synthesized from Pre-registration (Open Science Framework), DMAIC/Six Sigma, Tukey EDA (1977), Fisher DOE, Wald Sequential Analysis, Sensitivity Analysis literature"
date: 2026-04-01
last_verified: 2026-04-01
related:
  - "[[Comprehensive Data Science Methodology Reference]]"
  - "[[LLM Data Analysis Anti-Stupidity Protocols]]"
  - "[[Hypothesis-Driven Development for AI Research]]"
---

# Advanced Data Analysis Planning & Procedure Frameworks

> [!tip] Purpose
> Step-by-step PROCEDURES used by world-class scientists and quant researchers. Each framework is a complete protocol with exact ordering. This document answers: "What steps do I follow, in what order, and WHY does each step matter?" Consult BEFORE starting any analysis.

> [!warning] AI Agent Failure Modes Per Framework
> Each framework section includes a "What an AI Scientist Skips" callout. These are the steps that autonomous agents systematically omit because they create no immediate visible output. Skipping them is how analyses silently become invalid.

---

## 1. PRE-REGISTRATION PROTOCOL (Declare Before You Discover)

### What It Is
Pre-registration means writing your COMPLETE analysis plan BEFORE seeing results. It is the single most powerful tool against p-hacking, HARKing (Hypothesizing After Results are Known), and confirmation bias. The replication crisis exists because researchers skip this.

### Why It Matters
Without pre-registration, the human (or AI) brain will unconsciously fit the narrative to the data. You will "discover" patterns that were actually chosen because they looked good, not because they were predicted. Pre-registration creates an immutable record of what you expected, making it impossible to retroactively claim you predicted what you found.

### The Complete Pre-Registration Document (10 Components)

Write ALL of these BEFORE touching data:

**Step 1: State hypotheses explicitly**
- Write each hypothesis as a testable, falsifiable statement
- Include direction ("X increases Y" not just "X affects Y")
- Distinguish primary hypothesis from secondary/exploratory
- WHY: Forces clarity. If you can't state it precisely, you don't have a hypothesis

**Step 2: Define the sampling procedure**
- How will data be collected/selected?
- What population does the sample represent?
- What inclusion/exclusion criteria apply?
- WHY: Prevents post-hoc data exclusion to get better results

**Step 3: Specify sample size with justification**
- Conduct power analysis BEFORE data collection
- State target power (typically 0.80), alpha (0.05), and minimum detectable effect size
- If using existing data, state the sample size and acknowledge power limitations
- WHY: Prevents stopping data collection when results "look significant"

**Step 4: Declare variables**
- Independent variables (what you manipulate/observe)
- Dependent variables (what you measure)
- Control variables (what you hold constant)
- Covariates (what you adjust for)
- WHY: Prevents adding/removing variables to improve results

**Step 5: Specify data exclusion criteria**
- Exact rules for removing outliers (e.g., ">3 SD from mean")
- Criteria for excluding participants/observations
- How missing data will be handled
- WHY: Prevents selective exclusion of inconvenient data points

**Step 6: Declare the exact statistical tests**
- Primary test for each hypothesis
- One-tailed vs two-tailed
- Parametric vs non-parametric choice with justification
- Multiple comparisons correction method
- WHY: Prevents test-shopping (trying tests until one gives p<0.05)

**Step 7: Define the analysis pipeline**
- Exact sequence of data transformations
- Feature engineering steps (if any)
- Model specification (if modeling)
- Hyperparameter search space (if applicable)
- WHY: Prevents "researcher degrees of freedom" -- the hidden choices that inflate false positive rates

**Step 8: Specify success/failure criteria**
- What p-value threshold means "significant"?
- What effect size is "meaningful"?
- What would make you REJECT your hypothesis?
- WHY: Prevents moving goalposts after seeing results

**Step 9: Declare planned robustness checks**
- Which sensitivity analyses will you run?
- What alternative specifications will you test?
- Under what conditions would robustness failure invalidate the main result?
- WHY: Locks in the robustness standard before you know if it will help or hurt

**Step 10: Timestamp and freeze**
- Save the document with a timestamp before ANY data analysis begins
- Git commit the pre-registration document
- Any deviations from the plan MUST be transparently reported with justification
- WHY: Creates an immutable audit trail

> [!danger] What an AI Scientist Skips
> **Steps 3, 5, and 8.** AI agents jump straight to running tests without power analysis, without exclusion criteria, and without defining what failure looks like. This means the AI will ALWAYS find "something interesting" because it never defined what "nothing interesting" looks like. The result is unfalsifiable analysis.

### Pre-Registration Template (Copy-Paste)

```markdown
## Pre-Registration: [Analysis Title]
Date: [YYYY-MM-DD]
Analyst: [Name]

### Hypotheses
H1 (primary): [Specific, directional, falsifiable statement]
H2 (secondary): [...]
Exploratory: [Anything not covered above goes here and is labeled exploratory]

### Data
Source: [Where the data comes from]
Population: [What the sample represents]
Sample size: [N, with power analysis justification]
Time period: [Start-end dates]
Inclusion criteria: [Who/what is included]
Exclusion criteria: [Who/what is excluded and why]

### Variables
DV: [What we measure]
IV: [What we manipulate/observe]
Controls: [What we hold constant]
Covariates: [What we adjust for]

### Analysis Plan
Primary test for H1: [Exact test, one/two-tailed, alpha level]
Primary test for H2: [...]
Multiple comparisons correction: [Method]
Missing data handling: [Method]
Outlier treatment: [Exact rule]

### Success/Failure Criteria
H1 supported if: [Exact conditions]
H1 rejected if: [Exact conditions]
Minimum meaningful effect size: [Value with justification]

### Robustness Checks
1. [Alternative specification]
2. [Subset analysis]
3. [Different statistical test]

### Deviations Log
[Any changes from this plan MUST be documented here with justification]
```

---

## 2. EXPLORATORY vs. CONFIRMATORY ANALYSIS PROTOCOL

### The Critical Distinction

This is the single most important methodological concept most people (and all AI agents) ignore:

| | Exploratory (EDA) | Confirmatory (CDA) |
|---|---|---|
| **Goal** | Generate hypotheses | Test hypotheses |
| **Data** | Look at everything | Test pre-specified things |
| **Attitude** | "What's interesting here?" | "Is this specific thing true?" |
| **Statistics** | Descriptive, visual | Inferential, p-values |
| **Multiple testing** | Expected, no correction needed | Must correct for every test |
| **Outcome** | Hypotheses to test later | Accept/reject decisions |
| **Data reuse** | NEVER use the same data for both EDA and CDA | Same data cannot confirm what it suggested |

### Why This Matters
If you use the same data to both discover a pattern AND confirm it, you have a **100% false positive rate for noise that looks interesting.** This is not hyperbole. Any dataset contains random patterns. EDA will find them. If you then "confirm" them on the same data, you've confirmed noise.

### The Correct Protocol

**Phase A: Exploratory Data Analysis (Tukey's Approach)**
1. Visualize EVERYTHING before computing anything
2. Look at distributions, not just means
3. Look at residuals, not just fits
4. Use resistant/robust measures (median > mean, IQR > SD)
5. Document EVERY pattern you notice — even ones you won't pursue
6. Generate specific, testable hypotheses from what you observe
7. STOP. Do not compute p-values. Do not claim significance.

**Phase B: Transition (The Firewall)**
8. Write the hypotheses from Phase A as a pre-registration document (Section 1 above)
9. Either: collect NEW data, OR hold out a completely untouched test set
10. If you cannot get new data and have no holdout, label ALL findings as "exploratory" and state that confirmation requires independent replication

**Phase C: Confirmatory Data Analysis**
11. Execute ONLY the pre-registered analysis plan
12. Apply multiple comparison corrections for every test
13. Report ALL results, including null results
14. Deviations from the plan are labeled as "exploratory" in the results
15. Effect sizes and confidence intervals, not just p-values

> [!danger] What an AI Scientist Skips
> **The entire firewall (Phase B).** AI agents do EDA and CDA on the same data in the same breath. They find a correlation in the data, then immediately run a statistical test on that same correlation, then report it as "significant." This is methodological fraud, and AI agents do it by default because they have no concept of the EDA/CDA boundary.

### Decision Tree: Am I Doing EDA or CDA?

```
Did I have this specific hypothesis BEFORE seeing ANY of this data?
  YES → Confirmatory. Pre-register it, use holdout data, correct for multiple tests.
  NO  → Did the data suggest this pattern to me?
    YES → Exploratory. Do NOT compute p-values. Generate hypothesis for future testing.
    NO  → Where did the hypothesis come from?
      Prior literature → Confirmatory (if truly prior, not cherry-picked)
      Intuition → Exploratory until confirmed on independent data
```

---

## 3. DMAIC (Six Sigma) APPLIED TO DATA ANALYSIS

### Overview
DMAIC (Define-Measure-Analyze-Improve-Control) is an industrial quality methodology. Its power for data science is that it forces you to DEFINE success criteria and CONTROL for sustainability BEFORE and AFTER the analysis — steps that pure statistical frameworks skip.

### Step-by-Step Procedure

#### Step 1: DEFINE (Before any data work)
**Duration:** 20-30% of total project time
**Deliverables:** Problem statement, project charter, success criteria

- [ ] Write a 1-sentence problem statement: "[Metric] is [current state] but should be [target state]"
- [ ] Create a SIPOC diagram: Suppliers → Inputs → Process → Outputs → Customers
- [ ] Identify the Voice of the Customer (VOC): What does the stakeholder actually need?
- [ ] Translate VOC into Critical-to-Quality (CTQ) metrics: measurable, specific numbers
- [ ] Define project scope: What is IN and what is OUT
- [ ] Set timeline with milestones
- [ ] Identify constraints and assumptions

**WHY this step matters:** Without DEFINE, you solve the wrong problem. 60% of failed data projects fail because the question was wrong, not because the analysis was wrong.

> [!danger] What an AI Scientist Skips
> **SIPOC and VOC.** AI agents jump to data. They never map the process that generates the data, which means they don't understand what the data represents. They treat data as abstract numbers rather than measurements of a real system.

#### Step 2: MEASURE (Establish baselines)
**Duration:** 15-20% of total project time
**Deliverables:** Baseline metrics, data collection plan, measurement system validation

- [ ] Define operational definitions for ALL metrics (exactly how each is calculated)
- [ ] Validate the measurement system: Is the data accurate? Precise? Consistent?
- [ ] Collect baseline data: What is the current performance?
- [ ] Create a data collection plan: What data, from where, how much, how often?
- [ ] Calculate process capability: Is the current process capable of meeting CTQs?
- [ ] Document data quality issues found

**WHY this step matters:** If your measurements are garbage, your analysis is garbage. Gage R&R studies find that 30%+ of observed variation is often measurement noise, not real signal.

#### Step 3: ANALYZE (Find root causes)
**Duration:** 20-25% of total project time
**Deliverables:** Validated root causes, statistical evidence

- [ ] Create a fishbone (Ishikawa) diagram of ALL potential causes
- [ ] Prioritize causes using data, not opinion
- [ ] For each potential cause: test with data (correlation, hypothesis test, regression)
- [ ] Validate root causes: Can you demonstrate cause → effect, not just correlation?
- [ ] Use the "5 Whys" technique to get past surface-level causes
- [ ] Document which potential causes were ELIMINATED and why

**WHY this step matters:** Most analyses stop at correlation. DMAIC demands you validate causation through structured root cause analysis. This prevents the "correlation = causation" trap.

#### Step 4: IMPROVE (Design and test solutions)
**Duration:** 20-25% of total project time
**Deliverables:** Tested solution, implementation plan

- [ ] Generate multiple solution options (brainstorm, DOE, benchmarking)
- [ ] Evaluate solutions against CTQs defined in DEFINE
- [ ] Pilot the solution on a small scale FIRST
- [ ] Use PDCA (Plan-Do-Check-Act) cycles for iterative improvement
- [ ] Conduct FMEA (Failure Mode and Effects Analysis) before full deployment
- [ ] Quantify improvement: compare to MEASURE baseline

**WHY this step matters:** Forces piloting before full deployment. In data science, this means testing on holdout data before declaring victory.

#### Step 5: CONTROL (Sustain the improvement)
**Duration:** 10-15% of total project time
**Deliverables:** Control plan, monitoring dashboard, handoff documentation

- [ ] Create a control plan: What to monitor, how often, who owns it
- [ ] Implement control charts for key metrics (detect drift)
- [ ] Document standard operating procedures
- [ ] Train the team / document for future analysts
- [ ] Set triggers for when to re-analyze (performance degradation thresholds)
- [ ] Close the project: sign off benefits, release resources

**WHY this step matters:** Without CONTROL, improvements decay. Models drift, data distributions shift, and nobody notices until it's too late. This step is what separates one-off analysis from sustainable insight.

> [!danger] What an AI Scientist Skips
> **CONTROL entirely.** AI agents never create monitoring plans. They deliver results and move on. This means every analysis has a hidden expiration date that nobody tracks.

---

## 4. TUKEY'S EXPLORATORY DATA ANALYSIS (EDA) METHODOLOGY

### Philosophy
John Tukey (1977) argued that statisticians were obsessed with testing hypotheses (confirmation) and neglected the art of discovering what data has to tell (exploration). His key insight: **Confusing exploration with confirmation on the same data leads to systematic bias.**

### The EDA Protocol (Exact Steps)

#### Step 1: Look at the data raw
- Print the first and last 10 rows
- Check data types, formats, encodings
- Look for obvious errors (negative ages, future dates, impossible values)
- WHY: Catches data pipeline errors before they corrupt everything downstream

#### Step 2: Univariate exploration (one variable at a time)
- For each numeric variable: histogram, box plot, 5-number summary (min, Q1, median, Q3, max)
- For each categorical variable: frequency table, bar chart
- Use RESISTANT statistics (median and IQR, not mean and SD) initially
- WHY: Resistant statistics aren't distorted by outliers. Mean and SD can be meaningless for skewed data

#### Step 3: Look at what's missing
- Missing data heatmap
- Is missingness correlated with other variables?
- Missing completely at random (MCAR), missing at random (MAR), or missing not at random (MNAR)?
- WHY: Missing data patterns often contain MORE information than the data itself

#### Step 4: Bivariate exploration (pairs of variables)
- Scatter plots for numeric-numeric pairs
- Box plots for categorical-numeric pairs
- Contingency tables for categorical-categorical pairs
- Correlation matrix with heatmap
- WHY: Relationships between variables are where the science lives. Single variables are boring.

#### Step 5: Look at residuals, not just fits
- If you fit any model (even linear regression), plot the residuals
- Residuals vs fitted values (check homoscedasticity)
- Residual QQ plot (check normality)
- Residuals vs each predictor (check linearity)
- WHY: Residuals show you what the model DIDN'T capture. They're where the next discovery lives.

#### Step 6: Use transformations freely
- Log transforms for right-skewed data
- Square root for count data
- Box-Cox for general power transformations
- Re-express data to make patterns linear and spreads equal
- WHY: Many "non-linear" patterns are just linear patterns in a transformed space

#### Step 7: Document discoveries as hypotheses
- For every pattern found: write it as a testable hypothesis
- Note which were EXPECTED and which were SURPRISING
- DO NOT compute p-values during EDA
- WHY: This is the raw material for the confirmatory phase. Computing p-values during EDA is the cardinal sin.

### Tukey's Key Principles (Attitudes, Not Techniques)
1. **"The greatest value of a picture is when it forces us to notice what we never expected to see"** — Always visualize before computing
2. **"It is important to understand what you CAN DO before you learn to measure how WELL you seem to have DONE it"** — Exploration before inference
3. **Use both eyes** — Look at data from multiple angles (different plots, different transformations, different subsets)
4. **Be suspicious of smooth stories** — Real data is messy. If the results are too clean, something is wrong.
5. **Resistant and robust methods first** — Don't let outliers dominate your initial understanding

> [!danger] What an AI Scientist Skips
> **Steps 5 and 6, plus the entire attitude.** AI agents compute summary statistics and declare understanding. They rarely look at residuals (where the real insights hide) and almost never try transformations. Worse, they treat EDA as a box to check rather than a genuine investigation. The AI rushes through EDA to get to the "real" analysis, missing the point entirely: EDA IS the real analysis.

---

## 5. DESIGN OF EXPERIMENTS (DOE) METHODOLOGY

### Overview
DOE (Fisher, 1935) is the science of planning experiments to extract maximum information with minimum resources. It is radically different from observational data analysis because YOU choose what to test.

### Fisher's Three Principles (Non-Negotiable)

**1. Randomization**
- Randomly assign experimental units to treatments
- WHY: Eliminates systematic bias from confounding variables — even ones you don't know about
- Without randomization: you can prove correlation, NEVER causation

**2. Replication**
- Repeat each treatment on multiple experimental units
- WHY: Enables estimation of experimental error. Without replication, you cannot distinguish signal from noise
- Minimum: 3 replicates per treatment (5-10 preferred)

**3. Blocking**
- Group similar experimental units together, then randomize within groups
- WHY: Reduces noise from known nuisance variables (e.g., different days, different machines, different market regimes)
- Blocks what you CAN control, randomize what you CANNOT

### DOE Step-by-Step Protocol

**Step 1: Define the objective**
- What factor(s) do you want to study?
- What response variable(s) will you measure?
- What is the practical significance threshold?

**Step 2: Identify factors and levels**
- List ALL factors that could affect the response
- For each factor: choose levels to test (typically 2-3 per factor)
- Distinguish between factors of interest and nuisance factors (block these)

**Step 3: Choose the experimental design**
| Situation | Design |
|---|---|
| 1 factor, 2+ levels | Completely Randomized Design (CRD) |
| 2-4 factors, want ALL interactions | Full Factorial (2^k or 3^k) |
| 5+ factors, screening | Fractional Factorial (2^(k-p)) |
| Nuisance variable present | Randomized Complete Block Design (RCBD) |
| Sequential optimization | Response Surface Methodology (RSM) |
| Resource-constrained | Latin Square or Plackett-Burman |

**Step 4: Determine sample size**
- Power analysis based on minimum detectable effect size
- Rule of thumb: 5-10 observations per cell in factorial designs
- Total runs = (levels^factors) x replicates

**Step 5: Randomize the run order**
- Use a random number generator, NOT systematic ordering
- WHY: Systematic ordering confounds time trends with treatment effects

**Step 6: Execute the experiment**
- Follow the protocol EXACTLY as designed
- Record ALL unexpected events (deviations log)
- If something goes wrong: document and continue, don't restart selectively

**Step 7: Analyze**
- ANOVA for factorial designs
- Check assumptions: normality of residuals, homogeneity of variance
- Look at interaction plots, main effects plots
- Use Tukey HSD or similar for post-hoc pairwise comparisons

**Step 8: Confirm**
- Run confirmation experiments at the optimal settings
- Validate that predictions from the model match reality
- WHY: The model was fit to the experimental data. Confirmation experiments use NEW data.

> [!danger] What an AI Scientist Skips
> **Steps 2 (nuisance factor identification), 3 (design selection), and 5 (randomization).** AI agents treat all variables as interesting and skip blocking. They run full factorials when screening designs would suffice (wasting resources) or miss interactions by testing one-factor-at-a-time. And they almost never randomize run order, which confounds time effects with treatment effects.

---

## 6. SEQUENTIAL ANALYSIS & STOPPING RULES

### The Problem
When do you stop collecting data? Most analyses either use a fixed sample size (often arbitrary) or — worse — stop when results "look significant." The latter inflates false positive rates from 5% to 50%+.

### Wald's Sequential Probability Ratio Test (SPRT)

The foundational method. You compute a likelihood ratio as each data point arrives and compare it to two boundaries:

**Procedure:**
1. **Before starting:** Set alpha (Type I error rate) and beta (Type II error rate)
2. **Compute boundaries:**
   - Upper boundary A = (1 - beta) / alpha — cross this → reject H0
   - Lower boundary B = beta / (1 - alpha) — cross this → accept H0
3. **After each observation:** Compute the cumulative log-likelihood ratio
4. **Decision:**
   - If ratio >= A: STOP, reject H0
   - If ratio <= B: STOP, accept H0
   - If B < ratio < A: CONTINUE sampling
5. **Key property:** Controls BOTH Type I and Type II error rates at specified levels

**WHY it matters:** SPRT reaches conclusions 50-70% faster than fixed-sample tests on average, while maintaining the same error guarantees.

### Alpha Spending Functions (Modern Sequential Testing)

For more complex designs (interim analyses, group sequential trials):

**Step 1: Pre-specify the maximum sample size and number of interim looks**
**Step 2: Choose an alpha spending function:**
- **O'Brien-Fleming:** Spends very little alpha early, most at the end (conservative, recommended)
- **Pocock:** Spends alpha equally across looks (more likely to stop early, less power at end)
- **Haybittle-Peto:** Uses very strict threshold (e.g., p<0.001) at interim, nominal at final

**Step 3: At each interim look:**
- Compute test statistic
- Compare to the ADJUSTED boundary (not the nominal alpha)
- If boundary crossed: STOP
- If not: CONTINUE to next look

**Step 4: At the final analysis:**
- Use the remaining alpha
- This is your last chance to reject H0

### Stopping Rules Checklist

- [ ] The stopping rule was defined BEFORE data collection began
- [ ] If using sequential testing: alpha is adjusted for multiple looks
- [ ] The total number of looks was pre-specified (or alpha spending function is used)
- [ ] Early stopping for futility is also considered (not just for significance)
- [ ] If stopped early: report the actual stopping point and adjusted confidence intervals
- [ ] If the test was NEVER intended to be sequential: do NOT peek at intermediate results

> [!danger] What an AI Scientist Skips
> **All of it.** AI agents either run analyses on whatever data is available (no sample size planning) or run iterative analyses, checking results each time, without adjusting alpha. This is "optional stopping" and it GUARANTEES inflated false positive rates. An AI that checks results after each batch of data and stops when p<0.05 will find "significant" results in pure noise ~30% of the time instead of 5%.

---

## 7. SENSITIVITY ANALYSIS & ROBUSTNESS CHECKS

### What It Is
Sensitivity analysis answers: "Would my conclusion change if my assumptions were different?" A result that only holds under one specific set of assumptions is FRAGILE and should not be trusted.

### The Robustness Testing Protocol

#### Level 1: Specification Sensitivity (Always Do This)

**Step 1: Vary the model specification**
- Run the analysis with different model families (linear, non-linear, tree-based)
- Add/remove control variables one at a time
- Try different functional forms (linear, quadratic, log)
- PASS if: Main conclusion survives all reasonable specifications

**Step 2: Vary the sample**
- Remove the top and bottom 5% of observations
- Run on random subsets (bootstrap resampling)
- Run on different time periods or subgroups
- PASS if: Effect direction and approximate magnitude remain stable

**Step 3: Vary the outcome measure**
- If possible, use alternative measures of the same concept
- Use different aggregation methods (mean vs median, daily vs weekly)
- PASS if: Conclusion is robust to reasonable alternative operationalizations

#### Level 2: Assumption Sensitivity (Do For Important Results)

**Step 4: Test distributional assumptions**
- Non-parametric alternative to every parametric test
- Bootstrap confidence intervals alongside analytical ones
- Does the result hold if outliers are treated differently?
- PASS if: Parametric and non-parametric methods agree

**Step 5: Test for influence of individual observations**
- Cook's distance or DFBETAS for regression
- Leave-one-out analysis: does any single observation drive the result?
- PASS if: No single observation or small cluster changes the conclusion

**Step 6: Placebo tests and falsification**
- Test your method on outcomes it SHOULD NOT predict
- If your method "works" on placebo outcomes, it's detecting noise
- Example: if a trading signal predicts returns, also test if it "predicts" past returns (it shouldn't)
- PASS if: Method works on real outcomes and FAILS on placebo outcomes

#### Level 3: Global Sensitivity (Do For Critical/Published Results)

**Step 7: Variance-based sensitivity (Sobol indices)**
- Decompose output variance by input factor
- First-order index: direct contribution of each input
- Total-order index: contribution including all interactions
- WHY: Reveals which inputs actually drive the result and which are irrelevant

**Step 8: Monte Carlo sensitivity**
- Assign probability distributions to uncertain inputs
- Run 1000+ simulations sampling from these distributions
- Examine the distribution of outputs
- PASS if: Conclusion holds across the bulk of the output distribution

**Step 9: Scenario analysis**
- Best case, worst case, most likely case
- Identify "break-even" scenarios: what assumptions would need to be true for the conclusion to reverse?
- PASS if: The conclusion only fails under implausible scenarios

### Robustness Reporting Template

```markdown
## Robustness Assessment for [Analysis Title]

### Main Result
[State the primary finding]

### Specification Sensitivity
| Variation | Result | Direction Preserved? | Magnitude Similar? |
|---|---|---|---|
| [Alternative model] | [Result] | [Yes/No] | [Yes/No] |
| [Removed outliers] | [Result] | [Yes/No] | [Yes/No] |
| [Different time period] | [Result] | [Yes/No] | [Yes/No] |

### Assumption Sensitivity
| Test | Result | Conclusion Changed? |
|---|---|---|
| [Non-parametric alternative] | [Result] | [Yes/No] |
| [Leave-one-out] | [Result] | [Yes/No] |
| [Placebo test] | [Result] | [Pass/Fail] |

### Overall Robustness Verdict
[ ] ROBUST: Conclusion survives all reasonable checks
[ ] PARTIALLY ROBUST: Conclusion holds but magnitude is sensitive to [specific assumption]
[ ] FRAGILE: Conclusion depends critically on [specific assumption] — treat with extreme caution
```

> [!danger] What an AI Scientist Skips
> **Levels 2 and 3 entirely, and most of Level 1.** AI agents run ONE model with ONE specification and declare results. They never ask "what if I'm wrong about my assumptions?" They never run placebo tests. They never check if a single outlier drives the entire result. This means AI-produced results have unknown fragility — they might be rock-solid or they might be one outlier away from reversal, and nobody knows because nobody checked.

---

## 8. INTEGRATED MASTER PROTOCOL: THE COMPLETE PROCEDURE

This synthesizes all seven frameworks into one sequential protocol. Follow this order.

### Phase 0: PRE-ANALYSIS PLANNING
1. **DEFINE the question** (DMAIC Step 1): One sentence. What metric needs to change?
2. **Map the data-generating process** (DMAIC SIPOC): Where does this data come from? What process produces it?
3. **Write the pre-registration** (Section 1): Hypotheses, tests, success criteria, robustness plan
4. **Design the experiment** (DOE, if applicable): Randomization, blocking, replication, sample size
5. **Set stopping rules** (Section 6): When will you stop collecting data? How will you adjust for interim looks?

### Phase 1: EXPLORATORY DATA ANALYSIS
6. **Raw data inspection** (Tukey Step 1): Print, visualize, smell the data
7. **Univariate exploration** (Tukey Step 2): Distributions, outliers, missing patterns
8. **Bivariate exploration** (Tukey Step 4): Correlations, relationships, scatter plots
9. **Document discoveries** (Tukey Step 7): Every pattern → hypothesis. No p-values yet.
10. **UPDATE the pre-registration** if EDA reveals problems (e.g., data quality issues that require plan changes). Document the update transparently.

### Phase 2: CONFIRMATORY ANALYSIS
11. **Execute the pre-registered analysis plan** (Section 2 Phase C): ONLY the planned tests
12. **Apply stopping rules** if analyzing sequentially (Section 6)
13. **Report ALL results** including nulls. No cherry-picking.
14. **Separate clearly** what was pre-registered (confirmatory) from what was discovered during EDA (exploratory)

### Phase 3: ROBUSTNESS VERIFICATION
15. **Level 1 robustness** (Section 7): Vary specification, sample, outcome measure
16. **Level 2 robustness** (Section 7): Test assumptions, check influential observations, placebo tests
17. **Level 3 robustness** (Section 7, if critical): Sobol indices, Monte Carlo, scenario analysis
18. **Assign robustness verdict**: Robust / Partially Robust / Fragile

### Phase 4: CONTROL & DOCUMENTATION
19. **Create a monitoring plan** (DMAIC Step 5): What to track, how often, who owns it
20. **Set drift detection thresholds**: When should this analysis be rerun?
21. **Document everything**: Methods, results, deviations, robustness, limitations
22. **Archive the analysis** with all code, data references, and the pre-registration document

> [!tip] The Anti-Skip Rule
> Before moving to the NEXT phase, verify that ALL steps in the current phase are complete. The entire point of this protocol is that each phase depends on the previous one being done properly. Skipping Phase 0 makes Phase 2 meaningless (you're confirming nothing). Skipping Phase 3 makes Phase 2 untrustworthy (you don't know if results are fragile).

---

## Cross-Links

- [[Comprehensive Data Science Methodology Reference]] — Detailed checklists for individual analysis steps (sample size tables, CV methods, test selection flowchart)
- [[LLM Data Analysis Anti-Stupidity Protocols]] — 15 specific failure modes with detection and prevention
- [[AI Self-Improvement Frameworks]] — How the scientist loop prevents these errors through structured methodology

*Last updated: 2026-04-01*
