"""Export a complete connector snapshot; never writes to Airtable."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AXES = {'Pace':'pace', 'Heaviness':'heaviness', 'Gore':'gore',
        'Emotional':'emotional', 'Funny':'funny', 'Foreshadowing Payoff':'foreshadowingPayoff',
        'Worldbuilding':'worldbuilding', 'Characters':'characters', 'Mystery':'mystery',
        'Action':'action', 'Ambiguity':'ambiguity'}
TRAITS = {'Emotional':'emotional','Funny':'funny','Foreshadowing Payoff':'foreshadow',
          'Worldbuilding':'world','Characters':'characters','Mystery':'mystery','Action':'action'}
FLAGS = {'グロ強め':'gore','重すぎる':'dark','序盤が遅い':'slowstart','曖昧な結末':'unclear',
         '3DCG主体':'cgi','長すぎる':'long','未完結':'unfinished'}
FIT_KEYS = {'mind','tension','cozy','badass','slow','balanced','fast','light','medium','heavy'}

def choice(v):
    return v.get('name') if isinstance(v, dict) else v

def scalar(v):
    if v is None:
        return None
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not 1 <= v <= 5:
        raise ValueError('Score must be null or 1–5')
    return v

def export(snapshot):
    records = snapshot.get('records', [])
    if (snapshot.get('complete') is not True or snapshot.get('totalRecordCount') != len(records)
        or snapshot.get('baseId') != 'appXkCYzNbv1LDV6O'
        or snapshot.get('tableId') != 'tblokhzcBwhVIZwTv'):
        raise ValueError('A complete snapshot of the canonical table is required')
    output, rejected = [], []
    seen = set()
    for record in records:
        if record['id'] in seen:
            raise ValueError('Duplicate record in snapshot')
        seen.add(record['id'])
        f = record['fields']
        if choice(f.get('Evaluation Status')) != '評価済み' or f.get('Public Ready') is not True:
            continue
        try:
            if choice(f.get('Viewing State')) == '未視聴':
                raise ValueError('Unwatched title cannot be a completed user evaluation')
            if choice(f.get('Confidence')) not in ('中','高') or choice(f.get('Provenance')) not in ('ユーザー明示','AI暫定推定','客観情報'):
                raise ValueError('Missing provenance or insufficient confidence')
            if not f.get('Core Appeal') or not f.get('Evaluation Evidence'):
                raise ValueError('Missing public explanation or approval evidence')
            p = json.loads(f.get('Public Profile') or '{}')
            if p.get('schemaVersion') != 1:
                raise ValueError('Public Profile schemaVersion must be 1')
            for lang in (p, p.get('ja', {})):
                if any(not isinstance(lang.get(k), str) or not lang[k].strip() for k in ('title','reason')):
                    raise ValueError('English and Japanese public copy required')
                if not isinstance(lang.get('tags'), list) or not all(isinstance(t,str) for t in lang['tags']):
                    raise ValueError('Invalid public tags')
            if p['ja']['reason'] != f['Core Appeal']:
                raise ValueError('Public copy must match the current Core Appeal; review translations')
            scores = {key:scalar(f.get(field)) for field,key in AXES.items()}
            if sum(v is not None for v in scores.values()) < 7:
                raise ValueError('At least seven explicit axes required')
            fit = p.get('experienceFit', {})
            if not isinstance(fit, dict) or set(fit) - FIT_KEYS:
                raise ValueError('Unknown experience-fit key')
            traits = {k:scalar(v) for k,v in fit.items()}
            traits.update({key:scalar(f.get(field)) for field,key in TRAITS.items()})
            traits['ambiguity'] = scores['ambiguity']
            flags = [FLAGS[choice(v)] for v in (f.get('Dealbreakers') or [])]
            item = {k:p[k] for k in ('id','title','reason','tags')}
            if not isinstance(item['id'], str) or not item['id']:
                raise ValueError('Stable public ID required')
            item.update(ja=p['ja'],traits=traits,flags=flags,scores=scores,
                        moodTags=[choice(v) for v in (f.get('Mood Tags') or [])],
                        storyTags=[choice(v) for v in (f.get('Story Tags') or [])],
                        evaluationStatus='評価済み',publicReady=True,
                        provenance=choice(f.get('Provenance')),confidence=choice(f.get('Confidence')))
            output.append(item)
        except (KeyError, TypeError, ValueError) as exc:
            rejected.append({'id':record['id'],'reason':str(exc)})
    if rejected:
        raise ValueError('Public Ready records need review: ' + json.dumps(rejected,ensure_ascii=False))
    if len({a['id'] for a in output}) != len(output):
        raise ValueError('Duplicate public IDs')
    return sorted(output, key=lambda a:a['id'])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('snapshot', type=Path)
    args = parser.parse_args()
    data = json.loads(args.snapshot.read_text(encoding='utf-8-sig'))
    result = export(data)
    payload = json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    target = ROOT/'data/anime.json'
    temporary = target.with_suffix('.tmp')
    temporary.write_text(payload,encoding='utf-8')
    temporary.replace(target)
    manifest = {'schemaVersion':1,'source':'Airtable','fetchedAt':data['fetchedAt'],
                'sourceRecords':len(data['records']),'publicRecords':len(result),
                'sha256':hashlib.sha256(payload.encode()).hexdigest()}
    (ROOT/'data/export-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print(f'Exported {len(result)} approved records; private notes excluded.')

if __name__ == '__main__':
    main()
