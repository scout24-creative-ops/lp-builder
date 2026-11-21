async () => {
  await document.fonts.ready;
  const root=document.querySelector('.lpb-editorial-ux-root'),ux=root.querySelector('.lpb-editorial-ux');
  const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
  const box=e=>{if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,padding:s.padding,contentX:r.x+parseFloat(s.paddingLeft),contentWidth:r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)};};
  const near=(a,b)=>Math.abs(a-b)<.2;
  await Promise.all([...ux.querySelectorAll('img')].map(async i=>{i.loading='eager';if(!i.complete)await new Promise(r=>{i.onload=r;i.onerror=r;setTimeout(r,10000);});if(i.naturalWidth)await i.decode().catch(()=>{});}));
  const header=document.querySelector('header.page-header'),h=header?box(header):{contentX:Math.max(0,(innerWidth-1170)/2)+24,contentWidth:Math.min(innerWidth,1170)-48};
  const u=box(ux),n=box(root.querySelector('.lpb-news-nav__inner'));
  assert(near(u.x,h.contentX)&&near(u.width,h.contentWidth),'header/content edges mismatch');
  assert(near(n.x,u.x)&&near(n.width,u.width),'navigation/content edges mismatch');
  assert(document.documentElement.scrollWidth===innerWidth,'horizontal page overflow');
  const links=[...root.querySelectorAll('.lpb-news-nav__item')];
  assert(JSON.stringify(links.map(a=>a.textContent))===JSON.stringify(['News','Immobilienmarkt','Recht & Politik','Wohnen & Architektur','Lifestyle']),'five navigation entries');
  assert(links.filter(a=>a.getAttribute('aria-current')==='page').length===1,'one active area');
  const list=root.querySelector('.lpb-news-nav__list'),listbox=box(list);
  assert(getComputedStyle(list).boxShadow!=='none','missing group baseline');
  if(innerWidth===1280)assert(listbox.width<u.width,'baseline must stop at last tab');
  if(innerWidth===390){const inner=root.querySelector('.lpb-news-nav__inner');inner.scrollLeft=200;assert(inner.scrollLeft>0,'mobile navigation not scrollable');inner.scrollLeft=0;}
  assert(!root.querySelector('.lpb-editorial-ux-breadcrumb,[data-lpb-component="scaling-editorial-pilot-notice"]'),'breadcrumb or pilot notice remains');
  assert(!root.innerText.includes('Noch nicht angebunden')&&!root.innerText.includes('noch festzulegen')&&!root.innerText.includes('Datum offen'),'old UI filler remains');
  assert([...root.querySelectorAll('button')].every(b=>b.disabled),'active placeholder button');
  assert(!root.querySelector('a[href="#"],.lpb-editorial-ux-property a'),'dummy link');
  const images=[...ux.querySelectorAll('img')].map(i=>({role:i.className,src:i.src,box:box(i),radius:getComputedStyle(i).borderRadius,natural:[i.naturalWidth,i.naturalHeight]}));
  for(const i of images){assert(i.natural[0]>0,'image failed');assert(i.radius===(i.role.includes('author__avatar')?'50%':'12px'),'image radius');const r=i.box;
    if(i.role.includes('ux-compact'))assert(near(r.width,120)&&near(r.height,80),'compact image');
    if(i.role.includes('ux-reading'))assert(near(r.width,80)&&near(r.height,56),'reading image');
    if(i.role.includes('ux-property'))assert(near(r.width,100)&&near(r.height,76),'property image');
    if(i.role.includes('ux-plus'))assert(Math.abs(r.width/r.height-4/3)<.001,'SuchenPlus ratio');
  }
  const article=ux.querySelector('.lpb-editorial-article');let articleChecks=null;
  if(article){const title=article.querySelector('h1'),meta=article.querySelector('.lpb-editorial-article__meta'),google=article.querySelector('[data-lpb-component="scaling-editorial-ux-preferred-source"]'),figure=article.querySelector('figure'),intro=article.querySelector('.lpb-editorial-article__subline'),body=article.querySelector('.lpb-editorial-article__body'),rail=ux.querySelector('.lpb-editorial-ux-reading h2');
    assert(meta.nextElementSibling===google&&google.nextElementSibling===figure&&figure.nextElementSibling===intro&&intro.nextElementSibling===body,'article order');
    assert(article.querySelectorAll('.lpb-editorial-article__subline').length===1,'duplicate intro');
    assert(getComputedStyle(intro).color===getComputedStyle(body.querySelector('p')).color,'intro colour');
    assert(getComputedStyle(article.querySelector('.lpb-editorial-author__name')).textDecorationLine.includes('underline'),'author underline');
    if(innerWidth===1280)assert(near(box(title).y,box(rail).y),'headline and Weiterlesen top alignment');
    const sidebar=ux.querySelector('.lpb-editorial-ux-article-layout__sidebar'),main=ux.querySelector('.lpb-editorial-ux-article-layout__main');
    if(innerWidth===390)assert(box(sidebar).y>=box(main).bottom,'mobile sidebar position');
    articleChecks={headline:box(title),reading:box(rail),intro:box(intro),body:box(body),introColor:getComputedStyle(intro).color};
  }
  const home=ux.querySelector('.lpb-editorial-ux-home-lead'),category=ux.querySelector('.lpb-editorial-ux-category-lead');
  if(home){assert(!category,'home is category composition');assert(home.querySelectorAll('.lpb-editorial-ux-card--compact').length===3,'three home recommendations');const img=home.querySelector('.lpb-editorial-ux-card--home-lead img');assert(Math.abs(box(img).width/box(img).height-16/7)<.001,'home lead ratio');}
  if(category){assert(!home,'category is home composition');const img=category.querySelector('img');assert(Math.abs(box(img).width/box(img).height-16/9)<.001,'category ratio');}
  const columns=[...ux.querySelectorAll('.lpb-editorial-ux-card-grid')].map(g=>getComputedStyle(g).gridTemplateColumns.split(' ').length);
  assert(columns.every(c=>c===(innerWidth===390?1:4)),'card columns');
  const focus=links[0];focus.focus({preventScroll:true});assert(getComputedStyle(focus).outlineStyle==='solid','focus missing');focus.blur();window.scrollTo(0,0);
  return {url:location.href,viewport:innerWidth,header:h,content:u,navigation:n,tabGroup:listbox,active:links.find(a=>a.getAttribute('aria-current')==='page').textContent,images,columns,articleChecks,allChecksPassed:true};
}
