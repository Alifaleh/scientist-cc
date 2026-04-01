---
title: "Training Period Selection: Why Short Periods Kill Models"
tags: [research, training-period, overfitting, time-series, anti-stupidity, status/understood]
source: "First principles + ESL + statistical learning theory"
date: 2026-04-01
last_verified: 2026-04-01
related:
  - "[[Why Claude Makes Stupid Data Science Decisions]]"
  - "[[../Knowledge Base/Principle - Every Regime Must Be Represented]]"
  - "[[../Knowledge Base/Principle - If In Doubt The Model Is Overfit]]"
---

# Training Period Selection: Why Short Periods Kill Models

> [!note] Key Insight
> A model trained on 3 months of data captures 3 months of market personality — not "how markets work." When that personality changes (and it always does), the model fails catastrophically. Minimum training period: enough to cover at least 2 complete market cycles with 30+ samples per regime.

## The Problem

Claude's default behavior: "I have data from Jan-Mar 2025. Let me train a model."

Why this is catastrophic:
1. **Jan-Mar 2025 is ONE regime** (whatever the market was doing then)
2. **The model learns that regime's patterns** as if they're universal
3. **When the regime changes** (it always does), the model fails
4. **Claude reports the training results** as if they mean the model "works"

## Minimum Training Periods by Application

| Application | Minimum Period | Why |
|-------------|---------------|-----|
| Intraday trading | 1+ years | Must cover seasonal patterns + at least 2 volatility regimes |
| Daily trading | 3+ years | Must cover bull, bear, and sideways markets |
| Weekly signals | 5+ years | Must cover at least 1 full economic cycle |
| ML classification | Enough for 100+ samples per class per regime | Statistics requirement |
| Anomaly detection | Must include known anomalies | Can't detect what you haven't seen |

## The Regime Coverage Test

Before using ANY training period:
1. Label each day/period by regime (bull, bear, sideways, volatile, crisis)
2. Count samples per regime in your training set
3. If ANY regime has < 30 samples → your training period is too short
4. If ANY regime from your test period is NOT in training → your model is untested for that regime

## Why Claude Gets This Wrong

Claude doesn't have an intuitive sense of "3 months isn't enough." It sees a DataFrame with 60 rows and thinks "I have data, I can model." It doesn't naturally ask "is 60 rows enough for this problem?" or "do these 60 rows represent the full range of possible conditions?"

**The fix:** The data-science-comprehensive.md reference now requires a sample size check BEFORE modeling. The OBSERVE step requires regime coverage. The IMPLEMENT step requires the pre-flight check.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Every Regime Must Be Represented]]
- [[supports::../Knowledge Base/Principle - If In Doubt The Model Is Overfit]]
- [[extends::Why Claude Makes Stupid Data Science Decisions]]
