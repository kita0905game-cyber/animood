# PC work handoff
Read START_HERE_PC_LUNA.md, PROJECT_CONTEXT.md, DATA_SCHEMA.md, RECOMMENDATION_RULES.md, AIRTABLE_MAPPING.md and OPERATIONS.md.
GitHub rules/code and Airtable editorial data are canonical.

Implementation: 368-tag catalog, bilingual Mood/Taste/Like routes, explainable matching, local taste/feedback/events, two focused landing pages, static allowlist build and export privacy checks.
The ten formal approvals remain. Catalog inclusion does not imply formal evaluation. Editor notes are optional and gated.

Daily sync is staged. AIRTABLE_PAT must be a GitHub Actions secret with read access only to AniMood. First verify workflow_dispatch, then set ANIMOOD_SYNC_ENABLED=true for daily JST 05:17. Never claim remote sync without a successful run.
External funnel analytics is not connected; track() records device-local counters and emits an in-page event only.
