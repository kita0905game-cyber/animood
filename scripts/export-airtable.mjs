import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const fields = ['Title','English Title','General Tags','Media Type','Episodes',
 'Release Year','Airing Status',"Editor's Take",'Public Ready','Evaluation Status',
 'General Tags Updated','Metadata Updated'];
const name = v => typeof v === 'string' ? v : v?.name ?? null;
const text = v => typeof v === 'string' && v.trim() ? v.trim() : null;
const integer = v => Number.isInteger(v) && v > 0 ? v : null;
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0,10) : null;

export function normalize(records) {
 const seen = new Set();
 return records.map(r=>{
  if (!r.id || seen.has(r.id)) throw Error('Missing or duplicate source ID');
  seen.add(r.id);
  const f=r.fields||{}, title=text(f['English Title']);
  const tags=Array.isArray(f['General Tags']) ? [...new Set(f['General Tags'].map(name).filter(Boolean))].sort() : [];
  if(!title||!tags.length) throw Error('Source row lacks public title or tags; preserve previous output and review');
  const editorsTake=name(f['Evaluation Status'])==='評価済み' && f['Public Ready']===true ? text(f["Editor's Take"]) : null;
  return {id:r.id,title,titleJa:text(f.Title),generalTags:tags,mediaType:name(f['Media Type']),
   episodes:integer(f.Episodes),releaseYear:integer(f['Release Year']),airingStatus:name(f['Airing Status']),
   editorsTake,sources:{tags:'Editorial seed',tagsUpdated:date(f['General Tags Updated']),metadataUpdated:date(f['Metadata Updated'])}};
 }).sort((a,b)=>a.title.localeCompare(b.title,'en')||a.id.localeCompare(b.id));
}

export function validatePublic(rows) {
 const allowed=['id','title','titleJa','generalTags','mediaType','episodes','releaseYear','airingStatus','editorsTake','sources'];
 for(const a of rows){
  if(Object.keys(a).some(k=>!allowed.includes(k))) throw Error('Unexpected public field');
  const strings=[a.title,a.titleJa,a.editorsTake,...a.generalTags].filter(Boolean).join('\n');
  if(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b(?:pat|ghp|github_pat)_[A-Za-z0-9_]+|https?:\/\//i.test(strings)) throw Error('Public copy requires privacy review');
 }
}

export async function fetchAll(token) {
 if(!token) throw Error('Register AIRTABLE_PAT in repository Actions secrets; existing site data is preserved');
 const records=[], offsets=new Set();let offset;
 do {
  const params=new URLSearchParams({pageSize:'100'});
  fields.forEach(f=>params.append('fields[]',f));if(offset)params.set('offset',offset);
  const url=`https://api.airtable.com/v0/appXkCYzNbv1LDV6O/tblokhzcBwhVIZwTv?${params}`;
  let res;
  for(let attempt=0;attempt<4;attempt++){
   res=await fetch(url,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(30000)});
   if(res.status!==429&&res.status<500)break;
   if(attempt<3)await new Promise(r=>setTimeout(r,1000*(attempt+1)));
  }
  if(!res.ok)throw Error(`Airtable request failed (${res.status}); existing output preserved`);
  const body=await res.json();if(!Array.isArray(body.records))throw Error('Invalid source response');
  records.push(...body.records);offset=body.offset;
  if(offset){if(offsets.has(offset))throw Error('Repeated pagination cursor');offsets.add(offset);}
 }while(offset);
 return records;
}

export async function writePublic(rows,out='data/anime.json') {
 validatePublic(rows);if(!rows.length)throw Error('Empty source export rejected');
 let previous=null;
 try{previous=JSON.parse(await fs.readFile(out,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(previous?.anime?.length && rows.length < previous.anime.length*.8 && process.env.ALLOW_CATALOG_SHRINK!=='true')throw Error('Unexpected catalog shrink; manual review required');
 if(previous?.schemaVersion===2 && JSON.stringify(previous.anime)===JSON.stringify(rows)){console.log('No public data changes');return false;}
 const payload={schemaVersion:2,generatedAt:new Date().toISOString(),count:rows.length,anime:rows};
 await fs.mkdir(path.dirname(out),{recursive:true});
 await fs.writeFile(out+'.tmp',JSON.stringify(payload,null,2)+'\n');await fs.rename(out+'.tmp',out);
 console.log(`Exported ${rows.length} public titles`);return true;
}

async function main(){
 let records;
 const i=process.argv.indexOf('--snapshot');
 if(i>=0){const s=JSON.parse(await fs.readFile(process.argv[i+1],'utf8'));if(s.complete!==true||s.totalRecordCount!==s.records?.length)throw Error('Incomplete connector snapshot');records=s.records;}
 else records=await fetchAll(process.env.AIRTABLE_PAT);
 await writePublic(normalize(records),process.env.ANIMOOD_OUTPUT||'data/anime.json');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
