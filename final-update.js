(()=>{
 function setup(){
  document.querySelectorAll('a[href]').forEach(a=>{if(/^https?:\/\/muppeskms\.ru\/sites\/all\/calc\/index\.html\/?$/.test(a.href))a.href='/calculator/index.html';if(/^https?:\/\/muppeskms\.ru\/statistics\/?$/.test(a.href))a.href='/statistics/index.html'});
  document.body.classList.toggle('inner-page',!['/','/index.php'].includes(location.pathname));
  document.querySelectorAll('#navigation .nav-item').forEach(item=>{const a=item.querySelector(':scope > .nav-link'),menu=item.querySelector('.nav-dropdown');if(!a||!menu)return;a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded',String(item.classList.contains('open')))});
  if(!document.querySelector('.quick-contact')){const a=document.createElement('a');a.href='/contacts';a.className='quick-contact';a.textContent='Контакты';document.body.append(a)}
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('#navigation .nav-item > .nav-link');if(!a||!a.parentElement.querySelector('.nav-dropdown'))return;
  e.preventDefault();e.stopImmediatePropagation();const item=a.parentElement,open=!item.classList.contains('open');document.querySelectorAll('#navigation .nav-item.open').forEach(n=>n.classList.remove('open'));item.classList.toggle('open',open);setup();
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const item=document.querySelector('#navigation .nav-item.open');if(item){item.classList.remove('open');item.querySelector('.nav-link')?.focus();setup()}}});
 let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;setup()})}).observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('popstate',setup);setup();
})();
