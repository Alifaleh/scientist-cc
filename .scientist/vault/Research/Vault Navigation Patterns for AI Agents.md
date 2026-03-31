---
title: "Vault Navigation Patterns for AI Agents"
tags: [research, knowledge-retrieval, vault-navigation, index, frontmatter, scaling, status/understood]
stage: research
status: complete
created: 2026-03-31
confidence: high
sources:
  - llmstxt.org
  - MAGI specification
  - Smart Connections plugin
  - Manus agent architecture
  - Anthropic context engineering guide
---

# Vault Navigation Patterns for AI Agents

## Problem

As a markdown vault grows (50+ to 1000+ notes), an AI agent cannot read every file. It needs fast, structured navigation using only glob, grep, and frontmatter — no vector DB, no external services.

## Pattern 1: Three-Tier Progressive Disclosure

**Source:** Claude Code skills architecture, llms.txt specification

The dominant pattern across agent frameworks in 2026:

1. **Tier 1 — Manifest/Index (always loaded, ~100-500 tokens):** A machine-readable summary of every note. Contains: path, title, tags, status, 1-line description. Agent reads ONLY this on startup.
2. **Tier 2 — Frontmatter scan (on-demand, ~60 tokens/file):** When the index points to candidates, read only YAML frontmatter to filter further (by status, confidence, tags, date).
3. **Tier 3 — Full content (selective):** Read full body of only the 2-5 most relevant notes.

**Key insight:** llms.txt format (H1 title, blockquote summary, H2 sections with `- [Title](path): description` links) is the web standard for this. We should adopt it for `Index.md`.

## Pattern 2: Typed Frontmatter as Query Interface

**Source:** Dataview plugin, MAGI specification, Obsidian skills architecture

Frontmatter fields act as a structured query layer:

```yaml
---
tags: [hypothesis, implemented]
status: implemented | active | superseded | archived
confidence: high | medium | low
domain: memory | retrieval | evolution | methodology
created: 2026-03-31
last_verified: 2026-03-31
superseded_by: "[[newer note]]"
supports: ["[[Principle X]]"]
contradicts: ["[[Hypothesis Y]]"]]
---
```

**Query patterns without a database:**
- `grep -l "status: active"` — all active notes
- `grep -l "tags:.*hypothesis.*implemented"` — implemented hypotheses
- `grep -l "domain: memory"` — all memory-related notes
- `grep -l "confidence: low"` — notes needing review

## Pattern 3: Machine-Readable JSON Index

**Source:** Manus todo.md, MAGI embedded JSON, llms.txt**

Generate a `vault-index.json` alongside `Index.md`:

```json
{
  "generated": "2026-03-31",
  "note_count": 12,
  "notes": [
    {
      "path": "Research/Knowledge Management for AI Agents.md",
      "title": "Knowledge Management for AI Agents",
      "tags": ["research", "memory", "a-mem"],
      "status": "complete",
      "domain": "memory",
      "confidence": "high",
      "summary": "A-MEM, MIRIX, MemGPT; episodic-to-semantic consolidation",
      "links_to": ["Principle - Consolidation Is the Missing Step"],
      "created": "2026-03-31"
    }
  ],
  "tag_index": {
    "research": ["Research/Knowledge Management for AI Agents.md", ...],
    "hypothesis": ["Hypotheses/Hypothesis 1 - Consolidation Step.md", ...]
  },
  "domain_index": {
    "memory": [...],
    "methodology": [...]
  }
}
```

**Why both?** Index.md is for humans in Obsidian. vault-index.json is for the agent — parseable in one read, filterable without grep, and cheaper than scanning frontmatter across 200 files.

## Pattern 4: Context Routing (Query Classification)

**Source:** Anthropic context engineering guide, Windsurf architecture

Before searching, classify the query intent:

| Intent | Search Strategy |
|--------|----------------|
| "What do we know about X?" | Tag/domain filter in JSON index → read matched notes |
| "Any contradictions?" | Grep for `contradicts:` in frontmatter |
| "What's active?" | Filter `status: active` in JSON index |
| "Related to note Y?" | Read note Y's wikilinks + `supports:`/`contradicts:` fields |
| "What changed recently?" | Sort JSON index by `created` or file mtime |

## Pattern 5: Smart Connections Approach (Without Embeddings)

**Source:** Smart Connections plugin, Obsidian Copilot

Smart Connections uses embeddings for semantic similarity. Without a vector DB, approximate this with:

1. **Wikilink graph:** Notes that link to each other are related. Build adjacency from `[[wikilinks]]` in the JSON index.
2. **Tag co-occurrence:** Notes sharing 2+ tags are likely related.
3. **Temporal proximity:** Notes created in the same session (check `created` date) are contextually related.

## Recommendations for scientist-cc

### Immediate (v0.5.0)
1. **Add `domain` and `confidence` to all frontmatter templates** — enables structured grep
2. **Generate `vault-index.json` during CONSOLIDATE step** — one file parse replaces N file scans
3. **Adopt llms.txt-style Index.md format** — `- [Title](path): one-line summary` for every note
4. **Add `summary` field to frontmatter** — 1-sentence description, used in index generation

### Next (v0.6.0)
4. **Build wikilink adjacency into JSON index** — `links_to` and `linked_from` arrays per note
5. **Add context routing to resume workflow** — classify what the agent needs before loading
6. **Implement tag-based retrieval function** — given a query, return relevant note paths without reading bodies

### Future (v1.0)
7. **MAGI-style typed relationships** — `supports`, `contradicts`, `extends` in frontmatter
8. **Auto-generated summaries** — during CONSOLIDATE, compress each note to a 1-sentence summary
9. **Staleness detection** — flag notes where `last_verified` > 30 days

## Key Insight

> The JSON index is the single highest-leverage improvement. At 50 notes, grep works fine. At 200 notes, you need an index. At 1000 notes, you need an index with pre-computed relationships. The index should be regenerated on every CONSOLIDATE step — it's cheap to build and eliminates O(n) file reads.

*Last updated: 2026-03-31*
