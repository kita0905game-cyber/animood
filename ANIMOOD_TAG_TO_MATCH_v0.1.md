# AniMood General Tags → Match Logic v0.1

## Purpose
General Tagsを、Mood Quiz / Taste Profile / Anime Like X の推薦計算へ接続する正式変換層。

## Core rule
- General Tags = 一般的・客観的な作品特徴
- Mood = 今夜求める体験
- Taste = 長期的な好み
- Editor's Take = 管理人評価済み作品だけに付く独立レイヤー
- Hard Filter = NG条件。スコアより優先

## Mood mappings
- Mind-bending（頭を使いたい）: Mystery, Psychological, Mind Games, Plot Twists, Foreshadowing / Payoff, Time Travel, Time Loop
- Dark（ダーク）: Dark Fantasy, Horror, Gore, Crime, Underworld, Dystopia, Post-Apocalyptic, Morally Gray
- Emotional（感情）: Emotional, Drama, Tragedy, Character Growth
- Cozy（癒し）: Cozy / Healing, Slice of Life, Episodic, Food, Comedy
- Hype（テンション）: Action, Fast Paced, Gun Action, Martial Arts, Sports, Adventure
- Funny（笑い）: Comedy, Parody, Rom-Com
- Atmospheric（雰囲気）: Atmospheric, Worldbuilding Heavy, Slow Burn

## Taste dimensions
Plot/Payoff, Worldbuilding, Mystery, Action, Emotion, Comedy, Romance, Darkness, Comfort の9軸。

## Match order
1. Hard filters
2. Mood fit
3. Taste fit
4. Pace / heaviness / length constraints
5. Data confidence
6. Community score = tie-breaker only
7. Editor's Take = explanation/enrichment bonus, not mandatory

## Privacy
公開UI・JSON・SEOページ・コードコメントに運営者の個人名・呼称を入れない。公開表記は `Editor's Take`。
