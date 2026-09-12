// 推薦ロジック。文章や色の変更では編集不要。manuals/09_推薦を調整.md を参照
(function (root) {
  // 01 タグの取得と、対応する点の合計
  const tagsOf = (a) => new Set(a.generalTags || []);
  function sum(tags, map) {
    return Object.entries(map || {}).reduce(
      (n, [tag, w]) => n + (tags.has(tag) ? w : 0),
      0,
    );
  }

  // 02 特徴グラフに使う各軸の点数
  function dimension(a, key, cfg) {
    const map = cfg.taste_dimensions[key]?.tags || {};
    return sum(tagsOf(a), map);
  }

  // 03 1作品の判定。null を返すと推薦候補から外れる
  function score(a, p, cfg) {
    const tags = tagsOf(a);
    if (a.id === p.excludeId) return null;

    // 除外条件を先に適用。点が高くても除外を優先する
    for (const filter of p.filters || []) {
      if ((cfg.hard_filters[filter] || []).some((t) => tags.has(t)))
        return null;
      if (
        filter === "finished_only" &&
        !["FINISHED", "Finished", "終了", "完結"].includes(a.airingStatus)
      )
        return null;
    }
    if (p.shortOnly && (!Number.isInteger(a.episodes) || a.episodes > 12))
      return null;
    if (p.pace === "fast" && tags.has("Slow Burn")) return null;
    if (p.pace === "slow" && tags.has("Fast Paced")) return null;

    // 除外されなかった作品について、選択した軸の根拠を集計
    const moods = p.moods || [],
      taste = p.taste || [];
    let mood = 0,
      tasteFit = 0,
      like = 0;
      direct = 0;
    const hits = [];
    for (const key of moods) {
      const m = cfg.moods[key];
      if (!m) continue;
      mood += sum(tags, m.positive) + sum(tags, m.negative);
      for (const [tag, w] of Object.entries(m.positive || {}))
        if (tags.has(tag)) hits.push({ tag, weight: w, kind: "mood" });
    }
    for (const key of taste) {
      const map = cfg.taste_dimensions[key]?.tags || {};
      tasteFit += sum(tags, map);
      for (const [tag, w] of Object.entries(map))
        if (tags.has(tag)) hits.push({ tag, weight: w, kind: "taste" });
    }
    for (const [tag, w] of Object.entries(p.likeTags || {}))
      if (tags.has(tag)) {
        like += w;
        hits.push({ tag, weight: w, kind: "like" });
      }
    for (const [tag, w] of Object.entries(p.directTags || {}))
      if (tags.has(tag)) {
        direct += w;
         hits.push({ tag, weight: w, kind: "direct" });
      }
    // 一致する根拠が足りなければ推薦しない
    if (moods.length && mood <= 0) return null;
    if (p.excludeId && like <= 0) return null;
    if (!moods.length && !p.excludeId && !Object.keys(p.directTags || {}).length && tasteFit <= 0) return null;
    if (Object.keys(p.directTags || {}).length && direct <= 0) return null;
    const pace =
      (p.pace === "fast" && tags.has("Fast Paced")) ||
      (p.pace === "slow" && tags.has("Slow Burn"))
        ? 1
        : 0;

    // 内部の比較用点数。楽しめる確率や本人評価ではない
    const raw = mood * 3 + tasteFit * 2 + like * 3 + direct * 3 + pace;
    if (raw <= 0) return null;
    return {
      raw,
      mood,
      taste: tasteFit,
      like,
      hits: [
        ...new Map(
          hits.sort((a, b) => b.weight - a.weight).map((h) => [h.tag, h]),
        ).values(),
      ].slice(0, 4),
    };
  }

  // 04 点数順、同点はタイトル順。最後の slice が表示件数
  function rank(anime, p, cfg) {
    return anime
      .map((a) => ({ ...a, match: score(a, p, cfg) }))
      .filter((a) => a.match)
      .sort(
        (a, b) => b.match.raw - a.match.raw || a.title.localeCompare(b.title),
      )
      .slice(0, 3);
  }

  // 05 ブラウザとテストから呼び出す入口
  const api = { score, rank, dimension };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AniMoodEngine = api;
})(typeof window === "undefined" ? globalThis : window);
