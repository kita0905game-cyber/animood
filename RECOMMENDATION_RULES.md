# AniMood Recommendation Rules

Last updated: 2026-09-09

## 1. Goal

Recommend the anime that best fits **the experience the user wants now**, not merely the genre they usually watch.

Primary product question:
**What should I watch tonight?**
（今夜、何を観ればいい？）

## 2. Input Priority

Recommendation inputs should generally be considered in this order:

1. Hard deal-breakers
2. Desired mood / experience
3. Desired story payoff
4. Pace preference
5. Emotional heaviness tolerance
6. Secondary attributes such as action, mystery, worldbuilding, comedy, atmosphere

Do not overfit to genre.

## 3. Hard Constraints First

Examples:
- user says no heavy CGI → strongly penalize or exclude 3DCG主体
- user says no gore → strongly penalize グロ強め
- user wants completed story → penalize/exclude 未完結
- user has limited time → penalize 長すぎる

A title with a high mood match should not win if it violates an explicit deal-breaker.

## 4. Mood Match

Mood/experience is the primary positive signal.

Starter intents:
- 頭を使いたい
- ハラハラしたい
- 感動したい
- 癒されたい
- カッコいい作品が見たい
- 笑いたい

The vocabulary can grow, but avoid creating synonyms that fragment scoring.

## 5. Story Payoff

AniMood must distinguish:
- “最後に全部つながってほしい”
- “答えが残って考察できる方がいい”

Therefore:
- `Foreshadowing Payoff` and `Ambiguity` are separate axes.
- High ambiguity does not imply poor quality.
- High foreshadowing payoff does not imply low ambiguity.
- Recommendation text should explain which experience the title provides without spoilers.

## 6. Content Intensity

Keep these separate:
- `Gore` = graphic/visual content
- `Heaviness` = emotional/psychological burden
- `Emotional` = emotional impact
- `Action` = action intensity/presence

Do not infer one from another.

## 7. Scoring

No final numeric coefficients are frozen yet.

Initial engine may use a weighted similarity approach:
- strong weight: mood match
- strong weight: explicit story priority
- medium weight: pace/heaviness
- medium/low weight: secondary axes
- very strong negative weight: explicit deal-breaker conflict

Rules:
- Never use `Legacy Category` directly in public recommendation scoring.
- Never score blank/unrated dimensions as zero.
- Never fabricate missing values to make the engine work.
- Low-confidence/inferred data should be handled conservatively.
- The scoring implementation may evolve, but the product philosophy in this file has priority over a legacy code formula.

## 8. Recommendation Output

Default result:
- Top 1–3 titles
- match score/percentage only if it can be interpreted consistently
- concise spoiler-free reason
- relevant mood/story tags
- optional “why this fits tonight” explanation

Avoid generic text such as:
“Great characters and an amazing story.”

Prefer concrete but spoiler-free language such as:
“Best when you want a tense loop story where rules and limitations keep tightening.”
（制約のあるループものを、ハラハラしながら観たい夜向け）

## 9. Integrity

- Do not claim the user rated something formally unless `Evaluation Status = 評価済み`.
- Do not present AI inference as a direct user quote/opinion.
- Do not fabricate objective metadata.
- Do not expose spoilers in recommendation reasons.
- Do not use popularity as a substitute for fit.
- Do not add titles to public scoring merely to increase catalog size.

## 10. Legacy Data

Legacy Category and Reference Notes may:
- guide which title to evaluate next,
- reduce redundant interview questions,
- provide historical context.

They may not:
- mark a record evaluated,
- populate formal numeric axes automatically without provenance,
- directly determine the public ranking.

## 11. Release Threshold

For production/public recommendation, a title should normally require:
- `Evaluation Status = 評価済み`
- `Public Ready = true`
- sufficient field coverage
- acceptable confidence
- spoiler-safe public explanation

Development fixtures may be used for UI testing, but must be clearly treated as fixtures/noncanonical data.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.
