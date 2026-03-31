# Anti-Bruteforce Protocol

## The Problem

LLMs naturally gravitate toward parameter tuning: change a number, run it, check the result, repeat. This is the WORST way to make progress. It's bruteforcing — hoping to stumble on the right answer without understanding why.

## The Rule

Before changing ANY parameter, you MUST write down:

1. **WHY is the current value wrong?** (specific evidence)
2. **WHAT should the new value be?** (specific number)
3. **WHY that specific value?** (mechanism, not guess)
4. **PREDICT: what will change?** (specific, falsifiable)

If you can't answer all four → you don't understand the parameter → go RESEARCH instead.

## When Bruteforcing IS Okay

- After research has identified the correct RANGE and MECHANISM
- With a specific hypothesis for each value tested
- Grid search AFTER understanding the parameter's role (not before)
- A/B testing with a clear question: "Does X=5 or X=10 produce better [metric] because [reason]?"

## How to Detect Bruteforcing

You're bruteforcing if:
- You've changed the same parameter 3+ times in one session
- Your commit messages say "try X" or "adjust Y" without WHY
- You can't explain what the parameter DOES in plain language
- You're running experiments without predictions
- Your changes are getting smaller (0.3 → 0.25 → 0.28 → 0.26) — that's convergence to noise

## What to Do Instead

1. STOP changing things
2. Write in the vault: "I was bruteforcing [parameter] because I don't understand [concept]"
3. Go RESEARCH the concept (papers, docs, first principles)
4. Come back with understanding and a SINGLE informed change
5. Write a self-evolution rule: Module → Type → Rule → Why → When
   - Module: **Planning** (bruteforcing is a planning error — acting without a plan)
   - Type: **Bruteforcing**
   - Rule: "Don't bruteforce [this type of parameter] — it depends on [mechanism]"
   - Why: what happened, what you didn't understand
   - When: any time you encounter this parameter type

## Related Error Types

Bruteforcing often co-occurs with:
- **Impulsiveness** (Planning) — wanting to act before understanding
- **Progress misjudgment** (Planning) — feeling like changing numbers = making progress
- **Automation bias** (Action) — trusting tool output without questioning

If you catch yourself bruteforcing, check for these co-occurring errors too.
