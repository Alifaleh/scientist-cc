---
title: "Dogfooding Methodology for Framework Development"
tags: [research, methodology, dogfooding, testing, status/understood]
source: "Empirical observations from scientist-cc self-improvement effort"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[../Knowledge Base/Principle - Dogfooding Is Superior Testing]]"
  - "[[../Observations/Tool Verification - Session 1]]"
  - "[[../Observations/Framework Self-Analysis]]"
---

# Dogfooding Methodology for Framework Development

> [!note] Key Insight
> Using a framework to improve itself discovers bugs and design flaws that no amount of code review or testing would find. In this R&D effort, 5/5 bugs were discovered through dogfooding, including silent MCP failures, packaging breakage, and Unicode encoding issues.

## Bugs Discovered Through Dogfooding (5 total)
1. **tools/ not installed** — install.js didn't copy the tools directory (discovered during init)
2. **Jupyter MCP missing `start`** — silent failure, no tools available (discovered during tool verification)
3. **npm cache serves stale versions** — `npm update` doesn't always get latest (discovered during deploy)
4. **pdf_reader.py Unicode crash** — cp1252 can't handle math symbols (discovered reading A-MEM paper)
5. **MCP registration broken by .npmignore** — excluding mcp/ directory broke registration (discovered after packaging)

## Why Dogfooding Works Better Than Testing
- **Tests verify expected behavior** — dogfooding discovers unexpected failures
- **Tests run in isolation** — dogfooding encounters real environmental issues (Windows encoding, npm caching)
- **Tests are designed by the author** — dogfooding reveals usability issues the author doesn't see
- **Silent failures are invisible to tests** — dogfooding catches "works but wrong" scenarios

## Methodology for Meta-Tools
When building a tool that improves processes, the best test is:
1. **Use the tool on itself** — the meta-loop
2. **Document every friction point** — don't work around, fix
3. **Deploy and re-deploy continuously** — each deploy tests the full pipeline
4. **Check what's NOT happening** — silent failures are the most dangerous

## Cross-Links
- [[supports::../Knowledge Base/Principle - Interface Quality Over Tool Quantity]] — dogfooding tests the interface, not just the function
- [[supports::../Knowledge Base/Principle - Anti-Stopping is the Core Challenge]] — anti-stopping was discovered through dogfooding
