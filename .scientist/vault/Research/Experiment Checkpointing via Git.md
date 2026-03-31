---
title: "Experiment Checkpointing via Git Tags and Branches"
tags: [research, git, checkpointing, experiments, status/understood]
source: "Git workflow analysis + DVC/MLflow patterns adapted for pure git"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[../Research/AI Agent Frameworks Landscape]]"
  - "[[../Hypotheses/Hypothesis 4 - Two-Phase Linking]]"
---

# Experiment Checkpointing via Git Tags and Branches

> [!note] Key Insight
> Pure git provides sufficient checkpointing for R&D experiments: `git tag` marks checkpoints, `scientist/experiment/<name>` branches isolate experiments, and `git diff` compares states. No external tool (DVC, MLflow) needed for our markdown-based workflow.

## Lightweight Checkpointing Pattern

### Before an experiment:
```bash
git tag checkpoint/pre-[experiment-name]
git checkout -b scientist/experiment/[name]
```

### After an experiment:
```bash
git tag checkpoint/post-[experiment-name]
# If successful: merge to scientist/research
# If failed: document in vault, delete branch, keep tag for history
```

### Compare two states:
```bash
git diff checkpoint/pre-experiment..checkpoint/post-experiment
```

## Why External Tools Aren't Needed
- **DVC:** Designed for large binary data (models, datasets). Our vault is markdown — git handles it natively.
- **MLflow:** Designed for ML metrics tracking. Our meta-metrics from generate_index.py serve the same purpose.
- **W&B:** Cloud-based experiment tracking. Our vault-index.json is the local equivalent.

## Implementation for scientist-cc
Add to IMPLEMENT step in loop.md:
1. Before experiment: `git tag checkpoint/pre-[name]`
2. Create experiment branch
3. Run experiment, commit results
4. After experiment: `git tag checkpoint/post-[name]`
5. Compare: `git diff checkpoint/pre-[name]..checkpoint/post-[name]`

## Cross-Links
- [[extends::../Research/AI Agent Frameworks Landscape]] — LangGraph has checkpointing; our git-based approach is simpler
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — git IS the interface; no need for specialized tools
