import { Structure, StructureElement, StructureProperties as P, Unit } from 'molstar/lib/mol-model/structure';
import { Loci } from 'molstar/lib/mol-model/loci';
import { OrderedSet } from 'molstar/lib/mol-data/int';
import { SecondaryStructureProvider } from 'molstar/lib/mol-model-props/computed/secondary-structure';
import { ModelSecondaryStructure } from 'molstar/lib/mol-model-formats/structure/property/secondary-structure';
import { SecondaryStructureType as SS } from 'molstar/lib/mol-model/structure/model/types';
export type Feature = {key:string; title:string; name:string; detail:string; loci:StructureElement.Loci};
/** Resolve a picked atom to its annotated secondary-structure element, in one chain/instance. */
export function structuralFeature(picked:Loci, root:Structure):Feature|undefined {
 const normalized=Loci.normalize(picked,'element',true);
 if(!StructureElement.Loci.is(normalized))return;
 const loci=StructureElement.Loci.remap(normalized,root);
 const location=StructureElement.Loci.getFirstLocation(loci);
 if(!location||!Unit.isAtomic(location.unit))return;
 const unit=location.unit, residue=unit.residueIndex[location.element], chain=unit.chainIndex[location.element];
 const ss=SecondaryStructureProvider.get(root).value?.get(unit.invariantId)??ModelSecondaryStructure.Provider.get(unit.model);
 const index=ss?.getIndex(residue),flags=index===undefined?SS.Flag.NA:ss!.type[index];
 const key=index===undefined?undefined:ss!.key[index];
 const element=key===undefined?undefined:ss!.elements[key];
 const helix=SS.is(flags,SS.Flag.Helix), beta=SS.is(flags,SS.Flag.Beta);
 const group=(helix||beta)&&key!==undefined;
 const indices:number[]=[];
 for(let i=0;i<unit.elements.length;i++){
  const atom=unit.elements[i],r=unit.residueIndex[atom];
  if(unit.chainIndex[atom]!==chain)continue;
  if(group ? ss!.key[ss!.getIndex(r)]===key : r===residue)indices.push(i);
 }
 if(!indices.length)return;
 const first=StructureElement.Location.create(root,unit,unit.elements[indices[0]]),last=StructureElement.Location.create(root,unit,unit.elements[indices[indices.length-1]]);
 const number=(l:StructureElement.Location)=>`${P.residue.auth_seq_id(l)}${P.residue.pdbx_PDB_ins_code(l)||''}`;
 const range=number(first)===number(last)?number(first):`${number(first)}–${number(last)}`;
 const chem=P.residue.chem_comp_type(location)??'';
 const entity=P.entity.type(location);
 let title=SS.is(flags,SS.Flag.HelixAlpha)?'Alpha helix':SS.is(flags,SS.Flag.Helix3Ten)?'3₁₀ helix':SS.is(flags,SS.Flag.HelixPi)?'Pi helix':helix?'Helix':beta?'Beta strand':chem.includes('dna')?'DNA nucleotide':chem.includes('rna')?'RNA nucleotide':entity==='water'?'Water':entity==='non-polymer'?'Ligand / ion':SS.is(flags,SS.Flag.Turn)?'Turn':chem.includes('peptide')?'Coil / unassigned residue':'Residue';
 const sheet=element?.kind==='sheet'?` · sheet ${element.sheet_id}`:'';
 const name=P.entity.pdbx_description(location).join(', ')||P.atom.label_comp_id(location);
 return {key:`${unit.id}:${chain}:${group?'ss'+key:'r'+residue}`,title:title+sheet,name,
 detail:`Chain ${P.chain.auth_asym_id(location)} · ${group?'residues':'residue'} ${range}${group?'':' · '+P.atom.label_comp_id(location)} · model ${unit.model.modelNum}`,
 loci:StructureElement.Loci(root,[{unit,indices:OrderedSet.ofSortedArray(indices) as StructureElement.Loci['elements'][number]['indices']}])};
}
