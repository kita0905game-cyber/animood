"""Build a static allowlist; rule docs and private snapshots never ship."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
FILES = ['index.html','assets/app.js','assets/style.css','assets/engine.js',
         'data/anime.json','data/export-manifest.json']
def main():
    out = ROOT/'.local/site'
    if out.exists():
        shutil.rmtree(out)
    for name in FILES:
        target = out/name
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(ROOT/name,target)
    print('Built static site at .local/site')
if __name__ == '__main__':
    main()
