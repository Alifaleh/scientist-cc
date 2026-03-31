#!/usr/bin/env python3
"""Generate vault-index.json from vault markdown files."""

import os
import json
import re
import glob
from datetime import datetime

def generate_index(vault_dir='.scientist/vault'):
    notes = []

    for md_file in glob.glob(f'{vault_dir}/**/*.md', recursive=True):
        if 'Index.md' in md_file:
            continue
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter
        fm = {}
        if content.startswith('---'):
            end = content.find('---', 3)
            if end > 0:
                fm_text = content[3:end]
                for line in fm_text.split('\n'):
                    if ':' in line and not line.strip().startswith('-'):
                        key, val = line.split(':', 1)
                        fm[key.strip()] = val.strip().strip('"')

        # Extract tags
        tags = []
        tag_match = re.search(r'tags:\s*\[(.*?)\]', content)
        if tag_match:
            tags = [t.strip() for t in tag_match.group(1).split(',')]

        # Extract summary from callout
        summary = ''
        callout = re.search(r'>\s*\[!note\].*?\n>\s*(.*)', content)
        if callout:
            summary = callout.group(1).strip()

        rel_path = os.path.relpath(md_file, vault_dir).replace('\\', '/')

        notes.append({
            'path': rel_path,
            'title': fm.get('title', os.path.basename(md_file).replace('.md', '')),
            'tags': tags,
            'status': next((t.split('/')[1] for t in tags if t.startswith('status/')), None),
            'date': fm.get('date', None),
            'last_verified': fm.get('last_verified', None),
            'summary': summary[:150] if summary else None
        })

    index = {
        'generated': datetime.now().isoformat(),
        'note_count': len(notes),
        'notes': sorted(notes, key=lambda n: n.get('date') or '', reverse=True)
    }

    output_path = f'{vault_dir}/vault-index.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2)

    print(f'Generated {output_path}: {len(notes)} notes indexed')
    for n in index['notes']:
        s = n['summary'][:50] if n['summary'] else '(no summary)'
        status = n['status'] or '?'
        print(f'  {n["path"]}: [{status}] {s}')


if __name__ == '__main__':
    generate_index()
