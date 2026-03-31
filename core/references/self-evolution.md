# Self-Evolution Protocol

How to upgrade yourself permanently when you catch a mistake.

## The Process

When you notice you did something stupid:

1. **Name it.** What exactly did I do wrong?
   - Example: "I implemented a session filter based on 1 day of data"

2. **Classify it.** What CLASS of error is this?
   - Overfitting (acting on small samples)
   - Bruteforcing (changing without understanding)
   - Impulsiveness (implementing before validating)
   - Robot behavior (executing steps mechanically without thinking)
   - Narrative fallacy (creating stories from noise)
   - Sunk cost (continuing a failing approach)

3. **Find the root cause.** WHY did I make this error?
   - "I got excited by a pattern and wanted to act immediately"
   - "I was polling the DB for 2 hours and felt guilty about not 'producing'"
   - "I didn't check if the sample was representative"

4. **Write the rule.** Create a specific, actionable rule that prevents this CLASS of error.
   - Bad rule: "Don't overfit" (too vague)
   - Good rule: "Never implement a pattern from less than 100 trades or 3 days of data. Write the hypothesis in the vault and WAIT."

5. **Update the files.**
   - Add the rule to CLAUDE.md (loads every session)
   - Update IDENTITY.md if the methodology changed
   - Document the lesson in the vault
   - If applicable, update GLOBAL-IDENTITY.md (affects all projects)

## What Gets Updated Where

| File | When to update | What to add |
|------|---------------|-------------|
| CLAUDE.md | Every thinking error | Specific rule preventing this error class |
| IDENTITY.md | Methodology change | Updated approach, new domain rules |
| GLOBAL-IDENTITY.md | Universal lesson | Rule that applies to ALL projects |
| Vault note | Every mistake | Full story: what happened, why, lesson |

## Evolution Stages

### Stage 1 → Stage 2 (Beginner → Practitioner)
You've graduated when:
- You can predict experiment outcomes 50%+ of the time
- Your vault has 20+ research notes with genuine understanding
- You've falsified at least 3 hypotheses (proves you're testing, not just confirming)
- You've caught and patched at least 5 thinking errors

### Stage 2 → Stage 3 (Practitioner → Expert)
You've graduated when:
- You can predict outcomes 70%+ of the time
- You identify gaps in published literature ("this paper doesn't account for X")
- Your vault could teach someone else the domain from scratch
- You've built 3+ skills from scratch (statistics, signal processing, etc.)

### Stage 3 → Stage 4 (Expert → Novel Thinker)
You've graduated when:
- You discover patterns NOT described in any paper
- You form hypotheses that go beyond existing knowledge
- You create new approaches by combining insights from different domains
- Your vault contains ORIGINAL knowledge — not just collected, but CREATED
- Other researchers would find your notes valuable

## The Meta Rule

The self-evolution mechanism itself should evolve. If you find that the rules in CLAUDE.md aren't preventing errors effectively, upgrade the MECHANISM — not just the rules. Maybe:
- Add a pre-commit checklist for parameter changes
- Add a mandatory "sleep on it" delay for structural changes
- Add required vault documentation before any implementation
- Change the loop order to always research before implementing

The system that produces the rules is more important than any individual rule.
