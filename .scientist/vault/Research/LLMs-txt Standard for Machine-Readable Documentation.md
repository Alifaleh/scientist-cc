---
title: "llms.txt: Machine-Readable Documentation Standard"
tags: [research, llms-txt, documentation, progressive-disclosure, status/understood]
source: "Vault navigation research + llmstxt.org specification"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[Vault Navigation Patterns for AI Agents]]"
  - "[[Context Engineering for AI Agents]]"
---

# llms.txt: Machine-Readable Documentation Standard

> [!note] Key Insight
> The llms.txt standard (llmstxt.org) provides a format for machine-readable documentation: `- [Title](path): description` per entry. Our vault Index.md now uses this format, making it both human-readable in Obsidian AND parseable by any tool.

## Format
```markdown
# Project Name
> Brief description

## Section
- [Page Title](path/to/page.md): One-line description
- [Another Page](path/to/other.md): What this covers
```

## Why It Matters for AI Agents
- LLMs can parse this format naturally (it's just markdown links)
- One scan of the index tells the agent what's available without reading every file
- Progressive disclosure: index (tier 1) → frontmatter (tier 2) → full content (tier 3)

## Our Implementation
vault Index.md uses llms.txt format with sections: Research, Observations, Hypotheses, Principles, Open Questions. Each entry is `- [Title](path): description`.

## Cross-Links
- [[supports::Vault Navigation Patterns for AI Agents]] — llms.txt is the standard implementation of tier-1 progressive disclosure
- [[supports::Context Engineering for AI Agents]] — efficient context loading via structured index
