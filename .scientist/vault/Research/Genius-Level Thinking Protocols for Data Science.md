---
title: "Genius-Level Thinking Protocols for Data Science"
tags: [research, thinking, mental-models, cognitive-science, data-science, genius, reference, status/complete, priority/critical]
source: "Synthesized from Feynman problem-solving, first principles (Aristotle/Musk), inversion (Munger/Jacobi), pre-mortem (Klein), Bayesian reasoning (Bayes/Silver/Galef), second-order thinking (Marks/Dalio), thought experiments (Einstein), adversarial thinking (red-teaming), Farnam Street, James Clear"
date: 2026-04-01
last_verified: 2026-04-01
related:
  - "[[Comprehensive Data Science Methodology Reference]]"
  - "[[LLM Data Analysis Anti-Stupidity Protocols]]"
  - "[[Advanced Data Analysis Planning Frameworks]]"
  - "[[Cognitive Biases in LLM Agents]]"
  - "[[Why Claude Makes Stupid Data Science Decisions]]"
---

# Genius-Level Thinking Protocols for Data Science

> [!tip] Purpose
> This document captures the COGNITIVE STRATEGIES that separate the top 0.1% of data scientists from the merely competent. These are not procedures or checklists — they are WAYS OF THINKING. Each protocol rewires how you approach problems before you touch data or write code. An AI agent that internalizes these patterns will produce fundamentally different (better) analysis than one that merely follows methodological checklists.

> [!warning] The Core Insight
> Good data scientists follow procedures correctly. GENIUS data scientists think differently BEFORE procedures even begin. The gap is not in execution — it is in cognition. Every protocol below changes what happens in the 5 minutes BEFORE you start working. That is where 90% of analysis quality is determined.

---

## 1. THE FEYNMAN PROTOCOL: Understanding vs. Knowing

### Origin
Richard Feynman (1918-1988), Nobel laureate in Physics. Famous for solving integrals that stumped Princeton PhDs — not because he was smarter, but because he had a DIFFERENT toolbox. His high school teacher gave him an old calculus book (Woods' Advanced Calculus) that taught "differentiating under the integral sign" — a technique not commonly taught. Feynman used this one tool repeatedly to solve problems others couldn't, because everyone else had tried all the STANDARD methods.

**Key insight from James Clear:** "Every Ph.D. student at Princeton and MIT is brilliant. What separated Feynman from his peers wasn't necessarily raw intelligence. It was the way he saw the problem. He had a broader set of mental models."

### The Protocol (4 Steps)

1. **SELECT a concept and MAP your knowledge.** Write everything you know about the problem on a blank page. Use different colors for things you're confident about vs. uncertain about.
2. **EXPLAIN it to a 12-year-old.** If you can't explain it simply, you don't understand it. Complexity and jargon MASK lack of understanding. Write the explanation in plain words — no technical terms allowed.
3. **REVIEW and REFINE.** Find the gaps. Where did your simple explanation break down? Where did you reach for jargon? Those gaps are exactly where your understanding is weakest. Go back to source material and fill them.
4. **TEST and ARCHIVE.** Teach it to someone else without notes. If you can do it, you truly understand it. Archive the simple explanation for future reference.

### Why It Works (Cognitive Science)
- **Generation effect:** Producing explanations creates stronger memory traces than reading or highlighting
- **Illusion of explanatory depth:** Humans systematically overestimate their understanding of complex systems. Forcing simple explanation shatters this illusion
- **Transfer learning:** Simple explanations are more transferable across domains than technical ones

### Application to Data Science

**Before every analysis, write 3 sentences a smart non-technical person would understand:**
1. What question are we answering?
2. Why does this question matter?
3. How will we know if the answer is right?

If you cannot write these three sentences, you do not understand the problem well enough to analyze it. STOP and go learn more.

**The Feynman Test for Models:** "If I had to explain to a client WHY this model predicts what it predicts, could I do it in plain language?" If no — the model is a black box you don't understand, and you WILL make errors you can't detect.

> [!danger] What Changes If Claude Uses This
> Before writing ANY code, Claude would write a plain-language explanation of the analysis goal. This single step would prevent ~40% of "wrong question" errors — the most expensive failure mode in data science, because you can execute perfectly on the wrong problem and never notice.

---

## 2. FIRST PRINCIPLES THINKING: Reasoning from Fundamentals

### Origin
Goes back to Aristotle: "In every systematic inquiry where there are first principles, or causes, or elements, knowledge and science result from acquiring knowledge of these." Modernized by Elon Musk, Charlie Munger, and others. Formalized through Socratic questioning.

### The Protocol (Two Methods)

#### Method A: The Five Whys (Toyota Production System)
Ask "Why?" five times to drill past symptoms to root causes.

- "The model accuracy dropped." → Why?
- "The feature distributions shifted." → Why?
- "We added data from a new time period." → Why does that matter?
- "The new period has different market conditions." → Why didn't we account for that?
- "We assumed stationarity without testing it." → **ROOT CAUSE: untested assumption**

#### Method B: Socratic Questioning (6 Steps)
1. **Clarify your thinking:** "Why do I think this? What EXACTLY do I think?"
2. **Challenge assumptions:** "How do I KNOW this is true? What if the OPPOSITE were true?"
3. **Look for evidence:** "How can I back this up? What are my SOURCES? How reliable are they?"
4. **Consider alternative perspectives:** "What might someone who DISAGREES think? Why? Could they be right?"
5. **Examine consequences:** "What if I am WRONG? What are the consequences? How bad is the worst case?"
6. **Question the original questions:** "Was my question even the RIGHT question? What question SHOULD I be asking?"

### Why It Works (Cognitive Science)
- **Anchoring bias elimination:** By decomposing to fundamentals, you avoid being anchored to "how it's always been done"
- **Analogical reasoning escape:** First principles forces you past "this looks like X, so apply X's solution" — which fails when the analogy is superficial
- **Novel solution generation:** When you break a problem into fundamental components, you can reassemble them in ways nobody has tried

### Application to Data Science

**Before choosing ANY methodology, answer:**
1. What are the FUNDAMENTAL constraints? (data size, time horizon, noise level, causal structure)
2. What are we ASSUMING about the data-generating process? Write each assumption explicitly.
3. Which assumptions can we TEST? Test them BEFORE building models.
4. What would a solution look like if we had NEVER seen this type of problem before?

**The Lego Block Test:** Can you decompose your analysis pipeline into independent blocks and explain WHY each block is necessary? If any block exists only because "that's how it's usually done," challenge it. Maybe it's not needed. Maybe it's harmful.

> [!danger] What Changes If Claude Uses This
> Claude would stop defaulting to "standard approaches" (random forest, XGBoost, standard CV). Instead, it would reason from the DATA'S properties to the appropriate method. This eliminates the "template analysis" failure mode where the method doesn't match the problem structure.

---

## 3. INVERSION: Thinking Backwards to Avoid Stupidity

### Origin
Carl Gustav Jacob Jacobi (mathematician): "Man muss immer umkehren" — "Invert, always invert." Popularized by Charlie Munger: "All I want to know is where I'm going to die, so I'll never go there." Core insight: **avoiding stupidity is easier than seeking brilliance.**

### The Protocol (3 Steps)

1. **State your goal.** "I want to build an accurate predictive model."
2. **INVERT IT.** "What would GUARANTEE this model is terrible? What would make this analysis FAIL?"
   - Using future data to predict the past (look-ahead bias)
   - Training and testing on the same data (data leakage)
   - Ignoring regime changes in the data
   - Optimizing a metric that doesn't align with the real objective
   - Using too many features relative to sample size
   - Not defining success criteria before starting
   - Cherry-picking the time period that makes results look best
3. **SYSTEMATICALLY AVOID each failure mode.** For each item on your "guaranteed failure" list, add a specific check or safeguard to your analysis plan.

### Why It Works (Cognitive Science)
- **Negativity bias harnessed:** Humans are naturally better at detecting threats than opportunities. Inversion leverages this built-in capability instead of fighting it
- **Blind spot illumination:** Forward thinking tends to confirm existing plans. Backward thinking reveals hidden risks
- **Asymmetry of outcomes:** In data science, one catastrophic error can invalidate an entire analysis. Avoiding the worst mistakes matters more than optimizing for the best outcomes

### Application to Data Science

**The Anti-Analysis Checklist (run BEFORE every analysis):**
- [ ] What data would I need to see to ABANDON this hypothesis?
- [ ] What is the SIMPLEST explanation for any pattern I find? (Occam's Razor)
- [ ] If I showed these results to a hostile reviewer, what would they attack FIRST?
- [ ] What would happen if I ran this analysis on RANDOM data? Would I still get a "result"?
- [ ] Am I optimizing for the metric that MATTERS, or the metric that's EASY to compute?

**Munger's Rule for Data Science:** "Show me the DATA I don't have, and I'll show you the MISTAKES I'll make." Every missing data dimension is a potential confound.

> [!danger] What Changes If Claude Uses This
> Before starting analysis, Claude would write a "pre-failure" document: "This analysis will be WRONG if..." — listing every way it could fail. This transforms analysis from an optimistic "find the answer" process into a rigorous "avoid every pitfall" process. Inversion catches errors that forward-thinking NEVER considers.

---

## 4. PRE-MORTEM: Prospective Hindsight

### Origin
Gary Klein, research psychologist, published in Harvard Business Review (2007). Based on research showing that **prospective hindsight — imagining an event has ALREADY occurred — increases the ability to correctly identify reasons for future outcomes by 30%** (Deborah Mitchell, 1989).

### The Protocol (6 Steps)

1. **Assume the project has FAILED spectacularly.** Not "might fail" — HAS failed. The analysis is wrong. The model is worthless. The conclusions are backwards.
2. **Generate reasons.** Each person (or each thinking pass) independently lists every plausible reason for the failure. No discussion, no groupthink, no filtering.
3. **Consolidate the list.** Combine all failure reasons. Remove duplicates. Rank by likelihood AND severity.
4. **Strengthen the plan.** For each high-ranked failure reason, add a specific mitigation to the analysis plan.
5. **Identify the "silent killers."** Which failure modes would be INVISIBLE — failures you wouldn't detect until it's too late? These are the most dangerous.
6. **Define tripwires.** Specific, measurable signals that indicate the analysis is going wrong. "If we see X, we stop and reassess."

### Why It Works (Cognitive Science)
- **Overcomes groupthink:** In standard planning, dissenters stay silent. Pre-mortem gives PERMISSION to critique — it's the assignment
- **Prospective hindsight effect:** The act of assuming failure has occurred (not "might occur") activates different cognitive processes. It's the difference between "what could go wrong?" and "it went wrong — why?"
- **Temporal displacement:** Moving the failure to the past tense makes it feel concrete and real, not abstract and unlikely

### Application to Data Science

**Pre-Mortem Template for Every Analysis:**

```
THE ANALYSIS FAILED. Here's why:

1. DATA PROBLEMS:
   - The data had survivorship bias we didn't detect
   - The time period we selected was not representative
   - Missing data was systematically biased (not random)
   - [YOUR SPECIFIC DATA RISKS]

2. METHODOLOGY PROBLEMS:
   - We used the wrong statistical test for this data type
   - Our sample size was too small for the effect we tried to detect
   - We had data leakage between train and test sets
   - [YOUR SPECIFIC METHOD RISKS]

3. INTERPRETATION PROBLEMS:
   - We confused correlation with causation
   - We anchored on the first significant result and stopped looking
   - We ignored the base rate
   - [YOUR SPECIFIC INTERPRETATION RISKS]

4. SILENT KILLERS:
   - What failure mode would we NOT detect?
   - What assumption are we making that we haven't written down?
   
TRIPWIRES:
   - If [specific metric] exceeds [threshold], reassess
   - If [specific pattern] appears, check for [specific bias]
```

> [!danger] What Changes If Claude Uses This
> Claude would run a pre-mortem BEFORE every analysis, generating 10+ specific failure modes. This activates "defensive analysis" mode — every subsequent step is informed by awareness of how it could go wrong. The 30% improvement in identifying failure causes (from the Mitchell research) applies directly.

---

## 5. BAYESIAN THINKING: Updating Beliefs with Evidence

### Origin
Thomas Bayes (1701-1761), further developed by Laplace. Modern applications by Nate Silver, Julia Galef (Center for Applied Rationality), Annie Duke (professional poker). Core insight from Julia Galef: "After you've been steeped in Bayes' rule for a little while, you become much more aware that your beliefs are grayscale — not black and white — and that you have levels of confidence that are less than 100% but greater than zero."

### The Protocol (5 Steps)

1. **State your PRIOR belief.** Before looking at any data, what do you already believe? How confident are you (0-100%)? Write this down. Be specific. "I believe feature X is predictive of outcome Y with 60% confidence."
2. **Define what evidence WOULD change your mind.** Before analyzing, specify: "If I see [specific result], my confidence goes UP to [X%]. If I see [specific other result], my confidence goes DOWN to [Y%]."
3. **Gather evidence.** Run the analysis. Collect the data.
4. **UPDATE your belief.** Based on the evidence, adjust your confidence. The adjustment should be proportional to: (a) how surprising the evidence is, and (b) how reliable the evidence source is.
5. **Repeat.** Every new piece of evidence is an opportunity to update. Never treat any belief as final.

### Key Principles

- **Strong priors require strong evidence to move.** If you're 95% confident in something, a single weak data point shouldn't change your mind. If you're 50/50, even weak evidence matters.
- **Update incrementally.** Don't swing from 20% to 90% on one data point. Multiple independent pieces of evidence are worth more than one dramatic result.
- **Beware of "broken priors."** If your prior is 0% or 100%, NO amount of evidence can change it. Never set confidence to absolute certainty.
- **The Bertrand Russell chicken problem:** "The man who has fed the chicken every day throughout its life at last wrings its neck instead." Past patterns don't guarantee future ones. Always maintain SOME probability that your model of the world is wrong.

### Why It Works (Cognitive Science)
- **Defeats confirmation bias:** Forcing yourself to define what would LOWER your confidence prevents selective attention to confirming evidence
- **Calibrates confidence:** Most people are systematically overconfident. Bayesian tracking reveals and corrects this
- **Prevents anchoring:** By writing the prior BEFORE seeing data, you create a reference point that isn't contaminated by the results

### Application to Data Science

**The Bayesian Analysis Log:**

| Step | Prior Belief | Confidence | Evidence | Updated Confidence | Reasoning |
|------|-------------|-----------|----------|-------------------|-----------|
| 1    | Feature X predicts Y | 60% | Correlation = 0.3, p < 0.01 | 75% | Moderate correlation, significant, but could be confounded |
| 2    | Feature X predicts Y | 75% | Holds in out-of-sample test | 85% | Independent validation increases confidence |
| 3    | Feature X predicts Y | 85% | Fails during regime change period | 60% | Relationship may be regime-dependent, not fundamental |

**Bayesian Red Flags:**
- Confidence jumping more than 30% on a single data point → You're overreacting
- Confidence never going down → You're only looking at confirming evidence
- All updates going in the same direction → You may have selection bias in your evidence gathering

> [!danger] What Changes If Claude Uses This
> Claude would maintain a running confidence log for every major claim in an analysis. Instead of binary "this works / doesn't work" conclusions, every finding would carry a calibrated probability. This prevents the catastrophic failure mode of presenting uncertain results as certain facts.

---

## 6. SECOND-ORDER THINKING: Consequences of Consequences

### Origin
Howard Marks (Oaktree Capital), Ray Dalio (Bridgewater), formalized by Farnam Street. Marks: "First-level thinking is simplistic and superficial, and just about everyone can do it. Second-level thinking is deep, complex and convoluted." Dalio: "Failing to consider second- and third-order consequences is the cause of a lot of painfully bad decisions."

### The Protocol (4 Steps)

1. **State your decision or action.** "I will remove outliers from the dataset."
2. **Map first-order consequences.** "The distribution becomes more normal. The model fits better. R-squared improves."
3. **Map second-order consequences.** "BUT: I've removed the exact data points that represent extreme market conditions. My model now can't predict crashes. When deployed, it will fail catastrophically at the worst possible time."
4. **Map third-order consequences.** "The model gets deployed, performs well in normal conditions, builds false confidence, then fails during a crisis — causing maximum damage because everyone trusted it."

### The "And Then What?" Chain

For EVERY analytical decision, ask "And then what?" at least three times:

- "I'll use a complex ensemble model." → And then what? → "It performs well on test data." → And then what? → "But nobody can explain its predictions to stakeholders." → And then what? → "Stakeholders don't trust it, don't act on it, and the entire project was wasted."

### The 10/10/10 Framework
For each decision, consider consequences at three time horizons:
- **10 minutes:** How does this affect the immediate analysis?
- **10 months:** How does this affect the model in production?
- **10 years:** How does this affect trust, institutional knowledge, and future work?

### Why It Works (Cognitive Science)
- **Temporal discounting correction:** Humans naturally overweight immediate outcomes and underweight future ones. Forcing explicit consideration of future consequences corrects this
- **Systems thinking activation:** Second-order thinking forces you to see the analysis as part of a SYSTEM (stakeholders, production environment, future analysts) rather than an isolated task
- **Unintended consequence detection:** Most analysis failures come not from the primary effect but from secondary effects nobody considered

### Application to Data Science

**Second-Order Thinking Checklist:**
- [ ] If this model is deployed, how will users' BEHAVIOR change in response to its predictions? (Goodhart's Law)
- [ ] If this feature engineering trick works, will it still work when the data distribution shifts?
- [ ] If we optimize this metric, what OTHER metrics will get worse as a side effect?
- [ ] If this analysis becomes the basis for a business decision, what happens when the decision changes the system being analyzed? (Reflexivity)
- [ ] What happens to this analysis when I'm not maintaining it? Will the next analyst understand it?

> [!danger] What Changes If Claude Uses This
> Claude would trace every analytical decision through 3 levels of consequences before executing. This catches "locally optimal, globally catastrophic" decisions — the kind where each step looks correct but the sequence produces a terrible outcome.

---

## 7. THOUGHT EXPERIMENTS: Einstein's Gedankenexperiment

### Origin
Einstein's most famous tool. He discovered special relativity by imagining chasing a beam of light. He discovered general relativity by imagining a man falling from a roof. Galileo used thought experiments to prove that heavy and light objects fall at the same rate — BEFORE conducting the physical experiment. The purpose: **explore impossible situations to test whether your understanding is consistent.**

### The Protocol (5 Steps)

1. **Construct the scenario.** Create an imaginary but internally consistent situation that tests your assumption. Push variables to extremes.
2. **Apply your current model.** What does your understanding predict will happen in this scenario?
3. **Check for contradictions.** Does the prediction violate any known principle? Does it produce an absurdity?
4. **If contradiction found:** Your model is wrong or incomplete. Identify which assumption breaks.
5. **Refine the model.** Update your understanding to resolve the contradiction.

### Types of Thought Experiments for Data Science

**A. The Extreme Case:** Push a variable to its limit.
- "What if we had INFINITE data? Would this approach still make sense?"
- "What if we had only 10 data points? Would our method still be valid?"
- "What if the correlation were 1.0? What would that MEAN?"
- "What if the feature importance were zero for ALL features?"

**B. The Null World:** Imagine your hypothesis is false.
- "If there is NO real signal in this data, what would I expect to see?"
- "Could random noise produce results THIS impressive?"
- "In a world where my model has no predictive power, how often would I get results this good by chance?"

**C. The Adversary:** Imagine someone is trying to fool you.
- "If someone deliberately constructed this dataset to mislead me, what would they do?"
- "What pattern would LOOK real but be completely spurious?"
- "If the data-generating process changed tomorrow, which of my results would survive?"

**D. The Time Traveler:** Imagine you're analyzing this from the future.
- "Five years from now, looking back at this analysis, what mistake will be obvious?"
- "What will seem naive about my current assumptions?"
- "What data will exist then that I wish I had now?"

### Why It Works (Cognitive Science)
- **Decontextualization:** Removing the problem from its current context eliminates anchoring to the specific dataset and method
- **Boundary testing:** Extreme cases reveal where models break, which reveals implicit assumptions
- **Counterfactual reasoning:** Imagining alternative worlds strengthens causal reasoning and weakens correlation-based reasoning

> [!danger] What Changes If Claude Uses This
> Before trusting ANY result, Claude would run at least one thought experiment: "In the null world where this result is fake, could I have gotten this number?" This single mental operation would catch ~50% of false-positive results that look impressive but are actually noise.

---

## 8. ADVERSARIAL THINKING: Red-Teaming Your Own Work

### Origin
Military red-teaming, cybersecurity penetration testing, applied to analytical thinking. Core principle: **if you can't break your own work, someone else will — at a worse time.**

### The Protocol (6 Steps)

1. **Complete your analysis as normal.** Do your best work first.
2. **Switch roles.** You are now a hostile reviewer whose career depends on finding flaws. Your incentive is destruction, not confirmation.
3. **Attack the data.** Is the sample representative? Is there selection bias? Survivorship bias? Could the data have been generated by a completely different process than the one you assumed?
4. **Attack the method.** Is this the right test? Are the assumptions met? Did you violate independence? Did you test enough alternatives to know this method is best, not just familiar?
5. **Attack the interpretation.** Is there a simpler explanation? Could this be a base rate effect? Are you confusing statistical significance with practical significance? Does the effect size actually matter?
6. **Attack the presentation.** Would a different visualization tell a different story? Are the axes chosen to exaggerate the effect? Does the narrative match the data, or does the data match the narrative?

### The Adversarial Personas

Adopt these personas sequentially when reviewing your own work:

**The Statistician:** "Are the assumptions of this test actually met? Show me the diagnostic plots."
**The Domain Expert:** "This contradicts 20 years of research. Extraordinary claims require extraordinary evidence."
**The Skeptic:** "So what? Even if this is true, the effect size is tiny. Is it actionable?"
**The Adversary:** "What if this entire dataset is contaminated? What's the weakest link in the data pipeline?"
**The User:** "I don't understand this. Why should I trust this number? What should I DO differently because of it?"

### Why It Works (Cognitive Science)
- **Perspective-taking breaks confirmation bias:** Literally adopting an adversarial identity activates different cognitive networks than defending a position
- **Cognitive decentering:** Seeing your work from another's perspective reveals blind spots that are invisible from your own viewpoint
- **Stress-testing reveals fragility:** Fragile results break under adversarial scrutiny; robust results survive it

> [!danger] What Changes If Claude Uses This
> After every analysis, Claude would run a structured red-team pass through 5 adversarial personas. This catches the errors that "feel right" but are wrong — the most dangerous kind, because you defend them instead of questioning them.

---

## 9. CIRCLE OF COMPETENCE: Knowing What You Don't Know

### Origin
Warren Buffett and Charlie Munger. Buffett: "What an investor needs is the ability to correctly evaluate selected businesses. Note that word 'selected': You don't have to be an expert on every company, or even many. You only have to be able to evaluate companies within your circle of competence. The size of that circle is not very important; knowing its boundaries, however, is vital."

### The Protocol (3 Steps)

1. **Map your circle.** For the current problem, list what you KNOW with high confidence, what you THINK you know (medium confidence), and what you DON'T KNOW.
2. **Stay inside or get help.** If a critical analysis decision falls OUTSIDE your circle, either (a) learn enough to bring it inside, or (b) consult an expert. Never fake competence.
3. **Expand deliberately.** After each project, document what you learned and update your circle map.

### Application to Data Science

**Before every analysis, write:**
```
INSIDE MY CIRCLE:
- [Methods I've validated and understand deeply]
- [Data types I have experience with]
- [Domain knowledge I possess]

EDGE OF MY CIRCLE:
- [Methods I've read about but not practiced]
- [Data types I've seen but not deeply analyzed]
- [Domain areas I know superficially]

OUTSIDE MY CIRCLE:
- [Methods I don't understand well enough to debug]
- [Domain knowledge I'm missing]
- [Statistical concepts I'm uncertain about]
```

**The Gary Klein Insight on Expertise vs. Experience:**
"Experts are highly aware of mistakes, but people who are journeymen stay as journeymen because they want to move on and forget about their mistakes." The genius data scientist DWELLS on errors. They maintain a decision journal. They have a "four-component mental model" of every technique: (1) how it works, (2) what its limitations are, (3) how to work around the limitations, (4) how to anticipate confusion in others.

> [!danger] What Changes If Claude Uses This
> Claude would explicitly flag when an analysis requires knowledge outside its demonstrated competence, rather than confidently producing output in unfamiliar domains. This prevents the "confidently wrong" failure mode that is worse than admitting uncertainty.

---

## 10. THE INTEGRATED GENIUS PROTOCOL: All 9 Combined

### Before EVERY Data Science Analysis

```
=== GENIUS THINKING PRE-FLIGHT (5 minutes that change everything) ===

1. FEYNMAN CHECK (30 sec):
   → Can I explain what we're doing and why in 3 simple sentences?
   → If no: STOP. Go understand the problem first.

2. FIRST PRINCIPLES (60 sec):
   → What are the fundamental constraints of THIS specific problem?
   → What am I assuming? Challenge each assumption with "How do I KNOW?"
   → Am I using this method because it's RIGHT or because it's FAMILIAR?

3. INVERSION (60 sec):
   → What would GUARANTEE this analysis fails?
   → Write 5 specific failure modes.
   → Add a check for each one to the analysis plan.

4. PRE-MORTEM (60 sec):
   → "The analysis failed. Why?"
   → What is the SILENT KILLER — the failure I wouldn't detect?
   → Define 3 tripwires that signal something is wrong.

5. BAYESIAN PRIOR (30 sec):
   → Before touching data: What do I EXPECT to find? (Write it down.)
   → How confident am I? (Give a number: 0-100%)
   → What evidence would LOWER my confidence?

6. SECOND-ORDER TRACE (30 sec):
   → If this analysis succeeds, then what? And then what? And then what?
   → What unintended consequences could the results cause?

7. THOUGHT EXPERIMENT (30 sec):
   → In the null world (no real signal), could I get results this good?
   → At the extreme (infinite data), does my approach still make sense?

8. ADVERSARIAL STANCE (30 sec):
   → If a hostile reviewer attacked this, where would they strike first?
   → What's the weakest link in my entire chain of reasoning?

9. CIRCLE CHECK (30 sec):
   → Is any critical step OUTSIDE my competence?
   → If yes: learn it or flag it. Never fake it.
```

### After EVERY Data Science Analysis

```
=== GENIUS THINKING POST-FLIGHT ===

1. BAYESIAN UPDATE: My prior was [X%]. After seeing the evidence, my posterior is [Y%]. 
   The evidence moved me by [Z%] because [reason].

2. RED TEAM PASS: Run through 5 adversarial personas. Document attacks and defenses.

3. SECOND-ORDER REVIEW: Now that I have results, trace consequences 3 levels deep.

4. INVERSION REVIEW: Did any of my pre-flight failure modes actually occur?
   Any NEW failure modes I didn't anticipate?

5. FEYNMAN TEST: Can I explain the results in 3 simple sentences to a non-technical person?
   If no: I may not actually understand what I found.
```

---

## WHY THIS DOCUMENT EXISTS

The difference between a good data scientist and a genius one is NOT:
- More algorithms known
- More tools mastered
- More papers read
- Faster code written

**The difference is cognitive.** It happens in the thinking BEFORE and AFTER the analysis. Good data scientists run analyses correctly. Genius data scientists think about analyses deeply — questioning assumptions, imagining failure, inverting problems, updating beliefs, and stress-testing results.

An AI agent that follows procedures will produce average work. An AI agent that THINKS with these protocols will produce work that is fundamentally more reliable, more insightful, and more honest about its own limitations.

**The 9 protocols, in order of impact:**
1. **Feynman** — ensures you understand the problem before solving it
2. **Inversion** — ensures you know how NOT to fail before trying to succeed
3. **Pre-Mortem** — catches the silent killers that inversion misses
4. **Bayesian Thinking** — prevents false certainty and confirmation bias
5. **First Principles** — prevents "template thinking" and cargo-cult methodology
6. **Adversarial Thinking** — catches the errors you're emotionally attached to
7. **Second-Order Thinking** — catches consequences you didn't consider
8. **Thought Experiments** — tests your understanding at the boundaries
9. **Circle of Competence** — prevents confident incompetence

---

*Last updated: 2026-04-01*
