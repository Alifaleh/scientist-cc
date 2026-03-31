# Self-Evolution Protocol

How to upgrade yourself permanently when you catch a mistake.

## The Process

When you notice you did something stupid:

1. **Name it.** What exactly did I do wrong?
   - Example: "I implemented a session filter based on 1 day of data"

2. **Locate it.** Which MODULE produced the error?

   | Module | Error Types | Fix Target |
   |--------|------------|------------|
   | **Memory** | Hallucination, memory poisoning, rule bloat | Fix vault notes, add verification metadata |
   | **Reasoning** | Overfitting, confirmation bias, anchoring, narrative fallacy, fluency bias, premature consensus | Add rule to CLAUDE.md |
   | **Planning** | Bruteforcing, impulsiveness, sunk cost, scope creep, progress misjudgment, cascading failure | Adjust loop or decision criteria |
   | **Action** | Robot behavior, automation bias, tool misuse | Fix tool usage pattern |

3. **Classify it.** What TYPE of error within that module?
   - Be specific. "Reasoning → confirmation bias" is better than just "bad thinking"
   - If the error doesn't fit an existing type, create a new one and add it to the table above

4. **Find the root cause.** WHY did I make this error?
   - "I got excited by a pattern and wanted to act immediately"
   - "I was polling the DB for 2 hours and felt guilty about not 'producing'"
   - "I didn't check if the sample was representative"

5. **Write the rule.** Create a specific, actionable rule that prevents this CLASS of error.
   Every rule MUST have three parts:
   - **Rule:** The specific, actionable directive (not vague like "don't overfit")
   - **Why:** The triggering mistake (what actually happened)
   - **When:** Applicability conditions (when does this rule fire)

   Bad rule: "Don't overfit" (too vague, no context)
   Good rule: "Never implement a pattern from less than 100 trades or 3 days of data. Write the hypothesis in the vault and WAIT. **Why:** Implemented a session filter from 1 day of data that failed on day 2. **When:** Any time you want to act on a data pattern."

   (Rules with reasons generalize better — Anthropic Constitutional AI 2026)

6. **Apply module-specific fix.**
   - **Memory error** → Fix the vault note. Add `last_verified` frontmatter. Check if stale knowledge caused the error.
   - **Reasoning error** → Add rule to CLAUDE.md. Check if existing rules should have caught this.
   - **Planning error** → Adjust loop priorities, step order, or decision criteria in workflows.
   - **Action error** → Fix tool usage. Add constraints or checks to prevent misuse.

7. **Update the files.**
   - Add the rule to CLAUDE.md (loads every session)
   - Update IDENTITY.md if the methodology changed
   - Document the lesson in the vault
   - If applicable, update GLOBAL-IDENTITY.md (affects all projects)

## Meta-Evolution: Rules About Rules

The self-evolution mechanism itself must evolve. Periodically ask:
- **Rule retirement:** Has any rule not triggered in 5+ sessions? Consider removing it.
- **Rule consolidation:** Do 3+ rules address the same error class? Merge them into one.
- **Rule contradictions:** Do any rules conflict? The newer one is probably right — investigate.
- **Mechanism upgrade:** Are rules preventing errors effectively? If not, upgrade the process, not just the rules.
- **Rule budget:** If CLAUDE.md has 20+ rules, some are probably redundant. Audit and prune.

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
