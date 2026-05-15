---
title: "Handoff: v3.2.0 + v3.3.0 — Active Stop-Blocking and Context Rot Defense"
tags: [observation, handoff, status/actionable]
date: 2026-05-15
related:
  - "[[Novel Finding - Stop Hook decision-block Mechanism]]"
  - "[[../Research/Anti-Stopping Patterns for Autonomous Agents]]"
  - "[[Literature Gap - Anti-Stopping Not Addressed]]"
---

# Handoff: v3.2.0 + v3.3.0

> [!note] Context
> Resumed after ~6 weeks (Apr 1 → May 15) on Opus 4.7 with the user's explicit ask: fix the stopping problem, fix context rot, improve memory, and keep the meta-loop working. Two production releases shipped this session. Both published to npm and reinstalled globally — running instance is now on v3.3.0.

## What Shipped

### v3.2.0 — Active Stop Blocking (the real fix)
**Root cause discovered:** The Stop hook had been using `additionalContext` (passive injection) since March. Anthropic's May 2026 docs documented a new `decision: "block"` mechanism that ACTIVELY prevents stopping. Six weeks of platform evolution invalidated the framework's core assumption.

Six-hook stack now:
- `Stop` → decision:block + circuit breakers (3-strike unproductive-stop counter, 5-min idle reset, `.scientist/.stop-requested` marker for graceful stop)
- `StopFailure` NEW → log API errors to state.json
- `UserPromptSubmit` → "ultrathink" trigger every turn (31,999 thinking tokens)
- `SessionStart` NEW → identity bootstrap on startup/resume/clear/compact
- `PreCompact` → tell summarizer what scientist state to preserve
- `PostCompact` NEW → re-bootstrap identity from files after compaction

### v3.3.0 — Context Rot Defense
**Root cause:** Chroma 2025 (18/18 frontier models degrade) + NoLiMa 2025 (11/12 below 50% at 32k tokens) + Anthropic's own context-engineering post all confirm: for coding agents with accumulative context, rot is the #1 silent failure. With 90+ vault notes the old REFLECT "read everything" approach was actively making Claude worse.

- `core/references/context-rot.md` — protocol with 3-tier retrieval, distractor hygiene, subagent-as-cleanser, position-aware writing
- `tools/vault_query.py` — focused retrieval: `--status / --tag / --recent / --stale / --search`, returns paths + summaries (never full bodies blind)
- Hard rule: ≤ 5 vault note bodies per turn
- Loop REFLECT step rewritten to use the tool
- Rule 11 added to CLAUDE.md

## Why this matters
The previous v3.x stack claimed "never stops" but didn't structurally prevent stopping — it just injected reminders that fired AFTER the agent loop had exited. The user complaint "Claude still stops sometimes" was a direct, reproducible consequence. v3.2.0 closes the loophole at the platform level.

Context rot was working silently. The vault grew from ~12 notes (v0.5) to 90+ — exactly the regime where Chroma's experiments show 50%+ recall drop. Three-tier retrieval is the structural fix; aspirational "be selective" rules don't survive long sessions.

## Self-evolution rules added
- **Rule 10:** Re-verify Claude Code hook capabilities at every version bump. External platforms evolve; stale assumptions break the framework. (Reasoning: 6 weeks of Anthropic ships invalidated March's source-analysis conclusions.)
- **Rule 11:** Never load the full vault. Use `vault_query.py`. Hard limit of 5 note bodies per turn. (Reasoning: empirical context rot research — every frontier model degrades; coding agents are the worst case.)

## What's next (priorities for the next context window)
1. **Verify the new hooks empirically.** In a fresh session, count how many Stop events fire with no user message — should be 0 (or only when `.stop-requested` exists or circuit breaker trips).
2. **Audit the rest of the framework against Rule 10.** Same exercise: what assumptions about Claude Code might be stale? Skill loading, parallel tool concurrency limits, MCP behavior.
3. **Test on a non-scientist-cc project.** This is the long-standing v3.x next_priority — eat dogfood somewhere new.
4. **Backward evolution** — Stage 4 (Novel Thinker) requires 10+ evolved notes. The mechanism exists in CONSOLIDATE; we haven't run it on the existing 90+ notes.
5. **Consider `PostToolBatch` enforcement.** Could fire after big tool batches to remind: "did you distill into a vault note?" Active reminder vs passive guidance.

## State at handoff
- Branch: `main` (no longer on `scientist/research` — merged for CI publish)
- Latest commit: `e5c7955` (v3.3.0)
- npm: `scientist-cc@3.3.0` published, installed globally on this machine
- Hooks active in `~/.claude/hooks/`: 6 scientist hooks (plus pre-existing gsd-*)
- Settings registered: Stop, StopFailure, UserPromptSubmit, SessionStart, PreCompact, PostCompact

## Cross-links
- [[supports::Novel Finding - Stop Hook decision-block Mechanism]] — the discovery that drove v3.2.0
- [[supports::../Knowledge Base/Principle - Structural Enforcement Beats Instructional]] — `decision:block` is structural; the old `additionalContext` was instructional, and that's why it failed
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]] — user friction ("still stops") = product bug, fixed at the platform-feature level not the prompt level
- [[extends::../Research/Anti-Stopping Patterns for Autonomous Agents]] — the 4-pattern stack is now upgraded: pattern 2 (Stop event hook) is now active-blocking, not passive
