---
name: statistical-testing
description: Advanced statistical testing protocol. Use when performing hypothesis tests, computing p-values, confidence intervals, comparing models, testing significance, running A/B tests, or making ANY claim about statistical relationships. Prevents p-hacking, multiple comparison errors, and false discoveries.
---

# Statistical Testing Skill

## Test Selection Flowchart

```
What are you testing?
│
├── Comparing 2 groups?
│   ├── Normal data? → Welch's t-test (NOT Student's t)
│   └── Non-normal? → Mann-Whitney U
│
├── Comparing 3+ groups?
│   ├── Normal data? → One-way ANOVA → Tukey post-hoc
│   └── Non-normal? → Kruskal-Wallis → Dunn post-hoc
│
├── Relationship between variables?
│   ├── Both continuous? → Pearson (linear) or Spearman (monotonic)
│   └── One categorical? → Point-biserial or Chi-square
│
├── Model vs baseline?
│   ├── Same test set? → Paired t-test on fold scores
│   └── Multiple models? → Friedman test → Nemenyi post-hoc
│
└── Time series?
    ├── Stationarity? → ADF test + KPSS test (both!)
    ├── Structural break? → Chow test or CUSUM
    └── Autocorrelation? → Ljung-Box test
```

## Multiple Comparison Correction (MANDATORY when testing N > 1 hypotheses)

| Method | When to Use | Formula |
|--------|-------------|---------|
| **Bonferroni** | Conservative, few tests (N < 20) | α_adj = α / N |
| **Holm-Bonferroni** | Less conservative, ordered p-values | Step-down procedure |
| **Benjamini-Hochberg** | Many tests, controls FDR not FWER | Step-up on ordered p-values |

```python
from statsmodels.stats.multitest import multipletests

# Always correct for multiple comparisons
rejected, p_corrected, _, _ = multipletests(p_values, method='holm')
for i, (test_name, p_raw, p_adj, sig) in enumerate(
    zip(test_names, p_values, p_corrected, rejected)):
    print(f"{test_name}: p_raw={p_raw:.6f}, p_adj={p_adj:.6f}, {'✓ SIG' if sig else '✗ NOT SIG'}")
```

## Effect Size (ALWAYS report alongside p-value)

| Measure | Small | Medium | Large | When to Use |
|---------|-------|--------|-------|-------------|
| Cohen's d | 0.2 | 0.5 | 0.8 | Two-group comparison |
| Pearson r | 0.1 | 0.3 | 0.5 | Correlation |
| η² (eta-squared) | 0.01 | 0.06 | 0.14 | ANOVA |
| Cohen's w | 0.1 | 0.3 | 0.5 | Chi-square |

**A statistically significant but tiny effect is USELESS.** Always ask: "Is this effect large enough to matter practically?"

## Power Analysis (BEFORE collecting data)

```python
from statsmodels.stats.power import TTestIndPower
power_analysis = TTestIndPower()

# How many samples do I need?
n = power_analysis.solve_power(
    effect_size=0.5,  # medium effect (Cohen's d)
    alpha=0.05,
    power=0.8,        # 80% probability of detecting real effect
    alternative='two-sided'
)
print(f"Need {int(np.ceil(n))} samples per group")
```

| Effect Size | Power 0.8 | Power 0.9 | Power 0.95 |
|-------------|-----------|-----------|------------|
| Small (0.2) | 394/group | 526/group | 651/group |
| Medium (0.5) | 64/group | 85/group | 105/group |
| Large (0.8) | 26/group | 34/group | 42/group |

## Bootstrap Confidence Intervals (when parametric assumptions fail)

```python
def bootstrap_ci(data, statistic=np.mean, n_boot=10000, ci=0.95):
    """Non-parametric confidence interval via bootstrap."""
    boot_stats = [statistic(np.random.choice(data, len(data), replace=True)) 
                  for _ in range(n_boot)]
    alpha = (1 - ci) / 2
    return np.percentile(boot_stats, [alpha*100, (1-alpha)*100])

ci_low, ci_high = bootstrap_ci(model_scores)
print(f"95% CI: [{ci_low:.4f}, {ci_high:.4f}]")
```

## Red Flags in Statistical Testing

- **p = 0.049** — suspiciously close to 0.05. Was the analysis adjusted to get this?
- **No effect size reported** — significance without magnitude is meaningless
- **No multiple comparison correction** — if you tested 20 things, expect 1 false positive
- **One-tailed test without pre-registration** — one-tailed doubles your chance of significance
- **"Marginally significant" (p = 0.06-0.10)** — this is NOT significant. Don't pretend it is.
- **N chosen after seeing results** — this is optional stopping, a form of p-hacking
