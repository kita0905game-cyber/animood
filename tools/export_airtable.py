"""Compatibility entry point for current tag-based export."""
from pathlib import Path
import subprocess,sys
if __name__=='__main__':
 if len(sys.argv)!=2:raise SystemExit('Provide a complete current snapshot.')
 raise SystemExit(subprocess.call(['node','scripts/export-airtable.mjs','--snapshot',sys.argv[1]],cwd=Path(__file__).resolve().parents[1]))
