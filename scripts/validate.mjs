import {stories} from '../src/stories.ts';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const provenance=JSON.parse(readFileSync(new URL('../docs/provenance.json',import.meta.url)));
for(const s of stories){
 const path=new URL(`../public/structures/${s.id}.cif`,import.meta.url);
 if(!existsSync(path))throw Error(`Missing ${s.id} asset`);
 if(s.stops.length!==4)throw Error('Expected four stops');
 if(createHash('sha256').update(readFileSync(path)).digest('hex')!==provenance.find(p=>p.pdbId===s.id).sha256)throw Error(`Changed coordinates: ${s.id}`);
 for(const stop of s.stops)if(!stop.title||!stop.text)throw Error('Missing stop content');
}
console.log(`${stories.length} stories, ${stories.reduce((n,s)=>n+s.stops.length,0)} stops, component references and asset hashes verified.`);
