# AniMood Changelog

## 2026-09-09 — Canonical data architecture established

- Defined GitHub as the source of truth for rules/specification.
- Defined Airtable as the source of truth for anime evaluation data.
- Defined GitHub JSON as website/build output rather than editorial source.
- Created AniMood Airtable Anime table schema.
- Imported and verified 368 anime records.
- Set all 368 records to formal `Evaluation Status = 未評価`.
- Preserved prior preference classifications as `Legacy Category`.
- Preserved historical impressions as `Reference Notes`.
- Separated `Viewing State` from formal evaluation state.
- Documented formal evaluation and public-release rules.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.

## 2026-09-09 — Final handoff
- 368-title tag catalog; prior ten formal approvals preserved.
- Bilingual Mood/Taste/Like routes, actual tag explanations, local event hooks.
- Two focused landing pages, idempotent private-field-safe export, gated daily workflow.
- Remote workflow requires secret/manual verification; external analytics awaits configuration.
