# AniMood — PC Work Handoff

Last updated: 2026-09-09

## Start Here

Your role is **AniMood PC development lead**.

Before implementation, read in this order:
1. `PROJECT_CONTEXT.md`
2. `DATA_SCHEMA.md`
3. `RECOMMENDATION_RULES.md`
4. `AIRTABLE_MAPPING.md`

These files define the current project rules.

## Current Architecture

- GitHub repository = source of truth for rules, specification, code, and build logic
- Airtable = source of truth for anime evaluation data
- GitHub JSON = site-consumable output generated from approved Airtable records
- Smartphone Luna = user interview/evaluation collection and product planning
- PC Work = Airtable review, implementation, GitHub updates, site testing/deployment

Repository:
`kita0905game-cyber/animood`

## Airtable State

The AniMood Airtable `Anime` table contains **368 records**.

Verified on 2026-09-09:
- record count = 368
- every record has `Evaluation Status = 未評価`

This is intentional.

Old classifications such as:
- ⭐ 特に好き
- ❤️ 好き
- 😐 普通
- ❌ 合わなかった

are only `Legacy Category`.
They must not be treated as formal AniMood ratings.

Past impressions are `Reference Notes` only unless explicitly re-confirmed through the formal evaluation workflow.

## Important Correction to Older Prototypes

Earlier AniMood prototypes used structured/provisional data for a small seed set.

That data is **not canonical formal evaluation data**.

Do not assume the initial 10 titles are already evaluated.
They remain `未評価` unless Airtable later says otherwise.

If the current web prototype needs sample records for UI development:
- keep them as development fixtures/demo data, or
- clearly separate them from canonical production data.

Do not publicly imply that a provisional fixture is a completed user evaluation.

## Standard Update Workflow

When working on AniMood:

1. Read the GitHub canonical rule docs.
2. Read the latest Airtable Anime records needed for the task.
3. Identify records satisfying public export rules.
4. Generate/update site JSON from Airtable.
5. Update recommendation logic only in ways consistent with `RECOMMENDATION_RULES.md`.
6. Test desktop and mobile.
7. Commit rule/code/data-output changes to GitHub.
8. Deploy through the static hosting pipeline.

Never require the user to manually shuttle JSON files between smartphone Luna and PC Work for routine evaluation updates.

## Public Export Default

Only export a record into production recommendations when:
- `Evaluation Status = 評価済み`
- `Public Ready = true`

Do not silently relax this because the catalog is small.

## Cost / Technical Constraints

- Fixed additional cost target: ¥0
- Static HTML/CSS/JS is preferred initially
- No paid AI API inside the public website initially
- Avoid backend unless product need proves it necessary
- Do not depend on AniList API as the canonical database
- Prefer Cloudflare Pages/static deployment
- No custom domain is required during early validation

## Public UI

Public-facing product is English-first.
Internal discussion with the user is Japanese.

When writing public English:
- localize naturally
- keep wording concise
- avoid generic “AI recommendation” style
- focus on concrete viewing experience
- avoid spoilers

## Copyright

Do not add official anime screenshots, key art, character art, or other copyrighted visuals without clear rights.
Use original UI/graphics/text instead.

## Immediate PC Work Priorities

1. Put these canonical Markdown files at the repository root.
2. Inspect the current v0.2 repository structure.
3. Separate demo/fixture recommendation data from canonical production data.
4. Prepare an Airtable → site JSON mapping/export path.
5. Keep the site usable while formal evaluations are added incrementally.
6. Do not block development waiting for all 368 titles to be evaluated.

The next meaningful data milestone is to grow the number of **formally evaluated + Public Ready** titles, not merely the number of records in the database.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.
