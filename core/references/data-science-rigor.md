# Data Science Rigor Protocol

How to analyze data like a real scientist, not an overfitting bot.

## Anti-Overfitting Checklist (MANDATORY)

Before accepting ANY data-driven conclusion:

- [ ] **Sample size adequate?** Minimum 30 data points for basic stats, 100+ for ML, 1000+ for production
- [ ] **Train/test split?** NEVER evaluate on training data. Hold out 20-30% minimum.
- [ ] **Cross-validation?** Use k-fold (k=5 minimum) for small datasets. Leave-one-out for tiny datasets.
- [ ] **Confidence intervals?** Report 95% CI, not just point estimates.
- [ ] **Statistical significance?** p < 0.05 minimum. Use Bonferroni correction for multiple comparisons.
- [ ] **Out-of-sample test?** Results must hold on data the model has NEVER seen.
- [ ] **Baseline comparison?** Compare against a simple baseline (random, mean, last-value).
- [ ] **Feature leakage check?** No future information in features. No target leakage.

## Small Dataset Protocols

When data is limited (< 100 samples):

1. **Bootstrapping** — resample with replacement to estimate confidence intervals
2. **Cross-validation** — k-fold or leave-one-out, never single train/test split
3. **Simple models first** — linear regression before neural networks
4. **Regularization** — L1/L2 to prevent overfitting
5. **Feature selection** — fewer features than samples (p < n rule)
6. **Ensemble methods** — bag multiple simple models
7. **NEVER use test set for model selection** — use validation set or nested CV

## Dataset Acquisition

Where to find data:
- **Kaggle** — datasets.kaggle.com (pip install kaggle)
- **HuggingFace Datasets** — huggingface.co/datasets (pip install datasets)
- **UCI ML Repository** — archive.ics.uci.edu
- **APIs** — finance (yfinance), weather (openweathermap), social (Reddit, Twitter)
- **Web scraping** — use Playwright for JS-heavy sites, requests+BeautifulSoup for static
- **Synthetic data** — generate from known distributions for hypothesis testing
- **HuggingFace MCP** — use `hub_repo_search` to find datasets, `hf_hub_query` for exploration (available in Claude Code)

## Building Your Own Dataset

When existing data isn't available:
1. Define what you need (features, labels, size)
2. Identify data sources (APIs, logs, manual collection)
3. Write collection scripts in `.scientist/scripts/`
4. Run monitoring scripts for time-series data
5. Validate data quality (missing values, outliers, distributions)
6. Document in vault: source, size, collection date, known biases

## Statistical Tests Reference

| Question | Test | When to Use |
|----------|------|-------------|
| Is X different from Y? | t-test (2 groups) | Normal data, known variance |
| Is X different from Y? | Mann-Whitney U | Non-normal data |
| Are groups different? | ANOVA / Kruskal-Wallis | 3+ groups |
| Is there a relationship? | Pearson/Spearman correlation | Continuous variables |
| Does feature matter? | Chi-square | Categorical variables |
| Is the model better than baseline? | Paired t-test on CV folds | ML model comparison |

## Visualization Requirements

For EVERY analysis, generate:
1. **Distribution plots** — histograms of key variables
2. **Correlation matrix** — heatmap of feature relationships
3. **Time series** — if data has temporal component
4. **Scatter plots** — key variable pairs
5. **Residual plots** — after any regression/prediction

Save to `.scientist/vault/assets/` and embed in vault notes.

## Common Mistakes to Avoid

- **Testing on training data** — the #1 sin. Always hold out test data.
- **P-hacking** — running many tests until one is significant. Use Bonferroni correction.
- **Survivorship bias** — only analyzing surviving entities (e.g., profitable trades, not all trades)
- **Look-ahead bias** — using future information in features
- **Overfitting to noise** — complex model on small data = memorization, not learning
- **Ignoring base rates** — 99% accuracy on 99% imbalanced data = useless
- **Cherry-picking results** — report ALL experiments, not just the ones that worked
