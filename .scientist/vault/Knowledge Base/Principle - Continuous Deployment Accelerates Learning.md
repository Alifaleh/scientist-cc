---
title: "Principle: Continuous Deployment Accelerates Learning"
tags: [principle, deployment, meta-learning, velocity]
derived_from:
  - "[[../Research/Dogfooding Methodology for Framework Development]]"
  - "[[../Observations/Tool Verification - Session 1]]"
  - "[[../Knowledge Base/Principle - Dogfooding Is Superior Testing]]"
date: 2026-03-31
last_verified: 2026-03-31
---

# Principle: Continuous Deployment Accelerates Learning

> [!note] Core Principle
> Deploying improvements frequently (18+ versions in one R&D effort) creates a tight feedback loop: improve → deploy → use improved version → discover next improvement. Each deploy is a test of the full pipeline and reveals integration issues that local changes miss.

## Evidence
- This R&D effort: 18 npm versions deployed, each testing the full install → use → verify pipeline
- 5 bugs discovered ONLY through deployment: tools/ not copied, MCP registration broken by .npmignore, npm cache stale, Jupyter MCP missing `start`, pdf_reader Unicode
- Every deploy revealed whether the improvement actually worked in the installed context (not just the dev context)

## Boundary Conditions
- Continuous deployment requires CI/CD (we have GitHub Actions)
- Package managers introduce caching delays — always force-refresh after publish
- Don't deploy untested breaking changes — the deploys should be frequent but not reckless

## Connections
- [[extends::Principle - Dogfooding Is Superior Testing]] — deployment IS dogfooding the install pipeline
- [[supports::Principle - Structural Enforcement Beats Instructional]] — each deploy structurally tests the system
