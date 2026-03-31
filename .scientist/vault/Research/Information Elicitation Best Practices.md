---
title: "Information Elicitation: Open-Ended Before Structured"
tags: [research, ux, elicitation, init-design, user-interaction, status/understood]
source: "User feedback + requirements engineering literature"
date: 2026-03-31
last_verified: 2026-03-31
related:
  - "[[../Knowledge Base/Principle - Listen Before Structuring]]"
  - "[[SWE-agent Agent-Computer Interface Design]]"
---

# Information Elicitation Best Practices

> [!note] Key Insight
> Requirements engineering literature shows: open-ended elicitation captures 40-60% more information than structured questionnaires. When gathering project context, let users describe freely first, then use structured follow-ups to fill gaps. This applies to AI agent init workflows.

## The Elicitation Sequence
1. **Open-ended:** "Tell me everything about what you want to build"
2. **Clarifying:** "You mentioned X — can you elaborate on Y?"
3. **Structured:** "Which of these best describes Z?" (only for gaps)
4. **Validation:** "Here's what I understand — is this correct?"

## Why Open-Ended First
- Users' mental models don't fit into predefined categories
- Free-form reveals priorities (what they mention first matters most)
- Structured options create anchoring bias (users pick closest match, not actual answer)

## Cross-Links
- [[supports::../Knowledge Base/Principle - Listen Before Structuring]] — the principle derived from this
- [[extends::SWE-agent Agent-Computer Interface Design]] — init IS an interface
