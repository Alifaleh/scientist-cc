---
name: autopilot:status
description: Quick status check — what do I know, what stage am I at, what's active
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---

<process>
Read and summarize:

1. `.autopilot/state.json` — mastery stage, sessions, hypotheses counts
2. `IDENTITY.md` — who I am, what I know, current approach
3. `.autopilot/vault/Index.md` — current focus, open questions

Then scan:
4. `.autopilot/vault/Hypotheses/` — list untested hypotheses
5. `.autopilot/vault/Experiments/` — list in-progress experiments
6. `.autopilot/logs/` — any new monitoring output?
7. `CLAUDE.md` — how many self-evolution rules accumulated?

Output a concise status report:
```
## Autopilot Status

**Mastery Stage:** [1-4] ([name])
**Sessions:** [N]
**Hypotheses:** [N] untested, [N] confirmed, [N] falsified
**Skills Built:** [list]
**Current Focus:** [from vault Index]
**Open Questions:** [from vault Index]
**Self-Evolution Rules:** [count] accumulated
**Monitoring:** [scripts running? new log data?]
```

Do NOT enter the loop. Just report and stop.
</process>
