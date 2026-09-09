(function (root) {
  function known(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5; }
  function score(a, selections) {
    if (a.evaluationStatus !== '評価済み' || a.publicReady !== true) return null;
    const s = a.scores || {}, traits = a.traits || {}, flags = a.flags || [];
    const avoid = selections.dealbreaker || [];
    if (avoid.some(f => flags.includes(f))) return null;
    const axes = {gore:'gore', dark:'heaviness', unclear:'ambiguity'};
    for (const f of avoid) {
      const value = s[axes[f]];
      if (known(value) && value >= 4) return null;
      if (f === 'slowstart' && known(s.pace) && s.pace <= 2) return null;
    }
    let total = 0, possible = 0;
    const missing = [];
    function add(value, weight, key) {
      if (!known(value)) { missing.push(key); return; }
      total += value * weight; possible += 5 * weight;
    }
    for (const key of selections.mood || []) add(traits[key], 3, key);
    for (const key of selections.story || []) add(key === 'ambiguity' ? s.ambiguity : traits[key], 3, key);
    for (const key of selections.pace || []) {
      const target = {slow:1,balanced:3,fast:5}[key];
      add(known(s.pace) ? 5-Math.abs(s.pace-target) : traits[key], 1, key);
    }
    for (const key of selections.darkness || []) {
      const target = {light:1,medium:3,heavy:5}[key];
      add(known(s.heaviness) ? 5-Math.abs(s.heaviness-target) : traits[key], 1, key);
    }
    for (const key of avoid) {
      const axis = key === 'slowstart' ? 'pace' : axes[key];
      if (!axis || !known(s[axis])) missing.push('content');
    }
    if (!possible || !total) return null;
    return {raw:total/possible, incomplete:missing.length > 0, contentUnknown:missing.includes('content')};
  }
  function rank(records, selections) {
    return records.map(a=>({...a,match:score(a,selections)})).filter(a=>a.match)
      .sort((a,b)=>b.match.raw-a.match.raw || a.id.localeCompare(b.id)).slice(0,3);
  }
  const api = {score,rank};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AniMoodEngine = api;
})(typeof window === 'undefined' ? globalThis : window);
