---
title: "Principle: Every Regime Must Be Represented — The Biggest Data Science Blindspot"
tags: [principle, regime-analysis, data-science, anti-stupidity, priority/high]
derived_from:
  - "[[../Research/Why Claude Makes Stupid Data Science Decisions]]"
date: 2026-04-01
last_verified: 2026-04-01
---

# Principle: Every Regime Must Be Represented

> [!note] Core Principle
> A model trained only on bull market data WILL fail in bear markets. A strategy backtested only on calm periods WILL blow up during volatility spikes. EVERY analysis must identify the relevant regimes, verify the data covers ALL of them with sufficient samples (30+ per regime), and report performance PER REGIME. Overall performance is MEANINGLESS without regime decomposition.

## What Regimes Are

Any system has distinct behavioral modes. For financial data:
- **Trending up:** Momentum works, mean-reversion fails
- **Trending down:** Fear dominates, correlations spike
- **Range-bound:** Mean-reversion works, momentum fails
- **High volatility:** Everything is unpredictable, stop-losses get hit
- **Crisis:** Extreme moves, models break, liquidity disappears
- **Low volatility:** Carry works, options are cheap

For ANY time series data:
- **Structural breaks:** COVID, policy changes, technology shifts
- **Seasonal patterns:** Time-of-day, day-of-week, month-of-year
- **Cyclic patterns:** Economic cycles, product cycles, user behavior cycles

## The Protocol
1. **Identify regimes** before ANY analysis
2. **Label every data point** with its regime
3. **Count samples per regime** — minimum 30, ideally 100+
4. **Stratify splits** by regime — not random
5. **Report per-regime** — overall metrics hide regime failures
6. **Stress test** — what happens in the worst regime?

## Connections
- [[supports::Principle - Think Before You Compute]] — regime analysis IS part of thinking before computing
- [[extends::../Research/Why Claude Makes Stupid Data Science Decisions]] — no regime awareness is root cause #4
