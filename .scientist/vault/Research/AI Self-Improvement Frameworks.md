---
title: "AI Self-Improvement Frameworks"
tags: [research, self-improvement, metacognition, error-taxonomy, status/understood]
source: "Multi-source — GVU operator, Hyperagents (Meta 2026), AgentDebug (2025), Reflexion, Constitutional AI"
date: 2026-03-31
related:
  - "[[Knowledge Management for AI Agents]]"
  - "[[../Observations/Framework Self-Analysis]]"
---

# AI Self-Improvement Frameworks

> [!note] Key Insight
> scientist-cc's 10-step loop is an informal implementation of the **GVU (Generator-Verifier-Updater) operator** — the universal pattern behind STaR, Reflexion, SPIN, and AlphaZero. Formalizing this mapping would provide theoretical grounding. The biggest actionable gap: our **error taxonomy is incomplete** (6 types vs. 16+ needed) and needs **module-based classification**.

## What I Learned

### 1. GVU Operator: Our Loop Has Theoretical Grounding
- The Generator-Verifier-Updater pattern is proven universal across self-improving systems
- **Our mapping:** Loop steps 2-5 = Generator (research, hypothesize), Step 6 = Verifier (validate), Steps 7-9 = Updater (implement, learn, evolve)
- Formalizing this mapping makes the loop principled, not ad-hoc
- **Implication:** We should name our components in GVU terms and ensure each role is clearly separated

### 2. Hyperagents: Meta-Evolution (Meta, March 2026)
- Solves the infinite regress problem: who checks the checker?
- Makes meta-level rules themselves editable
- **Implication for scientist-cc:** Add rules about HOW to write/prune rules:
  - When should a rule be retired? (if it hasn't triggered in N sessions)
  - When should rules be consolidated? (if 3+ rules address the same error class)
  - When should the loop itself be modified? (meta-meta-evolution)
- This is exactly what `self-evolution.md` reference calls "upgrading the MECHANISM"

### 3. Error Taxonomy Is Incomplete (CRITICAL)
Current taxonomy (6 types):
- Overfitting, bruteforcing, impulsiveness, robot behavior, narrative fallacy, sunk cost

**Missing 12 critical types:**
| Error | Module | Description |
|-------|--------|-------------|
| Anchoring | Reasoning | Fixating on first information encountered |
| Confirmation bias | Reasoning | Seeking evidence that supports, ignoring contradictions |
| Automation bias | Action | Trusting tool output without verification |
| Hallucination | Memory | Generating false facts confidently |
| Cascading failure | Planning | One bad assumption propagating through chain |
| Memory poisoning | Memory | Stale/wrong vault notes degrading decisions |
| Premature consensus | Reasoning | Accepting hypothesis without adversarial challenge |
| Tool misuse | Action | Using wrong tool for the job |
| Progress misjudgment | Planning | Believing you're further along than you are |
| Fluency bias | Reasoning | Trusting well-written text over messy truth |
| Scope creep | Planning | Expanding beyond original objective |
| Rule bloat | Memory | Too many rules creating contradictions |

**Recommended structure:** 4 modules (Memory / Reasoning / Planning / Action) with 4+ types each

### 4. Rules Need Reasons (Validated)
- Anthropic's 2026 Constitutional AI publication: rules with explanations generalize better
- Every CLAUDE.md rule should include: the rule, WHY (triggering mistake), and WHEN (applicability conditions)
- **We're already doing this!** Rules 1 and 2 in CLAUDE.md include rationale. This is validated, not new.
- **Implication:** Make this MANDATORY in the self-evolution template, not just a good practice

### 5. Targeted Correction >> Broad Reflection
- **AgentDebug (2025):** 24% higher accuracy from root-cause-specific corrections vs. unguided self-reflection
- Our current EVOLVE step says "did I make a thinking mistake?" — too broad
- **Better:** Classify which MODULE produced the error, then apply module-specific correction
- Example: Memory error → fix vault note. Reasoning error → add rule. Planning error → adjust loop. Action error → fix tool usage.

### 6. Adversarial Validation Before Accepting Hypotheses
- Current flow: hypothesize → validate → implement
- **Missing:** An adversarial step where we deliberately try to DISPROVE the hypothesis
- This is what "falsification criteria" in the hypothesis template is for, but it's not enforced
- **Implication:** Add a mandatory "red team" sub-step in VALIDATE

## What I Can Use (Actionable for scientist-cc)

1. **Formalize GVU mapping** in loop.md — name Generator/Verifier/Updater roles explicitly
2. **Expand error taxonomy** from 6 to 16+ types across 4 modules (Memory/Reasoning/Planning/Action)
3. **Add meta-evolution rules** to self-evolution.md — rules about writing, pruning, and consolidating rules
4. **Mandate reasons** in self-evolution template (already doing it, make it required)
5. **Add adversarial validation** sub-step to VALIDATE phase
6. **Module-based error correction** — classify errors by originating module, apply targeted fixes
7. **Rule lifecycle management** — retire rules that don't trigger, consolidate overlapping rules

## What Contradicts My Understanding
- I assumed broad self-reflection ("did I make a mistake?") was sufficient. Research shows **targeted, module-specific correction is 24% more effective**. The EVOLVE step needs restructuring.

## Questions This Raises
- How many rules in CLAUDE.md before diminishing returns? Is there a "rule budget"?
- Should adversarial validation be a separate loop step or a sub-step of VALIDATE?
- How do we implement meta-evolution without infinite regress in practice?

## Key Numbers
- **24% accuracy improvement** from targeted vs. broad correction (AgentDebug 2025)
- **6 → 16+ error types** needed across 4 modules
- **GVU operator** is universal across STaR, Reflexion, SPIN, AlphaZero
