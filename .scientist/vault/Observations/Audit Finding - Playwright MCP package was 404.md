---
title: "Audit Finding: Playwright MCP Registered a 404 npm Package Since v0"
tags: [observation, audit, dogfood, bug, mcp, status/implemented]
date: 2026-05-16
last_verified: 2026-05-16
related:
  - "[[../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]"
  - "[[../Knowledge Base/Principle - The Meta-Tool Advantage]]"
---

# Audit Finding: Playwright MCP Registered a Non-Existent npm Package

> [!bug] Critical install-time silent failure (every install since v0)
> `bin/install.js` registered `@anthropic-ai/mcp-server-playwright` as the Playwright MCP command. **That package does not exist on npm — `npm view @anthropic-ai/mcp-server-playwright` returns 404.** Every `scientist-cc --global` invocation printed `✓ MCP: Playwright (browser control)` as a confidence signal that was, in fact, a lie. The MCP server never started on fresh installs; users who appeared to have Playwright working were running it via some other path (manual install, IDE bundling, etc.).

## How it was caught
Rule 10 audit per the v3.4.0 closing handoff queue: "Audit framework for stale Claude Code assumptions per Rule 10 (skill loading, MCP behavior, parallel concurrency)." I scanned `install.js` for the MCP package names, then ran `npm view` against each one. Playwright returned 404 immediately. Jupyter (`jupyter-mcp-server`) checked out fine at version 1.0.2 on pypi.

## The fix
Replaced with `@playwright/mcp@latest` — Microsoft's official MCP package, ~0.0.75 at time of fix. Description updated to credit upstream. Shipped as v3.4.1.

## How long the bug was live
First registration of `@anthropic-ai/mcp-server-playwright` traces back to early v0 commits (March 31, 2026). **~46 days of silent failure.** Every release between v0 and v3.4.0 reinforced the lie because the install message was the same.

## Why no test caught it
- The `--global` install only checks file copies and JSON edits succeed; it never tries to ACTUALLY start the MCP server.
- The hook smoke tests run hook scripts, not MCP server registration.
- Dogfooding on this machine had Playwright working through a pre-existing path, masking the failure for the developer.
- No issue was filed because no user explicitly reported "Playwright doesn't work" — likely because most users assumed the failure was on their end, and the silence was indistinguishable from working in the verbose npm install output.

## Generalizable lesson
**Audit external dependencies at every major version bump, not just internal code.** Package names CAN be wrong from day one and remain wrong forever if no one verifies. The Rule 10 audit pattern is now: for every external dependency the framework names, run a probe that confirms the dependency actually exists and is reachable. `npm view`, `pip index versions`, `pypi /json` are all cheap and definitive.

## Implication for self-evolution Rule 8
Rule 8 says "Test EVERY deploy — .npmignore and packaging can silently break features." This finding extends it: **also test that external deps actually resolve.** A package can be silently wrong from inception, not just after a regression.

## Cross-Links
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]
- [[supports::Dogfood Bug - v3.2.0 Stop Hook Didn't Actually Block]] — same class of bug: confident claim, silent platform-level failure, caught only via empirical probing
- [[extends::../Research/Claude Code Source Analysis - Exploitable Patterns]] — the source analysis trusted the install.js registration; this finding shows the analysis was downstream of an upstream lie
