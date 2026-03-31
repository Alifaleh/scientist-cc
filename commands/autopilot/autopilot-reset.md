---
name: autopilot:reset
description: Archive current vault and start fresh with new context gathering
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<process>
1. Confirm with user: "This will archive your current vault and start fresh. Continue?"
2. If yes:
   - Create `.autopilot/archive/[ISO-date]/`
   - Move current vault/ to archive
   - Move IDENTITY.md to archive
   - Reset state.json
   - Keep CLAUDE.md (evolution rules should persist)
   - Keep tools/, papers/, repos/ (resources persist)
3. Run the init workflow fresh — new context gathering, new vault, new identity
4. Enter the infinite loop
</process>
