'use strict';
// Read-only BOX browser checks. No CMS writes, no page-injected production scripts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'templates/scaling-editorial-ux/portal-refinement-20261107');
const targets = JSON.parse(fs.readFileSync(path.join(out, 'targets.json'), 'utf8'));
const qa = fs.readFileSync(path.join(__dirname,'check-scaling-editorial-refinement.js'),'utf8');
const local=process.argv.includes('--local');
if(local){for(const k of Object.keys(targets))targets[k]='http://127.0.0.1:8765/templates/scaling-editorial-ux/'+(k==='news'?'home':k==='market'?'category':k)+'-preview.html';}
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const target = pages.find(t => t.type === 'page');
  if (!target) throw new Error('No isolated QA Chrome page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { socket.addEventListener('open', ok, {once:true}); socket.addEventListener('error', fail, {once:true}); });
  let id = 0;
  const pending = new Map(), issues = [];
  socket.addEventListener('message', event => {
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') issues.push(m.params.exceptionDetails.text);
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') issues.push(m.params.entry.text);
    if (!pending.has(m.id)) return;
    const [ok, fail] = pending.get(m.id); pending.delete(m.id);
    m.error ? fail(new Error(m.error.message)) : ok(m.result);
  });
  const send = (method, params={}) => new Promise((ok, fail) => { const requestId=++id; pending.set(requestId,[ok,fail]); socket.send(JSON.stringify({id:requestId,method,params})); });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', {expression,awaitPromise:true,returnByValue:true});
    if(r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const ready = async url => {
    for(let i=0;i<150;i++) {
      await wait(100);
      try { if(await evaluate(`(location.href === ${JSON.stringify(url)} || location.href === ${JSON.stringify(url + '/')}) && !!document.querySelector('.lpb-editorial-ux') && document.readyState === 'complete'`)) return; } catch {}
    }
    throw new Error('BOX page not ready: '+url);
  };
  const before=process.argv.includes('--before')||process.argv.includes('--crumb-baseline');
  const crumbBaseline=process.argv.includes('--crumb-baseline');
  const report=[];
  fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  try {
    for(const type of ['news','market','category','article']) for(const width of [1280,390]) {
      issues.length=0;
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
      await send('Page.navigate',{url:targets[type]}); await ready(targets[type]);
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      const result=await evaluate(`(${qa})()`);
      if(!local && !await evaluate(`!!document.querySelector('header.page-header')`))throw Error('Actual host header missing');
      await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});await wait(300);
      const point=await evaluate(`(() => {const a=[...document.querySelectorAll('.lpb-news-nav__item:not([aria-current])')].find(a=>{const r=a.getBoundingClientRect();return r.x+r.width/2<innerWidth;});const r=a.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+15,color:getComputedStyle(a).color,transition:getComputedStyle(a).transitionDuration,href:a.getAttribute('href')};})()`);
      await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});await wait(75);
      const mid=await evaluate(`(() => {const a=document.querySelector('.lpb-news-nav__item:hover');return a?getComputedStyle(a).color:null;})()`);
      await wait(300);
      const end=await evaluate(`(() => {const a=document.querySelector('.lpb-news-nav__item:hover');return a?getComputedStyle(a).color:null;})()`);
      if(end!=='rgb(51, 51, 51)'||point.color===end||point.transition==='0s')throw Error('Actual COSMA hover transition failed');
      result.hover={before:point.color,intermediate:mid,after:end,duration:point.transition};
      await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});await wait(300);
      await evaluate('window.scrollTo(0,0)');
      const metrics=await send('Page.getLayoutMetrics');
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.ceil(metrics.cssContentSize.height),scale:1}});
      const name=type+'-'+(width===1280?'desktop':'mobile')+'.png';
      fs.writeFileSync(path.join(out,'screenshots', (local?'local-':'')+name),Buffer.from(shot.data,'base64'));
      result.screenshot=name;report.push(result);
      fs.writeFileSync(path.join(out,local?'local-browser-checks.json':'browser-checks.json'),JSON.stringify(report,null,2)+'\n');
      console.log(type+' '+width+'px '+'PASS x='+result.content.x+' width='+result.content.width);
    }
  } finally {socket.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
