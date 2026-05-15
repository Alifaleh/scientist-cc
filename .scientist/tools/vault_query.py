#!/usr/bin/env python3
"""Vault Query — focused retrieval for scientist vaults.

Replaces "read every vault note" with "read the 5 most relevant ones."
Reads `.scientist/vault/vault-index.json` (cheap) and filters by status,
tag, age, or staleness. Returns ONLY paths; the caller reads bodies
selectively.

Usage:
  vault_query.py --status untested
  vault_query.py --tag anti-stopping --recent 7
  vault_query.py --stale 30                # last_verified older than 30 days
  vault_query.py --search "context rot"    # substring on title/tags/summary
  vault_query.py --top 5 --status actionable
"""

from __future__ import annotations

import argparse
import io
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

# Force UTF-8 on Windows consoles (default is cp1252 which chokes on -> arrows
# and other Unicode chars found in vault note titles).
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        # If the streams aren't standard (e.g. captured), fall back silently.
        pass


def find_vault_index(start: Path) -> Path | None:
    """Walk up from `start` looking for `.scientist/vault/vault-index.json`."""
    for parent in [start, *start.parents]:
        candidate = parent / ".scientist" / "vault" / "vault-index.json"
        if candidate.exists():
            return candidate
    return None


def parse_date(s: str | None) -> datetime | None:
    if not s:
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            return datetime.strptime(s, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return None


def filter_notes(
    notes: list[dict[str, Any]],
    *,
    status: str | None,
    tag: str | None,
    recent: int | None,
    stale: int | None,
    search: str | None,
) -> list[dict[str, Any]]:
    now = datetime.now(tz=timezone.utc)
    out: list[dict[str, Any]] = []
    for n in notes:
        if status:
            note_status = (n.get("status") or "").lower()
            note_tags = [t.lower() for t in (n.get("tags") or [])]
            if status.lower() not in note_status and not any(
                status.lower() in t for t in note_tags
            ):
                continue
        if tag:
            tags_l = [t.lower() for t in (n.get("tags") or [])]
            if not any(tag.lower() in t for t in tags_l):
                continue
        if recent is not None:
            dt = parse_date(n.get("date"))
            if not dt or (now - dt) > timedelta(days=recent):
                continue
        if stale is not None:
            lv = parse_date(n.get("last_verified"))
            # No last_verified OR older than threshold counts as stale.
            if lv and (now - lv) <= timedelta(days=stale):
                continue
        if search:
            blob = " ".join(
                [
                    str(n.get("title") or ""),
                    str(n.get("summary") or ""),
                    " ".join(n.get("tags") or []),
                ]
            ).lower()
            if search.lower() not in blob:
                continue
        out.append(n)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--status", help="filter by status (e.g. untested, actionable, implemented)")
    parser.add_argument("--tag", help="filter by tag substring")
    parser.add_argument("--recent", type=int, help="only notes from the last N days")
    parser.add_argument("--stale", type=int, help="notes where last_verified is older than N days (or missing)")
    parser.add_argument("--search", help="substring search on title/tags/summary")
    parser.add_argument("--top", type=int, default=20, help="limit results (default 20)")
    parser.add_argument("--format", choices=["paths", "lines", "json"], default="lines",
                        help="output format (default: lines = path + 1-line summary)")
    parser.add_argument("--cwd", default=".", help="starting directory (default: cwd)")
    args = parser.parse_args()

    idx_path = find_vault_index(Path(args.cwd).resolve())
    if not idx_path:
        print("vault-index.json not found — run `python .scientist/tools/generate_index.py` first", file=sys.stderr)
        return 1

    try:
        idx = json.loads(idx_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        print(f"failed to read vault-index.json: {e}", file=sys.stderr)
        return 1

    notes = idx.get("notes", [])
    filtered = filter_notes(
        notes,
        status=args.status,
        tag=args.tag,
        recent=args.recent,
        stale=args.stale,
        search=args.search,
    )

    # Sort by date descending (most recent first), then by status priority.
    status_priority = {"untested": 0, "in-progress": 1, "actionable": 2, "implemented": 3, "understood": 4}
    filtered.sort(
        key=lambda n: (
            status_priority.get((n.get("status") or "").lower(), 9),
            -(parse_date(n.get("date")) or datetime.min.replace(tzinfo=timezone.utc)).timestamp(),
        )
    )
    filtered = filtered[: args.top]

    if args.format == "json":
        print(json.dumps(filtered, indent=2, default=str))
    elif args.format == "paths":
        for n in filtered:
            print(n.get("path", "?"))
    else:
        for n in filtered:
            title = n.get("title") or n.get("path") or "?"
            summary = (n.get("summary") or "").strip().replace("\n", " ")
            status = n.get("status") or "-"
            date = n.get("date") or "-"
            line = f"[{status:>11}] {date} {title}"
            if summary:
                line += f" — {summary[:120]}"
            print(line)

    return 0


if __name__ == "__main__":
    sys.exit(main())
