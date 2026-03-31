#!/usr/bin/env python3
"""PDF Reader for Autopilot — reads PDFs in 3-page chunks for Claude.

Usage:
    python pdf_reader.py <file.pdf>                    # Read all pages (3-page chunks)
    python pdf_reader.py <file.pdf> 10 20              # Read pages 10-20
    python pdf_reader.py <file.pdf> --summary          # Table of contents / outline
    python pdf_reader.py <file.pdf> --info              # Basic PDF info (pages, title, etc.)
    python pdf_reader.py <file.pdf> --chunk-size 5      # Custom chunk size (default: 3)

Designed for Claude to read research papers, textbooks, and technical docs.
Splits large PDFs into manageable chunks so Claude can read them sequentially.
"""

import sys
import os
import json

def ensure_pymupdf():
    """Install PyMuPDF if not available."""
    try:
        import fitz
        return fitz
    except ImportError:
        print("Installing PyMuPDF...", file=sys.stderr)
        os.system(f"{sys.executable} -m pip install PyMuPDF -q")
        import fitz
        return fitz


def get_info(pdf_path):
    """Get basic PDF metadata."""
    fitz = ensure_pymupdf()
    doc = fitz.open(pdf_path)
    meta = doc.metadata
    info = {
        "file": os.path.basename(pdf_path),
        "pages": len(doc),
        "title": meta.get("title", ""),
        "author": meta.get("author", ""),
        "subject": meta.get("subject", ""),
        "creator": meta.get("creator", ""),
    }
    doc.close()
    return info


def get_summary(pdf_path):
    """Extract table of contents and first-page text as summary."""
    fitz = ensure_pymupdf()
    doc = fitz.open(pdf_path)

    # Try to get TOC
    toc = doc.get_toc()

    output = []
    output.append(f"# {os.path.basename(pdf_path)}")
    output.append(f"Pages: {len(doc)}")

    meta = doc.metadata
    if meta.get("title"):
        output.append(f"Title: {meta['title']}")
    if meta.get("author"):
        output.append(f"Author: {meta['author']}")

    if toc:
        output.append("\n## Table of Contents")
        for level, title, page in toc:
            indent = "  " * (level - 1)
            output.append(f"{indent}- [{title}] (page {page})")
    else:
        output.append("\n## No TOC found — showing first page text")
        if len(doc) > 0:
            text = doc[0].get_text()
            output.append(text[:2000])

    doc.close()
    return "\n".join(output)


def read_pages(pdf_path, start=None, end=None, chunk_size=3):
    """Read PDF pages in chunks, yielding text for each chunk."""
    fitz = ensure_pymupdf()
    doc = fitz.open(pdf_path)

    total = len(doc)
    start = start or 1
    end = end or total

    # Clamp to valid range
    start = max(1, min(start, total))
    end = max(start, min(end, total))

    output = []
    output.append(f"# Reading {os.path.basename(pdf_path)}")
    output.append(f"Pages {start}-{end} of {total} (chunk size: {chunk_size})")
    output.append("")

    page_idx = start - 1  # 0-indexed
    while page_idx < end:
        chunk_end = min(page_idx + chunk_size, end)
        chunk_pages = range(page_idx, chunk_end)

        output.append(f"\n{'='*60}")
        output.append(f"## Pages {page_idx + 1}-{chunk_end}")
        output.append(f"{'='*60}\n")

        for i in chunk_pages:
            page = doc[i]
            text = page.get_text()
            if text.strip():
                output.append(f"--- Page {i + 1} ---")
                output.append(text.strip())
                output.append("")

        page_idx = chunk_end

    doc.close()
    return "\n".join(output)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    pdf_path = sys.argv[1]

    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    chunk_size = 3

    # Parse arguments
    if "--info" in sys.argv:
        info = get_info(pdf_path)
        print(json.dumps(info, indent=2))
        return

    if "--summary" in sys.argv:
        print(get_summary(pdf_path))
        return

    if "--chunk-size" in sys.argv:
        idx = sys.argv.index("--chunk-size")
        if idx + 1 < len(sys.argv):
            chunk_size = int(sys.argv[idx + 1])

    # Page range
    start = None
    end = None

    args = [a for a in sys.argv[2:] if not a.startswith("--")]
    if len(args) >= 2:
        start = int(args[0])
        end = int(args[1])
    elif len(args) == 1:
        start = int(args[0])
        end = start + chunk_size - 1

    print(read_pages(pdf_path, start, end, chunk_size))


if __name__ == "__main__":
    main()
