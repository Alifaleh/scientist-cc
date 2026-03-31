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

        # Count wikilinks as a proxy for connectivity
        link_count = len(re.findall(r'\[\[.*?\]\]', content))

        notes.append({
            'path': rel_path,
            'title': fm.get('title', os.path.basename(md_file).replace('.md', '')),
            'tags': tags,
            'status': next((t.split('/')[1] for t in tags if t.startswith('status/')), None),
            'date': fm.get('date', None),
            'last_verified': fm.get('last_verified', None),
            'link_count': link_count,
            'summary': summary[:150] if summary else None
        })

    # Compute relevance scores (H6: weighted retrieval)
    today = datetime.now().strftime('%Y-%m-%d')
    for note in notes:
        recency = 1.0  # default
        if note['date']:
            try:
                days_old = (datetime.now() - datetime.strptime(note['date'], '%Y-%m-%d')).days
                recency = max(0.1, 1.0 - (days_old / 90))  # decay over 90 days
            except ValueError:
                pass

        importance = 0.5
        if any('priority/high' in t for t in note['tags']):
            importance = 1.0
        elif any('principle' in t for t in note['tags']):
            importance = 0.8
        elif note['status'] == 'untested':
            importance = 0.9  # untested hypotheses are high priority

        connectivity = min(1.0, note['link_count'] / 10)  # normalize to 0-1

        note['relevance_score'] = round(
            recency * 0.4 + importance * 0.35 + connectivity * 0.25, 3
        )

    index = {
        'generated': datetime.now().isoformat(),
        'note_count': len(notes),
        'notes': sorted(notes, key=lambda n: n.get('relevance_score', 0), reverse=True)
    }

    output_path = f'{vault_dir}/vault-index.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2)

    print(f'Generated {output_path}: {len(notes)} notes indexed')
    for n in index['notes']:
        s = n['summary'][:40] if n['summary'] else '(no summary)'
        status = n['status'] or '?'
        score = n.get('relevance_score', 0)
        print(f'  {score:.2f} [{status:>12}] {n["path"]}')


if __name__ == '__main__':
    generate_index()
