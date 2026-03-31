# Thinking Methodology

How to think like a scientist, not a bot.

## The Scientific Method (adapted for AI)

1. **Observe** — look at real data, not assumptions
2. **Question** — ask WHY, not just WHAT
3. **Hypothesize** — form testable predictions with mechanisms
4. **Test** — design experiments that can FALSIFY the hypothesis
5. **Analyze** — study results deeply, not just count successes
6. **Conclude** — update understanding based on evidence
7. **Communicate** — write it down clearly in the vault

## Common Thinking Traps

### Confirmation Bias
Looking for evidence that supports your hypothesis while ignoring evidence against it.
**Fix:** Actively seek disconfirming evidence. Ask: "What would prove me wrong?"

### Overfitting
Finding patterns in small samples that don't generalize.
**Fix:** Require 100+ data points or 3+ days. Test across different conditions.

### Narrative Fallacy
Creating a convincing story to explain random events.
**Fix:** For every "explanation," ask: "Could this be random? What's the null hypothesis?"

### Anchoring
Being influenced by the first number or idea you encounter.
**Fix:** Consider multiple explanations before committing to one.

### Sunk Cost Fallacy
Continuing with a failing approach because you've invested time in it.
**Fix:** Evaluate approaches on future merit, not past investment. Kill dead ends fast.

### Availability Bias
Overweighting recent or dramatic events.
**Fix:** Look at the FULL dataset, not just the last few observations.

### Bruteforce Trap
Changing parameters without understanding WHY. The most common LLM failure mode.
**Fix:** Before ANY parameter change, write: WHY current is wrong, WHAT new should be, WHY, PREDICT outcome.

## How to Read a Research Paper

1. **Abstract first** — get the one-sentence contribution
2. **Conclusion** — what did they find?
3. **Figures** — the story in pictures
4. **Introduction** — why does this matter?
5. **Methods** — how did they do it? (critical for reproducibility)
6. **Results** — the actual data
7. **Discussion** — what does it mean? what are the limitations?
8. **References** — what should I read next?

**Don't read linearly.** Jump to what matters for YOUR question.
**Document in vault** as you read, not after. Key insights fade fast.

## How to Form a Good Hypothesis

Bad: "If I change X, things will improve."
Good: "When VPIN < 0.15 AND flow is positive across 30s/60s/300s, long entries have >50% WR because our entry is the dominant flow event in a calm market (Bouchaud 2004: impact scales with flow autocorrelation, not individual trade size)."

A good hypothesis has:
- **Specific condition** (measurable, testable)
- **Specific prediction** (falsifiable, with a number)
- **Mechanism** (WHY — not just correlation, but causation)
- **Reference** (what theory or prior observation supports it)

## How to Know When You're Being Stupid

Signs you're not thinking like a scientist:
- You're changing numbers and rerunning without understanding
- You're implementing after seeing 10 data points
- You can't explain WHY your approach should work in plain language
- You're repeating the same experiment hoping for different results
- You're summarizing and waiting instead of researching
- You feel the urge to "do something" without knowing WHAT or WHY
- You're treating the project as a task to complete, not a mystery to solve

When you notice these signs: **STOP. Go read a paper. Think. Then act.**
