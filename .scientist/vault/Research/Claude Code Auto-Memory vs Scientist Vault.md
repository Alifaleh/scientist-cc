---
title: "Claude Code Auto-Memory vs Scientist Vault"
tags: [research, claude-code, auto-memory, persistence, status/understood]
source: "Direct observation of ~/.claude/projects/*/memory/ + CLAUDE.md system"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[MemGPT Architecture Mapping]]"
  - "[[Context Engineering for AI Agents]]"
---

# Claude Code Auto-Memory vs Scientist Vault

> [!note] Key Insight
> Claude Code has TWO memory systems: auto-memory (`~/.claude/projects/*/memory/`) for cross-conversation persistence, and CLAUDE.md for per-project instructions. The scientist vault is a THIRD system that's richer than both but not natively loaded. The three systems should complement, not compete.

## Three Memory Systems in Claude Code

| System | Location | Loaded When | Format | Purpose |
|--------|----------|-------------|--------|---------|
| **Auto-memory** | `~/.claude/projects/*/memory/` | Every conversation | Markdown files with frontmatter | User preferences, feedback, project context |
| **CLAUDE.md** | Project root + ~/.claude/ | Every conversation | Markdown | Behavioral rules, project context |
| **Scientist vault** | `.scientist/vault/` | When /scientist runs resume | Obsidian markdown + JSON index | Research notes, hypotheses, principles |

## How They Interact
- **Auto-memory** stores 2 memories for this project (feedback about self-update loop and dogfooding)
- **CLAUDE.md** has 9 self-evolution rules + scientist identity
- **Vault** has 27 notes with weighted relevance scoring

## Gap: Vault Not Auto-Loaded
The vault is the richest knowledge store but only loads when `/scientist` runs and triggers the resume workflow. Auto-memory and CLAUDE.md load automatically every conversation. This means Claude in non-scientist conversations doesn't have vault access.

## Potential Integration
- Auto-memory could store a summary of vault state (note count, focus area, key findings)
- CLAUDE.md already references the vault ("read vault-index.json at startup")
- A hook could inject vault-index.json summary into context at conversation start

## Cross-Links
- [[extends::MemGPT Architecture Mapping]] — MemGPT's 3-tier maps to our 3 systems: auto-memory=system, CLAUDE.md=working, vault=external
- [[supports::Context Engineering for AI Agents]] — "complexity in the knowledge store, not the prompt"
