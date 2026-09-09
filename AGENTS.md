# AniMood development instructions

Before implementation or data export, run `python tools/check_rules.py`.
If it fails, do not assume cached rules are current. Fetch/read/reconcile changed
GitHub rule documents. Only then run `python tools/check_rules.py --accept-reviewed`.
This is a work-start check, not a continuous cloud watcher.

Read PROJECT_CONTEXT.md, DATA_SCHEMA.md, RECOMMENDATION_RULES.md,
AIRTABLE_MAPPING.md, PC_WORK_HANDOFF.md and OPERATIONS.md.
GitHub Markdown is canonical for rules; Airtable is canonical for editorial data.
Never edit data/anime.json manually. Export through tools/export_airtable.py.
Never expose raw Airtable snapshots, approval evidence, user reviews or credentials.
Keep snapshots under .local/ (gitignored).

The initial ten titles were explicitly approved by the user on 2026-09-09.
They are formal production records, not demo fixtures. AI-origin values retain
their provenance. Do not undo approval based on the earlier ZIP snapshot.
Do not automatically approve any additional titles.

Validate with `python -m unittest discover -s tests`, `node tests/engine.test.js`,
and desktop/mobile browser checks. Publish the explicit allowlisted website files
via tools/build_site.py if using an artifact, excluding raw/private source data.
