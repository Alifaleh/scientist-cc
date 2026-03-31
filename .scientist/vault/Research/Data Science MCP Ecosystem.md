---
title: "Data Science MCP Ecosystem for Claude Code"
tags: [research, mcp, data-science, tools, ecosystem, status/understood]
source: "MCP ecosystem survey + Claude Code tool analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Data Science Rigor for Autonomous Agents]]"
  - "[[SWE-agent Agent-Computer Interface Design]]"
  - "[[../Knowledge Base/Principle - Interface Quality Over Tool Quantity]]"
---

# Data Science MCP Ecosystem for Claude Code

> [!note] Key Insight
> Several MCP servers exist for data science work. The most immediately useful for scientist-cc: HuggingFace MCP (already available as Claude.ai integration for dataset discovery), Playwright MCP (for web scraping datasets), and native Python execution via Jupyter/scripts.

## Available MCP Servers
- **HuggingFace MCP** — dataset search, model hub queries, documentation (already in Claude.ai)
- **Playwright MCP** — web scraping for data collection (already installed)
- **Jupyter MCP** — interactive data analysis (fixed in v0.5.2, needs server)

## Native Python Tools (No MCP Needed)
- **pandas/numpy** — data manipulation (pip install)
- **matplotlib/seaborn** — visualization (pip install, verified working)
- **scikit-learn** — ML models, cross-validation, preprocessing
- **scipy/statsmodels** — statistical tests, hypothesis validation
- **datasets (HF)** — `pip install datasets` for direct HF dataset loading

## Best Approach for scientist-cc
Don't add more MCP servers — use Python directly. The SWE-agent ACI principle says: better interfaces to existing tools > adding more tools. Our `generate_index.py` pattern (Python script producing structured output) is the right ACI approach for data work too.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — Python scripts ARE the ACI
- [[extends::SWE-agent Agent-Computer Interface Design]] — tool quality matters more than quantity
- [[supports::Data Science Rigor for Autonomous Agents]] — tools must enforce rigor, not just enable analysis
