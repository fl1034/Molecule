export type ImportedMolecule = {id:string; name:string; contents:string; format:'mmcif'|'pdb'};
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
 const request=indexedDB.open('molecular-explorer',1);
 request.onupgradeneeded=()=>request.result.createObjectStore('molecules',{keyPath:'id'});
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}
export async function savedImports():Promise<ImportedMolecule[]>{
 const db=await database();return new Promise((resolve,reject)=>{
  const tx=db.transaction('molecules','readonly');const req=tx.objectStore('molecules').getAll();
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();
 });
}
export async function saveImport(molecule:ImportedMolecule){
 const db=await database();return new Promise<void>((resolve,reject)=>{
  const tx=db.transaction('molecules','readwrite');tx.objectStore('molecules').put(molecule);
  tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};
 });
}
