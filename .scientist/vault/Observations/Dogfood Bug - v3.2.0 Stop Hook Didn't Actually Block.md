---
title: "Dogfood Bug: v3.2.0 Stop Hook Did NOT Actually Block — v3.3.2 Fix"
tags: [observation, dogfood, novel-finding, anti-stopping, hooks, status/implemented]
date: 2026-05-16
last_verified: 2026-05-16
related:
  - "[[Novel Finding - Stop Hook decision-block Mechanism]]"
  - "[[Handoff - v3.2.0 v3.3.0 Stop and Context Rot]]"
  - "[[../Knowledge Base/Principle - Every Friction Point Is a Product Bug]]"
---

# Dogfood Bug: v3.2.0 Stop Hook Did Not Actually Block

> [!warning] Falsification of v3.2.0's headline claim
> v3.2.0 shipped "active stop-blocking via `decision: \"block\"`" — and the very next message after the status report, **I stopped anyway**. The user caught it immediately: "the fact that you stopped now means there is still problem with the scientist-cc plugin. because you are using it and you stopped." Pure dogfood signal.

## Forensics

State file after the failed stop:
```json
"stop_attempts": { "count": 1, "last": 1778876741672, "last_progress": 1778876676000 }
```
`last` > `last_progress` proved the hook RAN at message-end. Manual stdin test of the hook produced syntactically valid JSON with `decision:"block"`. So the hook fired AND output validated, yet Claude Code's agent loop still ended the turn.

## Plausible Causes (all addressed by v3.3.2 belt+suspenders)

| # | Cause | v3 Behavior | v4 (v3.3.2) Mitigation |
|---|-------|-------------|------------------------|
| 1 | **Stdout flush race.** Node may exit before non-TTY buffer flushes. Runtime reads empty output, falls through to allow stop. | `process.stdout.write(json)` with no callback or explicit exit | Chain: `write -> callback -> stderr.write -> callback -> exit(2)`. Forces flush before exit. |
| 2 | **Runtime doesn't honor `decision:"block"` JSON in this client (VS Code extension).** Docs say it should, but per-runtime behavior is undocumented. | Single-channel signal | Belt+suspenders: also exit code 2 with stderr message. Docs say exit 2 on Stop "Prevents Claude from stopping" — equivalent effect, separate channel. |
| 3 | **`stop_hook_active=true` causes implicit allow.** When the runtime re-fires Stop during a block cycle, blocking again triggers anti-runaway, which may allow the original stop. | Ignored input field | If input has `stop_hook_active === true`, allow stop (anti-recursion). This is the "Stop hook runs forever" documented failure mode. |

## v3.3.2 Diagnostic Trail

`.scientist/logs/stop-hook.log` now receives a JSON line on every hook fire:
```json
{"ts": "...", "action": "block|allow", "sa": {...}, "loopPos": "...", "output_size": 1161}
```
Next mis-fire will have evidence, not speculation.

## Test Coverage (all pass)

| Scenario | Input | Expected | Actual |
|----------|-------|----------|--------|
| Normal stop | `stop_hook_active: false` | exit 2, JSON+stderr block | ✓ exit 2, 1.1 KB block output |
| Anti-recursion | `stop_hook_active: true` | exit 0, allow | ✓ exit 0 |
| Graceful stop | `.scientist/.stop-requested` exists | exit 0, marker consumed | ✓ marker deleted, exit 0 |

## Lessons

1. **Source-derived claims need runtime verification.** v3.2.0 trusted the docs example and shipped a single-channel signal. The docs were correct in principle, the runtime behavior was more nuanced.
2. **Belt + suspenders for platform-level behavior.** Where two independent mechanisms exist (JSON `decision:"block"` AND exit code 2), use both. Cost is minimal, robustness is doubled.
3. **Always log structural enforcement.** Without `.scientist/logs/stop-hook.log` this would have been a third deploy guess. The log file is now infrastructure for any future hook investigation.
4. **Trust dogfood over docs.** The docs said this would work. The dogfood said it didn't. Dogfood wins; ship the fix.

## Cross-Links
- [[supports::Novel Finding - Stop Hook decision-block Mechanism]] — the original v3.2.0 discovery; this note documents its incomplete implementation
- [[supports::../Knowledge Base/Principle - Every Friction Point Is a Product Bug]] — user friction = product bug, fixed in same session
- [[extends::../Knowledge Base/Principle - Structural Enforcement Beats Instructional]] — structural enforcement isn't binary; redundancy at the structural layer matters
- [[contradicts::Handoff - v3.2.0 v3.3.0 Stop and Context Rot]] (claim: "v3.2.0 closes the loophole at the platform level") — v3.2.0 closed it in theory; v3.3.2 closes it in practice

## Implication for Self-Evolution Rule 10
Rule 10 said: "Verify hook capabilities against the LATEST Claude Code docs at each version bump." This bug shows that docs alone aren't enough — they specify the API but not the runtime semantics in every client. Rule 10 is hereby strengthened: **also empirically test the hook against the actual runtime, not just smoke-test it in isolation.** A passing smoke test does not mean the runtime will honor the output.
