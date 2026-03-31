#!/usr/bin/env python3
"""Repo Reader for Autopilot — clones a repo and lists its documentation structure.

Usage:
    python repo_reader.py <git_url> [target_dir]     # Clone and list docs
    python repo_reader.py --list <local_dir>           # List docs in existing dir
    python repo_reader.py --tree <local_dir>           # Full file tree

Designed for Claude to understand new tools by reading their FULL documentation.
Clones repos to .autopilot/repos/ and provides a structured list of docs to read.
"""

import sys
import os
import subprocess
import json
from pathlib import Path


DOC_PATTERNS = [
    "README*", "CHANGELOG*", "CONTRIBUTING*", "LICENSE*",
    "docs/**/*", "doc/**/*", "documentation/**/*",
    "*.md", "**/*.md",
    "examples/**/*", "example/**/*",
    "guides/**/*", "guide/**/*",
    "tutorials/**/*", "tutorial/**/*",
    "wiki/**/*",
    "API*", "api/**/*",
]

DOC_EXTENSIONS = {".md", ".rst", ".txt", ".adoc", ".org", ".html", ".htm"}

SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv",
    "dist", "build", ".next", ".nuxt", "target",
    ".tox", ".mypy_cache", ".pytest_cache",
}


def clone_repo(url, target_dir):
    """Clone a git repository."""
    if os.path.exists(target_dir):
        print(f"Directory exists: {target_dir}", file=sys.stderr)
        return target_dir

    print(f"Cloning {url} to {target_dir}...", file=sys.stderr)
    result = subprocess.run(
        ["git", "clone", "--depth", "1", url, target_dir],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"Clone failed: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return target_dir


def find_docs(root_dir):
    """Find all documentation files in a directory."""
    root = Path(root_dir)
    docs = []

    for path in sorted(root.rglob("*")):
        # Skip excluded directories
        if any(skip in path.parts for skip in SKIP_DIRS):
            continue

        if not path.is_file():
            continue

        rel = path.relative_to(root)
        is_doc = False

        # Check if in a docs-like directory
        parts_lower = [p.lower() for p in rel.parts]
        if any(d in parts_lower for d in ["docs", "doc", "documentation", "guides", "guide", "tutorials", "tutorial", "examples", "example", "wiki", "api"]):
            is_doc = True

        # Check extension
        if path.suffix.lower() in DOC_EXTENSIONS:
            is_doc = True

        # Check filename patterns
        name_lower = path.name.lower()
        if name_lower.startswith(("readme", "changelog", "contributing", "api", "guide", "tutorial")):
            is_doc = True

        if is_doc:
            size = path.stat().st_size
            docs.append({
                "path": str(rel),
                "size": size,
                "size_kb": round(size / 1024, 1),
                "extension": path.suffix,
            })

    return docs


def file_tree(root_dir, max_depth=3):
    """Generate a simple file tree."""
    root = Path(root_dir)
    lines = [f"{root.name}/"]

    def _walk(dir_path, prefix="", depth=0):
        if depth >= max_depth:
            return
        try:
            entries = sorted(dir_path.iterdir(), key=lambda p: (not p.is_dir(), p.name))
        except PermissionError:
            return

        entries = [e for e in entries if e.name not in SKIP_DIRS]
        for i, entry in enumerate(entries):
            is_last = i == len(entries) - 1
            connector = "└── " if is_last else "├── "
            if entry.is_dir():
                lines.append(f"{prefix}{connector}{entry.name}/")
                next_prefix = prefix + ("    " if is_last else "│   ")
                _walk(entry, next_prefix, depth + 1)
            else:
                lines.append(f"{prefix}{connector}{entry.name}")

    _walk(root)
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--list":
        local_dir = sys.argv[2] if len(sys.argv) > 2 else "."
        docs = find_docs(local_dir)
        print(f"# Documentation in {local_dir}")
        print(f"Found {len(docs)} doc files\n")
        for doc in docs:
            print(f"  {doc['path']} ({doc['size_kb']}KB)")
        total_kb = sum(d['size_kb'] for d in docs)
        print(f"\nTotal: {total_kb:.0f}KB across {len(docs)} files")
        return

    if sys.argv[1] == "--tree":
        local_dir = sys.argv[2] if len(sys.argv) > 2 else "."
        print(file_tree(local_dir))
        return

    # Clone mode
    url = sys.argv[1]
    if len(sys.argv) > 2 and not sys.argv[2].startswith("--"):
        target = sys.argv[2]
    else:
        # Extract repo name from URL
        name = url.rstrip("/").split("/")[-1].replace(".git", "")
        target = os.path.join(".autopilot", "repos", name)

    clone_repo(url, target)
    docs = find_docs(target)

    print(f"# {url}")
    print(f"Cloned to: {target}")
    print(f"Documentation files: {len(docs)}\n")

    # Group by directory
    dirs = {}
    for doc in docs:
        parts = Path(doc['path']).parts
        dir_name = parts[0] if len(parts) > 1 else "root"
        if dir_name not in dirs:
            dirs[dir_name] = []
        dirs[dir_name].append(doc)

    for dir_name, files in sorted(dirs.items()):
        print(f"\n## {dir_name}/")
        for f in files:
            print(f"  - {f['path']} ({f['size_kb']}KB)")

    print(f"\n## Reading Order Suggestion")
    print("1. README.md (project overview)")
    priority = [d for d in docs if "readme" in d['path'].lower()]
    priority += [d for d in docs if "getting-started" in d['path'].lower() or "quickstart" in d['path'].lower()]
    priority += [d for d in docs if "api" in d['path'].lower()]
    priority += [d for d in docs if d['path'].lower().startswith("docs/")]

    seen = set()
    for i, doc in enumerate(priority[:20], 2):
        if doc['path'] not in seen:
            print(f"{i}. {doc['path']}")
            seen.add(doc['path'])


if __name__ == "__main__":
    main()
