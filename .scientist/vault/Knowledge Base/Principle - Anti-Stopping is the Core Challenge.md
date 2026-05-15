---
title: "Principle: Anti-Stopping is the Core Challenge for Autonomous Agents"
tags: [principle, autonomy, metacognition]
derived_from:
  - "[[../Observations/Framework Self-Analysis]]"
  - "[[../Research/AI Self-Improvement Frameworks]]"
date: 2026-03-31
last_verified: 2026-05-16
evolved_on: 2026-05-16
---

> [!success] Confirmed by 6 weeks of evidence (2026-05-16)
> 11/11 self-evolution rules now in CLAUDE.md, with Rules 3, 5, 6, 9, 10, 11 (6/11) directly related to stopping/loop-discipline. Anti-stopping remains the dominant failure-mode cluster after six weeks of accumulated work. The v3.2.0 → v3.3.2 saga (this session) proved the principle holds even AGAINST structural enforcement: when one structural channel failed, only adding a second structural channel solved it. Instructional rules never came close. New cross-link: [[supports::../Observations/Novel Finding - Stop Hook decision-block Mechanism]].

# Principle: Anti-Stopping is the Core Challenge for Autonomous Agents

> [!note] Core Principle
> The #1 failure mode of autonomous AI agents is stopping when they shouldn't. 3 out of 5 errors in session 1 were variants of stopping (after summaries, on errors, to ask permission). The framework must aggressively counter Claude's default pause-and-report behavior.

## Evidence
- Session 1: 3/5 self-evolution rules address stopping behavior (Rules 3, 5, 6)
- The user had to intervene twice when Claude stopped unnecessarily
- The scientist command already says "NEVER stop" but Claude's training to be helpful (summarize, report, ask) overrides it

## Boundary Conditions
- Stopping IS correct when: user explicitly says stop, context window is full, destructive action needs confirmation
- Anti-stopping should not mean ignoring errors — it means handling errors and continuing
- Quality matters more than velocity — don't rush just to avoid "stopping"

## Structural Solution: Anti-Stop Hook
The only effective mitigation is **structural enforcement via Claude Code's Stop hook event**. Rules in CLAUDE.md are necessary but insufficient — they're instructions competing against model weights. The Stop hook fires every time Claude finishes responding and injects a continuation reminder into the context, making stopping a visible error rather than an invisible default.

This is a **5th novel contribution** of scientist-cc — no other framework has structural enforcement against LLM stopping behavior.

## Connections
- [[supports::Principle - Dogfooding Is Superior Testing]] — stopping bugs were all found through dogfooding
- [[supports::Principle - Novel Contributions of scientist-cc]] — anti-stop hook is a novel capability
- [[contradicts::Default Claude behavior of summarizing and waiting for input]]
