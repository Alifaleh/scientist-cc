---
title: "SWE-agent: Agent-Computer Interface Design Matters"
tags: [research, swe-agent, aci, interface-design, status/understood]
source: "SWE-agent paper + agent frameworks landscape analysis"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[AI Agent Frameworks Landscape]]"
  - "[[../Knowledge Base/Principle - Interface Quality Over Tool Quantity]]"
---

# SWE-agent: Agent-Computer Interface Design Matters

> [!note] Key Insight
> SWE-agent's key finding: interface design affects agent performance as much as model capability. A curated Agent-Computer Interface (ACI) with tailored commands outperforms giving the agent raw shell access. For scientist-cc, this means investing in how we read papers, navigate the vault, and run experiments — not just adding more tools.

## The ACI Concept
- Standard approach: give the agent bash/shell access and let it figure it out
- SWE-agent approach: provide curated commands (open_file, scroll_down, edit, search) designed for how agents think
- Result: significantly better performance on SWE-bench coding tasks

## Application to scientist-cc
Our tools ARE our ACI:
- `pdf_reader.py` — curated paper reading (summary, page range, info)
- `repo_reader.py` — curated repo exploration (clone, list docs, reading order)
- `generate_index.py` — curated vault navigation (structured index, metrics, scoring)

## What We Could Improve
- pdf_reader could suggest which pages to read based on the research question
- generate_index could filter by query (not just dump all notes)
- A `vault_search.py` tool that takes a natural language query and returns relevant note paths

## Cross-Links
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — ACI is the formalization of this principle
- [[extends::AI Agent Frameworks Landscape]] — SWE-agent insight applied across the framework
