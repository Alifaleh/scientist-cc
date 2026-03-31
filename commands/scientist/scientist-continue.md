---
name: scientist:continue
description: Resume the scientist loop after a graceful stop
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - WebSearch
  - WebFetch
  - TodoWrite
  - NotebookEdit
---

<process>
The user wants the scientist loop to resume after being stopped with /scientist:stop.

This is identical to /scientist resume mode — read state, identity, vault, and continue the loop.

1. Read `.scientist/state.json` — where were we?
2. Read the latest handoff note — what was in progress?
3. Read `IDENTITY.md` and `CLAUDE.md` — who are we, what rules?
4. Enter the infinite loop immediately from the saved `loop_position`

**DO NOT STOP. The loop resumes now.**
</process>
