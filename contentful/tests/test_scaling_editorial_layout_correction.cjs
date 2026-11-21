'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('layout correction moves only seven exact intros and retains all sixteen current entry snapshots',()=>{
  const manifest=JSON.parse(execFileSync('python3',['scripts/correct-scaling-editorial-layout.py','--check'],{cwd:root,encoding:'utf8'}));
  assert.equal(manifest.length,16);
  assert.equal(manifest.filter(e=>e.htmlChanged).length,7);
  for(const entry of manifest.filter(e=>e.htmlChanged)){
    const html=fs.readFileSync(path.join(root,'templates/scaling-editorial-ux/layout-correction/payloads',entry.entryId+'.html'),'utf8');
    const order=['<h1','lpb-editorial-article__meta','data-lpb-component="scaling-editorial-ux-preferred-source"','lpb-editorial-article__media ','lpb-editorial-article__subline','lpb-editorial-article__body'];
    const indexes=order.map(s=>html.indexOf(s));
    assert.ok(indexes.every((n,i)=>n>=0&&(!i||n>indexes[i-1])));
    assert.equal((html.match(/class="lpb-editorial-article__subline/g)||[]).length,1);
  }
});
test('UX uses host content width and a shared image radius while portraits stay circular',()=>{
  const css=fs.readFileSync(path.join(root,'runtime/contentful/lpbuilder-bridge.css'),'utf8').split('/* Scaling Editorial UX compositions —')[1];
  assert.match(css,/\.lpb-editorial-ux \{[^}]*--lpb-editorial-image-radius: 12px;[^}]*margin-inline: 0; max-width: none/);
  assert.match(css,/\.lpb-news-nav--ux \.lpb-news-nav__inner \{[^}]*max-width: none; padding-inline: 0; width: 100%/);
  assert.match(css,/\.lpb-editorial-ux img \{ border-radius: var\(--lpb-editorial-image-radius\)/);
  assert.match(css,/\.lpb-editorial-ux \.lpb-editorial-author__avatar \{ border-radius: 50%/);
  for(const selector of ['.lpb-editorial-ux-property','.lpb-editorial-ux-topic','.lpb-editorial-ux .lpb-editorial-article__media-frame']){
    const line=css.split('\n').find(l=>l.startsWith(selector+' {'));
    assert.match(line,/border-radius: var\(--lpb-editorial-image-radius\)/);
  }
  assert.doesNotMatch(css,/max-width: 964px|margin-inline: auto/);
  assert.match(css,/\.lpb-editorial-ux \.lpb-editorial-ux-breadcrumb li \{ margin: 0;/);
});
