# Scientist Resume Workflow

This workflow runs when `/scientist` is called in a project that already has `.scientist/`.

## Step 1: Load State

Read `.scientist/state.json`:
- What mastery stage am I at?
- Where in the loop did I leave off?
- How many sessions have I done?
- What hypotheses are active?

Update `total_sessions` +1 and `last_session` timestamp.

## Step 2: Read Identity

Read `IDENTITY.md`:
- Who am I in this project?
- What domain expertise have I built?
- What rules have I learned the hard way?

## Step 3: Read CLAUDE.md

Read `CLAUDE.md`:
- What thinking errors have I patched?
- What rules must I follow?
- Are there new rules since last session?

## Step 4: Read Vault Index

**Fast path (preferred):** Read `.scientist/vault/vault-index.json` for a structured overview of all notes:
- Filter by `status: "untested"` → active hypotheses
- Filter by `status: "actionable"` → observations needing follow-up
- Sort by `date` → most recent notes first
- Check `last_verified` → find stale notes

**Fallback:** If vault-index.json doesn't exist, read `.scientist/vault/Index.md` for human-readable overview:
- What's my current focus?
- What open questions do I have?
- What hypotheses are untested?

**Then** read only the TOP PRIORITY notes (not all of them):
- Untested hypotheses (from index)
- In-progress experiments
- Notes modified since last session (compare dates to `last_session` in state.json)

## Step 5: Knowledge Health Check

Check for stale or potentially outdated knowledge:
- Read notes with `last_verified` frontmatter — flag any past their `validity_window`
- Check if any `superseded_by` chains exist that haven't been cleaned up
- Look for contradictions between recent observations and existing principles in `Knowledge Base/`

If stale notes found: add them to the open questions list for re-validation this session.

## Step 6: Check Monitoring Scripts

Check `.scientist/logs/` for output from any observation scripts:
- Were any scripts running between sessions?
- Any alerts or interesting patterns logged?
- Read and analyze new log data.

## Step 7: Check Git State

Verify the working state is clean:
- Are we on the correct branch (`scientist/research` or an experiment branch)?
- Any uncommitted changes from last session? If yes, commit them with `vault:` prefix.
- Any experiment branches that need merging or deleting based on hypothesis status?
- Check `git log --oneline -10` for context on what the last session committed.

## Step 8: Quick Status Summary

Log (don't show to user unless asked):
- Session #N resuming
- Mastery stage: X
- Active hypotheses: N untested, N in progress
- Last focus: [from vault Index]
- New log data: [yes/no]
- Stale knowledge found: [yes/no]
- Git state: [clean/dirty]

## Step 9: Enter The Loop

Pick up where the loop left off (from `state.json.loop_position`), or start from REFLECT if unclear.

**Recovery rules:**
- If `loop_position` is missing or invalid → start from REFLECT
- If `loop_position` is mid-step (e.g., "validate") but the hypothesis note is gone → start from REFLECT
- If the vault Index references notes that don't exist → clean up Index first, then REFLECT
- If state.json is corrupted or missing → recreate from git history and vault contents

DO NOT STOP. Immediately continue the infinite loop.
