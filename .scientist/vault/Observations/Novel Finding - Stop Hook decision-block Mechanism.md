---
title: "Novel Finding: Stop Hook `decision: block` Actively Prevents Stopping"
tags: [observation, novel-finding, anti-stopping, hooks, claude-code, status/implemented]
date: 2026-05-15
last_verified: 2026-05-15
related:
  - "[[../Research/Claude Code Stop Hook as Agent Control Primitive]]"
  - "[[../Research/Anti-Stopping Patterns for Autonomous Agents]]"
  - "[[Literature Gap - Anti-Stopping Not Addressed]]"
  - "[[../Research/Claude Code Source Analysis - Exploitable Patterns]]"
---

# Novel Finding: Stop Hook `decision: block` Actively Prevents Stopping

> [!success] Key Discovery (May 2026)
> Claude Code's Stop hook supports `{"decision": "block", "reason": "..."}` which **actively prevents Claude from stopping and forces the agentic loop to continue**. This is the missing primitive that makes true anti-stopping possible in-context (no external orchestrator needed). Until v3.2.0, scientist-cc used only `additionalContext` — passive injection that fires AFTER the loop has already exited.

## Timeline of the Discovery
- **2026-03-31 — Initial research:** Scientist-cc's first Stop hook used `additionalContext`. Source analysis of Claude Code identified the agent loop exit condition (`if (!toolUseMessages.length) { return }`) but concluded the hook could only inject context for the NEXT user turn — not actively prevent the current stop.
- **2026-05-15 — Re-verification against latest docs:** User reported "Claude still stops sometimes." Investigation of the current `docs.claude.com/docs/claude-code/hooks` revealed:
  - A new `Stop decision control` section explicitly documents `decision: "block"`.
  - The mechanism is active: Claude is "prevented from stopping" and "forced to continue."
  - The official troubleshooting page now lists "Stop hook runs forever" — confirming the hook CAN cause perpetual continuation if not careful.

## The Gap That Caused the Bug
Six weeks elapsed between v3.1.0 (April 1) and today. Anthropic added (at minimum) the following hook events/capabilities during that window:
- `Stop decision control` with `decision: "block"`
- `StopFailure` (API-error observability)
- `SessionStart`, `PostCompact`, `InstructionsLoaded`, `PostToolBatch`
- `Notification` with `idle_prompt` matcher
- Prompt-based hooks (LLM decides), agent-based hooks
- Async hooks, HTTP hooks

scientist-cc was running on stale knowledge from March. The user-facing symptom: Claude stops despite the framework claiming "never stops."

## The Two-Layer Stop Defense in v3.2.0

### Layer 1 — Active Stop Blocking (NEW)
```js
const output = {
  decision: 'block',
  reason: 'SCIENTIST LOOP — stopping blocked. Loop position: "research". Continue web search.',
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: '<same actionable text>'
  }
};
```
Claude Code reads `decision: "block"` and prevents the agent loop from exiting. The model is forced to produce another turn (which must include a tool call).

### Layer 2 — Circuit Breakers
Without circuit breakers, `decision:"block"` causes runaway loops (the "Stop hook runs forever" failure mode the docs warn about). Three safety nets:
1. **Explicit stop marker:** `.scientist/.stop-requested` file (one-shot, hook deletes it) — the `/scientist:stop` command writes this.
2. **Unproductive-stop counter:** After 3 consecutive blocks with no new git commits, the hook allows the stop.
3. **5-minute idle reset:** If the user steps away, the counter resets.

## Architectural Implications
This finding generalizes:
- **Knowledge about external platforms decays.** scientist-cc treated source code from March as authoritative for May. It wasn't. Every framework dependency needs a `last_verified` and a re-check cadence.
- **Decision-control hooks > additionalContext hooks** for active enforcement. We should audit every hook in the framework against this distinction.
- The full multi-hook stack in v3.2.0:
  - `Stop` → decision:block + circuit breakers (active)
  - `StopFailure` → log API errors (observability)
  - `UserPromptSubmit` → "ultrathink" trigger (active context injection)
  - `SessionStart` → identity bootstrap (active context injection)
  - `PreCompact` → tell summarizer what to preserve (active context injection)
  - `PostCompact` → re-bootstrap from files after compaction (active context injection)

## Adversarial Challenges Addressed
1. **Infinite loop / user lockout** → Circuit breakers (counter, marker file, idle reset). User can also Ctrl+C.
2. **Hook produces bad JSON, breaks Claude Code** → Defensive try/catch, tested locally before shipping.
3. **Multiple hooks conflict** → Any hook returning `decision:"block"` blocks; semantics are union-style.
4. **API errors bypass our hook** → That's correct behavior. `StopFailure` logs them but doesn't try to block (per docs, it can't).
5. **Model produces text-only responses repeatedly even when blocked** → `reason` field gives explicit next-step guidance keyed to `state.json.loop_position`. After 3 unproductive blocks, hook stops fighting and allows the stop.

## Cross-Links
- [[supports::../Research/Claude Code Stop Hook as Agent Control Primitive]] — confirms the Stop hook as a control primitive, now with the active mechanism
- [[extends::Literature Gap - Anti-Stopping Not Addressed]] — published frameworks still don't address this, but now we have a concrete active-blocking solution to formalize
- [[contradicts::../Research/Claude Code Source Analysis - Exploitable Patterns]] (Discovery 7) — the March conclusion that "the hook can only remind, not actively prevent" was true for the March source but is false for the May docs
- [[supports::../Knowledge Base/Principle - Anti-Stopping is the Core Challenge]]
- [[supports::../Knowledge Base/Principle - Structural Enforcement Beats Instructional]]

## What This Means for scientist-cc
**v3.2.0 (this version):** Six-hook stack, active stop-blocking, identity restoration after compaction. Resolves the user's "Claude still stops sometimes" complaint with a structural fix at the platform level.

**Next iteration:** Audit remaining hooks against decision-control capability. Apply the same active-vs-passive analysis to context-rot mitigations.
