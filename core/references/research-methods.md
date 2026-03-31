# Research Methods

How to find, read, and extract value from research material.

## Finding Good Sources

### Academic Papers
- **arXiv** (arxiv.org) — preprints, free, most recent work
- **Google Scholar** (scholar.google.com) — search by topic, see citation counts
- **SSRN** (ssrn.com) — finance and economics working papers
- **Semantic Scholar** (semanticscholar.org) — AI-powered paper search
- Search terms: use specific technical vocabulary, not vague descriptions

### Technical Documentation
- **GitHub repos** — clone to `.scientist/repos/`, read full docs
- **Official docs sites** — use Playwright to browse JavaScript-heavy sites
- **API references** — read EVERY endpoint, not just the ones you think you need

### Books (PDFs)
- Download to `.scientist/papers/` using Python: `urllib.request.urlretrieve(url, path)`
- **ALWAYS use `pdf_reader.py`** — it's the most reliable approach:
  - `python .scientist/tools/pdf_reader.py <file> --info` → metadata (pages, title, author)
  - `python .scientist/tools/pdf_reader.py <file> --summary` → table of contents
  - `python .scientist/tools/pdf_reader.py <file> <start> <end>` → read specific pages
- **If pdf_reader.py fails:** Install PyMuPDF first: `pip install PyMuPDF`
- **Claude Code Read tool:** Can read PDFs but may fail on Windows (needs pdftoppm). Use pdf_reader.py as primary.
- **NEVER give up on a PDF.** If one method fails, try another. If text is garbled (font encoding), try the arxiv HTML version via Playwright.
- For textbooks: don't read linearly — `--summary` first, then targeted chapters

## How to Read a Paper

### Quick Scan (5 minutes)
1. Title + Abstract → What's the contribution?
2. Figures → What's the visual story?
3. Conclusion → What did they find?

### Deep Read (30 minutes)
4. Introduction → Why does this matter?
5. Methods → How did they do it?
6. Results → What specifically happened?
7. Discussion → What are the limitations?

### Extract Value
- Write a vault note WHILE reading, not after
- Focus on: What can I USE from this?
- Note what CONTRADICTS my current understanding
- Note what CONFIRMS my hypotheses
- Save key equations, numbers, thresholds

## How to Document in the Vault

Every research note should follow this template:

```markdown
---
title: "[Paper/Concept Name]"
tags: [research, domain/subtopic, source/paper]
source: "[URL or citation]"
date: YYYY-MM-DD
related:
  - "[[Connected concept]]"
  - "[[Hypothesis this informs]]"
---

# [Title]

> [!note] Key Insight
> One-sentence takeaway.

## What This Paper/Concept Says
[Summary in your own words]

## What I Can Use
[Specific, actionable insights for the project]

## What Contradicts My Understanding
[If anything — this is the most valuable part]

## Questions This Raises
[New things to investigate]

## Key Numbers
[Specific thresholds, parameters, empirical results]
```

## Evaluating Source Quality

- **High confidence:** Peer-reviewed papers with 100+ citations, official documentation
- **Medium confidence:** Recent preprints, popular blog posts from domain experts
- **Low confidence:** Blog posts, forum discussions, YouTube explanations
- **Never trust:** "Strategy" posts, "how to make money" content, anything selling something

The mechanism matters more than the claim. If a paper shows WHY something works (mathematical proof, controlled experiment), trust it more than a paper that shows THAT it works (correlation without causation).

## Before Starting Research

1. **Check vault-index.json** — has this topic been researched already? If a `status/understood` note exists, read it first and build on it instead of starting from scratch.
2. **Check papers/ directory** — has the paper already been downloaded? Don't re-download.
3. **Set a research question** — what specifically do you need to learn? Unfocused research produces unfocused notes.

## After Completing Research

1. **Run two-phase linking** — scan vault for notes sharing tags, assess link types
2. **Check for contradictions** — does the new research contradict anything in the vault? If yes, investigate.
3. **Update vault-index.json** — run `python .scientist/tools/generate_index.py`
4. **Update related notes' metadata** (backward evolution) if new findings change the context of old notes
