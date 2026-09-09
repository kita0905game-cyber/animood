# AniMood development
Before work run python tools/check_rules.py. Read/reconcile changed upstream rules before --accept-reviewed; never acknowledge unread changes.
Read START_HERE_PC_LUNA.md, PROJECT_CONTEXT.md, DATA_SCHEMA.md, RECOMMENDATION_RULES.md, AIRTABLE_MAPPING.md, PC_WORK_HANDOFF.md, OPERATIONS.md, ANIMOOD_TAG_TO_MATCH_v0.1.md.
GitHub rules/code and Airtable editorial data are canonical. Public eligibility is English Title + General Tags. Editor's Take requires formal approval and Public Ready. Keep the initial ten approvals; never fabricate reviews or expose operator identity/private notes.
Generate data with scripts/export-airtable.mjs; no manual edits to data/anime.json. Snapshots stay in .local/. Use static build allowlist. Test with node --test tests/v05.test.mjs and desktop/mobile checks.
Do not claim remote daily sync or external analytics is operational until verified. No paid services or AI API are needed.
