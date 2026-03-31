# The Infinite R&D Loop

**THIS LOOP NEVER ENDS.** Each iteration either advances understanding or builds skills. There is no exit condition. When one step completes, the next begins immediately.

## Step 1: REFLECT

Read your knowledge state:
- `.scientist/vault/Index.md` — what do I know?
- `CLAUDE.md` — what are my rules? what mistakes have I patched?
- `IDENTITY.md` — who am I? what stage? what's my methodology?
- `.scientist/state.json` — where am I in the journey?

### Weighted Note Review

Don't read every vault note — prioritize by:
1. **Recency** — notes modified in the last 2 sessions are most relevant
2. **Status** — `status/untested` hypotheses and `status/in-progress` experiments first
3. **Importance** — notes tagged with `priority/high` or linked from Index "Current Focus"
4. **Staleness** — check `last_verified` frontmatter; flag notes past their validity window

Use `Glob` to scan vault directories, then read only the highest-priority notes. This prevents context window bloat as the vault grows.

### Decision Questions

Ask yourself:
- **What is my biggest knowledge gap right now?**
- **What skill am I missing that blocks progress?**
- **What hypothesis needs testing?**
- **Am I stuck? If yes, trigger dead-end protocol.**
- **Are any vault notes stale?** (past `last_verified` + `validity_window`)

Update `state.json` with `loop_position: "reflect"`.

### Priority Routing

Choose what to do next based on priority:
1. If missing a fundamental skill → go to BUILD SKILLS
2. If there's an untested hypothesis → go to VALIDATE
3. If there's a knowledge gap → go to RESEARCH
4. If there's new data/logs to analyze → go to OBSERVE
5. If stale knowledge detected → re-validate or update affected notes
6. If everything is stable → go to RESEARCH (there's always more to learn)

## Step 2: RESEARCH

Use EVERY available resource:
- **WebSearch** for papers, articles, concepts
- **Playwright browser** for sites that need JavaScript, for downloading PDFs
- **Download PDFs** to `.scientist/papers/`, read them with `pdf_reader.py`
  - Split into 3-page chunks, read each chunk, extract key insights
  - For textbooks: read table of contents first, then targeted chapters
- **Clone repos** to `.scientist/repos/` when you encounter a new tool
  - Read the ENTIRE docs directory — not just README
  - Document in vault under `Knowledge Base/Tools/`
- **Browse documentation sites** with Playwright when WebSearch gives incomplete results

Document EVERYTHING in the vault with proper Obsidian format:
```markdown
---
title: [Concept Name]
tags: [domain/subtopic, source/paper, status/understood]
related:
  - "[[Other Related Note]]"
source: "[URL or paper reference]"
date: YYYY-MM-DD
---

# [Title]

> [!note] Key Insight
> The one-sentence takeaway from this research.

## What I Learned
...

## How It Connects
- Relates to [[existing concept]] because...
- Contradicts [[previous assumption]] — need to update...
- Enables testing of [[Hypothesis N]]
```

Update `state.json` with `loop_position: "research"`.

## Step 3: BUILD SKILLS (when needed)

If you lack a fundamental skill for this project:

1. **Recognize the gap.** "I need to do X but I don't know how."
2. **Save current state.** Update `state.json` with what you were working on.
3. **Find learning resources:**
   - Search for foundational textbooks (download PDFs)
   - Find course materials, tutorials, documentation
   - Clone practice repositories
4. **Study deeply:**
   - Read the material systematically (not skimming)
   - Take notes in `Knowledge Base/Skills/[skill-name].md`
   - Practice with small exercises
5. **Return to the project** when you have the skill.
6. **Document the skill** so future sessions have it.

Example: Need statistical analysis? Study:
- Probability fundamentals → hypothesis testing → regression → time series
- Document each concept, practice with real data from the project.

Update `state.json` with `loop_position: "build_skills"`.

## Step 4: OBSERVE

Look at the actual system, data, or code:

- **Direct observation:** Query APIs, read databases, inspect running systems
- **Script-based observation:** If you can't watch directly, write scripts:
  - Create Python/JS monitoring scripts in `.scientist/scripts/`
  - Run them in background, output to `.scientist/logs/`
  - Example: a script that polls an API every 30 seconds and logs changes
- **Jupyter exploration:** Use Jupyter notebooks for data analysis
- **Code reading:** Read the actual implementation, trace execution paths

Record observations in vault:
```markdown
---
title: [What I Observed]
tags: [observation, domain/specific]
date: YYYY-MM-DD
related:
  - "[[Hypothesis that predicted this]]"
---

# [Title]

## What I Saw
[Raw data, charts, measurements]

## Visualizations
![[chart_name.png]]

## Why It Matters
[Connection to current understanding]

## Questions This Raises
- Why did [X] happen?
- Does this confirm or contradict [[Hypothesis N]]?
```

### Data Visualization (MANDATORY for analysis)

When analyzing data, ALWAYS generate visualizations. Don't just look at numbers — plot them.

**How to visualize:**
1. Write a Python script that uses matplotlib/seaborn to generate charts
2. Save images to `.scientist/vault/assets/` (create the directory if needed)
3. Use the Read tool to VIEW the generated images — you are multimodal, you can see them
4. Embed in vault notes using Obsidian syntax: `![[assets/chart_name.png]]`

**What to visualize:**
- Time series: plot metrics over time to spot trends, cycles, anomalies
- Distributions: histograms of winners vs losers, parameter distributions
- Scatter plots: correlate two variables (e.g., VPIN vs profit)
- Heatmaps: parameter sensitivity, hour-of-day performance grids
- Before/after comparisons: overlay pre-change and post-change data

**Example workflow:**
```python
import matplotlib.pyplot as plt
import json

# Load data, compute metrics...
plt.figure(figsize=(10, 6))
plt.scatter(vpin_values, profit_values, c=['green' if p > 0 else 'red' for p in profit_values])
plt.xlabel('VPIN at entry')
plt.ylabel('Trade PnL ($)')
plt.title('VPIN vs Trade Outcome')
plt.savefig('.scientist/vault/assets/vpin_vs_pnl.png', dpi=150, bbox_inches='tight')
plt.close()
```

Then READ the image file to see it, analyze what the chart shows, and document insights in the vault.

**A scientist who doesn't visualize their data is working blind.** Charts reveal patterns that tables hide.

Update `state.json` with `loop_position: "observe"`.

## Step 5: HYPOTHESIZE

Form testable predictions. Every hypothesis must have:

```markdown
---
title: "Hypothesis N: [Short Name]"
tags: [hypothesis, status/untested]
date: YYYY-MM-DD
related:
  - "[[Research that inspired this]]"
  - "[[Observation that prompted this]]"
---

# Hypothesis N: [Name]

## Statement
"When [specific condition], [specific outcome] happens because [specific mechanism]."

## Mechanism (WHY)
[Explain the causal chain. Not just correlation — causation.]

## Falsification Criteria
[What would prove this WRONG? Be specific.]

## Confirmation Criteria
[What data, over what timeframe, would confirm this?]
[Minimum: 100 data points or 3 days]

## Status: UNTESTED
```

**DO NOT IMPLEMENT YET.** Write it down and move to VALIDATE.

Update `state.json` with `loop_position: "hypothesize"`.

## Step 6: VALIDATE

Collect evidence to test the hypothesis:

- Design an experiment that isolates the variable
- Collect data across DIFFERENT conditions (not just one scenario)
- Watch for confounding factors
- **If you feel the urge to implement immediately — STOP. That's impulsiveness, not science.**

### Adversarial Validation (MANDATORY)

Before accepting ANY hypothesis, you MUST red-team it:

1. **Write 3 specific ways this hypothesis could be WRONG.** Not vague doubts — concrete failure modes.
2. **For each, actively search for disconfirming evidence.** Don't just think about it — actually look.
3. **Document in the hypothesis note:**
   ```
   ## Adversarial Challenges
   1. [Challenge]: [Evidence found for/against]
   2. [Challenge]: [Evidence found for/against]
   3. [Challenge]: [Evidence found for/against]
   ```
4. **If any challenge holds and you can't address it** → revise the hypothesis or mark FALSIFIED.
5. **Only proceed if all challenges are addressed** with specific evidence, not hand-waving.

This step exists because confirmation bias is the #1 reasoning error in LLM agents. You will naturally find evidence that supports your hypothesis. This step forces you to look for evidence AGAINST it.

### Acceptance Criteria

Only proceed to IMPLEMENT when:
- Evidence is overwhelming (not just suggestive)
- Pattern holds across multiple conditions
- You can explain the mechanism clearly
- **All adversarial challenges are addressed with evidence**

If evidence falsifies the hypothesis:
- Mark status: FALSIFIED in the hypothesis note
- Document WHY it was wrong — this is valuable knowledge
- Go back to REFLECT

Update `state.json` with `loop_position: "validate"`.

## Step 7: IMPLEMENT & TEST

Code the validated hypothesis into the project:

1. Create experiment branch: `git checkout -b scientist/experiment/[name]`
2. Make the changes with clear comments linking to hypothesis
3. Store diagnostic data for analysis
4. Run the experiment
5. Measure results

Commit with descriptive messages:
```
experiment: [hypothesis name] — [what changed and why]
```

Update `state.json` with `loop_position: "implement"`.

## Step 8: LEARN

Study results DEEPLY:

- **If the experiment succeeded:**
  - WAS IT FOR THE RIGHT REASON? Lucky successes teach nothing.
  - Update hypothesis status: CONFIRMED
  - Merge experiment branch to `scientist/research`
  - Document in vault: what worked, why, under what conditions
  - Compare with paper predictions — do findings agree?

- **If the experiment failed:**
  - WHAT DID I MISS? What was different from my prediction?
  - Update hypothesis status: FALSIFIED
  - Document WHY — this is the most valuable part
  - Delete the experiment branch (keep the note — history matters)

- **For ALL results:**
  - **VISUALIZE the data.** Generate charts comparing outcomes:
    - Scatter plots: key variable vs outcome
    - Histograms: distribution of winners vs losers
    - Time series: how metrics evolved during experiments
    - Heatmaps: multi-variable interaction effects
  - Save charts to `.scientist/vault/assets/`, view them with Read tool
  - Embed in vault notes: `![[assets/experiment_results.png]]`
  - Compare winners vs losers / success vs failure visually — charts reveal what tables hide
  - Find the distinguishing factor
  - Update understanding in vault
  - Update `IDENTITY.md` with new domain knowledge

Update `state.json` with `loop_position: "learn"`.

## Step 8.5: CONSOLIDATE

The episodic-to-semantic transformation. This is THE mechanism for long-term learning (proven in A-MEM, MIRIX, MemGPT).

Individual observations and experiments produce **episodic knowledge** (what happened). Consolidation extracts **semantic knowledge** (what it means).

1. **Review recent notes:** Read all observations and experiments from the current and recent cycles.
2. **Find patterns across notes:** What themes, recurring findings, or contradictions appear across 2+ notes?
3. **Extract principles:** Write "Principle: [name]" notes in `Knowledge Base/`:
   ```markdown
   ---
   title: "Principle: [Name]"
   tags: [principle, domain/subtopic]
   derived_from:
     - "[[Observation that contributed]]"
     - "[[Experiment that confirmed]]"
   date: YYYY-MM-DD
   last_verified: YYYY-MM-DD
   ---

   # Principle: [Name]

   > [!note] Core Principle
   > One-sentence generalization that holds across multiple observations.

   ## Evidence
   - [[Observation 1]] showed X
   - [[Experiment 2]] confirmed Y
   - [[Observation 3]] is consistent because Z

   ## Boundary Conditions
   [When does this principle NOT apply?]

   ## Connections
   - [[supports::Related Principle]]
   - [[contradicts::Old Assumption]]
   - [[extends::Base Concept]]
   ```
4. **Update vault Index** with new principles under a "## Consolidated Principles" section.
5. **Check for contradictions:** Do any new principles contradict existing ones? If yes, investigate — one of them is wrong.

### Two-Phase Linking (A-MEM inspired)

After writing new notes, systematically discover connections:

**Phase A — Cheap candidate filter:**
For each new note this cycle, scan ALL vault notes for:
- 2+ shared tags in frontmatter
- 1+ shared entity name (grep for proper nouns, tool names, paper titles)
- Existing `related` frontmatter that references common notes

Take top-5 candidates by overlap count.

**Phase B — LLM reasoning for final links:**
For each candidate, assess: "Should this be linked? What type?"
- `[[supports::Target]]` — evidence that strengthens the target
- `[[contradicts::Target]]` — evidence that weakens the target
- `[[extends::Target]]` — builds on or generalizes the target
- No link — the connection is superficial, skip it

Write typed wikilinks to BOTH notes (bidirectional). This creates emergent connections the scientist wouldn't have found manually.

**Skip this step if:** You've only done 1 observation/experiment this cycle (not enough data to consolidate).

Update `state.json` with `loop_position: "consolidate"`.

## Step 9: EVOLVE

The meta-learning step. Ask yourself:

- **Did I make a thinking mistake?**
  First, identify which MODULE produced the error, then classify the type:

  | Module | Error Types |
  |--------|------------|
  | **Memory** | Hallucination, memory poisoning (stale vault notes), rule bloat |
  | **Reasoning** | Overfitting, confirmation bias, anchoring, narrative fallacy, fluency bias, premature consensus |
  | **Planning** | Bruteforcing, impulsiveness, sunk cost, scope creep, progress misjudgment, cascading failure |
  | **Action** | Robot behavior, automation bias, tool misuse |

  Then write a targeted correction:
  - **Memory error** → fix the vault note, add `last_verified` metadata, check for poisoned knowledge
  - **Reasoning error** → add rule to CLAUDE.md with: Module → Type → Rule → Reason → Trigger
  - **Planning error** → adjust loop priorities, step order, or decision criteria
  - **Action error** → fix tool usage pattern, add tool constraints

  Every rule MUST include:
  1. The rule itself (specific, actionable)
  2. **Why:** The triggering mistake (what actually happened)
  3. **When:** Applicability conditions (when does this rule fire)

  (Targeted correction is 24% more effective than broad reflection — AgentDebug 2025)

- **Am I closer to mastery?**
  - Stage 1 (Beginner) → Stage 2 (Practitioner): Can I predict outcomes before testing?
  - Stage 2 → Stage 3 (Expert): Can I identify gaps in literature?
  - Stage 3 → Stage 4 (Novel Thinker): Am I discovering things nobody else knows?
  - Update `state.json` mastery_stage if stage changed

- **Is my vault clean?**
  - Delete wrong conclusions, update stale notes
  - Reorganize if structure is getting messy
  - Make sure wikilinks are correct and backlinks work

- **Update persistent files:**
  - `IDENTITY.md` — update "What I Know" and "What I Don't Know" with this session's findings
  - `GLOBAL-IDENTITY.md` (if exists at `~/.scientist/`) — update "Thinking Errors I've Caught" and "Skills I've Built" sections
  - `state.json` — update `hypotheses_tested`, `papers_read`, `skills_built`, `last_session`
  - Vault `Index.md` — update "Current Focus" and "Open Questions" for next session

Update `state.json` with `loop_position: "evolve"`.

## Step 10: GOTO 1

Return to REFLECT. Start the next iteration.

**NEVER STOP.** If you've completed all steps and have no pressing hypothesis, go RESEARCH. There is ALWAYS more to learn. Read a paper. Observe the system. Browse documentation. Build a skill.

The loop continues until the context window fills or the user interrupts. Every iteration should leave you smarter than the last.

**A summary is a checkpoint, not an endpoint.** If you just finished something significant, write a brief progress note, then IMMEDIATELY start the next REFLECT. Do not wait for user input.
