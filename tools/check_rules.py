"""Fetch upstream rules and fail closed until changed rules are reviewed."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RULES = ['AGENTS.md','PROJECT_CONTEXT.md','DATA_SCHEMA.md','RECOMMENDATION_RULES.md',
         'AIRTABLE_MAPPING.md','PC_WORK_HANDOFF.md','OPERATIONS.md','CHANGELOG.md',
         'START_HERE_PC_LUNA.md','ANIMOOD_TAG_TO_MATCH_v0.1.md','data/tag_scoring.json']

def git(*args):
    return subprocess.check_output(['git',*args],cwd=ROOT)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--accept-reviewed',action='store_true',help='Only after reading and resolving every rule change')
    args = p.parse_args()
    git('fetch','origin','main')
    hashes = {}
    for name in RULES:
        remote = git('show',f'origin/main:{name}').replace(b'\r\n',b'\n')
        local = (ROOT/name).read_bytes().replace(b'\r\n',b'\n')
        if local != remote:
            raise SystemExit(f'Local/upstream rule mismatch: {name}. Read git diff origin/main -- {name}; reconcile before work.')
        hashes[name] = hashlib.sha256(remote).hexdigest()
    state = ROOT/'.local/rules-reviewed.json'
    previous = json.loads(state.read_text()) if state.exists() else {}
    changed = [name for name,h in hashes.items() if previous.get('hashes',{}).get(name) != h]
    if changed and not args.accept_reviewed:
        raise SystemExit('Review required: '+', '.join(changed)+'. Read the files/diff, then use --accept-reviewed.')
    if args.accept_reviewed:
        state.parent.mkdir(exist_ok=True)
        state.write_text(json.dumps({'commit':git('rev-parse','origin/main').decode().strip(),'hashes':hashes},indent=2))
    print('Canonical rules verified against origin/main.')

if __name__ == '__main__':
    main()
