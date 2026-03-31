---
title: "Cognitive Biases in LLM Agents"
tags: [research, cognitive-biases, sycophancy, confirmation-bias, reasoning, status/understood]
source: "AI self-improvement research + LLM bias literature"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Self-Improvement Frameworks]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
---

# Cognitive Biases in LLM Agents

> [!note] Key Insight
> LLMs exhibit cognitive biases analogous to human ones: confirmation bias (seeking supporting evidence), sycophancy (agreeing with the user), anchoring (fixating on first information), and fluency bias (trusting well-written text). Our 4-module error taxonomy + adversarial validation are designed to counter these.

## Most Dangerous Biases for Autonomous Agents
1. **Confirmation bias** — seeks evidence supporting hypotheses, ignores contradictions → our adversarial validation step counters this
2. **Sycophancy** — agrees with user/previous output instead of thinking critically → our "disagree when right" rule counters this
3. **Anchoring** — fixates on first solution/number encountered → our "consider multiple explanations" fix
4. **Fluency bias** — trusts well-written arguments over messy truth → our "evaluate on evidence, not eloquence" fix
5. **Automation bias** — trusts tool output without verification → our "spot-check results" fix

## Why This Matters for scientist-cc
An autonomous scientist that can't overcome its biases will:
- Confirm hypotheses that should be falsified (confirmation bias)
- Never pivot from failing approaches (sunk cost + anchoring)
- Produce confident-sounding but wrong vault notes (fluency bias)

## Cross-Links
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — bias mitigation requires knowing WHICH bias
- [[extends::AI Self-Improvement Frameworks]] — biases are the errors the self-improvement loop must catch
