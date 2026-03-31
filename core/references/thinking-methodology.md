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

## Error Taxonomy by Module

Errors are classified by the system MODULE that produced them, then by type. This enables targeted correction (24% more effective than broad reflection — AgentDebug 2025).

### Memory Module Errors
| Error | Description | Fix |
|-------|-------------|-----|
| **Hallucination** | Generating false facts confidently | Verify claims against sources before acting on them |
| **Memory poisoning** | Stale/wrong vault notes degrading decisions | Add `last_verified` metadata, re-validate old notes |
| **Rule bloat** | Too many CLAUDE.md rules creating contradictions | Audit, consolidate, and prune rules periodically |

### Reasoning Module Errors
| Error | Description | Fix |
|-------|-------------|-----|
| **Confirmation bias** | Seeking supporting evidence, ignoring contradictions | Use adversarial validation: "What would prove me wrong?" |
| **Overfitting** | Finding patterns in small samples that don't generalize | Require 100+ data points or 3+ days across different conditions |
| **Narrative fallacy** | Creating convincing stories to explain random events | Ask: "Could this be random? What's the null hypothesis?" |
| **Anchoring** | Being influenced by the first number or idea encountered | Consider multiple explanations before committing to one |
| **Fluency bias** | Trusting well-written text over messy truth | Evaluate ideas on evidence, not eloquence |
| **Premature consensus** | Accepting hypothesis without adversarial challenge | Run the mandatory adversarial validation step |

### Planning Module Errors
| Error | Description | Fix |
|-------|-------------|-----|
| **Bruteforcing** | Changing parameters without understanding WHY | Write WHY/WHAT/WHY/PREDICT before any parameter change |
| **Impulsiveness** | Implementing before validating | Write it as a hypothesis first, then VALIDATE |
| **Sunk cost** | Continuing a failing approach because of past investment | Evaluate on future merit only. Kill dead ends fast |
| **Scope creep** | Expanding beyond original objective | Check if the new work serves the current hypothesis |
| **Progress misjudgment** | Believing you're further along than you are | Compare against falsification criteria, not feelings |
| **Cascading failure** | One bad assumption propagating through a chain | Trace errors back to root cause, don't patch symptoms |

### Action Module Errors
| Error | Description | Fix |
|-------|-------------|-----|
| **Robot behavior** | Executing steps mechanically without thinking | Ask "WHY am I doing this?" before each step |
| **Automation bias** | Trusting tool output without verification | Spot-check tool results, especially on first use |
| **Tool misuse** | Using the wrong tool for the job | Review available tools before choosing; read docs |
| **Availability bias** | Overweighting recent or dramatic events | Look at the FULL dataset, not just the last few observations |

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
- You wrote a summary and stopped — summaries are checkpoints, not endpoints
- You're asking the user "should I continue?" — you ARE continuing
- A command failed and you stopped to report it instead of fixing it
- You're working around a framework problem instead of fixing it (dogfood!)
- You trust a claim from a previous analysis without verifying against source code

When you notice these signs: **STOP the bad behavior. Identify which module (Memory/Reasoning/Planning/Action) produced it. Write a rule. Then act correctly.**
