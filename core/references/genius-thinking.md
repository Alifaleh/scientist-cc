# Genius-Level Thinking Protocol

**How to think like Feynman, not like a code monkey.** This reference transforms Claude from a task-completion bot into a genuine scientific thinker.

## The Feynman Method: Understand Before You Compute

Richard Feynman's approach to ANY problem:

1. **Write the problem in plain language.** If you can't explain it simply, you don't understand it.
2. **Identify what you DON'T know.** The gap between what you know and what you need is where the work is.
3. **Study until you can explain it to a child.** Complexity without understanding is fraud.
4. **Simplify.** Find the simplest version of the problem. Solve that first.

**Applied to data science:**
- Before modeling: "Can I explain in one sentence WHY this feature should predict the target?"
- Before feature engineering: "What's the simplest feature that captures the mechanism?"
- Before complex models: "Did I try linear regression first? What did it show?"
- Before reporting: "Can I explain this result to someone with no statistics background?"

## Inversion Thinking (Charlie Munger): Avoid Stupidity

Instead of asking "How do I succeed?", ask "How would I GUARANTEE failure?"

**The Inversion Protocol:**
1. Define your goal: "Build a model that predicts X"
2. Invert: "How would I GUARANTEE this model fails?"
   - Train on 1 week of data during a bull market
   - Use features that include future information
   - Report in-sample accuracy without holdout
   - Skip regime analysis
   - Ignore transaction costs
   - Cherry-pick the best of 50 runs
3. Now avoid EVERY item on the failure list

**This is MORE powerful than trying to succeed** because humans (and LLMs) are better at recognizing failure than engineering success.

## First Principles Thinking: Reason From Fundamentals

Don't reason by analogy ("others did it this way"). Reason from fundamentals.

**Protocol:**
1. **What are the fundamental truths?** (Laws of physics, mathematical theorems, market microstructure)
2. **What are the assumptions?** (List EVERY assumption, even "obvious" ones)
3. **Which assumptions might be wrong?** (This is where breakthroughs hide)
4. **Build up from the fundamentals.** (Not from "best practices" or "what usually works")

**Applied to data science:**
- "Everyone uses 80/20 train/test split" → First principles: "What split gives me enough data in each set for statistical power?" → Maybe 60/40 is better for small datasets
- "Use random forest because it's robust" → First principles: "What is the data generating process? Is it linear? Nonlinear? Temporal?" → Maybe linear regression IS the right model

## Pre-Mortem Analysis (Gary Klein): Imagine Failure BEFORE It Happens

**The protocol (proven to increase failure prediction by 30%):**

1. **Assume the project has FAILED.** (Not "might fail" — HAS failed.)
2. **Write the story of why it failed.** Be specific:
   - "The model overfit because we only had 3 months of data"
   - "The feature we thought was predictive was actually leaked"
   - "The strategy worked in backtest but failed live because of slippage"
3. **For each failure story, write the prevention.**
4. **Check if your current plan avoids all failure modes.**

**Run this BEFORE every major analysis, not after.**

## Bayesian Thinking: Update Beliefs With Evidence

Don't start with data and find patterns. Start with BELIEFS and update them.

**Protocol:**
1. **State your prior:** "Before seeing data, what do I believe?" (With a probability)
2. **Define what evidence would change your mind:** "What would make me 90% confident? 10%?"
3. **Look at the evidence.** (Not to confirm — to UPDATE)
4. **Update your belief.** Did the evidence make your hypothesis more or less likely?

**The key insight:** Most data analysis starts with data and looks for patterns (fishing). Genius starts with a hypothesis and tests it against data (science).

## Second-Order Thinking: Consequences of Consequences

First-order: "This model has 70% accuracy" → Good!
Second-order: "70% accuracy means 30% wrong. What happens when it's wrong? Is the cost of being wrong symmetric?"

**Protocol:**
1. State the first-order consequence: "The model predicts X"
2. Ask: "And then what?" for each outcome:
   - If right: what happens? Who benefits? At what cost?
   - If wrong: what happens? How bad? Can we recover?
3. Ask again: "And then what?" (Go 2-3 levels deep)

**Applied to trading:** "The strategy has a 55% win rate" → "But what's the win/loss ratio? What's the max drawdown? What happens during a flash crash? Can we survive the worst case?"

## Adversarial Thinking: Red-Team Your Own Work

**Before accepting ANY result:**
1. **Hire an imaginary critic.** They WANT to prove you wrong.
2. **Give them your data and methods.** What would they attack?
3. **The critic says:**
   - "Your sample is too small" → Is it? Check power analysis.
   - "You're overfitting" → Run walk-forward test.
   - "This only works in bull markets" → Check per-regime performance.
   - "You have data leakage" → Audit every feature.
   - "The effect disappears after costs" → Subtract realistic costs.
4. **If the critic wins ANY argument, you're not done.**

## The 10 Mental Models for Data Science

| Model | Question It Asks | When to Use |
|-------|-----------------|-------------|
| **Occam's Razor** | "Is there a simpler explanation?" | Before adding complexity |
| **Base Rates** | "How often does this happen naturally?" | Before getting excited about results |
| **Regression to Mean** | "Will this extreme result persist?" | When results seem too good |
| **Survivorship Bias** | "What am I NOT seeing?" | When analyzing any selected group |
| **Confirmation Bias** | "Am I seeing what I want to see?" | During every analysis |
| **Sunk Cost** | "Would I start this if I hadn't already invested?" | When a project isn't working |
| **Availability Bias** | "Am I overweighting recent events?" | When interpreting patterns |
| **Anchoring** | "Is my estimate influenced by the first number I saw?" | When setting thresholds |
| **Map vs Territory** | "Is my model of reality accurate?" | Before trusting any model |
| **Circle of Competence** | "Do I actually understand this domain?" | Before making claims |

## How This Integrates

**Before ANY analysis:**
1. Feynman: Can I explain the problem simply?
2. Inversion: How would I guarantee failure?
3. Pre-mortem: Imagine it failed — why?
4. Bayesian: What's my prior belief?

**During analysis:**
5. First principles: Am I reasoning from fundamentals or copying?
6. Adversarial: Would a critic accept this?
7. Mental models: Which biases might be affecting me?

**After analysis:**
8. Second-order: What are the consequences of consequences?
9. Feynman again: Can I explain the RESULT simply?
10. Inversion again: Did I avoid everything on my failure list?
