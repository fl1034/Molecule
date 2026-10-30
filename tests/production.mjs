import {chromium} from '@playwright/test';
const b=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const p=await b.newPage();
const ready=()=>p.waitForFunction(()=>document.querySelector('#screenshot')&&!document.querySelector('#screenshot').disabled,null,{timeout:60000});
await p.goto('http://127.0.0.1:4174/demo/');await ready();await p.reload();await ready();
await p.route('**/1BNA.cif',r=>r.fulfill({status:404,body:'Missing'}));await p.locator('[data-molecule="1BNA"]').click();await p.waitForFunction(()=>document.querySelector('#status').textContent.includes('Could not load'));
await p.unroute('**/1BNA.cif');await p.locator('[data-molecule="1BNA"]').click();await ready();
console.log('Production subpath, reload and failed-load recovery passed');await b.close();
