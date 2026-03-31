---
title: "Error Cascading: Why Wrong Conclusions Compound in AI Agents"
tags: [research, error-cascading, knowledge-quality, anti-pattern, status/understood]
source: "Cross-synthesis: data science rigor + cognitive biases + self-evolution research"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Data Science Rigor for Autonomous Agents]]"
  - "[[Cognitive Biases in LLM Agents]]"
  - "[[../Knowledge Base/Principle - Rigor Over Speed]]"
---

# Error Cascading in AI Agent Knowledge Bases

> [!note] Key Insight
> When an agent builds on a wrong conclusion, every subsequent finding that references it is ALSO wrong. In a densely linked vault (4.8 links/note), a single poisoned note can corrupt dozens of connected conclusions. This is why rigor (validate before acting) and backward evolution (update old notes) are essential — they prevent and fix cascading errors.

## The Cascade Pattern
1. Agent makes incorrect observation (e.g., "MCP servers are broken stubs")
2. Hypothesis formed based on wrong observation
3. Implementation based on wrong hypothesis
4. New observations interpreted through wrong lens
5. Vault accumulates interconnected wrong conclusions

## Mitigations We Implement
- **Adversarial validation** prevents accepting wrong hypotheses
- **Source code verification** (Rule 1) catches wrong observations
- **Backward evolution** updates old notes when new evidence arrives
- **Contradiction detection** (`[[contradicts::]]` links) surfaces conflicts
- **last_verified metadata** flags potentially stale knowledge

## Cross-Links
- [[supports::../Knowledge Base/Principle - Rigor Over Speed]] — rigor prevents cascades at the source
- [[supports::../Knowledge Base/Principle - Targeted Correction Beats Broad Reflection]] — targeted fix at the root stops the cascade
- [[extends::Cognitive Biases in LLM Agents]] — confirmation bias amplifies cascades
