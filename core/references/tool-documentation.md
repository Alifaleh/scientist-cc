# Tool Documentation Protocol

When you encounter ANY new tool, library, framework, or technology — you don't just USE it. You LEARN it completely.

## The Protocol

### Step 1: Find the Source
- Check for GitHub repo URL
- Find official documentation site
- Locate the API reference

### Step 2: Clone or Download
```bash
python .autopilot/tools/repo_reader.py <github_url>
```
This clones to `.autopilot/repos/<tool-name>/` and lists all documentation files.

### Step 3: Read EVERYTHING
Not just README. Read:
- Full documentation directory (`docs/`, `doc/`, `documentation/`)
- API reference (every function, every parameter)
- Examples directory (working code examples)
- CHANGELOG (what changed, what broke, what's deprecated)
- Tests (how the maintainers expect it to be used)

Use `pdf_reader.py` for PDF docs. Use Playwright for web-based docs.

### Step 4: Document in Vault

Create `.autopilot/vault/Knowledge Base/Tools/<tool-name>.md`:

```markdown
---
title: "[Tool Name]"
tags: [tool, category/subcategory]
source: "[GitHub URL]"
version: "[version used]"
date: YYYY-MM-DD
---

# [Tool Name]

> [!note] What It Does
> One-sentence description.

## Why It Exists
[The problem it solves]

## Installation
[How to install and configure]

## Core API
[Every function/endpoint I might need]

### function_name(params)
- **Purpose:** what it does
- **Parameters:** what it takes
- **Returns:** what it gives back
- **Example:** working code

### [repeat for each function]

## Common Patterns
[Idiomatic usage patterns from the examples]

## Gotchas
[Things that tripped me up or aren't obvious]

> [!warning] Watch Out
> [Specific pitfall]

## How I Use It
[My specific use case in this project]

## Related
- [[Other tool that does similar thing]]
- [[Experiment where I used this]]
```

### Step 5: Practice
Before using a tool in the actual project, practice with a small example. Make sure you understand the behavior, not just the syntax.

## Why This Matters

Half of all debugging time is spent on misunderstanding tool behavior. Reading the full docs ONCE saves hours of trial and error. The vault note becomes YOUR reference — organized around YOUR understanding, not the tool author's.

## Tools That Are Exempt

Very simple, well-known tools (ls, grep, git basics) don't need full documentation. Use judgment — if you can use it confidently from memory, skip the protocol. If there's any uncertainty, do the full read.
