---
title: "User Feedback: Init Phase + Data Science Capabilities Need Major Improvement"
tags: [observation, user-feedback, init-phase, data-science, status/actionable, priority/high]
date: 2026-03-31
---

# User Feedback: Init Phase + Data Science Capabilities

> [!note] Key Feedback
> The information gathering phase (init Phase 1) needs to be smarter — ask better questions, probe deeper. The framework needs to be a REAL scientist with data analysis, statistical analysis, dataset handling, anti-overfitting, and ML capabilities built in.

## Areas to Improve

### 1. Init Phase Information Gathering
- Current: 6 generic questions via AskUserQuestion
- Needed: Adaptive questioning that digs deeper based on domain
- Should probe: data availability, existing models, known patterns, domain constraints
- Should map the codebase automatically before asking questions

### 2. Data Science & Statistical Analysis
- Add references/skills for: pandas, numpy, scipy, sklearn, statsmodels
- Anti-overfitting protocols: cross-validation, train/test split, confidence intervals
- Small dataset handling: bootstrapping, few-shot learning, data augmentation
- Feature extraction: PCA, correlation analysis, mutual information

### 3. Dataset Acquisition & Building
- Know how to find public datasets (Kaggle, HuggingFace, UCI ML Repository)
- Know how to build custom datasets from APIs, web scraping, logs
- Know when datasets are too small and how to handle it
- Synthetic data generation for testing hypotheses

### 4. Anti-Stupid Decisions
- Validate statistical significance before accepting results
- Require confidence intervals, not just point estimates
- Check for data leakage, look-ahead bias, survivorship bias
- Require out-of-sample testing for ALL ML claims

### 5. MCP Servers & Tools to Research
- Hugging Face MCP (already available in Claude Code)
- Data analysis MCP servers
- Statistical testing tools
- Visualization MCP servers

## Priority
HIGH — this feedback addresses the core value proposition. A scientist that can't do data analysis isn't a scientist.
