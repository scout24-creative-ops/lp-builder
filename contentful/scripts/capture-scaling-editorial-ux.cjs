'use strict';
// Local QA only: connects to an isolated Chrome started with --remote-debugging-port=9222.
// Uses built-in Node WebSocket; no browser library or client-side application dependency.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'templates/scaling-editorial-ux/screenshots');
const qaSource = fs.readFileSync(path.join(__dirname, 'check-scaling-editorial-ux-browser.js'), 'utf8');
const base = 'http://127.0.0.1:8765/templates/scaling-editorial-ux/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const articleOnly = process.argv.includes('--article-only');

(async () => {
  const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const target = targets.find(t => t.type === 'page' && t.url.startsWith(base));
  if (!target) throw new Error('Open a local UX preview in the isolated Chrome first.');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { socket.addEventListener('open', ok, { once: true }); socket.addEventListener('error', fail, { once: true }); });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const [ok, fail] = pending.get(msg.id); pending.delete(msg.id);
    if (msg.error) fail(new Error(msg.error.message)); else ok(msg.result);
  });
  const send = (method, params = {}) => new Promise((ok, fail) => {
    const requestId = ++id; pending.set(requestId, [ok, fail]); socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const report = articleOnly
    ? JSON.parse(fs.readFileSync(path.join(out, 'browser-checks.json'), 'utf8')).filter(r => !r.url.endsWith('/article-preview.html'))
    : [];
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  fs.mkdirSync(out, { recursive: true });
  try {
    for (const type of articleOnly ? ['article'] : ['home', 'category', 'article']) {
      for (const width of [1280, 390]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width === 390 });
        const url = `${base}${type}-preview.html`;
        await send('Page.navigate', { url });
        let ready = false;
        for (let i = 0; i < 100 && !ready; i++) {
          await wait(100);
          try { ready = await evaluate(`location.href === ${JSON.stringify(url)} && document.documentElement.dataset.previewReady === 'true'`); } catch {}
        }
        if (!ready) throw new Error('Preview did not load: ' + url);
        const result = await evaluate(`(${qaSource})()`);
        if (!result.allChecksPassed) throw new Error('Browser QA failed: ' + type);
        const styleChecks = await evaluate(`(() => {
          const card = document.querySelector('.lpb-editorial-ux-card__link');
          const blue = document.querySelector('.lpb-editorial-ux-breadcrumb a');
          return {cardTextDecoration: card ? getComputedStyle(card).textDecorationLine : null, blueLink: blue ? getComputedStyle(blue).color : null};
        })()`);
        result.linkStyles = styleChecks;
        for (const selector of ['.lpb-editorial-ux-card__link', '.lpb-editorial-ux-breadcrumb a']) {
          const point = await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null; const r = e.getBoundingClientRect(); return {x:r.x + Math.min(r.width/2, 20),y:r.y + 10}; })()`);
          if (!point) continue;
          await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
          const hovered = await evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}),s=getComputedStyle(e);return {hover:e.matches(':hover'),color:s.color,decoration:s.textDecorationLine}; })()`);
          if (!hovered.hover) throw new Error('Pointer hover was not exercised: ' + selector);
          if (selector.includes('breadcrumb') && hovered.color !== 'rgb(26, 100, 210)') throw new Error('Blue text link changes colour on hover');
          if (selector.includes('card__link') && hovered.decoration !== 'none') throw new Error('Entire teaser underlined on hover');
          result.linkStyles[selector] = hovered;
        }
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
        const metrics = await send('Page.getLayoutMetrics');
        const size = metrics.cssContentSize;
        const png = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.ceil(size.height), scale: 1 } });
        const name = `${type}-${width === 1280 ? 'desktop' : 'mobile'}.png`;
        fs.writeFileSync(path.join(out, name), Buffer.from(png.data, 'base64'));
        result.screenshot = name;
        report.push(result);
        console.log(`${type} ${width}px: PASS, content ${result.content.width}px, grids ${result.gridColumns.join('/') || 'article'}, ${result.images.length} loaded images`);
      }
    }
    // Exercise the actual local lead-to-article click, not an invented public URL.
    await send('Page.navigate', { url: `${base}home-preview.html` });
    let point;
    for (let i=0;i<100&&!point;i++) {
      await wait(100);
      try { point=await evaluate(`(() => { const a=document.querySelector('a[href="article-preview.html"]');if(!a)return null;const r=a.getBoundingClientRect();return {x:r.x+20,y:r.y+20};})()`); } catch {}
    }
    if (!point) throw new Error('Local demo article link missing');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    let clicked=false;
    for(let i=0;i<100&&!clicked;i++) { await wait(100);try { clicked=await evaluate(`location.href.endsWith('/article-preview.html') && !!document.querySelector('.lpb-editorial-ux--article')`); } catch {} }
    if(!clicked) throw new Error('Local lead-to-article click failed');
    for(const result of report) result.localLeadClickPassed=true;
    fs.writeFileSync(path.join(out, 'browser-checks.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(articleOnly ? 'Two article screenshots updated; home/category screenshots retained.' : 'Six screenshots and browser-checks.json saved.');
  } finally { socket.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
