---
title: "Principle: Dogfooding Is Superior Testing for Meta-Tools"
tags: [principle, methodology, testing]
derived_from:
  - "[[../Observations/Framework Self-Analysis]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Dogfooding Is Superior Testing for Meta-Tools

> [!note] Core Principle
> When a tool is designed to improve a process, the best test is using the tool on itself. Structural analysis and unit tests catch syntax errors; dogfooding catches design flaws, workflow gaps, and usability issues.

## Evidence
- [[../Observations/Framework Self-Analysis|Self-analysis]] found 4 critical gaps through structural analysis, but reading the actual source code corrected 1 (MCP servers work via public packages, not bundled repos)
- Dogfooding caught the `install.js` tools/ bug immediately — no automated test would have found that the init workflow references paths the installer doesn't create
- The user explicitly confirmed this approach: "you are running on the scientist plugin, so when you do stupid stuff, fix them"

## Boundary Conditions
- Dogfooding doesn't replace formal testing — it complements it
- You can only dogfood scenarios you actually encounter — rare edge cases need separate testing
- Beware of "works on my machine" bias — dogfooding tests one configuration, not all

## Connections
- [[supports::Principle - Targeted Correction Beats Broad Reflection]]
