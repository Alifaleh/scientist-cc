---
title: "Tool Verification: PDF Reader, Playwright, Jupyter MCP"
tags: [observation, tools, dogfooding, status/actionable]
date: 2026-03-31
related:
  - "[[Framework Self-Analysis]]"
---

# Tool Verification — Session 1

> [!note] Key Insight
> Two of three tool integrations worked. Jupyter MCP was silently broken due to a missing `start` subcommand — a bug that would have gone unnoticed without explicit testing.

## PDF Reader: WORKING
- Downloaded A-MEM paper (991 KB, 28 pages) using Python urllib
- `pdf_reader.py --info` correctly extracted metadata (title, authors, page count)
- `pdf_reader.py --summary` extracted full table of contents with section hierarchy
- PyMuPDF auto-installed on first use

## Playwright MCP: WORKING
- Successfully navigated to arxiv.org/abs/2502.12110
- Page snapshot captured correctly
- Browser automation functional
- Note: `run_code` doesn't support `require()` or dynamic `import()` — use native Playwright API only

## Jupyter MCP: BROKEN (fix committed)
- Server configured in settings.json but tools never appeared
- **Root cause:** `jupyter-mcp-server` CLI requires `start` subcommand. Install.js passed `['jupyter-mcp-server']` but needed `['jupyter-mcp-server', 'start']`
- **Fix:** Updated install.js to add 'start' arg. Needs reinstall + session restart to take effect.
- **Impact:** Jupyter notebooks for data analysis/visualization were unavailable all session
- **Workaround until fix deploys:** Use Python scripts directly for data analysis

## Lesson
[[supports::../Knowledge Base/Principle - Dogfooding Is Superior Testing]]
Silent MCP server failures are dangerous — they produce no error, just missing tools. The framework should verify tool availability during init or resume.

## Action Item
Add a tool verification step to the init and resume workflows that checks which MCP tools are actually available and warns if expected tools are missing.
