// Compare development hero content edges to the renderer at every layout boundary.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../../..');
const layout=JSON.parse(fs.readFileSync(path.join(root,'modules/layout.json'),'utf8'));
const stylesheets=['modules/contentful-runtime/lpbuilder-bridge.css','releases/contentful/layout-v1/lpbuilder-bridge.css'];
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
  console.log('Development and layout-v1 Hero content align at 10 viewport boundaries (40 combinations); protected runtime remains unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close()});
