---
title: "Data Science Rigor for Autonomous AI Agents"
tags: [research, data-science, overfitting, statistics, methodology, status/understood]
source: "User feedback + anti-overfitting research + statistical analysis best practices"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Hypothesis-Driven Development for AI Research]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
  - "[[Cognitive Biases in LLM Agents]]"
---

# Data Science Rigor for Autonomous AI Agents

> [!note] Key Insight
> An autonomous scientist without data rigor is worse than no scientist — it will confidently produce wrong conclusions and build on them. The anti-overfitting checklist, statistical significance requirements, and baseline comparisons are NON-NEGOTIABLE for any data-driven work.

## The Problem
LLMs are prone to:
- Overfitting narratives to small datasets
- Accepting results without statistical testing
- Ignoring base rates and class imbalance
- Building on incorrect conclusions (cascading failure)

## The Solution: Mandatory Rigor Protocol
1. Anti-overfitting checklist before ANY conclusion
2. Train/test/validation split for ALL ML work
3. Statistical significance (p < 0.05) with correction
4. Baseline comparison for ALL experiments
5. Visualization of distributions, residuals, correlations

## Tools Available
- **Python:** pandas, numpy, scipy, sklearn, statsmodels, matplotlib, seaborn
- **HuggingFace MCP:** dataset discovery and download
- **Jupyter:** interactive analysis (NotebookEdit + nbconvert as fallback)
- **generate_index.py:** meta-metrics for vault quality

## Cross-Links
- [[supports::Hypothesis-Driven Development for AI Research]] — rigor is what makes hypotheses testable
- [[supports::Cognitive Biases in LLM Agents]] — rigor protocol counters confirmation bias and overfitting
- [[extends::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — data rigor is targeted correction for data-specific errors
