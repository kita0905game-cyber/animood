# AniMood Data Schema

Last updated: 2026-09-09

The editorial source of truth for anime data is the Airtable base **AniMood**, table **Anime**.

## 1. Identity / Legacy Fields

### Title
Primary title used to identify the record.

### List No
Sequence number from the imported legacy anime list.

### Legacy Category
Historical preference classification from the pre-AniMood list.

Examples:
- ⭐ 特に好き
- ❤️ 好き
- 💛 好き寄り
- 😐 普通
- 🟠 微妙
- ❌ 合わなかった
- 🆕 未視聴
- ⏸️ 視聴状況・評価保留

**Rule:** Legacy Category must never be treated as an AniMood formal score.

### Viewing State
Separate from evaluation state.

Current values:
- 視聴済み
- 未視聴
- 一部視聴・未完走
- 視聴記憶曖昧
- 要確認

## 2. Evaluation Workflow Fields

### Evaluation Status
Allowed values:
- 未評価
- 評価中
- 評価済み

This is the only field that represents formal AniMood evaluation completion.

### Reference Notes
Historical comments, old conversation notes, context, or reminders.

These notes may help Luna ask fewer questions, but they are **not** formal evaluation answers.

### User Review
Free-form impression explicitly given during the formal AniMood evaluation workflow.

### Core Appeal
Short structured summary of why the work succeeds/fails for the intended recommendation context.

## 3. Recommendation Tags

### Mood Tags
Current starter vocabulary:
- 頭を使いたい
- ハラハラしたい
- 感動したい
- 癒されたい
- カッコいい
- 笑いたい

This vocabulary can expand when a genuinely new recommendation need appears.

### Story Tags
Current starter vocabulary:
- 伏線回収
- 世界観
- キャラクター
- 謎・考察
- アクション
- 社会テーマ
- 雰囲気・スタイル

Do not create many near-duplicate tags. Prefer a compact vocabulary with clear recommendation value.

## 4. Scalar Axes

All scalar axes use 1–5 when populated.

**Important:** For unevaluated titles, leave values blank/null.
Never convert “unknown” into 0, 1, or a guessed neutral score.

### Pace
1 = very slow / deliberate  
3 = moderate  
5 = very fast / constantly moving

### Heaviness
1 = emotionally/lightly demanding  
3 = moderate  
5 = very heavy, oppressive, or exhausting

### Gore
1 = almost none  
3 = noticeable  
5 = very graphic/strong

### Emotional
1 = little emotional impact  
3 = moderate  
5 = strongly emotional

### Funny
1 = little comedy  
3 = meaningful comedy presence  
5 = comedy is a central appeal

### Foreshadowing Payoff
1 = little payoff emphasis  
3 = some setup/payoff  
5 = major strength is clues/foreshadowing coming together

### Worldbuilding
1 = minimal/simple setting depth  
3 = meaningful setting detail  
5 = world/lore is a major appeal

### Characters
1 = weak/minimal character appeal  
3 = solid  
5 = characters/character writing are a major strength

### Mystery
1 = little mystery/analysis  
3 = meaningful mystery  
5 = heavy mystery, analysis, or theory-building

### Action
1 = little action  
3 = regular action  
5 = action is a dominant appeal

### Ambiguity
1 = answers are comparatively clear  
3 = some interpretive openness  
5 = major unresolved/interpretive ambiguity

**Ambiguity is not automatically bad.** It must be matched against what the user wants tonight.

## 5. Dealbreakers

Current starter values:
- グロ強め
- 重すぎる
- 序盤が遅い
- 曖昧な結末
- 3DCG主体
- 長すぎる
- 未完結

Dealbreakers are intended for hard exclusions or strong penalties, not ordinary genre tagging.

## 6. Provenance

Allowed values:
- 未設定
- ユーザー明示
- AI暫定推定
- 客観情報

Use provenance to avoid presenting assistant inference as confirmed user opinion.

When multiple individual values eventually require separate provenance, the schema may later be normalized into a linked evaluation-details table. Do not add complexity until needed.

## 7. Confidence

Allowed values:
- 低
- 中
- 高

Confidence describes confidence in the structured AniMood evaluation, not general popularity or quality.

## 8. Public Ready

Boolean.

`Public Ready = true` only when:
- `Evaluation Status = 評価済み`
- key recommendation dimensions are populated sufficiently
- public explanation can be written spoiler-free
- no material user/AI provenance ambiguity remains
- title data is safe to expose publicly

PC Work should export only records that satisfy public-release rules.

## 9. Updated At

Date/time of the latest meaningful evaluation/data update.

## 10. Evaluation Completion Rule

A title becomes `評価済み` only after:
1. a formal user impression exists,
2. required targeted questions have been answered,
3. recommendation-relevant axes/tags are structured,
4. assistant inferences are either corrected or accepted,
5. no critical ambiguity remains.

A past “好き” classification alone does not satisfy any of the above.

## 11. Public JSON Rule

GitHub JSON is a build/output format, not editorial source.

Recommended export rule:

`Evaluation Status == 評価済み`
AND
`Public Ready == true`

The exporter should map Airtable fields into a stable site schema.
If Airtable changes, update this document first when the change is a rule/schema change, then update exporter/site code.

## 2026-09-09 — Approved initial ten (supersedes the initial snapshot)

The user explicitly approved the existing ten records as formal and Public Ready in the PC task.
Airtable now has 10 evaluated/public records and 358 unevaluated records. The ten are NOT demo fixtures.
AI-origin scores keep their provenance; missing intensity axes remain null.
See OPERATIONS.md for the approval record, additional Airtable fields, export and rule checks.
This is an explicit seed approval, not permission to auto-approve future records.
