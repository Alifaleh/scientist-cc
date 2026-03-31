#!/usr/bin/env python3
"""Generate vault-index.json from vault markdown files."""

import sys
import io
import os
import json

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
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
        # Count typed links specifically
        typed_links = len(re.findall(r'\[\[(supports|contradicts|extends)::', content))

        notes.append({
            'path': rel_path,
            'title': fm.get('title', os.path.basename(md_file).replace('.md', '')),
            'tags': tags,
            'status': next((t.split('/')[1] for t in tags if t.startswith('status/')), None),
            'date': fm.get('date', None),
            'last_verified': fm.get('last_verified', None),
            'link_count': link_count,
            'typed_links': typed_links,
            'evolved_on': fm.get('evolved_on', None),
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
        status = n['status'] or '?'
        score = n.get('relevance_score', 0)
        print(f'  {score:.2f} [{status:>12}] {n["path"]}')

    # Meta-metrics (H7)
    if '--metrics' in sys.argv or len(notes) > 0:
        total_links = sum(n['link_count'] for n in notes)
        avg_links = total_links / len(notes) if notes else 0
        principles = sum(1 for n in notes if 'principle' in str(n['tags']))
        hypotheses = sum(1 for n in notes if 'hypothesis' in str(n['tags']))
        research = sum(1 for n in notes if 'research' in str(n['tags']))
        observations = sum(1 for n in notes if 'observation' in str(n['tags']))
        untested = sum(1 for n in notes if n['status'] == 'untested')
        implemented = sum(1 for n in notes if n['status'] == 'implemented')

        print(f'\n--- Meta-Metrics ---')
        print(f'  Link density: {avg_links:.1f} links/note ({total_links} total)')
        print(f'  Notes: {research} research, {observations} observations, {hypotheses} hypotheses, {principles} principles')
        print(f'  Hypotheses: {untested} untested, {implemented} implemented')
        total_typed = sum(n['typed_links'] for n in notes)
        evolved = sum(1 for n in notes if n.get('evolved_on'))
        if research > 0:
            print(f'  Principle extraction rate: {principles/research:.1f} principles per research note')
        print(f'  Typed links: {total_typed} (supports/contradicts/extends)')
        print(f'  Evolved notes: {evolved} (backward evolution applied)')

        # Mastery stage check
        understood = sum(1 for n in notes if n['status'] == 'understood')
        s2 = [understood >= 10, avg_links >= 3.0, total_typed >= 15]
        s3 = [understood >= 25, principles >= 10, total_typed >= 50]
        s4 = [evolved >= 10]  # partial — Stage 4 is mostly qualitative

        if all(s3):
            stage = 3
            print(f'\n--- Stage 3 (Expert) ACHIEVED ({sum(s3)}/3) ---')
            print(f'  ✓ Research: {understood}/25 | ✓ Principles: {principles}/10 | ✓ Typed: {total_typed}/50')
            print(f'  Stage 4 requires: 3+ novel contributions, 5+ confirmed hypotheses, 10+ evolved notes')
            print(f'  Novel findings: check vault Observations for "novel-finding" tag')
            print(f'  Evolved notes: {evolved}/10')
        elif all(s2):
            stage = 2
            print(f'\n--- Stage 2 (Practitioner) — {sum(s3)}/3 toward Stage 3 ---')
            for label, met, val, target in [('Research', s3[0], understood, 25), ('Principles', s3[1], principles, 10), ('Typed links', s3[2], total_typed, 50)]:
                print(f'  {"✓" if met else "✗"} {label}: {val}/{target}')
        else:
            stage = 1
            print(f'\n--- Stage 1 (Beginner) — {sum(s2)}/3 toward Stage 2 ---')
            for label, met, val, target in [('Research', s2[0], understood, 10), ('Density', s2[1], avg_links, 3.0), ('Typed', s2[2], total_typed, 15)]:
                print(f'  {"✓" if met else "✗"} {label}: {val}/{target}')

        index['meta_metrics'] = {
            'link_density': round(avg_links, 1),
            'total_links': total_links,
            'principle_extraction_rate': round(principles / research, 2) if research > 0 else 0,
            'hypotheses_untested': untested,
            'hypotheses_implemented': implemented,
            'note_breakdown': {'research': research, 'observations': observations, 'hypotheses': hypotheses, 'principles': principles}
        }
        # Re-write with metrics
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2)


if __name__ == '__main__':
    generate_index()
