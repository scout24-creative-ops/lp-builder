'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'templates/scaling-editorial-ux/portal-rollout');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
test('regular UX rollout retains complete article content, images, hrefs and original recovery snapshots',()=>{
  const result=JSON.parse(execFileSync('python3',['scripts/migrate-scaling-editorial-ux.py','--check','--historical'],{cwd:root,encoding:'utf8'}));
  assert.equal(result.length,13);
  assert.equal(result.filter(e=>e.kind==='article'&&e.articleContentExact).length,6);
  for(const e of result){
    const old=JSON.parse(fs.readFileSync(path.join(base,'baseline',e.entryId+'.json'),'utf8'));
    assert.equal(old.slug,e.slug);
    assert.equal(old.version,e.baselineVersion);
    assert.equal(old.publishedVersion,e.publishedVersion);
    assert.ok(e.linksPreserved&&e.imagesPreserved);
    const html=fs.readFileSync(path.join(base,'payloads',e.entryId+'.html'),'utf8');
    assert.match(html,/data-lpb-content-mode="regular"/);
    assert.doesNotMatch(html,/dev-scaling-editorial-ux-(?:home|category|article)-test|article-preview\.html|\.\.\/assets/);
    assert.equal((html.match(/class="lpb-explicit-spacing\b/g)||[]).length,1);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.equal((html.match(/LP_MODULE_START:/g)||[]).length,2);
  }
});
test('regular category inventories are unique and dummy slots never link to fabricated articles',()=>{
  const assigned=manifest.filter(e=>e.kind==='category').flatMap(e=>e.assignedArticles);
  assert.equal(new Set(assigned).size,6);
  for(const e of manifest.filter(e=>e.kind==='category')){
    assert.equal(new Set(e.assignedArticles).size,e.assignedArticles.length);
    const html=fs.readFileSync(path.join(base,'payloads',e.entryId+'.html'),'utf8');
    for(const slot of html.matchAll(/<article[^>]+aria-label="Layout-Platzhalter, kein Artikel">([\s\S]*?)<\/article>/g)) assert.doesNotMatch(slot[1],/<a\b/);
    assert.doesNotMatch(html,/lpb-editorial-ux-article-layout__sidebar/);
  }
});
test('UX headline hyphenation fix is scoped and retains emergency word wrapping',()=>{
  const css=fs.readFileSync(path.join(root,'runtime/contentful/lpbuilder-bridge.css'),'utf8');
  const rule=css.split('\n').find(s=>s.includes('hyphens: none; overflow-wrap: anywhere; word-break: normal;'));
  assert.ok(rule);
  assert.ok(rule.split('{')[0].split(',').every(s=>s.trim().startsWith('.lpb-editorial-ux ')));
  assert.doesNotMatch(rule,/__body|\bp\b|^h1/);
});
