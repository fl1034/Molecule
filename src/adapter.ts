import {PluginContext} from 'molstar/lib/mol-plugin/context';
import {DefaultPluginSpec} from 'molstar/lib/mol-plugin/spec';
import {MolScriptBuilder as MS} from 'molstar/lib/mol-script/language/builder';
import {setSubtreeVisibility} from 'molstar/lib/mol-plugin/behavior/static/state';
import { HighlightLoci, SelectLoci, FocusLoci } from 'molstar/lib/mol-plugin/behavior/dynamic/representation';
import { MarkerAction } from 'molstar/lib/mol-util/marker-action';
import { Vec2 } from 'molstar/lib/mol-math/linear-algebra';
import { EveryLoci } from 'molstar/lib/mol-model/loci';
import { structuralFeature, type Feature } from './selection';
import {Color} from 'molstar/lib/mol-util/color';
import type {Story,Stop} from './stories';
function viewerSpec(){const spec=DefaultPluginSpec();spec.behaviors=spec.behaviors.filter(b=>![HighlightLoci,SelectLoci,FocusLoci].includes(b.transformer));return spec;}
export type FeaturePrompt={feature:Feature; selected:boolean; x:number; y:number}|undefined;
export class Adapter {
 private selected?:Feature;
 private hoverTimer?:ReturnType<typeof setTimeout>;
 private removePointerListeners?:()=>void;
 private prompt:(value:FeaturePrompt)=>void=()=>{};
 private escape=(e:KeyboardEvent)=>{if(e.key==='Escape')this.clearSelection();};
 clearSelection(){clearTimeout(this.hoverTimer);this.selected=undefined;this.plugin.canvas3d?.mark({loci:EveryLoci},MarkerAction.Deselect);this.plugin.canvas3d?.mark({loci:EveryLoci},MarkerAction.RemoveHighlight);this.prompt(undefined);}

 private resizeObserver?:ResizeObserver;
 plugin=new PluginContext(viewerSpec()); components:Record<string,any>={}; structure:any; story!:Story;
 async init(canvas:HTMLCanvasElement, host:HTMLDivElement, onPrompt:(value:FeaturePrompt)=>void){
  await this.plugin.init(); if(!await this.plugin.initViewerAsync(canvas,host)) throw Error('WebGL is unavailable. Try a browser with hardware acceleration enabled.');
  this.plugin.canvas3d?.setProps({renderer:{backgroundColor:Color(0x242424)}, camera:{helper:{axes:{name:"off",params:{}}}}});
  this.resizeObserver=new ResizeObserver(()=>{this.plugin.handleResize();});
  this.resizeObserver.observe(host);
  this.prompt=onPrompt; window.addEventListener('keydown',this.escape);
  const leave=()=>{clearTimeout(this.hoverTimer);this.plugin.canvas3d?.mark({loci:EveryLoci},MarkerAction.RemoveHighlight);this.prompt(undefined);};
  const move=(e:PointerEvent)=>{
   leave();if(e.buttons||e.pointerType==='touch')return;
   const x=e.clientX,y=e.clientY;
   this.hoverTimer=setTimeout(()=>{
    const viewer=this.plugin.canvas3d;if(!viewer||!this.structure?.obj)return;
    const bounds=canvas.getBoundingClientRect();
    const pick=viewer.identify(Vec2.create(x-bounds.left,y-bounds.top));
    const feature=structuralFeature(viewer.getLoci(pick?.id).loci,this.structure.obj.data);
    if(feature)viewer.mark({loci:feature.loci},MarkerAction.Highlight);
    this.prompt(feature?{feature,selected:this.selected?.key===feature.key,x,y}:undefined);
   },100);
  };
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('pointerdown',leave);
  this.removePointerListeners=()=>{clearTimeout(this.hoverTimer);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerdown',leave);};
  this.plugin.behaviors.interaction.click.subscribe(e=>{
   if(e.button!==1)return;
   const feature=this.structure?.obj?structuralFeature(e.current.loci,this.structure.obj.data):undefined;
   const same=feature?.key===this.selected?.key;this.clearSelection();
   if(feature&&!same){this.selected=feature;this.plugin.canvas3d?.mark({loci:feature.loci},MarkerAction.Select);this.prompt({feature,selected:true,x:e.page?.[0]??20,y:e.page?.[1]??20});}
  });
 }
 async load(story:Story){
  this.clearSelection();this.structure=undefined;await this.plugin.clear(); this.components={}; this.story=story;
  const data=await this.plugin.builders.data.download({url:`${import.meta.env.BASE_URL}structures/${story.id}.cif`,isBinary:false});
  const trajectory=await this.plugin.builders.structure.parseTrajectory(data,'mmcif');
  const model=await this.plugin.builders.structure.createModel(trajectory,{modelIndex:0});
  this.structure=await this.plugin.builders.structure.createStructure(model,{name:'model',params:{}});
  for(const [id,c] of Object.entries(story.components)){
   const tests:any={};
   if(c.chains) tests['chain-test']=MS.core.set.has([MS.set(...c.chains),MS.struct.atomProperty.macromolecular.auth_asym_id()]);
   const residues:any[]=[MS.core.rel.neq([MS.struct.atomProperty.macromolecular.label_comp_id(),'HOH'])];
   if(c.residues) residues.push(MS.core.set.has([MS.set(...c.residues),MS.struct.atomProperty.macromolecular.auth_seq_id()]));
   if(c.compounds) residues.push(MS.core.set.has([MS.set(...c.compounds),MS.struct.atomProperty.macromolecular.label_comp_id()]));
   tests['residue-test']=MS.core.logic.and(residues);
   const component=await this.plugin.builders.structure.tryCreateComponentFromExpression(this.structure,MS.struct.generator.atomGroups(tests),id,{label:c.name});
   if(!component?.obj?.data.elementCount) throw Error(`Empty selection: ${c.name}`);
   this.components[id]=component;
   await this.plugin.builders.structure.representation.addRepresentation(component,{type:c.kind,color:'uniform',colorParams:{value:Color(c.color)}});
  }
 }
 async loadFile(name:string, contents:string, format:'mmcif'|'pdb'){
  this.clearSelection();this.structure=undefined;await this.plugin.clear(); this.components={};
  const data=await this.plugin.builders.data.rawData({data:contents,label:name});
  const trajectory=await this.plugin.builders.structure.parseTrajectory(data,format);
  if(!trajectory.obj?.data.frameCount) throw Error('No molecular coordinates found in this file.');
  const model=await this.plugin.builders.structure.createModel(trajectory,{modelIndex:0});
  this.structure=await this.plugin.builders.structure.createStructure(model,{name:'model',params:{}});
  if(!this.structure.obj?.data.elementCount) throw Error('No atoms found in this file.');
  await this.plugin.builders.structure.representation.applyPreset(this.structure,'auto');
  this.focus('all');
 }
 async screenshot(name:string){
  const helper=this.plugin.helpers.viewportScreenshot;
  if(!helper) throw Error('Screenshot is unavailable.');
  await helper.download(`${name.replace(/[^a-z0-9_-]/gi,'_')}.png`);
 }
 async stop(stop:Stop){for(const [id,c] of Object.entries(this.components)) setSubtreeVisibility(this.plugin.state.data,c.ref,!stop.visible.includes(id)); this.focus(stop.focus);}
 focus(id:string){const s=id==='all'?this.structure:this.components[id];this.plugin.managers.camera.focusSphere(s.obj.data.boundary.sphere,{durationMs:0});}
 isolate(id:string){for(const [key,c] of Object.entries(this.components))setSubtreeVisibility(this.plugin.state.data,c.ref,id!=='all'&&key!==id);this.focus(id);}
 counts(){return Object.fromEntries(Object.entries(this.components).map(([k,v])=>[k,v.obj.data.elementCount]));}
 dispose(){this.removePointerListeners?.();window.removeEventListener('keydown',this.escape);this.resizeObserver?.disconnect();this.plugin.dispose();}
}
