// Compare development hero content edges to the renderer at every layout boundary.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../../..');
const layout=JSON.parse(fs.readFileSync(path.join(root,'modules/layout.json'),'utf8'));
const stylesheets=['modules/contentful-runtime/lpbuilder-bridge.css','releases/contentful/layout-v1/lpbuilder-bridge.css','releases/contentful/layout-v2/lpbuilder-bridge.css'];
const library=fs.readFileSync(path.join(root,'modules/component-library.html'),'utf8');
let browser;
(async()=>{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const rules=layout.paddingInline.map(step=>`@media(min-width:${step.minWidth}px){.renderer{padding-inline:${step.value}px}}`).join('');
  for(const stylesheet of stylesheets){
    const css=fs.readFileSync(path.join(root,stylesheet),'utf8');
  for(const width of [1600,1200,1014,1000,800,669,668,392,375,320]){
    await page.setViewportSize({width,height:1000});
    for(const name of ['hero-split','hero-bleed-flex']){
      const block=library.match(new RegExp(`<!-- LP_MODULE_START: ${name} -->([\\s\\S]*?)<!-- LP_MODULE_END: ${name} -->`))[1];
      await page.setContent(`<style>html,body{margin:0;overflow:hidden}.renderer{box-sizing:border-box;width:100%;max-width:${layout.containerMaxWidth}px;margin:auto}${rules}${css}</style><main class="renderer"><div id="reference"></div>${block}</main>`,{waitUntil:'domcontentloaded'});
      const result=await page.evaluate(()=>{
        const reference=document.querySelector('#reference').getBoundingClientRect();
        const hero=document.querySelector('.lpb-hero--split .lpb-hero__inner,.lpb-hero--bleed .lpb-hero__content');
        const rect=hero.getBoundingClientRect(),style=getComputedStyle(hero);
        return {expectedLeft:reference.left,expectedRight:reference.right,
          left:rect.left+parseFloat(style.paddingLeft),right:rect.right-parseFloat(style.paddingRight)};
      });
      assert.ok(Math.abs(result.left-result.expectedLeft)<0.1,JSON.stringify({stylesheet,width,name,result}));
      assert.ok(Math.abs(result.right-result.expectedRight)<0.1,JSON.stringify({stylesheet,width,name,result}));
    }
  }
  }
  // Exercise article markup under the host reset without changing the frozen layout-v1 release.
  const release=JSON.parse(fs.readFileSync(path.join(root,'releases/contentful/layout-v2/manifest.json'),'utf8'));
  const releasedBytes=fs.readFileSync(path.join(root,release.stylesheet));
  const baseBytes=fs.readFileSync(path.join(root,release.base.path));
  const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
  assert.equal(releasedBytes.byteLength,release.bytes);
  assert.equal(hash(releasedBytes),release.sha256);
  assert.equal(hash(baseBytes),release.base.sha256);
  assert.ok(releasedBytes.subarray(0,baseBytes.length).equals(baseBytes));
  assert.equal(releasedBytes[baseBytes.length],10);
  const patch=releasedBytes.subarray(baseBytes.length+1);
  assert.equal(hash(patch),release.editorialListPatch.sha256);
  assert.ok(fs.readFileSync(path.join(root,release.editorialListPatch.source)).includes(patch));
  for(const articleCss of [fs.readFileSync(path.join(root,stylesheets[0]),'utf8'),releasedBytes.toString('utf8')]){
  for(const width of [1280,390]){
    await page.setViewportSize({width,height:1000});
    await page.setContent(`<style>ul,ol,li{list-style:none;margin:0;padding:0}${articleCss}</style>
      <main class="lpb-editorial-ux"><div class="lpb-editorial-article__body">
        <ul id="bullets" class="font-body-large-regular"><li>Gleichrangiger Punkt</li></ul>
        <ol id="steps" start="3"><li>Erster sichtbarer Schritt</li></ol>
      </div><ul id="outside"><li>Keine Liste im Artikeltext</li></ul></main>`,{waitUntil:'domcontentloaded'});
    const marks=await page.evaluate(()=>Object.fromEntries(['bullets','steps','outside'].map(id=>{
      const list=document.getElementById(id),item=list.firstElementChild,style=getComputedStyle(item);
      return [id,{type:style.listStyleType,display:style.display,inset:parseFloat(getComputedStyle(list).paddingInlineStart)}];
    })));
    assert.equal(marks.bullets.type,'disc');
    assert.equal(marks.steps.type,'decimal');
    for(const id of ['bullets','steps']){
      assert.equal(marks[id].display,'list-item');
      assert.ok(marks[id].inset>0);
    }
    assert.equal(marks.outside.type,'none');
    assert.equal(marks.outside.inset,0);
  }
  }
  console.log('Development and layout-v2 editorial markers survive the host reset on desktop and mobile.');
  console.log('Development and both release versions align Hero content at 10 viewport boundaries (60 combinations); protected runtime remains unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close()});
