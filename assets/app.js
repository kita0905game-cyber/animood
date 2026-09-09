
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
  host.innerHTML=`<div class="q-kicker">QUESTION ${step+1} OF ${questions.length}</div>
  <div class="q-title">${q.title}</div><div class="q-help">${q.help}</div>
  <div class="answers">${q.answers.map(([v,en,jp])=>`<button class="answer ${selections[q.key].includes(v)?"active":""}" data-v="${v}">${en}<small>${jp}</small></button>`).join("")}</div>`;
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
  next.textContent=step===questions.length-1?"Show my picks":"Next";
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

function showResults(){
  const ranked=anime.map(a=>({...a,match:scoreAnime(a)})).sort((a,b)=>b.match.raw-a.match.raw).slice(0,3);
  document.getElementById("resultsGrid").innerHTML=ranked.map((a,i)=>`
    <article class="card">
      <div class="rank">#${i+1} MATCH</div>
      <h3>${a.title}</h3>
      <div class="score">${a.match.pct}%</div>
      <div class="reason">${a.reason}</div>
      <div class="tags">${a.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    </article>`).join("");
  quiz.classList.add("hidden");
  results.classList.remove("hidden");
  window.scrollTo({top:results.offsetTop-20,behavior:"smooth"});
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
