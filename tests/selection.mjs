import {chromium} from '@playwright/test';
const b=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const p=await b.newPage({viewport:{width:1200,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:5173');
const ready=()=>p.waitForFunction(()=>document.querySelector('#screenshot')&&!document.querySelector('#screenshot').disabled,null,{timeout:60000});await ready();await p.waitForTimeout(2000);
async function find(type){
 for(const [x,y] of [[450,300],[600,450],[600,350],[550,400],[650,400],[500,500],[650,550],[550,550],[700,450],[450,450],[600,600],[700,350]]){
  await p.mouse.move(x,y);await p.waitForTimeout(1500);
  const t=p.locator('#feature-prompt');if(await t.isVisible()&&(await t.locator('strong').textContent()).includes(type))return {x,y};
 }
 throw Error(`No ${type} found`);
}
let pt=await find('Alpha helix');console.log(await p.locator('#feature-prompt').textContent());await p.mouse.click(pt.x,pt.y);await p.waitForFunction(()=>document.querySelector('#feature-prompt small')?.textContent.includes('Selected'));
await p.screenshot({path:'docs/selection-alpha.png'});await p.keyboard.press('Escape');if(await p.locator('#feature-prompt').isVisible())throw Error('Escape failed');
await p.locator('[data-molecule="1EMA"]').click();await ready();pt=await find('Beta strand');console.log(await p.locator('#feature-prompt').textContent());await p.mouse.click(pt.x,pt.y);await p.waitForFunction(()=>document.querySelector('#feature-prompt small')?.textContent.includes('Selected'));await p.screenshot({path:'docs/selection-beta.png'});
await p.mouse.click(20,20);if(await p.locator('#feature-prompt').isVisible())throw Error('Background clear failed');
await p.locator('[data-molecule="1BNA"]').click();await ready();await find('DNA nucleotide');console.log(await p.locator('#feature-prompt').textContent());
if(errors.length)throw Error(errors.join('\n'));console.log('Alpha, beta, DNA prompts; click selection, Escape and background clearing passed');await b.close();
