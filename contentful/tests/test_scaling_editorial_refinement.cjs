'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base=path.join(root,'templates/scaling-editorial-ux/portal-refinement-20261107');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('portal refinement preserves article bodies, sources, portraits and internal author states',()=>{
  const result=JSON.parse(execFileSync('python3',['scripts/refine-scaling-editorial-portal.py','--check'],{cwd:root,encoding:'utf8'}));
  assert.equal(result.entries,16);
  assert.equal(Object.keys(result.dates).length,6);
  assert.equal(result.dates['/haus-ohne-zentralheizung-ingolstadt'].date,'2026-11-07');
  assert.ok(result.dates['/haus-ohne-zentralheizung-ingolstadt'].fallback);
  for(const [slug,info] of Object.entries(result.dates)) if(slug!=='/haus-ohne-zentralheizung-ingolstadt'){
    assert.equal(info.date,'2026-11-03');assert.equal(info.fallback,false);
  }
  for(const e of JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'))){
    const html=fs.readFileSync(path.join(base,'payloads',e.entryId+'.html'),'utf8');
    assert.doesNotMatch(html,/aria-label="Breadcrumb"|Technischer Pilot – fiktives Autorenprofil|Noch nicht angebunden|Datum offen|noch festzulegen/);
    assert.equal((html.match(/LP_MODULE_START:/g)||[]).length,2);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
  }
});
test('regular News is a distinct deduplicated composition and Immobilienmarkt aggregates only its four internal categories',()=>{
  const html=fs.readFileSync(path.join(base,'news-home.html'),'utf8');
  assert.match(html,/lpb-editorial-ux-home-lead/);
  assert.match(html,/lpb-editorial-ux-card--home-lead/);
  assert.equal((html.match(/lpb-editorial-ux-card--compact/g)||[]).length,3);
  assert.doesNotMatch(html,/lpb-editorial-ux-category-lead|dev-scaling-editorial-ux-.*-test/);
  const articleSlugs=Object.keys(JSON.parse(fs.readFileSync(path.join(base,'dates.json'),'utf8')));
  for(const slug of articleSlugs)assert.equal(html.split('href="'+slug+'"').length-1,1,slug);
  const immo=fs.readFileSync(path.join(base,'payloads/LxsfE8MGOPJPbSOYTR4hw.html'),'utf8');
  for(const slug of ['/generationenwechsel-eigenheime','/baugenehmigungen-baupipeline','/heizoel-preissprung-heizkostenrechnung'])assert.equal(immo.split('href="'+slug+'"').length-1,1);
  assert.doesNotMatch(immo,/href="\/(?:wohngeldreform|energiewende|haus-ohne)/);
  assert.match(immo,/>Layout Platzhalter<\/p>/);
});
test('Editorial header-frame compensation and COSMA tabs stay scoped, responsive and preserve radius/media roles',()=>{
  const css=read('runtime/contentful/lpbuilder-bridge.css').split('/* Scaling Editorial UX compositions —')[1];
  assert.match(css,/\.lpb-editorial-ux-root \{[^}]*min\(100vw, 1170px\)[^}]*48px/);
  assert.doesNotMatch(css,/width: 1122px|!important|^body\s*\{/m);
  assert.match(css,/\.lpb-news-nav--ux \.lpb-news-nav__list \{ box-shadow: inset 0 -1px/);
  assert.match(css,/transition: color var\(--animation-duration-fast, 250ms\)/);
  assert.match(css,/\.lpb-editorial-ux \.lpb-editorial-author__name \{ text-decoration: underline/);
  assert.match(css,/\.lpb-editorial-ux \.lpb-editorial-article__subline \{ color: #333333/);
  assert.match(css,/--lpb-editorial-image-radius: 12px/);
  const moduleData=JSON.parse(read('templates/scaling-editorial-ux/ux-module-data.json'));
  assert.equal(moduleData.home[0].price,'1.250.000 €');
  assert.equal(moduleData.article[0].price,'3.500 €');
  assert.notDeepEqual(moduleData.home,moduleData.article);
  const config=JSON.parse(read('templates/scaling-editorial-ux/portal-config.json'));
  assert.deepEqual(config.navigation.map(n=>n.label),['News','Immobilienmarkt','Recht & Politik','Wohnen & Architektur','Lifestyle']);
  assert.equal(Object.keys(config.displayGroups).length,7);
});

test('shared normalisation preserves an explicitly supplied editorial publication date without a lookup',()=>{
  const source=read('templates/scaling-editorial-ux/article.html').replace('datetime="2026-11-07">07.11.2026','datetime="2024-06-03">03.06.2024');
  const result=execFileSync('python3',['scripts/refine-scaling-editorial-portal.py','--normalize','article'],{cwd:root,input:source,encoding:'utf8'});
  assert.match(result,/Veröffentlicht: <time datetime="2024-06-03">03\.06\.2024<\/time>/);
});
