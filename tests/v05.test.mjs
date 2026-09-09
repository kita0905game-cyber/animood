import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {normalize,validatePublic,writePublic} from '../scripts/export-airtable.mjs';
import engine from '../assets/engine.js';
const cfg=JSON.parse(await fs.readFile(new URL('../data/tag_scoring.json',import.meta.url)));
const row=(extra={})=>({id:'record',fields:{Title:'作品','English Title':'Title','General Tags':['Mystery','Gore'],...extra}});
test('unrated titles are eligible but editorial notes are gated',()=>{
 const a=normalize([row({"Editor's Take":'Private draft','Evaluation Status':'未評価','Public Ready':true,'User Review':'PRIVATE'})])[0];
 assert.equal(a.editorsTake,null);assert(!JSON.stringify(a).includes('PRIVATE'));assert.equal(a.episodes,null);
 assert.equal(normalize([row({"Editor's Take":'Approved note','Evaluation Status':{name:'評価済み'},'Public Ready':true})])[0].editorsTake,'Approved note');
});
test('unexpected fields and contact information fail privacy checks',()=>{
 assert.throws(()=>validatePublic([{...normalize([row()])[0],userReview:'leak'}]));
 assert.throws(()=>validatePublic(normalize([row({'English Title':'contact@example.com'})])));
});
test('missing title fails rather than silently dropping catalog',()=>assert.throws(()=>normalize([row({'English Title':null})])));
test('stable data does not change timestamps or files',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'animood-test-'));const out=path.join(dir,'anime.json');
 try{const rows=normalize([row()]);await writePublic(rows,out);const first=await fs.readFile(out,'utf8');assert.equal(await writePublic(rows,out),false);assert.equal(await fs.readFile(out,'utf8'),first);}finally{await fs.rm(dir,{recursive:true});}
});
test('hard filters beat mood and taste',()=>{
 const a=normalize([row()])[0];assert.equal(engine.score(a,{moods:['mind_bending'],filters:['no_gore']},cfg),null);
});
test('unknown completion and duration are not guessed',()=>{
 const a=normalize([row()])[0];assert.equal(engine.score(a,{moods:['mind_bending'],filters:['finished_only']},cfg),null);assert.equal(engine.score(a,{moods:['mind_bending'],shortOnly:true},cfg),null);
});
test('unrelated tags cannot produce a match or popularity bonus',()=>{
 const a=normalize([row({'General Tags':['School']})])[0];assert.equal(engine.score(a,{moods:['mind_bending']},cfg),null);
});
test('like route requires selected reason and excludes source work',()=>{
 const a=normalize([row()])[0];assert.equal(engine.score(a,{excludeId:a.id,likeTags:{Mystery:3}},cfg),null);assert.equal(engine.score(a,{excludeId:'other',likeTags:{Comedy:3}},cfg),null);assert(engine.score(a,{excludeId:'other',likeTags:{Mystery:3}},cfg));
});
