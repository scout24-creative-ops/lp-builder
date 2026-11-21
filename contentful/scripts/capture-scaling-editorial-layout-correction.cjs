'use strict';
// Read-only BOX browser checks. No CMS writes, no page-injected production scripts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'templates/scaling-editorial-ux/layout-correction');
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
  const before=process.argv.includes('--before')||process.argv.includes('--crumb-baseline');
  const crumbBaseline=process.argv.includes('--crumb-baseline');
  const report=[];
  fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  try {
    for(const type of ['home','category','article']) for(const width of [1280,390]) {
      issues.length=0;
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
      await send('Page.navigate',{url:targets[type]}); await ready(targets[type]);
      const result=before ? {} : await evaluate(`(${qa})()`);
      result.url=targets[type];result.viewport=width;
      result.measurements=await evaluate(`(() => {
        const ux=document.querySelector('.lpb-editorial-ux'), root=document.querySelector('.lpb-editorial-ux-root');
        const box=e=>{if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,class:e.className,x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,paddingLeft:s.paddingLeft,paddingRight:s.paddingRight,marginLeft:s.marginLeft,marginRight:s.marginRight,maxWidth:s.maxWidth,boxSizing:s.boxSizing,overflowX:s.overflowX,borderRadius:s.borderRadius,contentX:r.x+parseFloat(s.borderLeftWidth)+parseFloat(s.paddingLeft),contentWidth:r.width-parseFloat(s.borderLeftWidth)-parseFloat(s.borderRightWidth)-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)};};
        const chain=[];for(let n=ux;n;n=n.parentElement)chain.push(box(n));
        const imgs=[...ux.querySelectorAll('img')].map(i=>({class:i.className,box:box(i),radius:getComputedStyle(i).borderRadius,loaded:i.complete&&i.naturalWidth>0,clipping:[...function*(e){for(let n=e.parentElement;n&&n!==ux;n=n.parentElement)if(['hidden','clip'].includes(getComputedStyle(n).overflow))yield n;}(i)].map(box)}));
        const article=ux.querySelector('.lpb-editorial-article');
        const nav=root.querySelector('.lpb-news-nav__inner');
        return {chain,root:box(root),ux:box(ux),navigation:box(nav),navList:box(root.querySelector('.lpb-news-nav__list')),breadcrumb:box(root.querySelector('.lpb-editorial-ux-breadcrumb')),breadcrumbList:box(root.querySelector('.lpb-editorial-ux-breadcrumb ol')),breadcrumbItem:box(root.querySelector('.lpb-editorial-ux-breadcrumb li')),breadcrumbLink:box(root.querySelector('.lpb-editorial-ux-breadcrumb a')),module:box(ux.firstElementChild),main:box(root.querySelector('.lpb-editorial-ux-article-layout__main')),sidebar:box(root.querySelector('.lpb-editorial-ux-article-layout__sidebar')),article:box(article),intro:box(root.querySelector('.lpb-editorial-article__subline')),body:box(root.querySelector('.lpb-editorial-article__body')),images:imgs,scrollWidth:document.documentElement.scrollWidth,innerWidth,navScrollable:nav.scrollWidth>nav.clientWidth};
      })()`);
      if(!before){
        const m=result.measurements;
        if(Math.abs(m.ux.x-m.root.contentX)>.1||Math.abs(m.ux.width-m.root.contentWidth)>.1)throw Error('Editorial does not fill host');
        if(Math.abs(m.navigation.x-m.ux.x)>.1||Math.abs(m.navigation.width-m.ux.width)>.1)throw Error('Navigation axis');
        if(m.breadcrumb&&(Math.abs(m.breadcrumb.x-m.ux.x)>.1||Math.abs(m.breadcrumbList.x-m.ux.x)>.1||Math.abs(m.breadcrumbLink.x-m.ux.x)>.1))throw Error('Breadcrumb axis');
        if(!m.images.every(i=>i.loaded&&i.radius===(i.class.includes('author__avatar')?'50%':'12px')&&i.clipping.every(c=>c.borderRadius==='12px')))throw Error('Images/radii/clipping wrappers');
      }
      await evaluate('window.scrollTo(0,0)');
      const metrics=await send('Page.getLayoutMetrics');
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.ceil(metrics.cssContentSize.height),scale:1}});
      const name=type+'-'+(width===1280?'desktop':'mobile')+'.png';
      fs.writeFileSync(path.join(out,'screenshots', (before?(crumbBaseline?'breadcrumb-before-':'before-'):'')+name),Buffer.from(shot.data,'base64'));
      result.screenshot=name;report.push(result);
      fs.writeFileSync(path.join(out,before?(crumbBaseline?'breadcrumb-before.json':'before.json'):'after.json'),JSON.stringify(report,null,2)+'\n');
      console.log(type+' '+width+'px '+(before?'BEFORE':'PASS')+' x='+result.measurements.ux.x+' width='+result.measurements.ux.width);
    }
  } finally {socket.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
