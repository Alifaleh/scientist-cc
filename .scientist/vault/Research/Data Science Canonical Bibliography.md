---
tags: [research, bibliography, data-science, reference]
category: knowledge-base
created: 2026-04-01
---

# Data Science Canonical Bibliography

The definitive sources every real data scientist knows. Structured by domain with actionable insights from each.

---

## 1. STATISTICAL LEARNING & MACHINE LEARNING (The Holy Trinity + ISLR)

### The Elements of Statistical Learning (ESL)
- **Authors:** Trevor Hastie, Robert Tibshirani, Jerome Friedman
- **Year:** 2009 (2nd ed.)
- **PDF:** Free from authors — https://hastie.su.domains/ElemStatLearn/
- **Covers:** Supervised/unsupervised learning, neural nets, SVMs, boosting, random forests, regularization, model selection
- **Essential Takeaways:**
  1. The bias-variance tradeoff is THE fundamental tension in all of modeling
  2. Regularization (L1/L2) prevents overfitting better than feature selection alone
  3. Ensemble methods (bagging, boosting, stacking) consistently outperform single models
  4. Cross-validation is non-negotiable for honest model assessment
  5. Sparsity (via lasso) reveals which features actually matter
- **Level:** Graduate. The "bible" of statistical ML.

### An Introduction to Statistical Learning (ISLR/ISLP)
- **Authors:** Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani
- **Year:** 2021 (2nd ed. R), 2023 (Python ed.)
- **PDF:** Free — https://www.statlearning.com
- **Covers:** Same topics as ESL but accessible. Linear regression, classification, resampling, tree methods, SVMs, deep learning, survival analysis
- **Essential Takeaways:**
  1. Start simple (linear/logistic regression) before reaching for complex models
  2. Resampling methods (bootstrap, CV) are how you honestly assess performance
  3. Tree-based methods (random forests, boosting) are the workhorses of tabular data
  4. The interpretability-accuracy tradeoff shapes every modeling decision
  5. Always visualize data before modeling — structure hides in plots
- **Level:** Undergraduate/practitioner. Start here before ESL.

### Pattern Recognition and Machine Learning (PRML)
- **Authors:** Christopher Bishop
- **Year:** 2006
- **PDF:** Available from Microsoft Research
- **Covers:** Bayesian inference, graphical models, mixture models, EM algorithm, kernel methods, neural networks, sampling methods
- **Essential Takeaways:**
  1. Bayesian inference provides a principled framework for handling uncertainty
  2. The EM algorithm is the universal tool for latent variable models
  3. Graphical models (Bayesian nets, Markov random fields) encode conditional independence
  4. Kernel methods implicitly map data to high-dimensional spaces
  5. Variational inference trades exactness for scalability
- **Level:** Graduate. Best for understanding WHY algorithms work probabilistically.

### Probabilistic Machine Learning (PML)
- **Authors:** Kevin Murphy
- **Year:** 2022 (Introduction), 2023 (Advanced Topics)
- **PDF:** Free from author — https://probml.github.io/pml-book/
- **Covers:** Everything in Bishop + modern deep learning, transformers, generative models, causal inference, reinforcement learning
- **Essential Takeaways:**
  1. Murphy's two-volume set is the most comprehensive modern ML reference
  2. Probabilistic thinking unifies classical stats and modern ML
  3. Generative models (VAEs, GANs, diffusion) are as important as discriminative ones
  4. Modern Bayesian methods scale to neural networks (Bayesian deep learning)
  5. The field moves fast — Murphy's 2022/2023 editions capture the transformer era
- **Level:** Graduate encyclopedia. The most complete single reference.

---

## 2. BAYESIAN THINKING & STATISTICS

### Statistical Rethinking
- **Author:** Richard McElreath
- **Year:** 2020 (2nd ed.)
- **PDF:** Not free (published by CRC Press). Free lecture videos on YouTube.
- **Covers:** Bayesian inference from scratch, multilevel/hierarchical models, causal inference with DAGs, model comparison, MCMC, Stan
- **Essential Takeaways:**
  1. Bayesian models force you to state your assumptions explicitly (priors)
  2. Posterior distributions ARE the answer — not a single point estimate
  3. DAGs (directed acyclic graphs) clarify what you should and shouldn't control for
  4. Multilevel/hierarchical models handle grouped data far better than pooled or unpooled
  5. Prior predictive simulation catches bad models BEFORE you see data
- **Won the 2024 De Groot Prize (ISBA).** The best gateway to Bayesian thinking.

### Information Theory, Inference, and Learning Algorithms
- **Author:** David J.C. MacKay
- **Year:** 2003
- **PDF:** Free from author — https://www.inference.org.uk/itprnn/book.pdf
- **Covers:** Information theory, Bayesian inference, Monte Carlo methods, neural networks, error-correcting codes, clustering, data compression
- **Essential Takeaways:**
  1. Information theory and inference are deeply connected — entropy measures uncertainty
  2. Occam's razor emerges naturally from Bayesian model comparison
  3. Monte Carlo methods (MCMC, importance sampling) solve intractable integrals
  4. Compression and prediction are the same problem (minimum description length)
  5. 400+ exercises make this the best self-study book in the list
- **Level:** Advanced undergraduate. Uniquely bridges information theory and ML.

---

## 3. CAUSAL INFERENCE

### The Book of Why
- **Authors:** Judea Pearl, Dana Mackenzie
- **Year:** 2018
- **PDF:** Not free (commercial)
- **Covers:** The ladder of causation (association, intervention, counterfactuals), do-calculus, DAGs, confounding, mediation, SCMs
- **Essential Takeaways:**
  1. Correlation is not causation — but causation IS discoverable with the right tools
  2. The ladder of causation: seeing (data) < doing (experiments) < imagining (counterfactuals)
  3. DAGs make causal assumptions explicit and testable
  4. Do-calculus allows causal inference from observational data (sometimes)
  5. Counterfactual reasoning is the highest form of causal thinking
- **Level:** Popular science. Accessible but profound.

### Causality: Models, Reasoning, and Inference
- **Author:** Judea Pearl
- **Year:** 2009 (2nd ed.)
- **PDF:** Not free
- **Covers:** Structural Causal Models (SCMs), do-calculus formal proofs, identification, transportability, mediation analysis
- **Essential Takeaways:**
  1. SCMs provide the mathematical foundation for all causal reasoning
  2. The back-door and front-door criteria identify when causal effects are estimable
  3. Interventions (do-operator) are fundamentally different from observations
  4. Transportability theory tells you when results generalize to new populations
  5. This is the technical companion to "The Book of Why"
- **Level:** Graduate. The formal treatise on causality.

### Counterfactuals and Causal Inference
- **Authors:** Stephen L. Morgan, Christopher Winship
- **Year:** 2014 (2nd ed.)
- **PDF:** Not free
- **Covers:** Potential outcomes framework (Rubin), matching, instrumental variables, regression discontinuity, difference-in-differences, synthetic control
- **Essential Takeaways:**
  1. The Rubin Causal Model (potential outcomes) is the dominant framework in social science
  2. Matching and propensity scores create quasi-experiments from observational data
  3. Instrumental variables exploit natural experiments
  4. Difference-in-differences is the workhorse of policy evaluation
  5. Bridges the Pearl (graphs) and Rubin (potential outcomes) traditions
- **Level:** Graduate. Essential for applied causal inference.

---

## 4. TIME SERIES & FORECASTING

### Forecasting: Principles and Practice (FPP3)
- **Authors:** Rob J. Hyndman, George Athanasopoulos
- **Year:** 2021 (3rd ed.)
- **PDF:** Free online — https://otexts.com/fpp3/
- **Covers:** Time series decomposition, exponential smoothing, ARIMA, dynamic regression, hierarchical forecasting, cross-validation for time series
- **Essential Takeaways:**
  1. Decomposition (trend + seasonal + remainder) is always your first step
  2. Exponential smoothing and ARIMA cover most univariate forecasting needs
  3. Cross-validation for time series requires time-respecting splits (no data leakage)
  4. Forecast accuracy metrics: use MASE, not MAPE (MAPE is undefined for zeros)
  5. Prediction intervals matter more than point forecasts
- **Level:** Practitioner. THE practical forecasting reference. Free.

### Time Series Analysis
- **Author:** James D. Hamilton
- **Year:** 1994
- **PDF:** Not free
- **Covers:** ARIMA theory, state-space models, Kalman filter, cointegration, spectral analysis, unit roots, VAR models, regime switching
- **Essential Takeaways:**
  1. Unit root tests (ADF, Phillips-Perron) determine stationarity — critical before modeling
  2. The Kalman filter is the optimal recursive estimator for state-space models
  3. Cointegration allows modeling long-run equilibrium between non-stationary series
  4. VAR models capture multivariate temporal dynamics
  5. Spectral analysis reveals cyclical patterns invisible in the time domain
- **Level:** Graduate. ~800 pages. The theoretical encyclopedia.

---

## 5. FEATURE ENGINEERING

### Feature Engineering and Selection
- **Authors:** Max Kuhn, Kjell Johnson
- **Year:** 2019
- **PDF:** Free online — http://www.feat.engineering/
- **Covers:** Numeric transformations, encodings, interaction features, dimensionality reduction, feature selection, missing data
- **Essential Takeaways:**
  1. Feature engineering is often more impactful than model selection
  2. Target encoding for high-cardinality categoricals (but beware leakage)
  3. Near-zero variance and correlated feature removal prevents instability
  4. Recursive feature elimination + cross-validation = principled feature selection
  5. Domain knowledge beats automated feature engineering almost every time
- **Level:** Practitioner. The R-based definitive guide. Free.

### Feature Engineering for Machine Learning
- **Authors:** Alice Zheng, Amanda Casari
- **Year:** 2018
- **PDF:** Not free (O'Reilly)
- **Covers:** Numeric features, text features (bag of words, TF-IDF), categorical encoding, feature hashing, PCA, model-based feature engineering
- **Essential Takeaways:**
  1. Bin counting and feature hashing handle massive categorical spaces
  2. TF-IDF remains surprisingly competitive for text features
  3. PCA reduces dimensions while preserving maximum variance
  4. Feature crosses capture interactions that linear models miss
  5. Python-focused with practical code examples throughout

### The Art of Feature Engineering
- **Author:** Pablo Duboue
- **Year:** 2020 (Cambridge University Press)
- **PDF:** Not free
- **Covers:** Cross-domain feature engineering: graphs, text, time series, images, with case studies
- **Essential Takeaways:**
  1. Feature engineering is domain-specific — techniques for text differ from images differ from graphs
  2. Temporal features (lags, rolling stats, time-since-event) are universally useful
  3. Graph features (centrality, clustering coefficient) encode structural information
  4. Case studies show the full pipeline from raw data to engineered features

---

## 6. EXPERIMENTAL DESIGN & A/B TESTING

### Trustworthy Online Controlled Experiments
- **Authors:** Ron Kohavi, Diane Tang, Ya Xu
- **Year:** 2020
- **PDF:** Chapter 1 free at https://experimentguide.com/
- **Covers:** A/B testing at scale, OEC (Overall Evaluation Criterion), statistical power, novelty/primacy effects, interference, guardrail metrics, institutional memory
- **Essential Takeaways:**
  1. Define your OEC (Overall Evaluation Criterion) BEFORE running experiments
  2. Most experiments fail (80-90%) — this is EXPECTED and healthy
  3. Twyman's Law: any surprising result is more likely wrong than real
  4. Guardrail metrics prevent winning on one metric while destroying another
  5. Practical wisdom from Google/LinkedIn/Microsoft running 20,000+ experiments/year
- **Level:** Practitioner. THE book on A/B testing at scale.

---

## 7. DECISION-MAKING UNDER UNCERTAINTY

### Thinking in Bets
- **Author:** Annie Duke
- **Year:** 2018
- **PDF:** Not free
- **Covers:** Decision quality vs. outcome quality, resulting, motivated reasoning, truthseeking groups, probabilistic thinking
- **Essential Takeaways:**
  1. Separate decision quality from outcome quality — good decisions can have bad outcomes (and vice versa)
  2. "Resulting" (judging decisions by outcomes) is the most common thinking error
  3. Express beliefs as probabilities, not certainties — "I'm 70% sure" beats "I'm sure"
  4. Pre-mortems and backcasting improve planning more than optimism
  5. Build a "truthseeking pod" — a group committed to accuracy over ego
- **Relevance to data science:** Every model decision is a bet under uncertainty.

---

## 8. INTUITIVE STATISTICS (Accessible Entry Points)

### Naked Statistics
- **Author:** Charles Wheelan
- **Year:** 2013
- **PDF:** Not free
- **Covers:** Descriptive stats, probability, central limit theorem, inference, regression, polling, program evaluation
- **Essential Takeaways:**
  1. The Central Limit Theorem is the most important theorem in statistics — it enables inference
  2. Regression to the mean explains most "miraculous" improvements
  3. Selection bias is everywhere and destroys naive analyses
  4. P-values are widely misunderstood — they are NOT the probability the hypothesis is true
  5. Statistics literacy is a civic skill, not just a technical one
- **Level:** Popular science. Best for building intuition before formal study.

---

## 9. FOUNDATIONAL PAPERS (Must-Read)

| Paper | Authors | Year | Key Contribution |
|-------|---------|------|-----------------|
| A Few Useful Things to Know About ML | Pedro Domingos | 2012 | Meta-lessons: feature engineering > algorithms, correlation != causation, more data > clever algorithms |
| Attention Is All You Need | Vaswani et al. | 2017 | Transformer architecture — foundation of GPT, BERT, and modern NLP/vision |
| Deep Residual Learning | He et al. | 2015 | Skip connections enable training very deep networks — solved vanishing gradients |
| Generative Adversarial Networks | Goodfellow et al. | 2014 | Adversarial training paradigm — generator vs discriminator |
| Random Forests | Breiman | 2001 | Bagging + feature randomness = robust, high-performance ensemble |
| XGBoost | Chen & Guestrin | 2016 | Gradient boosting at scale — dominant on tabular data competitions |
| Dropout | Srivastava et al. | 2014 | Simple regularization technique that prevents co-adaptation |
| Batch Normalization | Ioffe & Szegedy | 2015 | Normalizing layer inputs enables faster, more stable training |
| Adam Optimizer | Kingma & Ba | 2015 | Adaptive learning rates — default optimizer for deep learning |
| U-Net | Ronneberger et al. | 2015 | Encoder-decoder with skip connections — standard for segmentation |

---

## 10. FREE PDF AVAILABILITY SUMMARY

| Book | Free? | URL |
|------|-------|-----|
| ESL (Hastie et al.) | Yes | https://hastie.su.domains/ElemStatLearn/ |
| ISLR/ISLP | Yes | https://www.statlearning.com |
| PML (Murphy) | Yes | https://probml.github.io/pml-book/ |
| MacKay Info Theory | Yes | https://www.inference.org.uk/itprnn/book.pdf |
| FPP3 (Hyndman) | Yes | https://otexts.com/fpp3/ |
| Feature Eng. & Selection (Kuhn) | Yes | http://www.feat.engineering/ |
| PRML (Bishop) | Partial | Microsoft Research hosts chapters |
| Statistical Rethinking | No | Free YouTube lectures though |
| All Pearl/Duke/Wheelan | No | Commercial only |

---

## RECOMMENDED READING ORDER FOR A SCIENTIST

**Phase 1 — Foundations (free):**
1. Naked Statistics (intuition)
2. ISLR/ISLP (applied statistical learning)
3. FPP3 (time series & forecasting)

**Phase 2 — Depth (free):**
4. ESL (rigorous statistical learning)
5. Feature Engineering and Selection (Kuhn)
6. PML Introduction (Murphy)

**Phase 3 — Bayesian & Causal:**
7. Statistical Rethinking (Bayesian thinking)
8. The Book of Why (causal intuition)
9. Counterfactuals and Causal Inference (applied causality)

**Phase 4 — Decision Science & Experimentation:**
10. Thinking in Bets (decision-making)
11. Trustworthy Online Controlled Experiments (A/B testing)

**Phase 5 — Deep Theory:**
12. MacKay — Information Theory
13. PRML (Bishop)
14. Causality (Pearl technical)
15. Hamilton — Time Series Analysis

*Last updated: 2026-04-01*
