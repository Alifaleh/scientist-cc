# Data Science MCP Ecosystem Research

*Date: 2026-03-31*
*Purpose: Identify MCP servers, tools, and best practices for autonomous R&D with data science capabilities*

---

## 1. MCP Servers for Data Work

### Data Analysis & Visualization
| Server | What it does | Install |
|--------|-------------|---------|
| **Pandas Data Analysis MCP** (`alistairwalsh/pandas`) | pandas + numpy + matplotlib; CSV/Excel loading, stats, Chart.js viz | `claude mcp add pandas` |
| **Data Explorer MCP** (`tofunori/data-explorer`) | pandas + scikit-learn + matplotlib + seaborn; dataset exploration, stats, charts | PulseMCP |
| **Claude Data Explorer** | Direct CSV loading + exploratory analysis inside Claude | Built-in connector |
| **Data Visualization MCP** (`xlisp/data-visualization`) | Interactive Chart.js generation from data | PulseMCP |
| **Penrose MCP** | Mathematical/scientific diagram generation | Community |

### Dataset Acquisition
| Server | What it does | Install |
|--------|-------------|---------|
| **Kaggle MCP** (`54yyyu/kaggle-mcp`) | Search/download datasets, competitions, kernels, models | `claude mcp add-json "kaggle" '{"command":"kaggle-mcp"}'` |
| **Hugging Face MCP** (official) | Search models, datasets, Spaces, papers; run Gradio tools | Built-in connector (claude.ai/settings/connectors) |
| **HF Dataset MCP** (`cfahlgren1/hf-dataset-mcp`) | Direct dataset access and preview | Community |
| **CMR-MCP** | NASA/scientific dataset discovery | Community |

### Statistics & Experimentation
| Server | What it does | Install |
|--------|-------------|---------|
| **Statsig MCP** | A/B experiments, feature flags, statistical significance | `claude mcp add statsig` |
| **Jupyter MCP** (bundled in scientist-cc) | Full Python environment — scipy.stats, statsmodels, sklearn | Already installed |

### Already Available in Scientist-CC
- **Jupyter MCP** — full Python runtime (scipy, sklearn, statsmodels available via pip)
- **Playwright MCP** — web scraping for datasets from UCI, government portals
- **Hugging Face MCP** — already in Claude connectors for this user

---

## 2. Anti-Overfitting Checklist

Every experiment in the scientist loop MUST run these checks:

### Before Training
- [ ] **Holdout split** — Separate test set locked away, never touched during development
- [ ] **Stratified splits** — Outcome prevalence equal across train/val/test
- [ ] **Feature audit** — No data leakage (no future info, no target-derived features)
- [ ] **Baseline model** — Establish naive baseline (mean predictor, majority class) first

### During Training
- [ ] **Cross-validation** — k-fold (k=5 or 10), stratified, repeated 3-5x for small data
- [ ] **Nested CV** — Inner loop for hyperparameter tuning, outer loop for evaluation
- [ ] **Regularization** — L1 (Lasso), L2 (Ridge), ElasticNet, or dropout
- [ ] **Early stopping** — Monitor validation loss, stop when it rises for N epochs
- [ ] **Learning curves** — Plot train vs. val loss; divergence = overfitting signal

### After Training
- [ ] **Train-val gap** — If train acc >> val acc, model is overfitting
- [ ] **Confidence intervals** — Bootstrap 95% CI on all reported metrics
- [ ] **Permutation test** — Shuffle labels, retrain; real model should significantly outperform
- [ ] **Simplicity check** — Can a simpler model achieve 90%+ of the performance?
- [ ] **Effect size** — Report Cohen's d or similar, not just p-values

### Red Flags (Auto-Reject)
- Accuracy on train > val by more than 10%
- No cross-validation used
- Hyperparameters tuned on test set
- Single random split with no repetition
- p-hacking: running many tests without correction (Bonferroni/FDR)

---

## 3. Small Dataset Best Practices (n < 500)

### Validation Strategy
- **Repeated stratified k-fold CV** (5-fold x 5 repeats = 25 evaluations)
- **Leave-One-Out CV** for n < 50
- **.632+ bootstrap** for variance estimates (better than plain bootstrap for small n)
- **Nested CV mandatory** — inner loop for hyperparameters, outer for evaluation

### Model Selection
- Prefer **simpler models**: logistic regression, decision trees, KNN
- **Regularization is mandatory** — never use unregularized models on small data
- **Ensemble with caution** — random forests OK, but deep ensembles risk overfitting
- **Bayesian methods** — natural regularization via priors, excellent for small n

### Data Augmentation
- **Bootstrapping** — resample with replacement for CI estimation
- **SMOTE** — synthetic minority oversampling for imbalanced classes (use with CV, not before)
- **Domain-specific augmentation** — rotations/flips for images, paraphrasing for text

### What NOT to Do
- Do NOT use deep learning on n < 500 without transfer learning
- Do NOT report metrics from a single train/test split
- Do NOT apply SMOTE before cross-validation (causes data leakage)
- Do NOT use complex feature engineering without regularization

---

## 4. Dataset Acquisition Patterns

### Pattern 1: Kaggle (via MCP)
```
kaggle-mcp → search_datasets("topic") → download → load via pandas MCP
```
Best for: Competitions, cleaned benchmark datasets, kernels with baselines

### Pattern 2: Hugging Face (via MCP)
```
hf-mcp → hub_repo_search(type="dataset", query="topic") → load via datasets library
```
Best for: NLP/CV datasets, model cards, paper-linked datasets

### Pattern 3: UCI ML Repository (via Playwright)
```
playwright → navigate to archive.ics.uci.edu → download CSV
```
Best for: Classic ML benchmarks, small clean tabular datasets

### Pattern 4: APIs (via Jupyter/ctx_execute)
```python
# Government/public APIs
import requests
data = requests.get("https://api.census.gov/data/...").json()
# Or: FRED, World Bank, WHO, data.gov
```
Best for: Time series, economic data, real-time data

### Pattern 5: Synthetic Data (via Jupyter)
```python
from sklearn.datasets import make_classification, make_regression
X, y = make_classification(n_samples=200, n_features=10, n_informative=5)
```
Best for: Controlled experiments, testing pipelines, methodology validation

---

## 5. Recommended Integrations for Scientist-CC

### High Priority (add to framework)
1. **Pandas MCP** — native data analysis without Jupyter overhead
2. **Kaggle MCP** — automated dataset discovery and download
3. **Anti-overfitting checklist** — embed in EXPERIMENT step validation

### Medium Priority
4. **Statsig MCP** — structured A/B experiment tracking
5. **HF Dataset MCP** — direct dataset streaming

### Already Covered
- Jupyter MCP (scipy.stats, sklearn, statsmodels all available)
- Hugging Face connector (models, datasets, papers)
- Playwright (web scraping for UCI, papers, docs)

---

*Sources compiled from web research 2026-03-31*
