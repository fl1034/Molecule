import './style.css';
import {stories} from './stories';
import {Adapter} from './adapter';
import {savedImports,saveImport,type ImportedMolecule} from './imports';

type Entry={id:string;name:string;story?:typeof stories[number];file?:ImportedMolecule};
const names:Record<string,string>={'4HHB':'Hemoglobin','1BNA':'DNA double helix','1AOI':'Nucleosome','1EMA':'Green fluorescent protein','1LYZ':'Lysozyme','1EHZ':'Transfer RNA','1MBN':'Myoglobin','1F88':'Rhodopsin','1BMF':'ATP synthase · F1'};
const entries:Entry[]=stories.map(story=>({id:story.id,name:names[story.id]??story.title,story}));
document.querySelector('#app')!.innerHTML=`<main id="viewer"><canvas tabindex="0" aria-label="Molecule. Drag to rotate; scroll or pinch to zoom."></canvas></main><aside aria-label="Molecule controls"><nav id="molecules" aria-label="Molecules"></nav><div class="actions"><button id="import" aria-label="Import" data-tip="Import"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/></svg></button><button id="screenshot" aria-label="Screenshot" data-tip="Screenshot" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 6 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-3l-2-3Z"/><circle cx="12" cy="14" r="4"/></svg></button></div><input id="file" type="file" accept=".cif,.mmcif,.pdb,.ent" multiple hidden></aside><div id="feature-prompt" role="tooltip" hidden></div><div id="status" role="status" aria-live="polite" hidden></div>`;
const $=(id:string)=>document.getElementById(id)!;
const tooltip=$('feature-prompt');
function showFeature(value:import('./adapter').FeaturePrompt){
 tooltip.replaceChildren();tooltip.hidden=!value;if(!value)return;
 const title=document.createElement('strong');title.textContent=value.feature.title;
 const name=document.createElement('span');name.textContent=value.feature.name;
 const detail=document.createElement('span');detail.textContent=value.feature.detail;
 const hint=document.createElement('small');hint.textContent=value.selected?'Selected · click again or Esc to clear':'Click to select';
 tooltip.append(title,name,detail,hint);
 tooltip.style.left=`${Math.max(8,Math.min(value.x+16,innerWidth-tooltip.offsetWidth-8))}px`;
 tooltip.style.top=`${Math.max(8,Math.min(value.y+16,innerHeight-tooltip.offsetHeight-8))}px`;
}
const adapter=new Adapter();let current:Entry|undefined;let revision=0;let queue=Promise.resolve();let initialized=false;let busy=true;let importing=false;
function message(text=''){ $('status').textContent=text;$('status').hidden=!text; }
function lock(value:boolean){busy=value;($('screenshot') as HTMLButtonElement).disabled=value||!current;($('import') as HTMLButtonElement).disabled=!initialized||value;}
function list(){
 $('molecules').replaceChildren(...entries.map(entry=>{
  const button=document.createElement('button');button.textContent=entry.name;button.dataset.molecule=entry.id;
  button.title=entry.file?entry.file.name:`${entry.name} · ${entry.id}`;button.setAttribute('aria-pressed',String(current?.id===entry.id));button.disabled=!initialized||importing;
  button.onclick=()=>void select(entry);return button;
 }));
}
function select(entry:Entry){
 const token=++revision;current=entry;lock(true);list();message(`Loading ${entry.name}…`);
 queue=queue.catch(()=>{}).then(async()=>{
  if(token!==revision)return;
  try{
   if(entry.story){await adapter.load(entry.story);await adapter.stop(entry.story.stops[0]);}
   else if(entry.file)await adapter.loadFile(entry.name,entry.file.contents,entry.file.format);
   if(token!==revision)return;
   lock(false);message();
  }catch(e){if(token!==revision)return;lock(false);($('screenshot') as HTMLButtonElement).disabled=true;message(`Could not load ${entry.name}. Select a molecule to retry. ${e instanceof Error?e.message:String(e)}`);}
 });return queue;
}
$('import').onclick=()=>($('file') as HTMLInputElement).click();
$('file').onchange=async()=>{
 const input=$('file') as HTMLInputElement;const files=Array.from(input.files??[]);input.value='';
 if(!files.length||busy)return;
 importing=true;lock(true);list();const errors:string[]=[];let last:Entry|undefined;
 for(const file of files){
  message(`Importing ${file.name}…`);
  try{
   const extension=file.name.split('.').pop()?.toLowerCase();
   if(!['cif','mmcif','pdb','ent'].includes(extension??''))throw Error('Use a .cif, .mmcif, or .pdb file.');
   if(file.size>50*1024*1024)throw Error('Files must be smaller than 50 MB.');
   const imported:ImportedMolecule={id:crypto.randomUUID(),name:file.name,contents:await file.text(),format:extension==='pdb'||extension==='ent'?'pdb':'mmcif'};
   // Serialize parsing with ordinary selections; only successfully parsed files enter the list.
   queue=queue.catch(()=>{}).then(()=>adapter.loadFile(imported.name,imported.contents,imported.format));
   await queue;
   await saveImport(imported);
   last={id:imported.id,name:imported.name,file:imported};entries.push(last);
  }catch(e){errors.push(`${file.name}: ${e instanceof Error?e.message:String(e)}`);}
 }
 if(last)await select(last);else if(current)await select(current);
 importing=false;lock(false);list();if(errors.length)message(errors.join(' '));
};
$('screenshot').onclick=async()=>{
 if(busy||!current)return;lock(true);
 try{await adapter.screenshot(current.name);message();}catch(e){message(`Screenshot failed: ${String(e)}`);}finally{lock(false);}
};
list();lock(true);
try{
 await adapter.init(document.querySelector('canvas')!,$('viewer') as HTMLDivElement,showFeature);initialized=true;
 try{for(const file of await savedImports())entries.push({id:file.id,name:file.name,file});}catch{message('Local import storage is unavailable in this browser.');}
 await select(entries[0]);
}catch(e){message(String(e));}
window.addEventListener('pagehide',()=>adapter.dispose());
