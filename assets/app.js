let language = navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
try { const saved = localStorage.getItem('animood-language'); if (['ja','en'].includes(saved)) language = saved; } catch {}
const japanese = [
 ['.hero .eyebrow','気分で出会う、次のアニメ'],
 ['.hero h1','探す時間を、<br>楽しむ時間に。'],
 ['.lead','今夜はどんな気分？ 感動、伏線回収、テンポ、世界観、苦手な描写。ジャンルだけでは見つからない、今のあなたに合うアニメを探そう。'],
 ['#startBtn','ぴったりのアニメを探す'],
 ['.micro','登録不要。迷わず選べる、あなたへのおすすめ。'],
 ['#backBtn','戻る'],['#nextBtn','次へ'],['#restartBtn','もう一度診断する'],
 ['.results-head .eyebrow','今の気分に合うアニメ'],['.results-head h2','今夜は、この作品を。'],
 ['.method strong','AniMoodのおすすめの仕組み'],
 ['.method p','感情の重さ、伏線回収、謎、テンポ、雰囲気など、人の手で設定した特徴をもとにおすすめしています。表示される％は好みとの相性を示す目安で、作品の評価点ではありません。'],
 ['.why .eyebrow','ANIMOODについて'],['.why h2','ジャンルの、その先へ。'],
 ['.why article:nth-child(1) h3','気分から選ぶ'],['.why article:nth-child(1) p','頭を使いたい夜も、ただ笑いたい夜も。今の気分から作品を探せます。'],
 ['.why article:nth-child(2) h3','観たときの体験を大切に'],['.why article:nth-child(2) p','伏線がつながる快感、心に残る余韻、緊張感、続きが気になる感覚まで。ジャンルだけでは伝わらない魅力を重視します。'],
 ['.why article:nth-child(3) h3','候補を絞って、選びやすく'],['.why article:nth-child(3) p','100本のリストを増やすより、今夜の1本を見つけるために。あなたに合う作品を絞って提案します。'],
 ['footer','試作版 v0.3 · AniMood']
];
const english = japanese.map(([selector]) => [selector, document.querySelector(selector).innerHTML]);
const questionJapanese = ['今夜はどんな気分になりたい？','物語でいちばん大切にしたいのは？','どんなテンポで楽しみたい？','どのくらい重い内容まで大丈夫？','避けたいものはある？'];
function localText(en,ja) { return language === 'ja' ? ja : en; }
function applyLanguage() {
 document.documentElement.lang = language;
 document.title = localText('AniMood — Find anime for your mood','AniMood — 今の気分に合うアニメを探そう');
 document.querySelector('meta[name="description"]').content = localText('AniMood helps you pick your next anime based on the mood and experience you want tonight.','今夜の気分や好みから、あなたにぴったりのアニメを診断。登録不要でおすすめの3作品が見つかります。');
 (language === 'ja' ? japanese : english).forEach(([selector,html]) => document.querySelector(selector).innerHTML = html);
 document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
 if (!quiz.classList.contains('hidden')) renderQuestion();
 if (!results.classList.contains('hidden')) showResults(false);
}
document.querySelectorAll('[data-language]').forEach(button => button.onclick = () => {
 language = button.dataset.language;
 try { localStorage.setItem('animood-language', language); } catch {}
 applyLanguage();
});


const questions = [
  {key:"mood", title:"What do you want to feel tonight?", help:"Choose up to two.", max:2, answers:[
    ["mind","Mind-bending","頭を使いたい"],["tension","High tension","ハラハラしたい"],["emotional","Emotional","感動したい"],
    ["cozy","Cozy","癒されたい"],["badass","Badass","カッコいいの見たい"],["funny","Funny","笑いたい"]
  ]},
  {key:"story", title:"What matters most in the story?", help:"Choose up to two.", max:2, answers:[
    ["foreshadow","Foreshadowing & payoff","伏線回収"],["world","Worldbuilding","世界観・設定"],["characters","Characters","キャラクター"],
    ["mystery","Mystery","謎・考察"],["action","Action","戦い・アクション"]
  ]},
  {key:"pace", title:"How should it move?", help:"Choose one.", max:1, answers:[
    ["slow","Slow burn","じっくり"],["balanced","Balanced","普通"],["fast","Fast","テンポ重視"]
  ]},
  {key:"darkness", title:"How heavy can it get?", help:"Choose one.", max:1, answers:[
    ["light","Keep it light","軽め"],["medium","Some darkness is fine","多少重くてもOK"],["heavy","Hit me hard","かなり重くてもOK"]
  ]},
  {key:"dealbreaker", title:"Anything you want to avoid?", help:"Optional. Choose as many as you want.", max:99, optional:true, answers:[
    ["gore","Too much gore","グロすぎるのは避けたい"],["slowstart","Slow start","序盤が遅いのは嫌"],
    ["unclear","Unanswered questions","答えが曖昧なのは嫌"],["dark","Too depressing","重すぎるのは嫌"]
  ]}
];

let anime = [];
let step = 0;
const selections = {};
questions.forEach(q=>selections[q.key]=[]);

const startBtn=document.getElementById("startBtn");
const quiz=document.getElementById("quizPanel");
const results=document.getElementById("resultsPanel");
const host=document.getElementById("questionHost");
const next=document.getElementById("nextBtn");
const back=document.getElementById("backBtn");
const restart=document.getElementById("restartBtn");
const bar=document.getElementById("progressBar");

fetch("data/anime.json").then(r=>r.json()).then(d=>anime=d);

function renderQuestion(){
  const q=questions[step];
  bar.style.width=((step+1)/questions.length*100)+"%";
  host.innerHTML=`<div class="q-kicker">${localText(`QUESTION ${step+1} OF ${questions.length}`, `質問 ${step+1} / ${questions.length}`)}</div>
  <div class="q-title">${localText(q.title, questionJapanese[step])}</div><div class="q-help">${localText(q.help, q.optional ? "選ばなくてもOK。いくつでも選べます。" : q.max===1 ? "1つ選んでください。" : "2つまで選べます。")}</div>
  <div class="answers">${q.answers.map(([v,en,jp])=>`<button class="answer ${selections[q.key].includes(v)?"active":""}" data-v="${v}">${localText(en,jp)}</button>`).join("")}</div>`;
  host.querySelectorAll(".answer").forEach(btn=>btn.onclick=()=>{
    const v=btn.dataset.v;
    if(q.max===1){selections[q.key]=[v];}
    else{
      const arr=selections[q.key];
      if(arr.includes(v)) selections[q.key]=arr.filter(x=>x!==v);
      else if(arr.length<q.max) arr.push(v);
      else {arr.shift();arr.push(v);}
    }
    renderQuestion();
  });
  back.style.visibility=step===0?"hidden":"visible";
  next.textContent=step===questions.length-1?localText("Show my picks","おすすめを見る"):localText("Next","次へ");
}

function canAdvance(){
  const q=questions[step];
  return q.optional || selections[q.key].length>0;
}

function scoreAnime(a){
  let total=0, possible=0;
  for(const group of ["mood","story","pace","darkness"]){
    for(const v of selections[group]){
      total += a.traits[v]||0;
      possible += 5;
    }
  }
  let penalty=0;
  for(const f of selections.dealbreaker) if(a.flags.includes(f)) penalty += 5;
  const raw=Math.max(0,total-penalty);
  return {raw,pct:possible?Math.max(1,Math.min(99,Math.round(raw/possible*100))):0};
}

function showResults(scroll = true){
  const ranked=anime.map(a=>({...a,match:scoreAnime(a)})).sort((a,b)=>b.match.raw-a.match.raw).slice(0,3);
  document.getElementById("resultsGrid").innerHTML=ranked.map((a,i)=>`
    <article class="card">
      <div class="rank">${localText(`#${i+1} MATCH`, `おすすめ ${i+1} · 相性`)}</div>
      <h3>${localText(a.title,a.ja.title)}</h3>
      <div class="score">${a.match.pct}%</div>
      <div class="reason">${localText(a.reason,a.ja.reason)}</div>
      <div class="tags">${(language === "ja" ? a.ja.tags : a.tags).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    </article>`).join("");
  quiz.classList.add("hidden");
  results.classList.remove("hidden");
  if (scroll) window.scrollTo({top:results.offsetTop-20,behavior:"smooth"});
}

startBtn.onclick=()=>{
  quiz.classList.remove("hidden");
  renderQuestion();
  window.scrollTo({top:quiz.offsetTop-20,behavior:"smooth"});
};
next.onclick=()=>{
  if(!canAdvance()){next.animate([{transform:"translateX(0)"},{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],{duration:220});return;}
  if(step<questions.length-1){step++;renderQuestion();}else showResults();
};
back.onclick=()=>{if(step>0){step--;renderQuestion();}};
restart.onclick=()=>{
  step=0;Object.keys(selections).forEach(k=>selections[k]=[]);
  results.classList.add("hidden");quiz.classList.remove("hidden");renderQuestion();
  window.scrollTo({top:quiz.offsetTop-20,behavior:"smooth"});
};

applyLanguage();
