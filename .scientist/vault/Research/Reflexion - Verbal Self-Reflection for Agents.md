---
title: "Reflexion: Verbal Self-Reflection for LLM Agents"
tags: [research, reflexion, self-correction, verbal-feedback, status/understood]
source: "Reflexion (Shinn et al., 2023), arxiv 2303.11366"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Self-Improvement Frameworks]]"
  - "[[../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]]"
---

# Reflexion: Verbal Self-Reflection for LLM Agents

> [!note] Key Insight
> Reflexion uses verbal self-reflection (natural language feedback) instead of gradient updates for agent learning. The agent reflects on failures, generates verbal lessons, and stores them in a memory buffer for future trials. Our CLAUDE.md self-evolution rules are a persistent version of this pattern.

## Core Architecture
- **Actor:** LLM agent that takes actions in the environment
- **Evaluator:** Scores the agent's trajectory (binary or heuristic)
- **Self-Reflection:** On failure, agent generates a verbal analysis of what went wrong
- **Memory:** Sliding window of past reflections stored as text

## Key Findings
- Reflexion improves GPT-4 from 80% to 91% on HumanEval (programming)
- Verbal feedback is more interpretable than scalar rewards
- Memory of past reflections prevents repeating the same mistakes

## Comparison to scientist-cc
| Reflexion | scientist-cc |
|-----------|-------------|
| Verbal reflections in memory buffer | Rules in CLAUDE.md + vault notes |
| Sliding window (forgets old reflections) | Persistent (rules accumulate forever) |
| Binary success/failure evaluation | Module-based error classification (4 types) |
| Same-task retry | Cross-task knowledge transfer |
| No linking between reflections | Two-phase linking discovers connections |

## What We Do Better
- **Persistence:** CLAUDE.md rules persist across context windows; Reflexion's buffer resets
- **Classification:** Our 4-module taxonomy (Memory/Reasoning/Planning/Action) gives more targeted corrections than generic reflection
- **Cross-pollination:** Two-phase linking connects reflections across different topics

## What Reflexion Does Better
- **Automated evaluation:** Reflexion has a formal evaluator; our self-evolution relies on Claude noticing its own mistakes
- **Retry mechanism:** Reflexion retries the same task with improved approach; we move forward, not back

## Cross-Links
- [[extends::AI Self-Improvement Frameworks]] — Reflexion is one of the GVU implementations we studied
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — but Reflexion uses BROAD reflection; we improved it with module classification
