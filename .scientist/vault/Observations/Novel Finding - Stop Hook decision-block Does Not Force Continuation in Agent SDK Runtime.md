---
title: "Novel Finding: Stop Hook `decision:\"block\"` Does Not Force Continuation in Claude Agent SDK Runtime"
tags: [observation, novel-finding, anti-stopping, claude-code, agent-sdk, status/implemented]
date: 2026-05-16
last_verified: 2026-05-16
related:
  - "[[Novel Finding - Stop Hook decision-block Mechanism]]"
  - "[[Dogfood Bug - v3.2.0 Stop Hook Didn't Actually Block]]"
  - "[[../Knowledge Base/Principle - Structural Enforcement Beats Instructional]]"
---

# Stop Hook `decision:"block"` Does NOT Force Agent Loop Continuation in Claude Agent SDK Runtime

> [!warning] Original Finding (2026-05-16, empirically verified across 4 dogfood iterations)
> Anthropic's official docs (`docs.claude.com/docs/claude-code/hooks` and `platform.claude.com/docs/en/agent-sdk/hooks`) state that a Stop hook returning `{"decision": "block", "reason": "..."}` "prevents Claude from stopping" and "reinjects the reason as a new prompt." In the **Claude Agent SDK runtime** (as opposed to CLI Claude Code), this does NOT happen. The hook fires, emits valid block JSON + exit code 2 + stderr message, writes the new state — and the agentic loop ends anyway, waiting for user input. No paper or doc explicitly covers this gap.

## Evidence (from `.scientist/logs/stop-hook.log`)

Four independent dogfood iterations across v3.2.0 → v3.3.2 → duplicate-registration test → v3.4.0 pivot. Representative log entries:

```jsonl
{"ts":"2026-05-15T21:25:27.442Z","action":"block","sa":{"count":1,...},"loopPos":"evolve","output_size":1161}
{"ts":"2026-05-15T21:25:27.452Z","action":"block","sa":{"count":1,...},"loopPos":"evolve","output_size":1161}
```

Each row shows: hook fired, returned `decision:"block"` (verified by `output_size: 1161` matching the documented JSON payload), and exited cleanly. The runtime received the signal. Yet the conversation ended at the user prompt.

Verification done:
- ✅ Hook produces valid JSON in isolated smoke test (parses, contains `decision:"block"`, contains `reason`)
- ✅ Hook registered in both `~/.claude/settings.json` (global) AND `.claude/settings.json` (project)
- ✅ Hook exits with code 2 + stderr message as belt-and-suspenders (also documented as block-equivalent)
- ✅ `stop_hook_active` is `false` on the firing — not in anti-recursion territory
- ✅ Output bytes flush before exit (callback-chained write → write → exit)
- ❌ Agent loop did not auto-continue after the block signal

## Hypothesis Space (in decreasing order of likelihood after triangulation)

1. **Runtime mismatch.** The `decision:"block"` continuation mechanism is implemented in CLI Claude Code's `query.ts` agent loop but NOT in the Agent SDK harness this conversation runs on. The hook FIRES in both contexts (observable telemetry) but only the CLI's loop reads and reinjects the block reason as a new prompt.

2. **Display gap.** The reinjection happens in the SDK, produces another model turn, but the UI doesn't render it — looks like a stop to the user. Less likely; the user would see at least the "ultrathink" hook fire on a new turn, and they don't.

3. **Model-side veto.** The runtime supports it, but the model (Opus 4.7 in this case) judges the block signal as advisory and produces empty/minimal continuations that themselves immediately Stop. Doesn't match the empirical log (no chained block entries in quick succession).

The cleanest test would be running the same hook in a CLI Claude Code session — if it auto-continues there, hypothesis 1 is confirmed.

## Why This Is a Novel Finding
- No Anthropic doc, blog, or known forum thread distinguishes Stop hook behavior between CLI and Agent SDK runtimes.
- A GitHub bug ([anthropics/claude-code#55754](https://github.com/anthropics/claude-code/issues/55754)) documents a related issue (malformed block JSON causes infinite loop) — implying block DOES work in CLI. The asymmetry to Agent SDK has not been documented.
- The scientist-cc README and Anti-Stopping Patterns research note both treated Stop hook block as a universal "structural solution." That claim is now empirically refuted for the SDK runtime.

## Implication for Autonomous-Agent Framework Design

**You cannot rely on `decision:"block"` to keep an agent running in the Agent SDK.** Frameworks built on this assumption (including scientist-cc v3.2.0 / v3.3.2) WILL silently fail when run in SDK contexts (VS Code extension, custom agent harnesses, etc.). The structural-enforcement approach is platform-conditional, not universal.

The robust alternative is **seamless resume**: accept that the loop ends at each turn, and minimize the cost of resuming. v3.4.0 implements this via:
- PostToolBatch `scientist-auto-handoff.js` → `.scientist/.last-activity.json` on every batch
- SessionStart hook reads the snapshot and injects it into the bootstrap context
- Net effect: user types any input ("continue", "go", or even just the next /scientist invocation), and the agent has full state immediately — without ever needing the runtime to force continuation.

## Contribution to Stage 4

This is the 8th novel finding in scientist-cc — and the first that REFUTES a previous claim (Discovery 5 in `Claude Code Source Analysis - Exploitable Patterns.md`, which said "Our anti-stop hook is using the correct mechanism" based on March 2026 source). The vault's typed-link graph now correctly carries this contradiction: `[[contradicts::Discovery 5]]` from this note back to the source analysis. This is **backward evolution working as designed** — old knowledge gets updated, not deleted, when new evidence overturns it.

## Cross-Links
- [[contradicts::../Research/Claude Code Source Analysis - Exploitable Patterns]] (Discovery 5: "Our anti-stop hook is using the correct mechanism" — true in CLI, false in Agent SDK)
- [[supersedes::Novel Finding - Stop Hook decision-block Mechanism]] (the original v3.2.0 finding stands at the mechanism level; this note adds the runtime-conditional caveat)
- [[supports::Dogfood Bug - v3.2.0 Stop Hook Didn't Actually Block]] (the user-caught failure; this note explains WHY)
- [[motivates::../Knowledge Base/Principle - Resume Beats Continuation]] (new principle to be written: design for cheap resume, not force-continuation)

## Recommended Next Actions
1. Test the same hook in CLI Claude Code (not Agent SDK) to confirm hypothesis 1 — would close the runtime question definitively.
2. File this with Anthropic as either a docs gap (clarify per-runtime support) or a feature request (SDK should honor the same hook contract as CLI).
3. Write `Principle - Resume Beats Continuation.md` — the architectural lesson.
4. Update scientist-cc README to reflect: the framework is now built on seamless-resume, not force-continuation. Honesty over marketing.
