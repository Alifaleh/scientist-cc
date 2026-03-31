# Git Workflow for R&D Projects

R&D projects are different — you don't know where you're going. The git workflow must support exploration, dead ends, and pivots.

## Branching Strategy

```
main                        ← stable, current best understanding
  └── autopilot/research    ← active R&D work
        ├── autopilot/experiment/vpin-filter  ← risky experiment
        ├── autopilot/experiment/new-signals  ← another experiment
        └── (merge back when results are in)
```

## Rules

- `main` only gets merges when there's a significant, validated improvement
- `autopilot/research` is the working branch — frequent commits, messy is OK
- `autopilot/experiment/<name>` for risky changes — if they fail, delete the branch but KEEP the vault documentation
- **Never force push.** History matters. Dead ends are valuable data.

## Commit Prefixes

| Prefix | When |
|--------|------|
| `research:` | Learned something new, documented in vault |
| `experiment:` | Testing a hypothesis in code |
| `observation:` | Data collection, monitoring scripts |
| `vault:` | Vault-only changes (notes, organization) |
| `fix:` | Bug fix in existing code |
| `tool:` | New tool or script created |
| `evolve:` | CLAUDE.md or IDENTITY.md self-evolution update |
| `skill:` | Skill building (new library learned, docs read) |

## Commit Messages

**Include WHY, not just WHAT.**

Bad: `update SL parameter`
Good: `experiment: widen SL 0.2%→0.3% — MAE analysis shows losers avg 0.26%, noise kills at 0.2%`

Bad: `add new filter`
Good: `research: flow autocorrelation as entry filter — Bouchaud 2004 shows buys follow buys (gamma~0.5)`

## When to Commit

- After documenting research in the vault
- Before and after each experiment
- After self-evolution updates to CLAUDE.md
- After adding new observation scripts
- After building a new skill
- Whenever you've done meaningful work (even if it's "just" reading and noting)
