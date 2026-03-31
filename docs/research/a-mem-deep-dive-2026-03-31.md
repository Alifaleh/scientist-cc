# A-MEM Deep Dive: Mechanism-Level Analysis for scientist-cc Implementation

*Research Date: 2026-03-31*
*Paper: "A-MEM: Agentic Memory for LLM Agents" (NeurIPS 2025)*
*Authors: Wujiang Xu, Zujie Liang, Kai Mei, Hang Gao, Juntao Tan, Yongfeng Zhang (Rutgers / AIOS Foundation)*
*ArXiv: https://arxiv.org/abs/2502.12110*
*Repos: https://github.com/agiresearch/A-mem (eval) | https://github.com/WujiangXu/A-mem-sys (production)*

---

## 1. Core Architecture

A-MEM is a Zettelkasten-inspired memory system for LLM agents with **three core operations** that run every time a new memory is added:

```
New Interaction → Note Construction → Link Generation → Memory Evolution
                      (LLM call #1)      (LLM call #2)     (LLM call #3)
```

### Memory Note Structure (the atomic unit)

Each memory note `m_i` contains:

```
m_i = {
  content:    c_i,   // Raw interaction text
  timestamp:  t_i,   // When it happened (YYYYMMDDHHMM format)
  keywords:   K_i,   // LLM-generated key concepts (nouns, verbs, key terms)
  tags:       G_i,   // LLM-generated categorical tags (domain, format, type)
  context:    X_i,   // LLM-generated 1-sentence contextual description
  links:      L_i,   // Set of linked memory IDs (bidirectional)
  embedding:  e_i,   // Dense vector from text encoder
  id:         uuid,  // Unique identifier
  retrieval_count,   // How often retrieved (usage tracking)
  last_accessed,     // Timestamp of last retrieval
  evolution_history, // Record of all modifications
  category           // Classification category
}
```

**Key insight for scientist-cc:** This maps directly to a markdown note with YAML frontmatter. The `content` is the note body; `keywords`, `tags`, `context`, `category` are frontmatter fields; `links` are wikilinks; `embedding` is computed at index time.

---

## 2. Operation 1: Note Construction (LLM Call #1)

### What Happens
When new content arrives, the LLM analyzes it and generates structured metadata.

### Exact Prompt Template (from source code)
```
Generate a structured analysis of the following content by:
1. Identifying the most salient keywords (focus on nouns, verbs, and key concepts)
2. Extracting core themes and contextual elements
3. Creating relevant categorical tags

Format the response as a JSON object:
{
  "keywords": [
    // several specific, distinct keywords that capture key concepts and terminology
    // Order from most to least important
    // Don't include keywords that are the name of the speaker or time
    // At least three keywords, but don't be too redundant.
  ],
  "context": // one sentence summarizing:
    // - Main topic/domain
    // - Key arguments/points
    // - Intended audience/purpose
  ,
  "tags": [
    // several broad categories/themes for classification
    // Include domain, format, and type tags
    // At least three tags, but don't be too redundant.
  ]
}

Content for analysis: {content}
```

### Response Schema (enforced via structured output)
```json
{
  "type": "object",
  "properties": {
    "keywords": { "type": "array", "items": { "type": "string" } },
    "context": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}
```

### Embedding Generation
After metadata extraction, a dense vector is computed:
```
e_i = f_enc(concat(c_i, K_i, G_i, X_i))
```

The embedding encodes ALL textual components concatenated together, not just the raw content. This is critical -- it means the embedding captures the LLM's semantic interpretation, not just the surface text.

**Implementation detail:** Uses `SentenceTransformer("all-MiniLM-L6-v2")` via ChromaDB's `SentenceTransformerEmbeddingFunction`. The enhanced document for embedding is:
```
content + " context: {context}" + " keywords: {keywords}" + " tags: {tags}"
```

### scientist-cc Implementation
For a markdown vault, this maps to:
1. Claude receives new content (observation, paper summary, experiment result)
2. Claude generates frontmatter: `keywords`, `tags`, `context` (one-line summary)
3. The note body contains the full content
4. No vector DB needed -- we can use tag/keyword overlap + LLM reasoning for linking

---

## 3. Operation 2: Link Generation (LLM Call #2)

### The Two-Phase Linking Process

This is NOT the "4 linking strategies" I initially expected. A-MEM uses a **two-phase approach**:

**Phase 1: Embedding-based candidate retrieval (fast filter)**
```
s_{n,j} = cos(e_n, e_j)  for all m_j in M
M_near^n = {m_j | rank(s_{n,j}) <= k, m_j in M}
```
- Compute cosine similarity between new note's embedding and all existing notes
- Take top-k (k=5 in implementation) most similar
- This is the "cheap" filter to avoid exhaustive LLM comparison

**Phase 2: LLM-based link determination (expensive reasoning)**
```
L_i = LLM(m_n || M_near^n || P_s2)
```
- Send the new note + its k nearest neighbors to the LLM
- LLM decides WHICH connections should actually be established
- LLM can see keywords, context, and content of all candidates

### Link Generation Prompt (from source code)
```
You are an AI memory evolution agent responsible for managing and evolving a knowledge base.
Analyze the new memory note according to keywords and context, also with their several
nearest neighbors memory.

The new memory context: {context}
content: {content}
keywords: {keywords}

The nearest neighbors memories (each line starts with memory_id):
{nearest_neighbors_memories}

Based on this information, determine:
Should this memory be evolved? Consider its relationships with other memories.
```

### Key Design Decision: LLM as Final Arbiter
The embedding retrieval is just a candidate filter. The LLM makes the final linking decision based on semantic reasoning, not threshold-based similarity scores. This means:
- No fixed similarity threshold to tune
- The LLM can recognize conceptual relationships that embeddings miss
- Links are established based on meaning, not just surface similarity

### scientist-cc Implementation
For a markdown vault without vector DB:
1. **Candidate retrieval:** Use tag overlap + keyword overlap to find candidate notes (cheap)
2. **LLM reasoning:** Present candidates to Claude and ask which deserve wikilinks
3. **Link format:** Standard Obsidian wikilinks `[[note-name]]` in a "Related" section

Alternative without LLM call: Use a scoring function:
- Tag overlap score (Jaccard similarity of tags)
- Keyword overlap score (Jaccard similarity of keywords)
- Context embedding similarity (if we add embedding support later)
- Threshold: link if combined score > 0.3 (tunable)

---

## 4. Operation 3: Memory Evolution (LLM Call #3)

### What Happens
When a new memory is integrated, existing memories can be UPDATED. This is the most novel part of A-MEM.

### Evolution Prompt (from source code)
```
You are an AI memory evolution agent responsible for managing and evolving a knowledge base.
Analyze the new memory note according to keywords and context, also with their several
nearest neighbors memory. Make decisions about its evolution.

The new memory context: {context}
content: {content}
keywords: {keywords}

The nearest neighbors memories: {nearest_neighbors_memories}

Based on this information, determine:
1. Should this memory be evolved? Consider its relationships with other memories.
2. What specific actions should be taken (strengthen, update_neighbor)?
   2.1 If choose to strengthen the connection, which memory should it be connected to?
       Can you give the updated tags of this memory?
   2.2 If choose to update_neighbor, you can update the context and tags of these
       memories based on the understanding of these memories.
       Tags should be determined by the content of these characteristics of these memories.
       Note that the length of new_tags_neighborhood must equal the number of input neighbors,
       and the length of new_context_neighborhood must equal the number of input neighbors.
       The number of neighbors is {neighbor_number}.

Return your decision in JSON format:
{
    "should_evolve": True or False,
    "actions": ["strengthen", "update_neighbor"],
    "suggested_connections": ["memory_id_1", "memory_id_2", ...],
    "tags_to_update": ["tag_1", ... "tag_n"],
    "new_context_neighborhood": ["new context", ... "new context"],
    "new_tags_neighborhood": [["tag1", "tag2"], ... ["tag1", "tag2"]]
}
```

### Two Evolution Actions

**1. Strengthen (new note gets linked)**
- The new note's `links` list gets extended with suggested connection IDs
- The new note's `tags` get updated based on LLM's analysis
- Effect: New note becomes better connected to the knowledge network

**2. Update Neighbor (existing notes get modified)**
- Existing neighbor notes get their `context` and `tags` REWRITTEN
- The LLM generates new context descriptions and tag sets for each neighbor
- Effect: Old memories evolve their understanding based on new information

### Consolidation Mechanism
After evolution, the system tracks an evolution counter:
```python
if evo_label == True:
    self.evo_cnt += 1
    if self.evo_cnt % self.evo_threshold == 0:
        self.consolidate_memories()  # Rebuild ChromaDB index
```

`consolidate_memories()` resets the ChromaDB collection and re-indexes all memories with their updated metadata. Default `evo_threshold` is configurable.

### scientist-cc Implementation
This is the most powerful idea for a markdown vault:
1. When adding a new note, find 5 nearest neighbors (by tag/keyword overlap)
2. Ask Claude: "Given this new note, should any existing notes be updated?"
3. If yes, Claude edits the frontmatter (context, tags) of existing notes
4. Periodically run a "consolidation pass" (like AutoDream's `/dream`) to rebuild the index

**Critical insight:** Memory evolution means OLD NOTES GET SMARTER over time. A research note from week 1 gets better tags and richer context descriptions as new related research is added in week 5. This is exactly what Zettelkasten practitioners do manually.

---

## 5. Retrieval Mechanism

### Query Processing
```
e_q = f_enc(query)                              // Encode query
s_{q,i} = cos(e_q, e_i)  for all m_i in M      // Cosine similarity
M_retrieved = {m_i | rank(s_{q,i}) <= k}        // Top-k results
```

### Link-Following (Box Retrieval)
When a memory is retrieved, its LINKED memories are also returned:
```python
for link_id in links:
    if link_id not in seen_ids and neighbor_count < k:
        neighbor = self.memories.get(link_id)
        if neighbor:
            memories.append({
                'id': link_id,
                'content': neighbor.content,
                'context': neighbor.context,
                'keywords': neighbor.keywords,
                'tags': neighbor.tags,
                'timestamp': neighbor.timestamp,
                'category': neighbor.category,
                'is_neighbor': True  # Flagged as linked, not directly matched
            })
```

This is the "box" concept from Zettelkasten: related notes travel together. When you pull one card from a box, you get the related cards too.

### No Weighted Scoring
Surprisingly, A-MEM does NOT use weighted retrieval (no recency weighting, no importance weighting). It's pure cosine similarity + link following. The `retrieval_count` and `last_accessed` fields are tracked but not used in scoring.

### scientist-cc Implementation
For markdown retrieval:
1. Search by tag match + keyword match (cheap)
2. Follow wikilinks from matched notes to get "box" contents
3. Present both direct matches and linked notes to Claude
4. Consider adding recency/importance weighting (A-MEM doesn't, but it would help)

---

## 6. Benchmarks and Performance

### Datasets
- **LoCoMo**: Long-term conversational memory dataset (5 categories: Multi-Hop, Temporal, Open Domain, Single Hop, Adversarial)
- **DialSim**: Dialog simulation benchmark

### Key Results (vs. baselines: LoCoMo, ReadAgent, MemoryBank, MemGPT)

| Metric | A-MEM (GPT-4o-mini) | LoCoMo | MemGPT | Improvement |
|--------|---------------------|--------|--------|-------------|
| Multi-Hop ROUGE-L | 44.27 | 18.09 | ~15 | 2.4x |
| Multi-Hop SBERT | 70.49 | 52.30 | ~48 | 1.35x |
| Multi-Hop METEOR | 23.43 | 7.61 | ~6 | 3.1x |
| DialSim F1 | 3.45 | 2.55 | 1.18 | 1.35x / 2.9x |

### Token Efficiency (the killer metric)
- **A-MEM: 1,200-2,500 tokens per retrieval**
- **LoCoMo/MemGPT: ~16,900 tokens per retrieval**
- **85-93% reduction in token usage** while achieving better results

### Ablation Study Results
- Full A-MEM > A-MEM without Memory Evolution > A-MEM without both Link Gen and Evolution
- Link Generation is the critical foundation
- Memory Evolution provides significant refinement on top
- Both modules are complementary and necessary

### Retrieval Parameter k
- Optimal k varies by task type (k=3 for simple tasks, k=5-7 for complex multi-hop)
- Too large k degrades performance (noise dilutes signal)

---

## 7. Comparison: A-MEM vs. MemGPT/Letta vs. AutoDream

### MemGPT/Letta Architecture (for reference)

**Original MemGPT (2023):** OS-inspired virtual context management
- Main Context (in-window): System prompt + recent messages
- Recall Storage: Searchable conversation history (vector DB)
- Archival Storage: Long-term knowledge (vector DB)
- Agent controls paging between tiers via function calls

**Letta/MemGPT Evolution (2025-2026):** Now uses "MemFS" (Memory FileSystem)
- Git-backed directory of markdown files (very similar to what we're building!)
- `system/` folder: Pinned to context window (always loaded)
- Non-system folders: Visible in tree view but contents omitted until requested
- Agent self-edits its own memory files using standard bash tools
- Memory hierarchy: system/ (always loaded) > non-system/ (tree visible) > archived
- **Sleep-time compute:** Background "reflection" subagents that consolidate memory
- **Defrag:** Explicit memory defragmentation command (refactor large blocks, remove redundancies)

**Key Letta insight for scientist-cc:** Letta moved FROM vector DB TO markdown files. Their MemFS is essentially what we're building. The key differentiators:
- Git-backed versioning of memory (we can do this)
- System/non-system hierarchy (maps to our vault structure)
- Sleep-time reflection agents (maps to our consolidation step)

### AutoDream / claude-dream (Memory Consolidation)

A community replication of Anthropic's unreleased `/dream` and `/autodream` features.

**10-phase consolidation process:**

| Phase | Action | scientist-cc Equivalent |
|-------|--------|------------------------|
| 1. Orient | Read all memory files, understand current state | Load vault index |
| 2. Gather | Search session transcripts for corrections, preferences, decisions | Review recent observations/experiments |
| 3. Consolidate | Merge duplicates, resolve contradictions, anchor dates | Merge related notes, resolve conflicts |
| 4. Prune & Index | Update index, keep under 200 lines | Rebuild Index.md |
| 5. Auto-Promote | Detect patterns across 3+ projects -> permanent rules | Promote to Knowledge Base/ |
| 6. Staleness | Check if referenced items still exist | Verify hypotheses still relevant |
| 7. Cross-Project Merge | Detect duplicate project dirs | Merge overlapping research areas |
| 8. Missed Signals | Find uncaptured corrections from transcripts | Catch unrecorded learnings |
| 9. Dream Log | Append summary to log | Update state.json |
| 10. Reset | Reset autodream counter | Reset consolidation timer |

**Trigger thresholds:**
- minSessions: 5 sessions since last consolidation
- minHours: 24 hours since last consolidation
- Both must be met before auto-trigger

**Sleep metaphor mapping:**
| Brain During Sleep | Dream Consolidation |
|---|---|
| Replays important experiences | Searches transcripts for corrections and decisions |
| Prunes weak synapses | Deletes memories that duplicate rules or reference deleted code |
| Strengthens repeated patterns | Promotes feedback appearing in 3+ projects to permanent rules |
| Consolidates short-term to long-term | Merges scattered session notes into organized topic files |
| Detects anomalies (nightmares) | Finds user corrections that were never saved |

---

## 8. Implementation Recommendations for scientist-cc

### Priority 1: Note Construction Enhancement
Add to the scientist workflow's note creation step:
```yaml
# Frontmatter for every vault note
---
keywords: [extracted, key, concepts]     # LLM-generated
tags: [domain, topic, type]              # LLM-generated
context: "One-sentence summary"          # LLM-generated
links: []                                # Auto-populated
created: 2026-03-31
last_verified: 2026-03-31
confidence: 0.8
review_interval: 7d
---
```

### Priority 2: Link Generation (Two-Phase)
After creating any new note:
1. **Cheap filter:** Scan existing notes' frontmatter for tag/keyword overlap (Jaccard > 0.2)
2. **LLM reasoning:** Present top-5 candidates to Claude with the prompt:
   "Given this new note and these existing notes, which deserve bidirectional wikilinks? Consider shared concepts, supporting/contradicting evidence, and temporal relationships."
3. **Insert links:** Add `[[wikilinks]]` to both the new note and matched existing notes

### Priority 3: Memory Evolution
When adding a new note, also check if neighbors need updating:
1. Find 5 most related existing notes
2. Ask Claude: "Does this new information change how we should describe or categorize any of these existing notes? Update their context/tags if needed."
3. If yes, edit the frontmatter of existing notes
4. Track evolution in `evolution_history` frontmatter field

### Priority 4: Consolidation (AutoDream-Inspired)
Add a CONSOLIDATE step to the R&D loop (every N cycles or on demand):
1. Scan vault for duplicate/overlapping content
2. Merge related notes or create hub notes
3. Update stale references
4. Rebuild Index.md
5. Promote repeated patterns to Knowledge Base/
6. Log consolidation actions

### Priority 5: Retrieval Enhancement
When the scientist needs to recall information:
1. Match query against note tags/keywords/context
2. Return matched notes + their wikilinked neighbors ("box retrieval")
3. Consider adding weighted scoring: `score = 0.5*relevance + 0.3*recency + 0.2*importance`

### What NOT to Implement
- **ChromaDB/vector store:** Unnecessary for a markdown vault. Tag/keyword overlap + LLM reasoning achieves the same effect as embedding similarity + LLM reasoning.
- **Fixed similarity thresholds:** Follow A-MEM's approach of letting the LLM decide, not a threshold.
- **Complex retrieval scoring:** A-MEM achieves state-of-the-art with simple cosine + link following. Don't over-engineer.

---

## 9. Key Takeaways

1. **A-MEM's secret sauce is Memory Evolution** -- old notes get smarter as new notes arrive. This is the single most impactful idea to implement.

2. **Two-phase linking works** -- cheap filter (tags/keywords) + expensive filter (LLM reasoning). Don't try to make the cheap filter perfect.

3. **Token efficiency comes from structured metadata** -- 85-93% fewer tokens than LoCoMo/MemGPT because each note carries rich context in compact form (keywords + tags + one-line summary).

4. **Letta/MemGPT moved to markdown files** -- The industry is converging on file-based memory. scientist-cc's Obsidian vault approach is validated by Letta's MemFS evolution.

5. **Consolidation is essential** -- Both AutoDream and Letta's sleep-time compute implement periodic memory maintenance. This should be a first-class operation in scientist-cc.

6. **Link following ("box retrieval") is powerful** -- When you retrieve one note, automatically include its linked notes. This is how A-MEM achieves multi-hop reasoning superiority.

7. **The LLM is the memory manager** -- A-MEM doesn't use fixed rules for linking or evolution. The LLM decides. This is what makes it "agentic" and is the right approach for scientist-cc where Claude IS the agent.

---

## Sources

- [A-MEM Paper (arXiv)](https://arxiv.org/abs/2502.12110)
- [A-MEM Production Code (GitHub)](https://github.com/WujiangXu/A-mem-sys)
- [A-MEM Evaluation Code (GitHub)](https://github.com/agiresearch/A-mem)
- [MemGPT Paper (arXiv)](https://arxiv.org/abs/2310.08560)
- [Letta (formerly MemGPT) Memory Docs](https://docs.letta.com/letta-code/memory)
- [claude-dream (AutoDream replication)](https://github.com/Josue7211/claude-dream)
