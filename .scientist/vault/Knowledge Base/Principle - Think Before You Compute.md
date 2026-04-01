---
title: "Principle: Think Before You Compute — The #1 Data Science Rule"
tags: [principle, data-science, thinking, anti-stupidity, priority/high]
derived_from:
  - "[[../Research/Why Claude Makes Stupid Data Science Decisions]]"
  - "[[../Research/Data Science Canonical Bibliography]]"
date: 2026-04-01
last_verified: 2026-04-01
---

# Principle: Think Before You Compute

> [!note] Core Principle
> Every data science failure starts with computing before thinking. Before loading data, writing code, or fitting a model: state your hypothesis with a causal mechanism, define what success looks like with numbers, and list everything that could go wrong. If you can't do these three things, you're not ready to compute.

## The Three-Gate System

**Gate 1: Hypothesis with Mechanism**
"I believe X predicts Y BECAUSE Z (causal mechanism from domain knowledge or literature)."
- If you can't fill in the BECAUSE → go research, don't compute

**Gate 2: Success Criteria with Numbers**  
"Success = metric > threshold on out-of-sample data covering all regimes, with p < 0.05."
- If you can't define this → you won't know if you succeeded

**Gate 3: Failure Mode Inventory**
"This could fail because: (1) data leakage, (2) regime dependency, (3) overfitting, (4) survivorship bias, (5) insufficient samples per condition."
- If you can't list failures → you'll walk into them blind

## Evidence
- Every stupid decision documented in user feedback started with skipping these gates
- ESL, ISLR, Statistical Rethinking all emphasize: understand BEFORE model
- Google's ML best practices: "First, think about what you're optimizing"

## Connections
- [[supports::Principle - Rigor Over Speed]]
- [[extends::../Research/Why Claude Makes Stupid Data Science Decisions]]
- [[supports::../Research/Data Science Canonical Bibliography]]
