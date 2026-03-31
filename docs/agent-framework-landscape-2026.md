# Autonomous AI Agent Framework Landscape (March 2026)

> Foundational research for scientist-cc: a self-evolving R&D framework for Claude Code.
> Compiled 2026-03-31.

---

## Table of Contents

1. [Framework Comparison Matrix](#framework-comparison-matrix)
2. [Detailed Framework Profiles](#detailed-framework-profiles)
3. [Cross-Cutting Research Themes](#cross-cutting-research-themes)
4. [Key Insights for scientist-cc](#key-insights-for-scientist-cc)
5. [Sources](#sources)

---

## Framework Comparison Matrix

| Framework | Architecture | Memory System | Self-Improvement | Knowledge Mgmt | Tool Use | Status (Mar 2026) |
|---|---|---|---|---|---|---|
| **AutoGPT** | Single autonomous agent; low-code platform with server+frontend | Short-term (session state) + Long-term (vector DB: Pinecone/Weaviate/ChromaDB via RAG) | Dynamic plan adjustment; prone to self-feedback loops without constraints | Vector DB embeddings for knowledge retrieval | Web search, code execution, file management, API calls | Active. 182k GitHub stars. Platform beta v0.6.50 |
| **CrewAI** | Multi-agent role-based; hub-and-spoke communication; Crews (autonomous) + Flows (event-driven) | 4-layer: Short-term (ChromaDB/RAG), Long-term, Entity, Procedural. Weighted configs (recency/semantic/importance) | LLM-driven auto-scope on save; limited cross-session evolution without Mem0 | Scoped memory trees; LLM-analyzed categorization on save/recall | MCP + A2A native support; pluggable tool interfaces | Active. 45.9k stars. v1.10.1. 100k+ certified devs. 12M daily agent executions |
| **LangGraph** | Graph-based stateful workflows; nodes=actions, edges=conditional transitions | Thread-scoped checkpoints (short-term); external store queries (long-term); full state persistence to external storage | Time-travel debugging; human-in-the-loop correction; no autonomous self-improvement | State stored in checkpointed graphs; long-term via database/vector store queries | Any tool via LangChain ecosystem; code execution, APIs, retrieval | Active. Part of LangChain ecosystem. v1.0 milestone reached |
| **OpenHands** | Multi-agent: CodeActAgent (generalist), BrowserAgent, Micro-agents. Event-sourced state model | Event log recording commands/edits/results; session-bounded (resets each session) | No native self-improvement; relies on external memory layers (e.g., MemU) for learning | Session-scoped only; rediscovers codebase each session without external memory | Shell, code editor, web browser; MCP integration; typed tool system | Very Active. 65k stars. 250+ contributors. v1.5.0 |
| **Devin** | Single autonomous agent in sandboxed environment (shell + editor + browser) | Proprietary; maintains context across multi-step tasks; long-term reasoning | RL-based training; 4x faster problem-solving year-over-year; 67% PR merge rate (up from 34%) | Proprietary knowledge system; architecture diagrams, dependency mapping | Shell, code editor, web browser (all sandboxed) | Commercial. ~$150M ARR (incl. Windsurf). Closed source |
| **Claude Code** | Single-threaded master loop (nO); model-driven autonomy; sub-agent spawning (Plan/Explore/Task) | 6-layer memory loaded at session start; AutoDream background consolidation between sessions; CLAUDE.md files | AutoDream (REM-sleep-like memory consolidation); model decides next actions autonomously | CLAUDE.md hierarchy; MCP servers for external knowledge; file-based persistence | Bash, Grep, Edit, Read, Write + MCP tools; any CLI tool composable | Active. Anthropic's flagship CLI agent |
| **Aider** | Single agent; pair-programming model; architect/ask modes | Git-based (repo map + chat history); no cross-session persistence beyond git | Auto-runs tests/linters and fixes problems; no autonomous self-improvement loop | Repo map (automatic codebase understanding); no external knowledge store | Git integration; test runners; linters; multi-model support | Active. Popular CLI tool. Works with any LLM |
| **SWE-agent** | Single agent with Agent-Computer Interface (ACI); ReAct-style (thought-action-observation) | Session-scoped; no cross-session persistence | No self-improvement; relies on ACI design for performance | Curated commands for repo navigation, file inspection, code editing | Custom ACI commands (not raw shell); specialized for SWE tasks | Active. Princeton/Stanford research. Top 3 on SWE-bench Full |
| **MetaGPT** | Multi-agent SOP-based; assembly line (PM, Architect, Engineer, etc.); structured outputs | Session-scoped; vector DB integration planned | Executive feedback mechanism (runtime debugging); AFlow for automated workflow generation | Structured artifacts (PRDs, design docs, flowcharts); intermediate outputs reduce errors | Code execution, web browsing, file management | Active. Launched MGX (commercial). ICLR 2025 oral (AFlow) |
| **BabyAGI** | Single agent; task creation-execution-prioritization loop | Vector DB (Pinecone/FAISS/Chroma) for task results as embeddings | Newest version: experimental self-building agent ("simplest thing that can build itself") | Semantic search over past task results via embeddings | LangChain-based tool integration | Archived (original). Experimental self-building version exists |

---

## Detailed Framework Profiles

### 1. AutoGPT / AutoGPT Forge

**Architecture:** Fully autonomous agent that takes high-level goals, breaks them into actionable steps, and adjusts plans dynamically. The platform separates agent logic from UI, with an AutoGPT Server handling core functions (LLM orchestration, tool integration, API calls, memory) and an AutoGPT Frontend providing a low-code visual workflow builder.

**Memory:** Dual-layer: short-term memory maintains immediate context (recent messages, session state), while long-term memory persists across sessions using external vector databases (Pinecone, Weaviate, or local ChromaDB) with RAG retrieval. This adds infrastructure complexity but scales well.

**Self-Improvement:** Can dynamically adjust plans based on feedback, but is prone to self-feedback loops, brittle long-term memory, higher token usage, and error cascades without explicit constraints. Requires human oversight, governance layers, and evals for production.

**Strengths:** Pioneer of autonomous agents; massive community (182k stars); visual workflow builder; good for complex multi-step tasks.

**Weaknesses:** Error cascades without guardrails; high token consumption; infrastructure complexity for memory; requires careful governance for production use.

**Key Lesson for scientist-cc:** AutoGPT's struggle with self-feedback loops is instructive. scientist-cc's hypothesis-experiment-learn loop is a more structured approach that avoids unbounded autonomy. However, AutoGPT's vector DB memory pattern is worth studying for knowledge persistence.

---

### 2. CrewAI

**Architecture:** Role-based multi-agent framework with hub-and-spoke communication (no peer-to-peer agent traffic). Two modes: Crews (autonomous teams with true agency -- agents decide when to delegate) and Flows (enterprise event-driven architecture for precise orchestration). Built from scratch, independent of LangChain.

**Memory:** Most sophisticated memory architecture among open-source frameworks. Four layers: short-term (ChromaDB + RAG for session context), long-term (cross-session persistence), entity memory (tracking specific entities), and procedural memory (learned procedures). Supports weighted configurations (recency_weight, semantic_weight, importance_weight) and scoped memory trees. LLM auto-analyzes content on save to suggest scope, categories, importance.

**Self-Improvement:** LLM-driven memory categorization improves over time. However, native memory is fairly static and does not evolve with the user or transfer easily across sessions. Integration with Mem0 adds persistent context and reduces token costs by up to 90%.

**Strengths:** Clean role decomposition; production-ready (12M daily executions); MCP + A2A native support; fast-growing community.

**Weaknesses:** Memory does not natively evolve across sessions; hub-and-spoke can bottleneck complex inter-agent workflows; relatively new enterprise features.

**Key Lesson for scientist-cc:** CrewAI's 4-layer memory architecture (short-term, long-term, entity, procedural) is a strong model. scientist-cc could adopt a similar layered approach. The weighted retrieval (recency/semantic/importance) is particularly relevant for prioritizing which learned knowledge to surface.

---

### 3. LangGraph

**Architecture:** Graph-based workflow engine where nodes represent actions and edges represent conditional transitions. Supports parallel execution, conditional branching, and human-in-the-loop interrupts. Part of the LangChain ecosystem but can be used independently.

**Memory:** Thread-scoped checkpoints provide short-term memory that survives interruptions and can be resumed across computing environments. Long-term memory uses external stores (database or vector store) that agents can query and update. Full state persistence enables multi-day workflows.

**Self-Improvement:** No autonomous self-improvement. Instead, offers time-travel debugging (replay and inspect any past state) and human-in-the-loop correction. The graph structure itself is static -- defined at build time, not learned.

**Strengths:** Most flexible workflow definition; production-grade persistence; time-travel debugging; human-in-the-loop; strong ecosystem integration.

**Weaknesses:** Steeper learning curve; graph structure is static (not self-modifying); more of a workflow engine than an autonomous agent; requires explicit programming of all paths.

**Key Lesson for scientist-cc:** LangGraph's time-travel debugging and checkpoint-based persistence are powerful patterns. scientist-cc could implement experiment checkpointing that allows replaying and branching from any past state. The graph-as-workflow concept could inform how scientist-cc structures its research pipelines.

---

### 4. OpenHands (formerly OpenDevin)

**Architecture:** Multi-agent platform with specialized agent types: CodeActAgent (generalist code-writing/debugging), BrowserAgent (web navigation), and Micro-agents (lightweight, instantiated from natural language). Event-sourced state model with deterministic replay and typed tool system with MCP integration.

**Memory:** Event log recording all commands, edits, and results provides persistent context within a session. However, memory is strictly session-bounded -- each new session starts from zero, requiring the agent to rediscover codebase architecture and conventions. This is widely recognized as a critical limitation.

**Self-Improvement:** No native self-improvement. External solutions like MemU add a "learning layer" where each coding session deposits project knowledge that future sessions can withdraw. The SDK supports immutable configuration for agents, suggesting a design philosophy of stability over evolution.

**Strengths:** Excellent for autonomous coding tasks; strong SWE-bench performance (top 3); rich multi-interface design (SDK, CLI, GUI, Cloud, Enterprise); large active community (65k stars, 250+ contributors).

**Weaknesses:** Session-bounded memory is the critical weakness -- agents rediscover the same codebase each session. No self-improvement mechanism. Relies on external memory layers for cross-session continuity.

**Key Lesson for scientist-cc:** OpenHands demonstrates the cost of session-bounded memory -- 50 sessions means 50 rediscoveries of the same architecture. scientist-cc's Obsidian vault approach (persistent knowledge across sessions) directly solves this problem. The event-sourced state model is worth studying for experiment reproducibility.

---

### 5. Devin (Cognition)

**Architecture:** Single autonomous agent operating in a self-contained sandboxed environment with shell, code editor, and web browser. Uses long-term reasoning and planning to execute tasks requiring thousands of decisions. Trained via a combination of LLM capabilities and reinforcement learning.

**Memory:** Proprietary system that maintains context across multiple steps within a task. Supports architecture diagrams, dependency mapping, and breaking-change detection. Details are closed-source.

**Self-Improvement:** RL-based training has driven measurable improvements: 4x faster problem-solving and 2x more efficient resource consumption year-over-year. PR merge rate improved from 34% to 67%. This is training-time improvement, not runtime self-improvement.

**Strengths:** Best-in-class for well-defined tasks (4-8 hour junior engineer scope); strong commercial traction (~$150M ARR); excels at migrations, vulnerability fixes, test writing, small tickets.

**Weaknesses:** Struggles with ambiguous requirements; cannot exercise senior-engineer judgment; closed-source; expensive; improvement comes from retraining, not runtime learning.

**Key Lesson for scientist-cc:** Devin's success with well-defined tasks and struggle with ambiguity mirrors a key insight: autonomous agents need clear success criteria. scientist-cc's hypothesis-driven approach (where each experiment has explicit success/failure criteria) is well-aligned with this finding.

---

### 6. Claude Code

**Architecture:** Single-threaded master loop (codenamed nO) with real-time steering capabilities. Represents the "model-driven" agent paradigm: the runtime is a "dumb loop" and all intelligence lives in the model. The model decides what to do next. Supports controlled parallelism through limited sub-agent spawning (Plan, Explore, Task agents).

**Memory:** 6-layer memory system loaded at session start. AutoDream is a background sub-agent that runs between coding sessions (modeled after REM sleep memory consolidation) -- it reviews memory files, tidies them, and consolidates insights before the next session. CLAUDE.md files provide hierarchical project-level and directory-level context.

**Self-Improvement:** AutoDream provides between-session memory consolidation. The model-driven architecture means improvements come from model updates and prompt engineering rather than runtime self-modification. MCP integration enables external tool and knowledge expansion.

**Strengths:** Most sophisticated memory consolidation (AutoDream); clean tool composition (Bash, Grep, Edit compose any workflow); strong sub-agent architecture; deep MCP ecosystem.

**Weaknesses:** Single-model dependency (Claude); memory is file-based (no vector search natively); sub-agent spawning is limited; no autonomous self-improvement of its own prompts or tools.

**Key Lesson for scientist-cc:** Claude Code's AutoDream is the closest existing system to what scientist-cc aims to build. The 6-layer memory + between-session consolidation pattern is directly applicable. scientist-cc should study how AutoDream decides what to consolidate, prune, and promote.

---

### 7. Aider

**Architecture:** Single agent operating as a pair programmer. Offers multiple interaction modes: /architect (planning), /ask (questions), and in-code AI comments. Supports virtually any LLM backend.

**Memory:** Git-based persistence -- changes are committed with sensible messages. Automatic repo map provides codebase understanding. No cross-session memory beyond what git provides. Chat history is session-scoped.

**Self-Improvement:** Automatically runs tests and linters after changes, then fixes detected problems. This is a feedback loop but not self-improvement -- it does not learn from past mistakes across sessions.

**Strengths:** Excellent pair-programming UX; model-agnostic; strong git integration; auto-test-and-fix workflow; lightweight and focused.

**Weaknesses:** No cross-session memory; no knowledge management; purely reactive (does not plan ahead); limited to code editing tasks.

**Key Lesson for scientist-cc:** Aider's auto-test-and-fix loop is a simple but effective self-correction pattern. scientist-cc could adopt this as the inner loop of experiments: run, test, fix, repeat -- but with the addition of cross-experiment learning that Aider lacks.

---

### 8. SWE-agent (Princeton/Stanford)

**Architecture:** Single agent with a custom Agent-Computer Interface (ACI) providing curated commands for repository navigation, file inspection, and code editing. Uses ReAct-style prompting (thought-action-observation cycles). Key insight: interface design significantly affects agent performance.

**Memory:** Purely session-scoped. No cross-session persistence. Each issue resolution starts fresh.

**Self-Improvement:** None. Performance comes from ACI design, not learning. The mini-swe-agent variant achieves >74% on SWE-bench verified in just 100 lines of code, demonstrating that interface design matters more than complexity.

**Strengths:** Top 3 on SWE-bench Full; clean research architecture; ACI concept is influential; mini-swe-agent proves simplicity works.

**Weaknesses:** No memory, no learning, no knowledge management; purely task-focused; research-oriented rather than production tool.

**Key Lesson for scientist-cc:** SWE-agent's ACI insight is profound: how the agent interfaces with the computer matters as much as the model. scientist-cc should invest in its tool interfaces (how it reads papers, runs experiments, visualizes data) rather than just adding more tools.

---

### 9. MetaGPT

**Architecture:** Multi-agent SOP-based framework simulating a software company. Agents include Product Manager, Architect, Project Manager, and Engineer, each following standardized operating procedures. "Code = SOP(Team)" is the core philosophy. Uses an assembly-line paradigm with structured intermediate outputs (PRDs, design docs, flowcharts).

**Memory:** Primarily session-scoped. Structured outputs serve as inter-agent communication and intermediate knowledge artifacts. Vector DB integration for long-term memory is planned but not yet production-ready. Recent work on SPO (Self-Supervised Prompt Optimizer) suggests movement toward persistent optimization.

**Self-Improvement:** Executive feedback mechanism debugs and executes code at runtime (5.4% improvement on MBPP). AFlow automates agentic workflow generation (ICLR 2025 oral, top 1.8%). SPO represents early self-improvement of prompt strategies.

**Strengths:** SOP enforcement reduces errors significantly; structured outputs maintain consistency; strong academic backing; AFlow is innovative; MGX commercial product launched.

**Weaknesses:** Memory is mostly session-scoped; SOP rigidity may limit creative problem-solving; complex setup; enterprise features still maturing.

**Key Lesson for scientist-cc:** MetaGPT's SOP-as-code philosophy is directly relevant. scientist-cc's research methodology (hypothesize, experiment, learn) is itself an SOP. MetaGPT shows that encoding process discipline into the framework (requiring structured artifacts at each stage) dramatically reduces errors.

---

### 10. BabyAGI

**Architecture:** Elegantly simple task-driven loop: create tasks, execute tasks, prioritize tasks, repeat. Uses LLM for reasoning and vector database for memory. The newest experimental version pursues a "self-building agent" philosophy: build the simplest thing that can build itself.

**Memory:** Vector DB (Pinecone/FAISS/Chroma) stores task results as embeddings. Semantic retrieval enables the agent to recall past results by meaning rather than exact match.

**Self-Improvement:** The newest version is explicitly designed as a self-building autonomous agent -- the agent modifies its own code and capabilities. This is the most ambitious self-improvement goal in the landscape, though it remains experimental.

**Strengths:** Conceptually elegant; educational value; self-building vision is ambitious; influenced the entire autonomous agent field.

**Weaknesses:** Not production-ready; original version archived; self-building version is highly experimental; limited community activity.

**Key Lesson for scientist-cc:** BabyAGI's "self-building agent" philosophy resonates directly with scientist-cc's self-evolution goal. The key insight is "build the simplest thing that can build itself" -- scientist-cc should ensure its core loop is simple enough to be self-modifiable while robust enough to be reliable.

---

## Cross-Cutting Research Themes

### Memory Systems (2025-2026 State of the Art)

**Key Papers:**
- "Memory in the Age of AI Agents: A Survey" (updated Jan 2026) -- comprehensive taxonomy
- "Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers" (Mar 2026)
- ICLR 2026 Workshop: "MemAgents: Memory for LLM-Based Agentic Systems"
- "Persistent Memory for AI Coding Agents: An Engineering Blueprint for Cross-Session Continuity"

**Emerging Memory Architectures:**
- **Mem0/Mem0g**: Universal memory layer achieving 26% improvement in LLM-as-Judge metric over OpenAI. Graph-based variant (Mem0g) captures entity relationships as directed labeled graphs. 91% lower p95 latency and >90% token cost savings.
- **EverMemOS**: Self-organizing memory operating system for structured long-horizon reasoning (Jan 2026)
- **Observational Memory (Mastra 1.0)**: Uses Observer and Reflector background agents to compress conversation history into date-stamped observations
- **WebCoach**: Self-evolving framework with persistent cross-session memory for web browsing agents

**Key Insight for scientist-cc:** The field is converging on the idea that agent memory is fundamentally different from LLM memorization -- it is online, interaction-driven, under the agent's control, and requires write policies, temporal credit assignment, and provenance-aware retrieval.

---

### Self-Improvement and Self-Correction (2025-2026)

**Key Papers:**
- ICLR 2026 Workshop on "AI with Recursive Self-Improvement"
- "Truly Self-Improving Agents Require Intrinsic Metacognitive Learning" (ICLR 2026)
- "Self-Improving AI Agents through Self-Play" (Dec 2025)
- "Hyperagents" (Meta, Mar 2026) -- self-modifying AI framework

**Five Axes of Self-Improvement:**
1. **Change targets**: Parameters, memory/context, tools/workflows, or agent architecture
2. **Adaptation timing**: Within a task episode vs. between tasks/deployments
3. **Adaptation mechanisms**: Reward/critique-based, imitation, or evolutionary search
4. **Operating contexts**: Web, robotics, scientific discovery, enterprise
5. **Evidence and assurance**: Beyond benchmarks

**The GVU Pattern:** Generator-Verifier-Updater is emerging as the canonical self-improvement loop:
- Generator: Samples trajectories (runs experiments)
- Verifier: Scores results (reward model, critic, oracle, or verbal judge)
- Updater: Updates policy (first-order update)

**Metacognitive Self-Improvement:** The strongest position paper argues that truly self-improving agents need *intrinsic* metacognition -- the ability to evaluate, reflect on, and adapt their own learning processes. Current agents rely on *extrinsic* metacognition (fixed human-designed loops), which limits scalability.

**Hyperagents (Meta, March 2026):** The meta-level modification procedure is itself editable, enabling metacognitive self-modification -- improving not just task-solving behavior but the improvement mechanism itself. This is the most advanced self-improvement paradigm published to date.

**Key Insight for scientist-cc:** scientist-cc's hypothesis-experiment-learn loop is a GVU pattern. To advance toward true self-improvement, the framework should eventually be able to modify its own research methodology -- not just learn facts, but learn *how to learn better*.

---

### Agent Architecture Patterns (2025-2026)

**Key Surveys:**
- "Agentic AI: A Comprehensive Survey of Architectures, Applications, and Future Directions" (Springer, 2025)
- "AI Agent Systems: Architectures, Applications, and Evaluation" (Jan 2026)
- Anthropic's "2026 Agentic Coding Trends Report"

**Dominant Patterns:**
1. **Single-threaded master loop** (Claude Code, Devin): Model decides next action; runtime is minimal
2. **Multi-agent role decomposition** (CrewAI, MetaGPT): Specialized agents with defined responsibilities
3. **Graph-based workflows** (LangGraph): Explicit state machines with conditional edges
4. **Task-driven loops** (BabyAGI, AutoGPT): Create-execute-prioritize cycles
5. **Self-organizing modular** (emerging): Meta-controller chooses which modules to activate

**Multi-Agent Explosion:** Gartner reported 1,445% surge in multi-agent system inquiries from Q1 2024 to Q2 2025. Interaction patterns include chain, star, mesh, and explicit workflow graphs.

**Key Insight for scientist-cc:** scientist-cc currently uses a single-agent model with sub-agent spawning. The research suggests that as complexity grows, a hybrid approach (single master agent with specialized sub-agents for distinct research phases) is optimal. The graph-based workflow pattern could structure the research pipeline while maintaining autonomous decision-making within each node.

---

### Knowledge Management for Agents (2025-2026)

**State of the field:** 70% of organizations will use AI-powered KM systems by end of 2025. The market grew 47.2% CAGR to $7.71B in 2025.

**Key Capabilities:**
- RAG (Retrieval-Augmented Generation) remains the foundation for grounded knowledge retrieval
- Graph-based knowledge representations (Mem0g, knowledge graphs) capture relationships
- Agentic KM workflows: planning, memory, and multi-step reasoning
- Faithfulness and grounding: citations, evidence-based answers, hallucination prevention

**Key Insight for scientist-cc:** scientist-cc's Obsidian vault is a knowledge management system. The research suggests augmenting file-based storage with: (a) graph-based relationship tracking between concepts, (b) semantic search over accumulated knowledge, and (c) automated knowledge health monitoring (detecting stale, contradictory, or incomplete knowledge).

---

## Key Insights for scientist-cc

### What scientist-cc Already Does Well (Relative to the Field)

1. **Cross-session persistence via Obsidian vault** -- Solves the #1 problem plaguing OpenHands, SWE-agent, Aider, and MetaGPT (session-bounded memory)
2. **Structured research methodology** -- The hypothesis-experiment-learn loop mirrors the GVU pattern identified as canonical in self-improvement research
3. **File-based knowledge management** -- More transparent and auditable than vector DB approaches; aligns with Anthropic's CLAUDE.md philosophy
4. **Model-driven autonomy** -- Leverages Claude Code's single-threaded master loop, which is the architecture Anthropic itself chose for production

### What scientist-cc Should Learn From Others

| Insight | Source Framework | How to Apply |
|---|---|---|
| **Layered memory with weighted retrieval** | CrewAI | Add recency/semantic/importance weights when retrieving past knowledge; not all memories are equally relevant |
| **Between-session memory consolidation** | Claude Code (AutoDream) | Implement a "consolidation" step that runs after each research session, pruning redundant findings and promoting key insights |
| **Graph-based knowledge representation** | Mem0g | Augment Obsidian notes with explicit relationship graphs between concepts, papers, experiments |
| **SOP enforcement via structured outputs** | MetaGPT | Require structured artifacts (hypothesis docs, experiment plans, result summaries) at each stage to reduce errors |
| **Self-building simplicity** | BabyAGI | Keep the core loop simple enough to be self-modifiable; complexity should live in the knowledge vault, not the framework |
| **ACI design investment** | SWE-agent | Invest in the quality of tool interfaces (how the agent reads papers, runs experiments, visualizes data) -- interface design drives performance |
| **Checkpoint-based experiment replay** | LangGraph | Enable branching and replaying experiments from any past state (time-travel for research) |
| **Auto-test-and-fix inner loop** | Aider | After each experiment execution, automatically validate results and self-correct before recording findings |
| **Clear success criteria per task** | Devin | Every experiment needs explicit, measurable success/failure criteria -- ambiguity kills autonomous agents |
| **Metacognitive self-improvement** | Hyperagents (Meta) | Long-term goal: the framework should learn not just domain knowledge but how to improve its own research process |

### Recommended Architecture Evolution

```
Current: Single agent + Obsidian vault + hypothesis-experiment-learn loop

Recommended evolution (phased):

Phase 1 - Memory Enhancement:
  - Add weighted retrieval to vault queries (recency, relevance, importance)
  - Implement post-session consolidation (AutoDream-inspired)
  - Add experiment checkpointing for replay/branching

Phase 2 - Knowledge Graph Layer:
  - Build relationship graph between concepts, papers, experiments
  - Enable semantic search over accumulated knowledge
  - Add knowledge health monitoring (stale/contradictory detection)

Phase 3 - Structured Research Pipeline:
  - Enforce structured artifacts at each research stage (MetaGPT-inspired SOPs)
  - Add auto-validation after experiment execution (Aider-inspired)
  - Implement GVU pattern explicitly (Generator=experiment, Verifier=validation, Updater=vault)

Phase 4 - Metacognitive Evolution:
  - Enable the framework to evaluate and modify its own research methodology
  - Track meta-metrics: how well is the learning process itself improving?
  - Self-modify tool interfaces based on usage patterns
```

---

## Sources

### Framework Documentation & Repositories
- [AutoGPT GitHub](https://github.com/Significant-Gravitas/AutoGPT) -- 182k stars, platform beta v0.6.50
- [CrewAI GitHub](https://github.com/crewAIInc/crewAI) -- 45.9k stars, v1.10.1
- [CrewAI Memory Docs](https://docs.crewai.com/en/concepts/memory)
- [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
- [LangChain/LangGraph v1.0 Announcement](https://blog.langchain.com/langchain-langgraph-1dot0/)
- [OpenHands GitHub](https://github.com/OpenHands/OpenHands) -- 65k stars, v1.5.0
- [OpenHands SDK Paper](https://arxiv.org/html/2511.03690v1)
- [Devin Performance Review 2025](https://cognition.ai/blog/devin-annual-performance-review-2025)
- [Devin 2.0 Technical Design](https://medium.com/@takafumi.endo/agent-native-development-a-deep-dive-into-devin-2-0s-technical-design-3451587d23c0)
- [Claude Code Overview](https://code.claude.com/docs/en/overview)
- [Claude Code Architecture (Reverse Engineered)](https://vrungta.substack.com/p/claude-code-architecture-reverse)
- [Claude Code System Prompts](https://github.com/Piebald-AI/claude-code-system-prompts)
- [Claude Code AutoDream Memory](https://popularaitools.ai/blog/claude-code-autodream-memory-2026)
- [Aider](https://aider.chat/)
- [SWE-agent GitHub](https://github.com/SWE-agent/SWE-agent)
- [SWE-agent Paper (NeurIPS 2024)](https://arxiv.org/abs/2405.15793)
- [MetaGPT GitHub](https://github.com/FoundationAgents/MetaGPT)
- [MetaGPT Paper (ICLR 2024)](https://arxiv.org/abs/2308.00352)
- [BabyAGI GitHub](https://github.com/yoheinakajima/babyagi)
- [BabyAGI Overview (IBM)](https://www.ibm.com/think/topics/babyagi)

### Memory Systems Research
- [Memory in the Age of AI Agents: Survey Paper List](https://github.com/Shichun-Liu/Agent-Memory-Paper-List)
- [Memory for Autonomous LLM Agents (Mar 2026)](https://arxiv.org/html/2603.07670)
- [ICLR 2026 MemAgents Workshop](https://openreview.net/pdf?id=U51WxL382H)
- [Persistent Memory for AI Coding Agents (Feb 2026)](https://medium.com/@sourabh.node/persistent-memory-for-ai-coding-agents-an-engineering-blueprint-for-cross-session-continuity-999136960877)
- [Mem0 Paper](https://arxiv.org/abs/2504.19413)
- [Mem0 GitHub](https://github.com/mem0ai/mem0)
- [Mem0 Graph Memory (Jan 2026)](https://mem0.ai/blog/graph-memory-solutions-ai-agents)
- [OpenHands Memory Limitation Analysis](https://memu.pro/blog/openhands-open-source-coding-agent-memory)
- [CrewAI Deep Dive Memory Systems](https://sparkco.ai/blog/deep-dive-into-crewai-memory-systems)

### Self-Improvement Research
- [ICLR 2026 Workshop on AI with Recursive Self-Improvement](https://openreview.net/pdf?id=OsPQ6zTQXV)
- [Truly Self-Improving Agents Require Intrinsic Metacognitive Learning](https://arxiv.org/abs/2506.05109)
- [Self-Improving AI Agents through Self-Play](https://arxiv.org/abs/2512.02731)
- [Hyperagents (Meta, Mar 2026)](https://arxiv.org/abs/2603.19461)
- [Better Ways to Build Self-Improving AI Agents (Yohei Nakajima)](https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/)

### Architecture Surveys
- [Agentic AI: Comprehensive Survey (Springer)](https://link.springer.com/article/10.1007/s10462-025-11422-4)
- [AI Agent Systems: Architectures, Applications, and Evaluation (Jan 2026)](https://arxiv.org/html/2601.01743v1)
- [Anthropic 2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [Top 5 AI Agent Architectures 2025 (MarkTechPost)](https://www.marktechpost.com/2025/11/15/comparing-the-top-5-ai-agent-architectures-in-2025-hierarchical-swarm-meta-learning-modular-evolutionary/)
- [5 AI Agent Design Patterns to Master by 2026](https://explore.n1n.ai/blog/5-ai-agent-design-patterns-master-2026-2026-03-21)
- [AI Agent Framework Comparison (Fast.io)](https://fast.io/resources/ai-agent-framework-comparison/)
- [Framework Comparison 2026 (Ideas2IT)](https://www.ideas2it.com/blogs/ai-agent-frameworks)

### Knowledge Management
- [Cross-Session Agent Memory: Foundations and Future Directions](https://mgx.dev/insights/cross-session-agent-memory-foundations-implementations-challenges-and-future-directions/d03dd30038514b75ad4cbbda2239c468)
- [AI-Native Memory and Context-Aware Agents](https://ajithp.com/2025/06/30/ai-native-memory-persistent-agents-second-me/)
- [Agent Memory Architecture: Persistent Context Systems That Scale](https://getathenic.com/blog/agent-memory-architecture-persistent-context-systems)

---

*Generated 2026-03-31 for the scientist-cc project.*
