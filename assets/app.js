// 01 共通の道具・言語・端末保存。編集ガイドは manuals/14_コードの読み方.md
const $ = (s) => document.querySelector(s);
let lang = navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};
const savedLang = read("animood-language", null);
if (["en", "ja"].includes(savedLang)) lang = savedLang;

// 02 HTMLの英語を記憶。data-i の名前で日本語と対応させる
const en = new Map(
  [...document.querySelectorAll("[data-i]")].map((e) => [
    e.dataset.i,
    e.innerHTML,
  ]),
);

// 03 日本語の文章辞書：右側の文章を編集。左側はHTMLの data-i と一致させる
const ja = {
  eyebrow: "気分から選ぶ、次のアニメ",
  headline: "気分と、好きな理由で。<br>次の1本を。",
  intro:
    "今夜の気分からでも、好きな作品の魅力からでも。あなたに合う理由がわかるアニメ選び。",
  modeMood: "今の気分",
  modeTaste: "いつもの好み",
  modeLike: "好きな作品から",
  modetags: "好きなタグから",
  tagLabel: "好きな要素を3つまで選ぶ",
  tagHelp: "観たい体験に近いタグを選んでください。",
  moodLabel: "01 / 気分を2つまで選ぶ",
  tasteLabel: "何に惹かれる？ 3つまで選んでください。",
  tasteHelp: "好みはこの端末だけに保存。登録は不要です。",
  clearTaste: "保存した好みを消す",
  favoriteLabel: "好きな作品を選ぶ",
  favoriteHelp: "作品名を入れると候補が絞られます。英語・日本語どちらでもOK。",
  preferences: "今夜の条件を調整する",
  pace: "テンポ",
  paceAny: "どちらでも",
  paceFast: "テンポよく進んでほしい",
  paceSlow: "じっくり楽しみたい",
  shortOnly: "12話以内（話数が確認できる作品のみ）",
  avoid: "避けたい要素",
  filterHint:
    "記録されたタグで絞り込みます。タグがないことは描写がない保証ではありません。放送終了のみの指定では、状態が確認できる作品に絞ります。",
  go: "次に観るアニメを探す <span>↗</span>",
  yourPicks: "今夜の候補",
  resultsTitle: "3つの物語。それぞれの魅力。",
  matchHelp:
    "AniMood Matchはタグから見た適合度です。作品の評価点や確率ではありません。",
  share: "この条件のリンクをコピー",
  guideLabel: "探す時間を、楽しむ時間に",
  guideTitle: "ジャンルより、体験から。",
  guideText:
    "同じタイムトラベルでも、謎解き、感情を揺さぶるドラマ、緊迫したサスペンスでは体験が違う。好きになった理由から、次の作品を探そう。",
  footer: "気分で選ぶ、テキスト中心のアニメ案内。",
  privacy:
    "好みとフィードバックはこの端末に保存します。Google Analyticsで訪問・機能利用を集計しますが、アカウント情報・検索文字・作品名は送信しません。",
};

// 04 共通処理：t は言語の選択、esc はデータを安全な表示文字に変換
const t = (a, b) => (lang === "ja" ? b : a);
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// 05 気分の表示名：[英語, 日本語]。追加時は設定JSONの moods も更新
const moodNames = {
  mind_bending: ["Mind-bending", "頭を使いたい"],
  dark: ["Dark", "ダーク"],
  emotional: ["Emotional", "感動したい"],
  cozy: ["Cozy", "癒されたい"],
  hype: ["Hype", "テンションを上げたい"],
  funny: ["Funny", "笑いたい"],
  atmospheric: ["Atmospheric", "雰囲気に浸りたい"],
};

// 06 好みの表示名。追加時は taste_dimensions とグラフの列数を確認
const tasteNames = {
  plot_payoff: ["Plot / payoff", "伏線・回収"],
  worldbuilding: ["Worldbuilding", "世界観"],
  mystery: ["Mystery", "謎・考察"],
  action: ["Action", "アクション"],
  emotion: ["Emotion", "感情"],
  comedy: ["Comedy", "笑い"],
  romance: ["Romance", "恋愛"],
  darkness: ["Darkness", "ダークさ"],
  comfort: ["Comfort", "癒し"],
};

// 07 除外条件の表示名。追加時は hard_filters と選択上限を確認
const filterNames = {
  no_gore: ["No gore", "グロ描写を避ける"],
  no_heavy_cgi: ["No heavy CGI", "CG主体を避ける"],
  low_romance: ["Low romance", "恋愛要素を控えめに"],
  finished_only: ["Airing finished only", "放送終了のみ"],
};

const directTagNames = {
  Mystery: ["Mystery", "謎・考察"],
  Psychological: ["Psychological", "心理戦・頭脳戦"],
  Action: ["Action", "アクション"],
  Emotional: ["Emotional", "感情を揺さぶられたい"],
  Comedy: ["Comedy", "笑いたい"],
  "Cozy / Healing": ["Cozy / Healing", "癒されたい"],
};

// 08 好きな理由：label は日英の名前、tags は特徴と重み
const reasonDefs = {
  payoff: {
    label: ["Foreshadowing & payoff", "伏線回収"],
    tags: { "Foreshadowing / Payoff": 4, "Plot Twists": 3, Mystery: 2 },
  },
  rules: {
    label: ["Time-travel rules", "タイムトラベルの仕組み"],
    tags: { "Time Travel": 4, "Time Loop": 4, "Sci-Fi": 1 },
  },
  tension: {
    label: ["Tension & uncertainty", "緊張感と先の読めなさ"],
    tags: { Thriller: 4, Mystery: 2, "Mind Games": 3 },
  },
  characters: {
    label: ["Characters & their growth", "登場人物と成長"],
    tags: {
      "Character Growth": 4,
      Friendship: 2,
      "Found Family": 2,
      "Coming of Age": 2,
    },
  },
  emotion: {
    label: ["Emotional punch", "感情を揺さぶる展開"],
    tags: { Emotional: 4, Drama: 2, Tragedy: 2 },
  },
};

// 09 選択中の条件・作品一覧・読み込み状態。文章の編集では変更不要
let anime = [],
  config = null,
  mode = "mood",
  moods = new Set(["mind_bending"]),
  taste = new Set(read("animood-taste", [])),
  filters = new Set(),
  reasons = new Set(["payoff"]),
  tagChoices = new Set(),
  favorite = "",
  favoriteQuery = "",
  lastPicks = [],
  loaded = false;

// 10 共有URLから選択を復元。選択上限を変えるときはここも確認
const params = new URLSearchParams(location.search);
if (["mood", "taste", "like"].includes(params.get("mode")))
  mode = params.get("mode");
if (params.has("moods"))
  moods = new Set(
    params
      .get("moods")
      .split(",")
      .filter((k) => moodNames[k])
      .slice(0, 2),
  );
if (params.has("taste"))
  taste = new Set(
    params
      .get("taste")
      .split(",")
      .filter((k) => tasteNames[k])
      .slice(0, 3),
  );
taste = new Set([...taste].filter((k) => tasteNames[k]).slice(0, 3));
if (params.has("filters"))
  filters = new Set(
    params
      .get("filters")
      .split(",")
      .filter((k) => filterNames[k]),
  );
if (params.has("reasons"))
  reasons = new Set(
    params
      .get("reasons")
      .split(",")
      .filter((k) => reasonDefs[k]),
  );
if (["any", "fast", "slow"].includes(params.get("pace")))
  $("#pace").value = params.get("pace");
$("#shortOnly").checked = params.get("short") === "1";
if (location.pathname.includes("anime-like-steins-gate")) mode = "like";

// 11 操作記録。GA4へ送るのはイベント名・ページ種別・数値の件数だけ。
//    作品名、作品ID、選んだ回答、検索文字、共有URLの条件は送らない。
const events = new Set([
  "landing_view",
  "quiz_start",
  "quiz_answer",
  "quiz_complete",
  "recommendation_view",
  "anime_click",
  "feedback_match",
  "feedback_miss",
  "taste_profile_start",
  "taste_profile_complete",
  "seo_page_view",
  "share_click",
]);
function track(event, detail = {}) {
  if (!events.has(event)) return;
  const safe = {
    mode,
    ...Object.fromEntries(
      Object.entries(detail).filter(([key]) =>
        ["count", "choice", "publicId"].includes(key),
      ),
    ),
  };
  const counts = read("animood-events", {});
  counts[event] = (counts[event] || 0) + 1;
  save("animood-events", counts);
  window.dispatchEvent(
    new CustomEvent("animood:track", { detail: { event, ...safe } }),
  );

  // GA4用はさらに絞る。URLの ? 以降、選択内容、作品情報は渡さない。
  if (typeof window.gtag === "function") {
    const gaDetail = {
      screen_type: location.pathname === "/" ? "home" : "seo_page",
    };
    if (Number.isFinite(detail.count)) gaDetail.count = detail.count;
    window.gtag("event", event, gaDetail);
  }
}

// 12 診断開始の記録と、選択ボタンの共通処理
const startedRoutes = new Set();
function startDiscovery() {
  if (!startedRoutes.has(mode)) {
    startedRoutes.add(mode);
    track(mode === "taste" ? "taste_profile_start" : "quiz_start");
  }
}
function label(map, key) {
  return map[key] ? t(...map[key]) : key;
}
function chips(selector, defs, chosen, max, onchange) {
  $(selector).innerHTML = Object.keys(defs)
    .map(
      (key) =>
        `<button class="chip" data-key="${esc(key)}" aria-pressed="${chosen.has(key)}">${esc(label(defs, key))}</button>`,
    )
    .join("");
  $(selector)
    .querySelectorAll("button")
    .forEach(
      (b) =>
        (b.onclick = () => {
          startDiscovery();
          const k = b.dataset.key;
          if (chosen.has(k)) chosen.delete(k);
          else if (chosen.size < max) chosen.add(k);
          else {
            chosen.delete(chosen.values().next().value);
            chosen.add(k);
          }
          track("quiz_answer", { choice: k });
          onchange();
          renderControls();
        }),
    );
}

// 13 入力画面の更新：翻訳・パネル・選択ボタン・作品数
function renderControls() {
  document.documentElement.lang = lang;
  document
    .querySelectorAll("[data-i]")
    .forEach(
      (e) =>
        (e.innerHTML =
          lang === "ja"
            ? (ja[e.dataset.i] ?? en.get(e.dataset.i))
            : en.get(e.dataset.i)),
    );
  document
    .querySelectorAll("[data-lang]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)),
    );
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
    );
  $("#moodPanel").hidden = mode !== "mood";
  $("#tastePanel").hidden = mode !== "taste";
  $("#likePanel").hidden = mode !== "like";
  $("#tagPanel").hidden = mode !== "tags";
  chips("#moods", moodNames, moods, 2, () => {});
  chips("#tastes", tasteNames, taste, 3, () =>
    save("animood-taste", [...taste]),
  );
  chips("#filters", filterNames, filters, 4, () => {});
  chips("#tagChoices", directTagNames, tagChoices, 3, () => {});
  const source = anime.find((a) => a.id === favorite);
  const query = favoriteQuery.trim().toLocaleLowerCase();
  const matches = anime
    .filter((a) => {
      if (!query) return false;
      return [a.title, a.titleJa]
        .filter(Boolean)
        .some((title) => title.toLocaleLowerCase().includes(query));
    })
    .slice(0, 12);
  const favoriteInput = $("#favorite");
  favoriteInput.placeholder = t("Type an anime title", "作品名を入力");
  favoriteInput.value = favoriteQuery;
  favoriteInput.setAttribute(
    "aria-label",
    t("Search favorite anime", "好きな作品を検索"),
  );
  $("#favoriteMatches").innerHTML = matches.length
    ? matches
        .map(
          (a) =>
            `<button type="button" role="option" class="favorite-match" data-favorite-id="${esc(a.id)}" aria-selected="${a.id === favorite}">${esc(t(a.title, a.titleJa || a.title))}</button>`,
        )
        .join("")
    : query
      ? `<p class="hint">${esc(t("No matching title in the current catalog.", "公開中の作品に一致する候補がありません。"))}</p>`
      : source
        ? `<button type="button" role="option" class="favorite-match is-selected" data-favorite-id="${esc(source.id)}" aria-selected="true">${esc(t(source.title, source.titleJa || source.title))}</button>`
        : "";
  $("#favoriteMatches")
    .querySelectorAll("[data-favorite-id]")
    .forEach(
      (button) =>
        (button.onclick = () => {
          favorite = button.dataset.favoriteId;
          favoriteQuery = "";
          renderControls();
        }),
    );
  $("#likeQuestion").textContent = source
    ? t(
        `What did you love about ${source.title}?`,
        `${source.titleJa || source.title}の、何が好きだった？`,
      )
    : "";
  chips(
    "#reasons",
    Object.fromEntries(
      Object.entries(reasonDefs).map(([k, v]) => [k, v.label]),
    ),
    reasons,
    3,
    () => {},
  );
  $("#catalog").textContent = loaded
    ? t(
        `${anime.length} titles · editorial tag profiles · no account`,
        `${anime.length}作品 · 編集済みタグから診断 · 登録不要`,
      )
    : t("Loading the catalog…", "作品を読み込み中…");
  $("#go").disabled = !loaded;
}

// 14 選択条件を推薦ロジックへ渡す形に変換
function profile() {
  const p = {
    moods: mode === "mood" ? [...moods] : [],
    taste: mode === "taste" ? [...taste] : [],
    filters: [...filters],
    pace: $("#pace").value,
    shortOnly: $("#shortOnly").checked,
    directTags: mode === "tags" ? Object.fromEntries([...tagChoices].map((tag) => [tag, 3])) : {},
  };
  if (mode === "like") {
    p.excludeId = favorite;
    p.likeTags = {};
    const sourceTags = new Set(
      anime.find((a) => a.id === favorite)?.generalTags || [],
    );
    for (const reason of reasons)
      for (const [tag, w] of Object.entries(reasonDefs[reason].tags))
        if (sourceTags.has(tag))
          p.likeTags[tag] = Math.max(p.likeTags[tag] || 0, w);
  }
  return p;
}

// 15 特徴グラフ。タグ由来の目安で、本人の正式評価ではない
function fingerprint(a) {
  return Object.entries(config.taste_dimensions)
    .map(([key, c]) => {
      const raw = AniMoodEngine.dimension(a, key, config),
        max = Object.values(c.tags).reduce((a, b) => a + b, 0),
        pct = Math.round((raw / max) * 100);
      return `<div title="${esc(label(tasteNames, key))}: ${raw}/${max}"><div class="bar"><i style="height:${pct}%"></i></div><div class="trait">${esc(label(tasteNames, key))}</div></div>`;
    })
    .join("");
}

// 16 観る前の注意。タグの未登録は描写がない保証ではない
function watchouts(a) {
  const defs = {
    Gore: ["graphic violence", "グロ描写"],
    Horror: ["horror elements", "ホラー要素"],
    "Slow Burn": ["a gradual start", "じっくり進む序盤"],
    "Heavy CGI": ["CG-heavy presentation", "CG主体の映像"],
    "Unfinished Story": ["an unfinished story", "未完結の物語"],
    Romance: ["romance", "恋愛要素"],
    Tragedy: ["tragic themes", "悲劇的なテーマ"],
  };
  const notes = a.generalTags.filter((k) => defs[k]).map((k) => t(...defs[k]));
  if (a.episodes === null)
    notes.push(t("episode count unconfirmed", "話数未確認"));
  return notes.length
    ? notes.join(t("; ", "、"))
    : t(
        "No caution tags recorded. This is not a content-safety guarantee.",
        "注意タグは未登録です。描写がないことを保証するものではありません。",
      );
}

// 17 結果カードの表示：名前・理由・注意・任意の管理人の見解・ボタン
function renderResults() {
  $("#results").hidden = false;
  $("#cards").innerHTML =
    lastPicks
      .map((a, i) => {
        const hits = a.match.hits.map((h) => h.tag).join(", "),
          strong = a.match.hits.length >= 3;
        const why = t(
          `Your selected preferences connect through ${hits}.`,
          `選んだ好みと「${hits}」が重なっています。`,
        );
        const meta = [
          a.mediaType,
          a.episodes ? t(`${a.episodes} episodes`, `${a.episodes}話`) : null,
          a.releaseYear,
        ]
          .filter(Boolean)
          .join(" · ");
        return `<article class="result-row"><div class="rank">0${i + 1}</div><div><div class="titleRow"><h3>${esc(t(a.title, a.titleJa || a.title))}</h3><span class="match"> AniMood Match · ${strong ? t("multiple signals", "複数の特徴が一致") : t("focused fit", "特定の好みに一致")}</span></div><p class="metadata">${esc(meta)}</p><div class="tags">${a.generalTags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div><div class="explanation"><div><h4>${t("Why it fits", "合う理由")}</h4><p>${esc(why)}</p></div><div><h4>${t("Know before watching", "観る前に知っておきたいこと")}</h4><p>${esc(watchouts(a))}</p></div></div><div class="fingerprint"><h4>${t("Mood fingerprint · tag signals", "好みの特徴 · タグからの目安")}</h4><div class="finger-grid">${fingerprint(a)}</div></div>${a.editorsTake ? `<div class="editor"><h4>Editor's Take${t("", "（管理人の見解）")}</h4><p>${esc(a.editorsTake)}</p></div>` : ""}<div class="actions"><button data-feedback="match" data-id="${esc(a.id)}">${t("Fits my mood", "気分に合う")}</button><button data-feedback="miss" data-id="${esc(a.id)}">${t("Not tonight", "今夜は違う")}</button><button data-more="${esc(a.id)}">${t("Explore its appeal", "この作品の魅力から探す")}</button><a data-search="${esc(a.id)}" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=${encodeURIComponent(a.title + " anime")}">${t("Look up this anime ↗", "作品情報を調べる ↗")}</a></div></div></article>`;
      })
      .join("") ||
    `<p>${t("No match with enough evidence for these choices. Change a preference or filter and try again.", "今の条件に合う根拠が十分な作品はありません。好みや条件を変えてお試しください。")}</p>`;
  $("#cards")
    .querySelectorAll("[data-feedback]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          const feedback = read("animood-feedback", {});
          feedback[b.dataset.id] = b.dataset.feedback;
          save("animood-feedback", feedback);
          track("feedback_" + b.dataset.feedback, { publicId: b.dataset.id });
          b.parentElement
            .querySelectorAll("[data-feedback]")
            .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        }),
    );
  $("#cards")
    .querySelectorAll("[data-more]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          favorite = b.dataset.more;
          mode = "like";
          renderControls();
          $("#picker").scrollIntoView({ behavior: "smooth" });
          track("anime_click", { publicId: favorite });
        }),
    );
  $("#cards")
    .querySelectorAll("[data-search]")
    .forEach(
      (a) =>
        (a.onclick = () =>
          track("anime_click", { publicId: a.dataset.search })),
    );
}

// 18 診断実行：入力確認 → 順位計算 → 結果表示
function discover() {
  if (!loaded) return;
  startDiscovery();
  if (
    (mode === "mood" && !moods.size) ||
    (mode === "taste" && !taste.size) ||
    (mode === "like" && !reasons.size)
  ) {
    $("#message").textContent = t(
      "Choose at least one preference.",
      "好みを1つ以上選んでください。",
    );
    return;
  }
  $("#message").textContent = "";
  const p = profile();
  if (mode === "like" && !Object.keys(p.likeTags).length) {
    $("#message").textContent = t(
      "That appeal is not recorded for this title yet. Choose another reason.",
      "この作品には選んだ魅力のタグがまだありません。別の理由を選んでください。",
    );
    return;
  }
  track(mode === "taste" ? "taste_profile_complete" : "quiz_complete");
  lastPicks = AniMoodEngine.rank(anime, p, config);
  renderResults();
  track("recommendation_view", { count: lastPicks.length });
  $("#results").scrollIntoView({ behavior: "smooth" });
}

// 19 クリック動作の接続。HTMLの id を消す場合は対応する処理も確認
$("#go").onclick = discover;
document.querySelectorAll("[data-mode]").forEach(
  (b) =>
    (b.onclick = () => {
      mode = b.dataset.mode;
      $("#message").textContent = "";
      $("#results").hidden = true;
      renderControls();
      startDiscovery();
    }),
);
document.querySelectorAll("[data-lang]").forEach(
  (b) =>
    (b.onclick = () => {
      lang = b.dataset.lang;
      save("animood-language", lang);
      renderControls();
      if (!$("#results").hidden) renderResults();
    }),
);
$("#favorite").oninput = () => {
  favoriteQuery = $("#favorite").value;
  renderControls();
  $("#favorite").focus();
};
$("#clearTaste").onclick = () => {
  taste.clear();
  save("animood-taste", []);
  renderControls();
};
$("#share").onclick = async () => {
  const p = new URLSearchParams({
    mode,
    moods: [...moods].join(","),
    taste: [...taste].join(","),
    filters: [...filters].join(","),
    reasons: [...reasons].join(","),
    favorite,
    pace: $("#pace").value,
    short: $("#shortOnly").checked ? "1" : "0",
  });
  const url = location.origin + "/?" + p;
  try {
    await navigator.clipboard.writeText(url);
    $("#shareStatus").textContent = t(
      "Link copied.",
      "リンクをコピーしました。",
    );
    track("share_click");
  } catch {
    $("#shareStatus").textContent = url;
  }
};

// 20 公開データの読み込み。作品の原本はAirtable
async function load() {
  try {
    const [a, s] = await Promise.all(
      ["/data/anime.json", "/data/tag_scoring.json"].map(async (url) => {
        const r = await fetch(url);
        if (!r.ok) throw Error("load");
        return r.json();
      }),
    );
    if (
      a.schemaVersion !== 2 ||
      !Array.isArray(a.anime) ||
      a.count !== a.anime.length ||
      !s.moods
    )
      throw Error("schema");
    anime = a.anime;
    config = s;
    favorite = anime.some((a) => a.id === params.get("favorite"))
      ? params.get("favorite")
      : (anime.find((a) => /^steins;gate$/i.test(a.title)) || anime[0])?.id ||
        "";
    loaded = true;
    renderControls();
  } catch {
    $("#catalog").textContent = t(
      "The catalog could not load. Reload to try again.",
      "作品データを読み込めませんでした。再読み込みしてください。",
    );
  }
}

// 21 起動処理。実行の順番を維持する
renderControls();
load();

// GA4の最初の閲覧記録。共有条件を含む ? 以降は送らない。
if (typeof window.gtag === "function") {
  window.gtag("event", "page_view", {
    page_location: location.origin + location.pathname,
    page_title: "AniMood",
    screen_type: location.pathname === "/" ? "home" : "seo_page",
  });
}
track("landing_view");
if (location.pathname !== "/") track("seo_page_view");
