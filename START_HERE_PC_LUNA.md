# AniMood — PCルナ最終引き継ぎ
更新日: 2026-09-09

## 最初に読む
このファイルが最新の引き継ぎ正本です。
古い v0.2 / v0.3 の判断より、この内容を優先してください。

## プロジェクトの目的
海外向けの「気分・体験ベース」アニメ推薦サイト AniMood を、初期固定費0円で公開・成長させる。
長期目標は月5万円規模の収益化。
単なるジャンル検索やAIおすすめ一覧ではなく、
「今夜どんな体験がしたいか」「好きな作品の何が好きだったか」から選ぶ意思決定ツールにする。

## 役割分担
- Airtable = アニメデータの正式原本
- GitHub = 仕様・ルール・サイトコードの正式原本
- GitHub JSON = 公開サイト用の派生データ
- Cloudflare Pages = 公開ホスティング候補
- スマホルナ = 企画、評価収集、SEO、Airtableデータ整備
- PCルナ = GitHub実装、サイト開発、同期、デプロイ、検証

GitHub repo:
https://github.com/kita0905game-cyber/animood

## 今回の完了状態
Airtable Animeテーブルの全368作品について以下が埋まった。
- English Title: 368/368
- General Tags: 368/368
- General Tags Source
- General Tags Updated

空欄チェック済み: English Title / General Tags とも 0件。

注意:
これは「一般特徴タグの初期編集データ」が完成したという意味。
Episodes / Release Year / Airing Status / Media Type 等の客観メタデータは全368件完了とは限らない。
Editor's Takeも全件必須ではなく、実視聴・正式評価済み作品のみ追加する。

## Airtable
Base: AniMood
Base ID: appXkCYzNbv1LDV6O
Table: Anime
Table ID: tblokhzcBwhVIZwTv

公開推薦で重要なフィールド:
- Title
- English Title
- General Tags
- Editor's Take
- Media Type
- Episodes
- Release Year
- Airing Status
- General Tags Source
- General Tags Updated
- Metadata Source
- Metadata Updated

内部/非公開:
- User Review
- Reference Notes
- Evaluation Evidence
- Legacy Category
- Viewing State
- 運営者を識別できる情報

## プライバシー絶対ルール
公開サイト、公開JSON、SEOページ、GitHub公開コードに
運営者の個人名・呼称等を絶対に出さない。
公開ラベルは `Editor's Take`（管理人の評価・見解）。

## General Tags の役割
General Tags = 世間一般の作品特徴・広さ。
例:
Isekai / Gore / Underworld / Time Travel / Time Loop / Mystery /
Dark Fantasy / Cozy / Crime / Adult Cast / War / Romance / School /
Psychological / Thriller / Plot Twists / Foreshadowing-Payoff /
Heavy CGI / Unfinished Story 等。

タグは無制限に増やさない。
Airtableの標準選択肢を正規語彙として使う。

## 推薦の基本構造
General Tags
→ animood_tag_scoring_v0.1.json
→ Mood/Taste適合度
→ Hard Filter
→ AniMood Match
→ Why it fits
→ Know before watching

主要Mood:
- Mind-bending = 頭を使いたい
- Dark = ダーク
- Emotional = 感動
- Cozy = 癒し
- Hype = テンションを上げたい
- Funny = 笑いたい
- Atmospheric = 雰囲気に浸りたい

Hard Filter例:
- No Gore
- No Heavy CGI
- Low Romance
- Finished only（メタデータ完成後に強化）

## UI/ブランド
避ける:
- generic purple gradient
- generic card grid
- 「Find your perfect anime!」のようなテンプレ感
- 理由のないMatch %
- AI自動生成サイトっぽい雰囲気
- ジャンル先行推薦

狙う印象:
「ちゃんとアニメを観てる人が作った道具」

重要画面:
1. Top
2. Mood Quiz
3. Taste Profile
4. Results
5. Anime Like X

結果では必ず:
- AniMood Match
- General Tags
- Why it fits
- Know before watching
- Mood fingerprint
- Editor's Take（ある場合のみ）

## Anime Like X のUSP
「シュタゲに似てる」ではなく、
“What did you love about Steins;Gate?”
（シュタゲの何が好きだった？）
から分岐する。

例:
- Foreshadowing/payoff
- Time-travel rules
- Tension
- Characters
- Emotional punch

表面的設定一致ではなく、好きだった理由で似た作品を出す。

## SEO
初期クラスタ:
- what anime should I watch
- anime recommendation quiz
- anime taste quiz
- anime like Steins;Gate
- anime like Attack on Titan
- anime like Death Note
- anime like Made in Abyss
- anime with amazing plot twists
- dark anime with a good story
- short anime to binge
- anime to watch when you want to cry
- anime with great worldbuilding
- mystery anime that keeps you guessing

大量の薄いSEOページは禁止。
各ページがAniMood独自タグ・比較・診断分岐など実価値を持つこと。

## Analytics
Cloudflare Web Analytics:
- 基礎PV/訪問計測候補
- 無料・プライバシー寄り
- custom event用途には不足

サイト側は `track()` を抽象化。
将来/初期のファネルイベント:
- landing_view
- quiz_start
- quiz_answer
- quiz_complete
- recommendation_view
- anime_click
- feedback_match
- feedback_miss
- taste_profile_start
- taste_profile_complete
- seo_page_view
- share_click

カスタムイベントはGA4等、無料枠のある実装へ差し替え可能にする。

## 自動同期
`Airtable_Export/` に、
Airtable REST API → `data/anime.json` のエクスポートコードと
GitHub Actions workflowがある。

必要なユーザー操作:
GitHub Repository
→ Settings
→ Secrets and variables
→ Actions
→ `AIRTABLE_PAT` を登録。

PATはAniMood Baseのread最小権限にする。
絶対に公開コードへ直書きしない。

workflow:
- 手動実行
- JST 05:17 日次実行
- 差分がある時だけ data/anime.json をcommit/push

## PCルナが最初にやる順番
1. この引き継ぎパックをGitHub repoに反映する前に現行repoを確認。
2. `Site_v0.5/` を現行コードと比較し、良い部分を統合。
3. `Tag_Scoring/animood_tag_scoring_v0.1.json` を正規推薦設定として配置。
4. `Airtable_Export/` のscripts/workflowをrepoへ配置。
5. 公開データ読み込み先を `data/anime.json` へ統一。
6. まず手動workflowで368作品JSONが生成されるか確認。
7. 公開JSONに内部フィールド・個人情報が無いことを検査。
8. Mood Quizを368作品データで動かす。
9. Taste Profileを実装。
10. Anime Like X（最初はSteins;Gate）を実装。
11. Resultsの Why it fits / Know before watching / Mood fingerprint を磨く。
12. モバイル表示確認。
13. Cloudflare Pagesへ公開。
14. Analytics計測。
15. SEO初期ページを少数高品質で公開。

## 今やらなくていいこと
- 368作品すべてのEditor's Take作成を待つ
- community score全件収集
- 有料AI API
- 有料ホスティング
- 独自ドメイン購入
- 1000ページ規模のSEO量産
- アニメ公式画像の無断利用

## データ品質上の注意
368作品のGeneral Tagsは初期公開母集団を作るための編集済みシード。
将来的に:
- 外部の客観メタデータ
- Editor's Take
- 利用者フィードバック
で精度を上げる。

タグの細かい誤差があっても、勝手に新タグを乱造せず標準辞書内で修正する。

## 成功指標
検索表示
→ CTR
→ site visit
→ quiz start
→ quiz complete
→ recommendation click
→ matched/missed feedback
→ revisit/share
→ monetization

最終事業目標: 月5万円。
ただし初期は収益より、検索流入・診断完走・推薦納得度を優先する。
