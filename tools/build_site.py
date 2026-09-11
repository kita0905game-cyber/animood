"""Build a static allowlist; rule docs and private snapshots never ship."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
FILES = ['index.html','assets/app.js','assets/style.css','assets/engine.js',
         'data/anime.json','data/tag_scoring.json']
def main():
    out = ROOT/'.local/site'
    if out.exists():
        resolved = out.resolve()
        if not resolved.is_relative_to((ROOT/'.local').resolve()):
            raise ValueError('Unexpected output path')
        for child in resolved.iterdir():
            if child.is_symlink():
                child.unlink()
            elif child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    for name in FILES:
        target = out/name
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(ROOT/name,target)
    source = (ROOT/'index.html').read_text(encoding='utf-8')
    pages = {
        'anime-like-steins-gate': (
            'Anime like Steins;Gate — Choose what you loved | AniMood',
            'Find anime through the payoff, time-travel rules and tension you loved in Steins;Gate.',
            '''<section class="seo-content guide"><p class="eyebrow">ANIME LIKE STEINS;GATE</p>
            <h2>Which part stayed with you?</h2><p>A shared time-travel setting is only one connection.
            Start with the part of Steins;Gate you want to experience again, then compare the reasons behind each result.</p>
            <ul><li><strong>Foreshadowing and payoff:</strong> prioritize recorded mystery, plot-twist and payoff signals.</li>
            <li><strong>Time-travel rules:</strong> follow time-travel or time-loop stories, rather than all science fiction.</li>
            <li><strong>Tension:</strong> emphasize thriller and uncertainty signals. This can lead outside time travel.</li></ul>
            <p>Character and emotional connections need supporting tags. When a reason is not recorded, the tool tells you instead of inventing it.</p>
            <p>Choose up to three reasons above. The original work is excluded, and your filters still come first. Read the trade-offs before deciding.</p>
            <a href="/?mode=mood">Prefer to start with tonight’s mood? →</a></section>'''),
        'anime-recommendation-quiz': (
            'Anime recommendation quiz — Mood first | AniMood',
            'An anime quiz with explainable mood matches, taste preferences and content filters.',
            '''<section class="seo-content guide"><p class="eyebrow">ANIME RECOMMENDATION QUIZ</p>
            <h2>A useful answer starts with a better question.</h2>
            <p>Instead of asking for a favorite genre, AniMood starts with tonight: a puzzle, comfort, energy or an emotional story?</p>
            <ol><li>Choose one or two moods. Two choices combine their recorded tag signals.</li>
            <li>Open the conditions to choose pace, episode length or exclusions.</li>
            <li>Compare up to three results, with matching tags, reasons and cautions.</li></ol>
            <h3>Tonight’s mood versus lasting taste</h3><p>Your mood can change tomorrow. Use My taste for recurring interests such as worldbuilding,
            mystery or comedy. Those choices stay on your device and can be cleared anytime.</p>
            <h3>What the match means</h3><p>This is a tag-based comparison, not a prediction of enjoyment or a review score.
            Tags are an editorial starting point. Missing metadata stays unknown; a missing caution tag never guarantees content is absent.</p>
            <p>Finished-only means recorded airing is finished and no unfinished-story tag is present. It does not promise every source-material storyline has been adapted.</p></section>''')
    }
    for slug, (title, description, section) in pages.items():
        html = source.replace('AniMood — What should I watch tonight?', title)
        html = html.replace('Choose an anime by the mood and story experience you want. Explore a growing catalog with clear reasons and content notes.', description)
        html = html.replace('href="https://animood.pages.dev/"', f'href="https://animood.pages.dev/{slug}/"').replace('<footer>', section+'<footer>')
        dest = out/slug/'index.html'
        dest.parent.mkdir(exist_ok=True)
        dest.write_text(html,encoding='utf-8')
    urls = ['https://animood.pages.dev/']+[f'https://animood.pages.dev/{slug}/' for slug in pages]
    (out/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>')
    (out/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://animood.pages.dev/sitemap.xml\n')
    print('Built static site and two focused landing pages.')
if __name__ == '__main__':
    main()
