# AniMood operating procedure

## Rule updates

Before each work session, fetch origin/main and run `python tools/check_rules.py`.
It compares upstream rule files, local copies and the last reviewed hashes. A failed
fetch or changed/missing rule stops verification. Read the changes, reconcile the
local checkout, then acknowledge with `--accept-reviewed`. Never acknowledge blindly.
This detects changes when development starts; it does not monitor while idle.
Phone Luna must place rule changes in GitHub (or send them for a GitHub update).
Changes made only to a ChatGPT source ZIP cannot be detected by this mechanism.

## Data refresh (PC handles this; no user file shuttling)

1. Use the connected Airtable tools: search_bases, list_tables_for_base, then
   list_records_for_table. Resolve field IDs from the live schema; paginate to the end.
2. Normalize field IDs to field names. Preserve select objects or their names and
   nulls. Write a private .local/airtable.json snapshot shaped as:
   `{complete:true,baseId,tableId,fetchedAt,totalRecordCount,records:[{id,fields:{...}}]}`.
   Mark complete only after pagination is exhausted and counts/IDs are checked.
3. Read Evaluation Status, Public Ready, Viewing State, Confidence, Provenance,
   Core Appeal, Evaluation Evidence, Public Profile, all eleven scalar axes,
   Mood Tags, Story Tags and Dealbreakers. Do not fetch private notes unnecessarily.
4. Run `python tools/export_airtable.py .local/airtable.json`.
   Only 評価済み + Public Ready records export. Invalid approved records stop the
   entire export rather than silently disappear. Unrated records are excluded.
5. Run tests, check English/Japanese on desktop/mobile, review diffs, publish.
   Commit data/export-manifest.json with data/anime.json for freshness traceability.

## Public Profile and approval evidence

Public Profile is an Airtable multiline JSON field (schemaVersion 1):
`{schemaVersion:1,id,title,reason,tags,ja:{title,reason,tags},experienceFit:{...}}`.
English/Japanese text is editorial copy in Airtable, not a second GitHub data source.
ja.reason must match Core Appeal. When updating Core Appeal, review both languages.
Evaluation Evidence stores approval/source history separately from User Review.
Never fabricate a free-form user review from an approval message.

The initial ten records were explicitly accepted as formal and public by the user
on 2026-09-09 in the AniMood development task. Their seven directly corresponding
axes were transferred without changing values. Provenance remains AI暫定推定 and
Confidence is 中: approval is not a claim the user personally supplied every number.
Mood/Story tags use existing fit values >= 4 as a deterministic summary.

Approved legacy experienceFit values are preference-fit vectors (1–5), NOT intensity
measurements. Keys: mind,tension,cozy,badass,slow,balanced,fast,light,medium,heavy.
Do not convert them into Pace/Heaviness/Gore/Ambiguity intensity scores. Those remain
null until separately evaluated. Emotional/Funny and five story axes come from the
named scalar Airtable fields, which take precedence during export.
New records need at least seven measured scalar fields, both-language public copy,
approval evidence, medium/high confidence, provenance, and the public-release gates.

## Matching and safety

Known dealbreaker conflicts exclude a title before ranking. A missing flag is not
proof of safety: warn that content checks are incomplete when a requested intensity
or ambiguity check lacks data. Unknown values never become zero/neutral scores.
Omit unknown dimensions from calculation; do not show a percentage as certainty.
Ambiguity is separate from foreshadowing payoff; gore is separate from heaviness.

## Deployment and secrets

No AI API, paid service or backend is introduced. Airtable access stays in PC tools;
no tokens belong in browser code, GitHub, exported JSON or the static build.
`python tools/build_site.py` creates .local/site/ with only index.html, assets/app.js,
assets/style.css, assets/engine.js, data/anime.json and data/export-manifest.json.
For Cloudflare's Git build use `python3 tools/build_site.py` and output `.local/site`.
No unattended sync is claimed: refresh is performed when PC works on data.
