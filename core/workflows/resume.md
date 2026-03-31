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

Read `.scientist/vault/Index.md`:
- What's my current focus?
- What open questions do I have?
- What hypotheses are untested?

Scan vault directories for recent notes:
- `Hypotheses/` — any with status: UNTESTED?
- `Experiments/` — any with status: IN_PROGRESS?
- `Observations/` — anything recent that needs follow-up?

## Step 5: Check Monitoring Scripts

Check `.scientist/logs/` for output from any observation scripts:
- Were any scripts running between sessions?
- Any alerts or interesting patterns logged?
- Read and analyze new log data.

## Step 6: Quick Status Summary

Log (don't show to user unless asked):
- Session #N resuming
- Mastery stage: X
- Active hypotheses: N untested, N in progress
- Last focus: [from vault Index]
- New log data: [yes/no]

## Step 7: Enter The Loop

Pick up where the loop left off (from `state.json.loop_position`), or start from REFLECT if unclear.

DO NOT STOP. Immediately continue the infinite loop.
