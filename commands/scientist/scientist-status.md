---
name: scientist:status
description: Quick status check — what do I know, what stage am I at, what's active
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---

<process>
Read and summarize:

1. `.scientist/state.json` — mastery stage, sessions, hypotheses counts
2. `IDENTITY.md` — who I am, what I know, current approach
3. `.scientist/vault/Index.md` — current focus, open questions

Then scan:
4. `.scientist/vault/Hypotheses/` — list untested hypotheses
5. `.scientist/vault/Experiments/` — list in-progress experiments
6. `.scientist/logs/` — any new monitoring output?
7. `CLAUDE.md` — how many self-evolution rules accumulated?

Output a concise status report:
```
## Scientist Status

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
