# AniMood Project Context

Last updated: 2026-09-09

## 1. Project
AniMood is a mood-first anime discovery product for overseas users.

Core question:
**What should I watch tonight?**
（今夜、何を観ればいい？）

AniMood should help users decide by desired experience, mood, pacing, story payoff, atmosphere, and deal-breakers rather than by genre alone.

## 2. Source of Truth

AniMood deliberately separates rules from data.

- **GitHub = rules/specification source of truth**
- **Airtable = anime evaluation data source of truth**
- **GitHub `data/*.json` = generated/public website data**
- **Smartphone Luna = planning, interview/evaluation collection, idea refinement**
- **PC Work = implementation, Airtable review, JSON generation, GitHub updates, site maintenance**

Never treat both Airtable and GitHub JSON as editorial sources of truth at the same time.
When they differ, Airtable wins for anime evaluation data and GitHub Markdown wins for project rules.

## 3. Current Data State

The Airtable Anime table contains **368 titles** from the existing anime list.

As of 2026-09-09:
- All 368 titles have AniMood `Evaluation Status = 未評価`.
- Old classifications such as ⭐ 特に好き / ❤️ 好き / 😐 普通 / ❌ 合わなかった are stored only as **Legacy Category**.
- Legacy Category is historical/reference information, not a formal AniMood evaluation.
- Past conversational impressions may be stored as **Reference Notes**, but do not make a title evaluated.

## 4. Formal Evaluation States

Only these values are valid:

- `未評価` = no formal AniMood evaluation completed
- `評価中` = formal evaluation is in progress
- `評価済み` = AniMood evaluation workflow has been completed

A title must never be promoted to `評価済み` merely because an old preference or past comment exists.

## 5. Formal Evaluation Workflow

User workload should stay low.

Default workflow:
1. User gives a free-form impression.
2. Luna asks only 3–5 targeted questions needed to resolve important gaps.
3. Luna structures the answers into the AniMood schema.
4. Inferences must be distinguishable from user-explicit statements.
5. User corrects only materially wrong interpretations.
6. Only then may the record become `評価済み`.
7. `Public Ready` is enabled only after the public-facing recommendation data is spoiler-safe and sufficiently confident.

## 6. Product Principles

### Mood first, genre second
Do not begin with “SF / fantasy / isekai?” as the main recommendation route.

Prefer questions such as:
- 頭を使いたい
- ハラハラしたい
- 感動したい
- 癒されたい
- カッコいい作品が見たい
- 笑いたい

### Important distinctions
Keep these concepts separate:
- clean foreshadowing payoff vs unresolved ambiguity
- gore/graphic content vs emotional heaviness
- action intensity vs overall pace
- user-explicit opinion vs AI inference
- viewing state vs evaluation state
- legacy preference vs AniMood formal evaluation

## 7. Public Product

Initial product:
- English-first public UI
- spoiler-free recommendations
- top 1–3 results
- match explanation and tags
- static site
- no backend required initially
- no paid API required initially
- fixed additional cost target: **¥0**

Project discussion and maintenance can remain Japanese.
English copy should be natural localization, not literal Japanese translation.

## 8. Copyright / Integrity

- Do not use official anime screenshots, key art, character art, or copyrighted promotional images unless permission/license is clear.
- Prefer original interface graphics, typography, and text.
- Do not fabricate a user's viewing experience.
- Do not claim official affiliation with anime studios, publishers, streaming services, or IP owners.
- Do not publish unsupported hearsay as factual metadata.
- Streaming availability is volatile and should not be a core canonical field.
- Do not make AniMood dependent on AniList or another third-party anime API.

## 9. Development Strategy

Build recommendation logic and the website in parallel.

Suggested growth:
- v0.2: prototype / foundation
- v0.3: ~20 formally evaluated titles
- v0.4: ~30 formally evaluated titles
- UX refinement
- v1.0: ~50 formally evaluated titles and public validation

Do not wait for hundreds of completed records before improving the product.
Do not monetize before there is evidence of real usage.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.
