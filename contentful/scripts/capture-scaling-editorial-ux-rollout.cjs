'use strict';
// Read-only BOX browser checks. No CMS writes, no page-injected production scripts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'templates/scaling-editorial-ux/portal-rollout');
const targets = JSON.parse(fs.readFileSync(path.join(out, 'targets.json'), 'utf8'));
let qa = fs.readFileSync(path.join(__dirname, 'check-scaling-editorial-ux-browser.js'), 'utf8');
qa = qa.replace('const images = [...document.images]', 'const images = [...ux.querySelectorAll("img")]')
  .replace('document.querySelector(`img[src="${image.src}"]`)', 'ux.querySelectorAll("img")[images.indexOf(image)]')
  .replaceAll("document.querySelectorAll('button')", "ux.querySelectorAll('button')")
  .replaceAll("document.querySelectorAll('button:disabled')", "ux.querySelectorAll('button:disabled')");
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
  const report=[];
  fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  try {
    for(const type of ['filled-category','placeholder-category','article']) for(const width of [1280,390]) {
      issues.length=0;
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
      await send('Page.navigate',{url:targets[type]}); await ready(targets[type]);
      const result=await evaluate(`(${qa})()`);
      const extra=await evaluate(`(() => {
        const root=document.querySelector('.lpb-editorial-ux-root'), ux=root.querySelector('.lpb-editorial-ux');
        const imgs=[...root.querySelectorAll('img')];
        const avatar=root.querySelector('.lpb-editorial-author__avatar');
        const links=[...root.querySelectorAll('.lpb-editorial-ux-demo-note a')].map(a=>a.href);
        const sheets=[...document.styleSheets].map(s=>s.href).filter(Boolean);
        return {allGrey:imgs.every(i=>i.src===${JSON.stringify('https://www.static-immobilienscout24.de/fro/lpbuilder-contentful-placeholder/_/1920x1080.png')}),
          testLinks:links, stylesheets:sheets,
          font:getComputedStyle(ux).fontFamily,
          fonts:[400,700,800].map(w=>({weight:w,loaded:document.fonts.check(w+' 16px "Make It Better"')})),
          avatar:avatar?{width:avatar.getBoundingClientRect().width,height:avatar.getBoundingClientRect().height,radius:getComputedStyle(avatar).borderRadius}:null,
          navHeight:root.querySelector('.lpb-news-nav').getBoundingClientRect().height,
          rootCount:document.querySelectorAll('.lpb-explicit-spacing').length};
      })()`);
      if(extra.rootCount!==1 || !extra.fonts.every(f=>f.loaded)) throw new Error('Host media/font/root check failed');
      if(!extra.stylesheets.some(s=>s.includes('lpbuilder-bridge.css'))) throw new Error('Bridge not loaded');
      const typography=await evaluate(`(() => {
        const titles=[...document.querySelectorAll('.lpb-editorial-ux .lpb-editorial-article__header h1, .lpb-editorial-ux .lpb-editorial-ux-card__title, .lpb-editorial-ux .lpb-editorial-ux-category-lead h1, .lpb-editorial-ux .lpb-editorial-ux-reading h3')];
        return titles.map(t=>({text:t.textContent,hyphens:getComputedStyle(t).hyphens,overflowWrap:getComputedStyle(t).overflowWrap,fontSize:getComputedStyle(t).fontSize}));
      })()`);
      if(!typography.length || !typography.every(t=>t.hyphens==='none' && t.overflowWrap==='anywhere')) throw new Error('UX title hyphenation fix missing');
      result.typography=typography;result.host=extra; result.consoleErrors=[...issues];
      await evaluate('window.scrollTo(0,0)');
      const metrics=await send('Page.getLayoutMetrics');
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.ceil(metrics.cssContentSize.height),scale:1}});
      const name=type+'-'+(width===1280?'desktop':'mobile')+'.png';
      fs.writeFileSync(path.join(out,'screenshots',name),Buffer.from(shot.data,'base64'));
      result.screenshot=name;report.push(result);
      fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2)+'\n');
      console.log(type+' '+width+'px PASS; '+result.images.length+' images; grid '+result.gridColumns.join('/')+'; errors '+issues.length);
    }
    // Exercise the actual lead link with a browser click.
    await send('Page.navigate',{url:targets["filled-category"]}); await ready(targets["filled-category"]);
    await evaluate(`document.querySelector('.lpb-editorial-ux-category-lead a').click()`);
    await ready(targets.article);
    for(const r of report) r.actualLeadClickPassed=true;
    fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2)+'\n');
    console.log('Actual existing category-to-article link passed; six rollout host screenshots saved.');
  } finally {socket.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
