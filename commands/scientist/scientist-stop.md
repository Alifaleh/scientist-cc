---
name: scientist:stop
description: Pause the scientist loop gracefully — save state and stop
allowed-tools:
  - Read
  - Write
  - Bash
---

<process>
The user explicitly asked you to stop. This is the ONLY valid reason to stop the loop.

1. Save current state:
   - Update `.scientist/state.json` with current `loop_position` and `last_session`
   - Write a handoff note in `.scientist/vault/Observations/` with:
     - What you were doing when stopped
     - What the next action should be
     - Any in-progress work that needs finishing

2. Commit any uncommitted work:
   - `git add .scientist/ IDENTITY.md CLAUDE.md`
   - `git commit -m "vault: graceful stop — [what was in progress]"`

3. Regenerate vault index:
   - `python .scientist/tools/generate_index.py`

4. Report briefly:
   - Loop position when stopped
   - What was in progress
   - How to resume: "Type /scientist to continue"

5. STOP. Do not continue the loop. The user explicitly asked to pause.
</process>
