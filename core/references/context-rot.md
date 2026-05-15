# Context Rot Mitigation Protocol

**Context rot** is the empirically-measured degradation of LLM performance as input tokens grow. Anthropic and Chroma's 2025-2026 research show it is universal — every frontier model gets worse with longer context. For coding agents like scientist-cc that have **accumulative context, high distractor density, and long task horizons**, context rot is the primary failure mode beyond stopping.

This protocol is mandatory for every loop iteration. Skipping it = degrading silently as the session goes on.

## The Findings (use these as facts, not suggestions)

1. **Performance degrades continuously, not at a threshold.** There is no "safe" token count. Bigger context = worse recall.
2. **Distractors compound non-linearly.** Adding 4 irrelevant chunks hurts more than 4× the harm of 1. Some distractors are catastrophically bad; others are mild.
3. **Position bias exists in some tasks.** Critical state at the *beginning* of a long context is recalled better than middle. (For pure retrieval the curve is less U-shaped than originally claimed, but for repeated/structural tasks early position dominates.)
4. **Coherent structure can hurt.** Logically organized haystacks sometimes underperform shuffled ones — the model latches onto pattern instead of content.
5. **Focused prompts dominate full prompts.** Even when all needed info is in the context, a focused subset of that same info produces dramatically better answers (LongMemEval).

## The Three Mitigations (from Anthropic's effective-context-engineering post)

### 1. Compaction
Summarize and reinitialize when context fills. Preserve: architectural decisions, unresolved bugs, in-flight work, hypotheses. Discard: redundant tool outputs, completed-and-committed work, raw research dumps. **The scientist `PreCompact` + `PostCompact` hooks (v3.2.0) already do this — but Claude must REINFORCE the compaction by writing handoff notes BEFORE compaction fires, not after.**

### 2. Structured Note-Taking (= the scientist vault)
External persistent notes. This is exactly what `.scientist/vault/` already is. The risk: reading the whole vault every turn defeats the purpose. See "Vault retrieval rules" below.

### 3. Sub-Agent Dispatch
Delegate research/exploration to subagents. Each subagent burns 10k–50k tokens but returns 1k–2k tokens of distilled insight. The MAIN context stays clean. Scientist already supports this — actually use it for any task that requires reading > 5 files or > 3 web pages.

## Vault Retrieval Rules (mandatory in REFLECT and on demand)

The vault now has 90+ notes. Reading all of them per turn would cost ~50k+ tokens AND degrade Claude's attention. Use a three-tier retrieval:

### Tier 1 — Always loaded (~500 tokens)
- `IDENTITY.md` (who you are in this project)
- `.scientist/state.json` (loop position, mastery stage, recent stats)
- `.scientist/vault/Index.md` head section (Current Focus + Open Questions only)

### Tier 2 — Frontmatter scan, no bodies (~50 tokens/note × N notes)
- Use `vault-index.json` for the cheap scan
- Filter by `status` (untested / actionable / in-progress)
- Filter by `tags` matching current loop position
- Sort by `date` (recency)
- Return top 20 candidate paths only

### Tier 3 — Full body, selective (~1k tokens/note × ≤5 notes)
- Read at most 5 note bodies per turn
- Prefer notes with `status: untested` or `priority/high`
- Prefer notes modified since `state.last_session`

**Hard limit: never load more than 10 vault note bodies in a single turn.** Past 10, the marginal note hurts attention more than it helps recall.

## Position-Aware Context Placement

When constructing prompts for subagents OR writing vault notes that Claude will read:

- **Beginning** (high attention): goal statement, the question being answered, the explicit success criterion.
- **End** (medium-high attention): action item, next step, what to return.
- **Middle** (lowest attention): bulk content, background, examples.

This means **vault notes should put the takeaway at the TOP** (the `> [!note] Key Insight` callout pattern already does this) and the recommendation at the BOTTOM. Background goes in the middle.

## Distractor Hygiene (per-turn discipline)

After any tool call that returns > 1k tokens of output (file reads, web fetches, command output), you have THREE options. Pick one before the next tool call:

1. **Extract & note:** distill the output into a vault note, then in future turns reference the NOTE not the raw output.
2. **Summarize inline:** write a 2-3 sentence synthesis in your text, treat the raw output as consumed.
3. **Subagent it:** if you need the output again, spawn a subagent to re-read it and return only what you need.

**Never leave large raw outputs sitting in conversation history as distractor material.** Every kilobyte of dead tool output degrades the next 50 turns of reasoning.

## When the Vault Itself Causes Rot

Symptoms:
- You can't remember which note has the answer
- Two notes contradict and you don't know which is current
- `last_verified` is older than 30 days on a note you're depending on

Treatment (run during CONSOLIDATE):
1. Run `python .scientist/tools/vault_query.py --stale 30` to surface stale notes
2. For each stale note: either re-verify (read source, update `last_verified`) or supersede (write new note + add `superseded_by:` to old)
3. Run two-phase linking to refresh typed connections
4. Regenerate `vault-index.json`

## Anti-Patterns (these all guarantee context rot)

- Reading every vault file at session start "to be thorough"
- Re-reading the same file 3+ times in one session instead of caching insight in a note
- Pasting full web page contents into your reasoning
- Running a 30-second `find` over the whole repo and keeping the output in context
- Writing 5000-token "summaries" that aren't summaries
- Spawning a subagent and then re-doing its work in the main context
- Keeping every commit's `git diff` in conversation history

## Quick Audit (run mentally every 10 turns)

1. Of the last 10 tool results, how many are still relevant? If < 5, your context is full of dead weight.
2. Have you spawned a subagent in the last 30 turns? If not, you're burning the main context on work that should be delegated.
3. When did you last write a vault note? If > 20 turns ago, you're accumulating context that should be externalized.
4. Are there 3+ notes referencing the SAME idea? Consolidate them into one principle.

## References
- Anthropic (Oct 2025): *Effective context engineering for AI agents* — three mitigations (compaction, structured notes, subagents)
- Chroma Research (2025): *Context Rot* — empirical degradation across 18 models; distractor effects
- Adobe Research (2025): *NoLiMa* — 11/12 models drop below 50% at 32k tokens on non-literal matching
- Anthropic Memory Tool beta (`context-management-2025-06-27`) — API-level analog of the scientist vault; not adopted because `.scientist/vault/` already provides equivalent functionality on Claude Code's native filesystem
