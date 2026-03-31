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
6. `.scientist/vault/Knowledge Base/` — count consolidated principles
7. `.scientist/logs/` — any new monitoring output?
8. `CLAUDE.md` — how many self-evolution rules accumulated?

### Vault Health Check
9. Scan notes with `last_verified` frontmatter — flag any past validity window
10. Check for notes tagged `status/untested` that are older than 3 sessions
11. Count total vault notes by directory

Output a concise status report:
```
## Scientist Status

**Mastery Stage:** [1-4] ([name])
**Sessions:** [N]
**Loop Position:** [last step from state.json]

### Knowledge
**Vault Notes:** [N] research, [N] observations, [N] hypotheses, [N] experiments, [N] principles
**Papers Read:** [list from state.json]
**Frameworks Studied:** [list from state.json]

### Hypotheses
**Untested:** [N]  |  **Confirmed:** [N]  |  **Falsified:** [N]

### Health
**Self-Evolution Rules:** [count] in CLAUDE.md
**Stale Notes:** [N] past validity window
**Oldest Unverified:** [note name and date]
**Skills Built:** [list]

### Focus
**Current:** [from vault Index]
**Open Questions:** [from vault Index]
**Next Priority:** [based on state + roadmap]
```

Do NOT enter the loop. Just report and stop.
</process>
