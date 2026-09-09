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
 ['.method p','感情の重さ、伏線回収、謎、テンポ、雰囲気など、人の手で設定した特徴をもとにおすすめしています。正式承認されたデータを使い、未設定の項目は採点から外しています。'],
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
 updateDataNotice();
});


const questions = [
  {key:"mood", title:"What do you want to feel tonight?", help:"Choose up to two.", max:2, answers:[
    ["mind","Mind-bending","頭を使いたい"],["tension","High tension","ハラハラしたい"],["emotional","Emotional","感動したい"],
    ["cozy","Cozy","癒されたい"],["badass","Badass","カッコいいの見たい"],["funny","Funny","笑いたい"]
  ]},
  {key:"story", title:"What matters most in the story?", help:"Choose up to two.", max:2, answers:[
    ["foreshadow","Foreshadowing & payoff","伏線回収"],["world","Worldbuilding","世界観・設定"],["characters","Characters","キャラクター"],
    ["mystery","Mystery","謎・考察"],["action","Action","戦い・アクション"],["ambiguity","Open-ended interpretation","答えを残して考察したい"]
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

let loadState = 'loading';
const dataNotice = document.createElement('p');
dataNotice.className = 'data-notice';
dataNotice.setAttribute('role','status');
startBtn.after(dataNotice);
function updateDataNotice(){
 startBtn.disabled = loadState === 'loading';
 dataNotice.textContent = loadState === 'loading' ? localText('Loading recommendations…','作品データを読み込み中…') : loadState === 'error' ? localText('Could not load recommendations. Select the button to retry.','読み込めませんでした。ボタンを押すと再試行します。') : anime.length ? '' : localText('Our first recommendations are being prepared. Please check back soon.','公開できる作品を準備中です。しばらくしてからお試しください。');
}
async function loadAnime(){
 loadState = 'loading'; updateDataNotice();
 try {
  const response = await fetch('data/anime.json');
  if (!response.ok) throw new Error('load');
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error('schema');
  anime = records.filter(a=>a.evaluationStatus==='評価済み' && a.publicReady===true);
  loadState = 'ready';
 } catch { loadState = 'error'; }
 updateDataNotice();
}
function escapeHTML(value){return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

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

function showResults(scroll = true){
  const ranked=AniMoodEngine.rank(anime,selections);
  document.getElementById("resultsGrid").innerHTML=ranked.map((a,i)=>`
    <article class="card">
      <div class="rank">${localText(`#${i+1} MATCH`, `おすすめ ${i+1} · 相性`)}</div>
      <h3>${escapeHTML(localText(a.title,a.ja.title))}</h3>
      ${a.match.incomplete ? `<p class="match-note">${localText('Some preferences could not be checked.','一部の希望は未設定のため照合できていません。')}</p>` : ''}
      ${a.match.contentUnknown ? `<p class="match-note">${localText('Content information is incomplete. Check content guidance before watching.','苦手な描写の情報が不足しています。視聴前に内容をご確認ください。')}</p>` : ''}
      <div class="reason">${escapeHTML(localText(a.reason,a.ja.reason))}</div>
      <div class="tags">${(language === "ja" ? a.ja.tags : a.tags).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
    </article>`).join("") || `<p class="empty-result">${localText('No matches for these preferences yet. Try changing your answers.','今の条件に合う作品はまだありません。回答を変えてお試しください。')}</p>`;
  quiz.classList.add("hidden");
  results.classList.remove("hidden");
  if (scroll) window.scrollTo({top:results.offsetTop-20,behavior:"smooth"});
}

startBtn.onclick=()=>{
  if(loadState==='error'){loadAnime();return;}
  if(loadState!=='ready'||!anime.length)return;
  results.classList.add('hidden');
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
loadAnime();
