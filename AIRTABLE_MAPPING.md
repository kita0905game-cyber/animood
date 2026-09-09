# AniMood Airtable Mapping

Last updated: 2026-09-09

## Canonical Location

- Base: `AniMood`
- Base ID: `appXkCYzNbv1LDV6O`
- Table: `Anime`
- Table ID: `tblokhzcBwhVIZwTv`

The Airtable Anime table is the **editorial source of truth for anime data**.

Current verified record count: **368**
Current formal evaluation state: **all 368 = 未評価**

## Key Fields

| Airtable field | Purpose |
|---|---|
| Title | Primary work title |
| List No | Legacy-list sequence |
| Legacy Category | Historical preference only |
| Viewing State | Watched / unwatched / partial / unclear |
| Evaluation Status | Formal AniMood workflow state |
| Reference Notes | Old notes/context; not formal evaluation |
| User Review | User's formal free-form review |
| Core Appeal | Structured summary |
| Mood Tags | Desired-experience tags |
| Story Tags | Story-value tags |
| Pace | 1–5 |
| Heaviness | 1–5 |
| Gore | 1–5 |
| Emotional | 1–5 |
| Funny | 1–5 |
| Foreshadowing Payoff | 1–5 |
| Worldbuilding | 1–5 |
| Characters | 1–5 |
| Mystery | 1–5 |
| Action | 1–5 |
| Ambiguity | 1–5 |
| Dealbreakers | Hard/strong negative traits |
| Provenance | Source of structured evaluation |
| Confidence | Low / medium / high |
| Public Ready | Eligible for public export |
| Updated At | Last meaningful update |

## PC Work Read / Export Procedure

1. Read Airtable before changing public anime data.
2. Treat GitHub JSON as generated/output data.
3. For public export, default to:
   - `Evaluation Status = 評価済み`
   - `Public Ready = true`
4. Preserve nulls for unknown values.
5. Never map Legacy Category into formal score fields.
6. Never promote a record to 評価済み automatically.
7. If schema/rule changes are required, update the GitHub rule docs first or in the same commit.

## Suggested Site JSON Shape

```json
{
  "title": "Example",
  "coreAppeal": "...",
  "moodTags": [],
  "storyTags": [],
  "scores": {
    "pace": null,
    "heaviness": null,
    "gore": null,
    "emotional": null,
    "funny": null,
    "foreshadowingPayoff": null,
    "worldbuilding": null,
    "characters": null,
    "mystery": null,
    "action": null,
    "ambiguity": null
  },
  "dealbreakers": [],
  "confidence": "高"
}
```

The final site JSON schema may differ, but it should be generated consistently from Airtable rather than manually maintained in two places.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.
