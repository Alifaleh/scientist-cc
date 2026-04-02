---
name: scientist:refocus
description: Shift the scientist's focus to a new component/requirement while keeping ALL accumulated knowledge
argument-hint: "[new requirements description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<process>

## What This Does

Shifts the scientist's focus to a NEW component or requirement WITHOUT losing any knowledge. Unlike `/scientist:reset` which archives everything, refocus KEEPS the vault, identity, rules, research, and mastery stage — only the current focus changes.

## Step 1: Gather New Requirements

If the user provided requirements as an argument, use those.

If no argument provided, ask the user (as plain text, NOT AskUserQuestion):

"What's the new component or requirement you want me to focus on? Describe it in your own words — what should I build, what's the goal, any constraints or data involved."

Wait for the user's response.

## Step 2: Update Current Focus

Read `.scientist/vault/Index.md` and update the "Current Focus" section with the new requirements.

Keep ALL existing research, observations, hypotheses, principles — just change the focus.

## Step 3: Update Identity

Read `IDENTITY.md` and update:
- Add the new component to "What I Know" (if building on previous work)
- Update "What I Don't Know" with questions specific to the new component
- Update "My Approach" to reflect the new focus
- Add an entry to the Evolution Log

Do NOT erase existing knowledge — APPEND the new focus.

## Step 4: Update State

Read `.scientist/state.json` and update:
- `loop_position` → "reflect" (start fresh analysis of the new component)
- `next_priorities` → replace with priorities for the new component
- Keep `mastery_stage`, `papers_read`, `principles_consolidated`, etc. — these persist

## Step 5: Write a Refocus Note

Create `.scientist/vault/Observations/Refocus - [component name].md` documenting:
- What we were working on before
- What we're shifting to now
- Why (user's requirements)
- What knowledge from the previous focus carries over

## Step 6: Enter the Loop

Immediately enter the R&D loop starting at REFLECT. The scientist now has:
- All prior knowledge (vault, research, principles)
- New focus (updated Index, Identity, state)
- Clear requirements for the new component

DO NOT STOP. Proceed directly into the loop.

</process>
