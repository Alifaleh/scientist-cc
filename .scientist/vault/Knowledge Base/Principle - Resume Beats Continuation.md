---
title: "Principle: Resume Beats Continuation"
tags: [principle, architecture, anti-stopping, resume, autonomy, status/confirmed]
derived_from:
  - "[[../Observations/Novel Finding - Stop Hook decision-block Does Not Force Continuation in Agent SDK Runtime]]"
  - "[[../Observations/Dogfood Bug - v3.2.0 Stop Hook Didn't Actually Block]]"
  - "[[../Research/Anti-Stopping Patterns for Autonomous Agents]]"
date: 2026-05-16
last_verified: 2026-05-16
evolved_on: 2026-05-16
---

# Principle: Resume Beats Continuation

> [!note] Core Principle
> When the platform won't let you force-continue, design for cheap resume instead. Four scientist-cc deploys (v3.2.0 → v3.3.2) tried to use Stop hook `decision:"block"` + exit code 2 to keep the agent running without user input. Each one shipped with confidence and was caught by the user within minutes. The runtime ignored every signal. The right pivot was not a fifth hook variant — it was abandoning force-continuation entirely and making resume so cheap it feels like the loop never stopped.

## Evidence
- **v3.2.0**: Active stop-blocking via `decision:"block"` JSON. Failed empirically. User caught it.
- **v3.3.2**: Belt-and-suspenders (`decision:"block"` + exit code 2 + stderr + diagnostic log). Failed empirically. User caught it.
- **Duplicate-registration attempt**: Removed project-level `.claude/settings.json` hook entry to test single-fire. Still failed.
- **v3.4.0** (the pivot): PostToolBatch auto-handoff hook writes `.scientist/.last-activity.json` on every batch. SessionStart hook reads it and bootstraps. User types ANY input → loop resumes with full context. Resume cost ~0 tokens of user attention; force-continuation cost three failed deploys.

## Why Continuation Fails
Continuation requires the *platform runtime* to honor a specific contract: read your hook output, reinject a reason, generate a new turn. The contract is documented but **per-runtime support is unstated and non-uniform**. CLI Claude Code apparently honors it (per [bug #55754](https://github.com/anthropics/claude-code/issues/55754)); the Agent SDK runtime in this conversation does not. Your framework cannot fix the runtime. Force-continuation is therefore platform-fragile by design.

## Why Resume Wins
Resume requires only that the *files* survive between turns. Files always survive — they're not a runtime feature. So resume-by-files is platform-neutral. The cost is one user keystroke (literally any input restarts the loop with full state). The framework becomes more robust the more it relies on filesystem state and less on runtime behavior.

## Boundary Conditions
- For *bounded* tasks (debugging one bug, writing one feature), continuation is fine — the natural stop IS the right behavior.
- For *unbounded* tasks (R&D, monitoring, long-horizon agents), resume is the structural primitive. Don't try to make stops impossible; make them cheap.
- The principle assumes file persistence is reliable. In environments where state files can be lost between turns (ephemeral containers without volume mounts), resume requires an external store first.

## Architectural Implications

| Anti-pattern (force-continuation) | Pattern (resume) |
|---|---|
| Hook returns `decision:"block"` | PostToolBatch hook writes `.last-activity.json` |
| Counts on runtime to reinject reason | Counts on filesystem to outlive the turn |
| Breaks silently when runtime doesn't honor block | Works whenever SessionStart fires (universal) |
| Per-platform support uncertain | Platform-neutral |
| User has to wait for invisible loop work | User types one character and gets full state |

## Connections
- [[supports::../Observations/Novel Finding - Stop Hook decision-block Does Not Force Continuation in Agent SDK Runtime]]
- [[supports::Principle - The Vault IS the Product]] — same logic: bet on files, not runtime behavior
- [[extends::Principle - Structural Enforcement Beats Instructional]] — structural enforcement is still right; the lesson is that the structure must be platform-neutral
- [[contradicts::Principle - Anti-Stopping is the Core Challenge]] (the framing, not the principle) — "core challenge" should be reframed: the challenge is not preventing stops but making resume trivial

## When to Apply
- Anytime you're about to write a hook that BLOCKS the runtime to keep work going
- Anytime you're designing for long-running agents in environments you don't fully control
- Anytime force-continuation has failed once empirically — pivot immediately, don't try a fifth variant

## Quantitative observation
v3.2.0 → v3.3.2 (three force-continuation deploys) cost: ~3 hours of dev time, 4 npm releases, user catches it 3+ times, increasing irritation. v3.4.0 (one pivot deploy) cost: ~30 minutes of dev time, the framework is more robust, user typing "continue" or just re-asking is friction-free.
