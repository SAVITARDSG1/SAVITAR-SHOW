(()=>{
 const email=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
 const matches=/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?<![\w\d])(?:\+7|7|8)(?:[\s().\u00a0-]*\d){10}(?!\d)|\(4217\)[\s.-]*\d{2}[\s.-]*\d{2}[\s.-]*\d{2}/gi;
 const phone=t=>{let n=t.replace(/\D/g,'');if(n.length===10)n='7'+n;if(n.length===11&&n[0]==='8')n='7'+n;return n.length===11&&n[0]==='7'?'+'+n:null};
 const photos={'122543570':'grid','291301596':'documents','455993125':'security','549647510':'grid','1326200427':'documents','886781779':'digital','592914399':'building','87514650':'documents','566320704':'digital','89985248':'digital'};
 const descriptions={grid:'Линии электропередачи',documents:'Документы и отчётность',security:'Камера видеонаблюдения',digital:'Ноутбук и онлайн-сервисы',building:'Коммерческая недвижимость'};
 function newsPhotos(){
  document.querySelectorAll('.feed-row:not(.notice-row)').forEach(row=>{
   const id=new URL(row.href,location.origin).pathname.split('/').pop(),topic=photos[id];if(!topic)return;
   const cover=row.querySelector('.feed-cover');if(!cover)return;let img=cover.querySelector('img');
   if(img&&new URL(img.src,location.origin).pathname.startsWith('/media/'))return;
   const src='/assets/news-photos/'+topic+'.jpg';
   if(!img){img=document.createElement('img');img.loading='lazy';cover.replaceChildren(img)}
   if(img.getAttribute('src')!==src){img.src=src;img.alt=descriptions[topic];img.title='Тематическая иллюстрация, не фотография объекта АО «ППЭС»';}
  });
 }
 function run(){
  newsPhotos();
  document.querySelectorAll('a').forEach(a=>{if(a.closest('#adm-root,nav,.navigation,.picture-service'))return;const t=a.textContent.trim();if(email.test(t))a.setAttribute('href','mailto:'+t);else if(/^[+\d\s().-]+$/.test(t)&&phone(t))a.setAttribute('href','tel:'+phone(t))});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&&!n.parentElement.closest('a,button,textarea,input,select,script,style,code,pre,svg,nav,[contenteditable],#adm-root,.ed-shell')&&n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const text=node.textContent;matches.lastIndex=0;const found=[...text.matchAll(matches)];if(!found.length)continue;const fragment=document.createDocumentFragment();let i=0;for(const m of found){fragment.append(text.slice(i,m.index));const a=document.createElement('a');a.className='contact-auto-link';a.textContent=m[0];a.href=email.test(m[0])?'mailto:'+m[0]:'tel:'+phone(m[0]);fragment.append(a);i=m.index+m[0].length;}fragment.append(text.slice(i));node.replaceWith(fragment)}
 }
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}).observe(document.body,{childList:true,subtree:true});run();
})();
