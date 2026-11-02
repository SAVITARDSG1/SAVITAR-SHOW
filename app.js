import {disclosurePage,enhanceDisclosure} from './disclosure.js?v=20261027-complete';
import {registryPage,enhanceRegistry} from './registry.js?v=20261027-complete';
import {contactsPage,newsCorner,enhanceNewsCorner,publicationsPage,maxBanner,maxPage,receptionPage,enhanceReception} from './communications.js?v=20261027-complete';
'use strict';
import { readingsPage, enhanceReadingsPage } from './readings.js?v=20261027-complete';
import { cabinetPage, enhanceCabinetPage } from './cabinet.js?v=20261027-complete';
import { laboratoryPage } from './laboratory.js?v=20261027-complete';
import { adminPage, enhanceAdminPage } from './admin.js?v=20261027-complete';

const paths = {
  about: '/about', jobs: '/materials/вакансии', info: '/materials/раскрытие-информации',
  connection: '/materials/технологическое-присоединение', passports: '/materials/паспорта-услуг',
  lab: '/elektrolaboratoriya',
  account: '/lichny-kabinet', readings: '/peredacha-pokazaniy',
  calculator: '/calculator/index.html'
};
const iconPaths = {
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  bolt: '<path d="m14 2-9 12h7l-2 8 9-12h-7Z"/>',
  meter: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8m-8 4 2-2m6 2-2-2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/>',
  phone: '<path d="m5 3 4 4-2 3c2 4 3 5 7 7l3-2 4 4c-1 4-4 4-7 3C7 19 2 14 1 7 0 4 2 2 5 3Z" transform="translate(1 -1) scale(.95)"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  print: '<path d="M6 8V3h12v5M6 17H3V9h18v8h-3M6 14h12v8H6Z"/><path d="M17 11h1"/>',
  lab: '<path d="M9 3h6M10 3v7L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-10V3M7 16h10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>'
};
const icon = (name, className='') => `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.arrow}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = url => /^https?:/.test(url);
const target = url => external(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
const link = (url, label, className='', arrow='') => `<a href="${esc(url)}" class="${className}"${target(url)}>${label}${arrow ? icon(arrow) : ''}</a>`;
const canonical = value => {
  const u=new URL(value,location.origin);
  let path;try{path=decodeURIComponent(u.pathname);}catch{path=u.pathname;}
  return (path.replace(/\/index\.php$/,'/').replace(/\/+$/,'')||'/')+u.search;
};
const main=document.querySelector('#main');
const navigation=document.querySelector('#navigation');
const searchDialog=document.querySelector('#search-dialog');
const searchInput=document.querySelector('#site-search');
let content, searchIndex=[], currentRoute='/', routeObserver;

function renderNav(){
  navigation.innerHTML=content.nav.map((item,i)=>{
    const key=canonical(item.href);
    const dropdown=[...(content.menus[key]||[])];
    if(dropdown.length&&!dropdown.some(x=>canonical(x.href)===key))dropdown.unshift({href:item.href,label:item.label+' — обзор'});
    return `<div class="nav-item ${i>3?'nav-service':''}">${link(item.href,(i===4?icon('user'):i===5?icon('meter'):'')+esc(item.label),'nav-link')}${dropdown.length?`<button class="nav-expand" aria-label="Подразделы: ${esc(item.label)}" aria-expanded="false">${icon('down')}</button><div class="nav-dropdown">${dropdown.map(x=>link(x.href,esc(x.label))).join('')}</div>`:''}</div>`;
  }).join('');
  navigation.querySelectorAll('.nav-expand').forEach(button=>button.addEventListener('click',()=>{
    const parent=button.closest('.nav-item'),open=!parent.classList.contains('open');
    closeDropdowns();parent.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));
  }));
}
function closeDropdowns(){navigation.querySelectorAll('.nav-item.open').forEach(x=>{x.classList.remove('open');x.querySelector('.nav-expand')?.setAttribute('aria-expanded','false');});}
function closeMobile(){navigation.classList.remove('mobile-open');document.querySelector('.mobile-toggle').setAttribute('aria-expanded','false');closeDropdowns();}
function compactDate(value){return value.replace(/^[^,]+,\s*/,'').replace(/,\s*/g,' ').split(' - ')[0];}

function serviceCard(url,name,description,ic,primary=false){
 return `<a class="service-card ${primary?'primary':''}" href="${esc(url)}"${target(url)}><span class="service-icon">${icon(ic)}</span><span class="service-arrow">${icon(external(url)?'external':'arrow')}</span><h3>${name}</h3><p>${description}</p></a>`;
}
function newsCard(item,index){
 const summary=(content.pages[canonical(item.href)]?.text||'').replace(item.title,'').trim().slice(0,155);
 return `<a class="news-card" href="${esc(item.href)}"><span class="news-tag">${index===0?'Информация':'Развитие'}</span><time>${esc(compactDate(item.date))}</time><h3>${esc(item.title)}</h3><p>${esc(summary)}</p><span class="text-link">Читать полностью ${icon('arrow')}</span></a>`;
}

function home(){
 const a=content.appearance;
 const cards=content.homepage.items.map((c,i)=>[c.url,c.title,c.description,['meter','user','bolt','shield','mail'][i%5],c.image]);
 const audiences=[['Жителям города','Всё необходимое для повседневных вопросов',[[paths.readings,'Передача показаний'],[paths.account,'Вход в личный кабинет'],[paths.info+'/сведения-о-тарифах-на-услуги','Тарифы и услуги'],['/internet-priemnaya','Написать обращение']]],['Бизнесу и организациям','Подключение, испытания и документы',[[paths.connection,'Технологическое присоединение'],[paths.calculator,'Расчёт стоимости подключения'],[paths.lab,'Услуги электролаборатории'],[paths.passports,'Паспорта услуг']]]];
 const slides=content.slides.items.filter(s=>s.enabled).map(s=>[s.image,s.number,s.title,s.url,s.button,s.alt]);
 const c=content.communications;if(c.maxEnabled&&c.maxUrl)slides.unshift(['/assets/max-channel-banner.png',c.maxTitle,c.maxText,'/max','Подробнее о канале','Иллюстрация: представитель компании со знаком MAX']);
 return `<div class="portal-home"><section class="ppes-carousel" id="portal-banner" role="region" aria-roledescription="карусель" aria-label="Предприятие и услуги" tabindex="0">${slides.map(([img,num,title,url,cta,alt],i)=>`<div class="ppes-slide ${canonical(url)===paths.lab||num.trim().toLowerCase()==='электролаборатория'?'ppes-lab-slide':''} ${url==='/max'?'ppes-max-slide':''} ${img.includes('/public-banner-')?'ppes-public-banner':''}" data-slide="${i}" role="group" aria-roledescription="слайд" aria-label="${i+1} из ${slides.length}" ${i?'hidden':''}>${img.includes('/public-banner-')?`<a class="public-banner-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><img src="${esc(img)}" alt="${esc(alt||title)}"></a>`:`<img src="${esc(img)}" alt="${esc(alt||title)}">`}<div class="container ppes-slide-layout"><div class="ppes-slide-copy"><p>АО «ППЭС» · Энергия города</p><h1><span class="ppes-slide-number ${num.length>14?'ppes-slide-words':''}">${esc(num)}</span><span class="ppes-slide-title">${esc(title)}</span></h1>${canonical(url)===paths.about?'':link(url,cta,'button button-primary','arrow')}</div></div></div>`).join('')}<button class="ppes-slide-arrow ppes-slide-prev" type="button" aria-label="Предыдущий слайд">←</button><button class="ppes-slide-arrow ppes-slide-next" type="button" aria-label="Следующий слайд">→</button><div class="ppes-slide-dots" role="group" aria-label="Выбор слайда">${slides.map((slide,i)=>`<button type="button" data-banner="${i}" aria-label="${esc(slide[1]+' — '+slide[2])}" aria-pressed="${i===0}"></button>`).join('')}</div><span class="sr-only" id="ppes-slide-status" aria-live="polite" aria-atomic="true"></span></section>
 <section class="container picture-services"><div class="section-heading"><div><div class="eyebrow">Услуги и онлайн-сервисы</div><h2>Выберите ваш следующий шаг</h2></div><p>Нажмите на карточку, чтобы перейти в нужный раздел.</p></div><div class="picture-services-grid">${cards.map(([u,t,d,i,img],n)=>`<a href="${u}" class="picture-service"><img src="${esc(img)}" alt="" loading="lazy"><div class="picture-service-shade"></div><span class="picture-service-number">0${n+1} / АО «ППЭС»</span><div class="picture-service-copy">${icon(i)}<h2>${t}</h2><p>${d}</p><span class="picture-service-go">Перейти в раздел ${icon('arrow')}</span></div></a>`).join('')}</div></section>
 <section class="portal-audiences"><div class="container"><div class="section-heading"><div><div class="eyebrow">Потребителям</div><h2>С чего начнём?</h2></div><p>Выберите вопрос — мы подскажем нужный раздел.</p></div><div class="portal-audience-grid">${audiences.map(([t,d,links],i)=>`<article class="portal-audience"><span class="portal-label">${i?'ДЛЯ ОРГАНИЗАЦИЙ':'ДЛЯ ЧАСТНЫХ ЛИЦ'}</span><h3>${t}</h3><p>${d}</p><div>${links.map(([u,t])=>link(u,t,'portal-list-link','arrow')).join('')}</div></article>`).join('')}</div><div class="portal-support"><div>${icon('phone')}<div><b>Нужна помощь специалиста?</b><span>Контакты подразделений и информация для обращений.</span></div></div>${link('/internet-priemnaya','Написать обращение','button button-primary','arrow')}</div></div></section>
 ${newsCorner(content)}
 ${maxBanner(content.communications)}
 <section class="container portal-lab"><div class="portal-lab-photo"><img src="${esc(content.laboratory.heroImage)}" alt="${esc(content.laboratory.heroAlt)}" loading="lazy"><span>Иллюстрация работы специалистов</span></div><div class="portal-lab-copy"><div class="eyebrow">Экспертиза и надёжность</div><h2>Электролаборатория.<br>Точность в каждом измерении.</h2><p>${esc(content.laboratory.intro)}</p><ul><li>Электрозащитные средства</li><li>Заземление и кабельные линии</li><li>Изоляция, защита и автоматика</li></ul>${link(paths.lab,'Услуги лаборатории','button button-primary','arrow')}</div></section>
 <section class="portal-company"><div class="container portal-company-layout"><div><div class="eyebrow">О компании</div><h2>${esc(a.companyTitle)}</h2><p>${esc(a.companyBody)}</p>${link(paths.about,'Подробнее о предприятии','text-link','arrow')}</div><figure><img src="${esc(a.companyImage)}" alt="${esc(a.companyAlt)}" loading="lazy"><figcaption>АО «ППЭС» · Комсомольск-на-Амуре</figcaption></figure></div></section>
 <section class="container portal-documents"><div class="section-heading"><div><div class="eyebrow">Открытая информация</div><h2>Документы и деятельность</h2></div>${link(paths.info,'Все разделы','text-link','arrow')}</div><div class="portal-document-grid">${[[paths.info+'/сведения-о-тарифах-на-услуги','Тарифы и услуги'],[paths.info+'/инвестиционная-деятельность','Инвестиционные программы'],[paths.info+'/сведения-о-закупочной-деятельности','Закупки'],[paths.info+'/отчетная-информация','Отчётность'],[paths.passports,'Паспорта услуг'],[paths.jobs,'Карьера в ППЭС']].map(([u,t])=>`<a href="${u}">${icon('file')}<span>${t}</span>${icon('arrow')}</a>`).join('')}</div></section>
 <section class="container portal-bottom"><div><span class="eyebrow">Всегда на связи</span><h2>Ваш вопрос — наш следующий шаг.</h2><p>Найдите нужного специалиста в разделе контактов.</p></div>${link('/contacts','Контакты предприятия','button button-primary','arrow')}</section></div>`;
}

function enhanceHome(){
 enhanceNewsCorner();
 const banner=document.querySelector('#portal-banner');if(!banner)return;
 const slides=[...banner.querySelectorAll('[data-slide]')],dots=[...banner.querySelectorAll('[data-banner]')];let current=0;
 const select=(index,announce=true)=>{current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==current);dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));if(announce)banner.querySelector('#ppes-slide-status').textContent=`Слайд ${current+1} из ${slides.length}: ${dots[current].getAttribute('aria-label')}`;};
 banner.querySelector('.ppes-slide-prev').onclick=()=>select(current-1);banner.querySelector('.ppes-slide-next').onclick=()=>select(current+1);dots.forEach((dot,i)=>dot.onclick=()=>select(i));
 banner.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(current+(e.key==='ArrowLeft'?-1:1));}});
 const pause=document.createElement('button');pause.type='button';pause.className='slide-pause';let stopped=matchMedia('(prefers-reduced-motion: reduce)').matches;const label=()=>{pause.textContent=stopped?'Включить смену слайдов':'Пауза';pause.setAttribute('aria-pressed',String(stopped))};label();pause.onclick=()=>{stopped=!stopped;label()};banner.append(pause);
 let hovered=false;banner.addEventListener('mouseenter',()=>hovered=true);banner.addEventListener('mouseleave',()=>hovered=false);
 const timer=setInterval(()=>{if(!banner.isConnected){clearInterval(timer);return}if(!stopped&&!hovered&&!document.hidden&&!banner.contains(document.activeElement))select(current+1,false)},7000);
 let touch=null;banner.addEventListener('touchstart',e=>{touch=[e.changedTouches[0].clientX,e.changedTouches[0].clientY]},{passive:true});banner.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))select(current+(dx<0?1:-1));touch=null},{passive:true});
}

const descriptions={
 '/about':'История предприятия, направления работы и информация о компании.',
 '/materials/вакансии':'Актуальная информация о вакансиях предприятия и контакты для трудоустройства.',
 '/materials/раскрытие-информации':'Тарифы, отчётность, инвестиционные программы и сведения о деятельности предприятия.',
 '/materials/технологическое-присоединение':'Информация для подключения объектов к электрическим сетям АО «ППЭС».',
 '/materials/паспорта-услуг':'Условия, порядок и сроки оказания услуг сетевой организацией.',
 '/contacts':'Телефоны, адрес предприятия, электронная почта и реквизиты.',
 '/news':'Сообщения, объявления и информация о деятельности предприятия.',
 '/asa':'Все разделы и материалы сайта.'
};
function routeGroup(route){
 if(route.startsWith(paths.connection))return paths.connection;
 if(route.startsWith(paths.info)||route.startsWith('/materials/cведения'))return paths.info;
 if(route.startsWith(paths.jobs))return paths.jobs;
 if(route.startsWith('/news'))return '/news';
 return paths.about;
}
function makeBreadcrumbs(page){
 const links=(page.breadcrumbs||[]).filter(x=>x.label);
 if(!links.some(x=>canonical(x.href)==='/'))links.unshift({label:'Главная',href:'/'});
 if(currentRoute.startsWith('/news/')&&!links.some(x=>canonical(x.href)==='/news'))links.push({label:'Новости',href:'/news'});
 return `<nav class="breadcrumbs" aria-label="Путь к странице">${links.map(x=>`${link(x.href,esc(x.label))}${icon('chevron')}`).join('')}<span class="current">${esc(page.title)}</span></nav>`;
}
function pageActions(route){
 if(route.startsWith(paths.connection))return `<div class="page-actions">${link(paths.account,'Подать заявку в личном кабинете','button button-primary','external')}${link(paths.calculator,'Рассчитать стоимость','button button-outline','external')}</div>`;
 if(route==='/contacts')return `<div class="contact-quick"><a href="tel:+74217549810">${icon('phone')}<div><span>Приёмная</span><b>+7 (4217) 54-98-10</b></div></a><a href="mailto:muppeskms@mail.ru">${icon('mail')}<div><span>Электронная почта</span><b>muppeskms@mail.ru</b></div></a></div>`;
 return '';
}
function companyPage(page){
 const a=content.appearance;
 return `<div class="company-page"><header class="company-heading container"><a href="/" class="company-home">Главная</a><h1>О компании</h1></header><section class="company-feature container"><img class="company-feature-photo" src="${esc(a.companyImage)}" alt="${esc(a.companyAlt)}"><div class="company-introduction"><div class="company-statement"><span></span><h2>АО «ППЭС»</h2><p>${esc(a.companyTitle)}</p></div><div class="company-summary">${a.companyBody.split(/\n\s*\n/).map(p=>`<p>${esc(p)}</p>`).join('')}</div></div></section><section class="company-details container"><h2>История и деятельность предприятия</h2><div class="article-content company-original">${page.html}</div><nav class="company-links" aria-label="Информация о компании">${(content.menus[paths.about]||[]).map(item=>link(item.href,esc(item.label)+' →')).join('')}</nav></section></div>`;
}
function article(page){
 if(page.kind==='disclosure')return disclosurePage();
 if(page.kind==='registry')return registryPage();
 if(currentRoute===paths.about)return companyPage(page);
 if(page.kind==='contacts')return contactsPage(content);
 if(page.kind==='reception')return receptionPage(content,page.department||'reception');
 if(page.kind==='max')return maxPage(content.communications);
 if(page.kind==='bulletin-list')return publicationsPage(content,page.list);
 if(page.kind==='laboratory')return laboratoryPage(content.laboratory);
 if(page.kind==='account')return cabinetPage(page.mode||'login');
 if(page.kind==='admin')return adminPage();
 if(page.kind==='readings')return readingsPage({icon,link});
 if(page.kind==='careers'&&content.careers)return careersPage();
 let side=page.sidebar?.length?page.sidebar:(content.menus[routeGroup(currentRoute)]||content.menus[paths.about]||[]);
 if(currentRoute.startsWith('/news'))side=[{label:'Все новости',href:'/news'},...content.news.slice(0,6).map(x=>({label:x.title,href:x.href}))];
 const seen=new Set();side=side.filter(x=>{const k=x.href+'|'+x.label;if(seen.has(k))return false;seen.add(k);return true;});
 const subtitle=descriptions[currentRoute.split('?')[0]]||'';
 return `<section class="page-banner"><div class="container">${makeBreadcrumbs(page)}<h1>${esc(page.title)}</h1>${subtitle?`<p class="page-subtitle">${subtitle}</p>`:''}</div></section><div class="container page-layout"><aside class="page-sidebar"><button class="sidebar-title" type="button" aria-expanded="false" aria-controls="section-links">Разделы сайта</button><div class="sidebar-links" id="section-links">${side.map(x=>link(x.href,esc(x.label)+icon('chevron'),canonical(x.href)===currentRoute?'active':'')).join('')}</div><div class="sidebar-help"><p>Связаться с предприятием</p><a href="tel:+74217549810">+7 (4217) 54-98-10</a></div></aside><article class="page-article"><div class="article-tools"><span>${page.date?esc(compactDate(page.date)):'АО «ППЭС»'}</span><button id="print-page">${icon('print')}Печать</button></div>${pageActions(currentRoute)}<div class="article-content">${page.html}</div></article></div>`;
}
function render(route,scroll=true){
 currentRoute=route;
 closeMobile();
 if(searchDialog.open)searchDialog.close();
 const page=content.pages[route];
 if(route==='/'){
  main.innerHTML=home();enhanceHome();document.title='АО «ППЭС» — Энергия города';
 }else if(page){
  main.innerHTML=article(page);document.title=page.title+' — АО «ППЭС»';
  document.querySelector('#print-page')?.addEventListener('click',()=>window.print());
  document.querySelector('.sidebar-title')?.addEventListener('click',e=>{const button=e.currentTarget;const open=button.closest('.page-sidebar').classList.toggle('expanded');button.setAttribute('aria-expanded',String(open));});
  enhancePage();
  if(page.kind==='careers')enhanceCareersPage();
  if(page.kind==='readings')enhanceReadingsPage();
  if(page.kind==='account')enhanceCabinetPage();
  if(page.kind==='admin')enhanceAdminPage();
  if(page.kind==='registry')enhanceRegistry(content);
  if(page.kind==='disclosure')enhanceDisclosure(content,page);
  if(page.kind==='reception')enhanceReception(content,page.department||'reception');
 }else{
  main.innerHTML=`<div class="container error-state"><div class="eyebrow">Навигация</div><h1>Страница не найдена</h1><p>Воспользуйтесь поиском или картой сайта.</p>${link('/asa','Открыть карту сайта','button button-primary','arrow')}</div>`;
  document.title='Страница не найдена — АО «ППЭС»';
 }
 navigation.querySelectorAll('.nav-link').forEach(a=>{const p=canonical(a.href);const active=route!=='/'&&(route===p||route.startsWith(p+'/'));a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 applySiteSettings();
 if(scroll){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
 if(page?.kind==='careers'&&location.hash)revealCareerFromHash();
}

const careerGroups=[['all','Все вакансии'],['specialists','Инженеры и специалисты'],['electricians','Электромонтёры'],['workers','Рабочие профессии']];
const salaryText=value=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0');
function careerEmail(job){
 const subject=job?'Отклик на вакансию «'+job.title+'»':'Вопрос о вакансиях АО «ППЭС»';
 const body=(job?'Здравствуйте! Меня интересует вакансия «'+job.title+'».':'Здравствуйте! Прошу уточнить информацию о вакансиях АО «ППЭС».')+'\n\nФИО: \nКонтактный телефон: \nОбразование: \nОпыт работы: \n\nПодскажите, пожалуйста, актуальна ли вакансия и как направить резюме.';
 return 'mailto:'+content.careers.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
function careerCard(job){
 const group=careerGroups.find(([id])=>id===job.category)?.[1]||'';
 return `<details class="career-card" id="${esc(job.id)}" data-vacancy="${esc(job.id)}"><summary><div class="career-card-top"><div><div class="career-category">${esc(group)}${job.needsClarification?'<span class="career-clarify-tag">Уточнить условия</span>':''}</div><h3>${esc(job.title)}</h3></div><div class="career-pay"><strong>${salaryText(job.salary)} <span>₽</span></strong><small>${esc(job.salaryNote)}</small></div><span class="career-expand" aria-hidden="true">+</span></div><p class="career-summary">${esc(job.summary)}</p><div class="career-meta"><span>${icon('briefcase')}Опыт от ${job.experienceYears} ${job.experienceYears===1?'года':'лет'}</span><span>${icon('file')}${esc(job.scheduleLabel)}</span><span>${icon('user')}${job.positions} место</span></div><span class="career-detail-label"><span class="career-label-closed">Обязанности и требования</span><span class="career-label-open">Свернуть подробности</span>${icon('down')}</span></summary><div class="career-details">${job.needsClarification?`<div class="career-source-note">${icon('info')}<p>${esc(job.clarification)}</p></div>`:''}<div class="career-details-grid"><section><h4>Чем предстоит заниматься</h4><p>${esc(job.duties)}</p><h4>Требования к кандидату</h4><p>${esc(job.requirements)}</p></section><section class="career-facts"><h4>Условия и квалификация</h4><dl><div><dt>Образование</dt><dd>${esc(job.education)}</dd></div><div><dt>График работы</dt><dd>${esc(job.scheduleLabel)}${job.schedule==='shift'?'<small>Часы смен уточняйте в отделе кадров.</small>':''}</dd></div><div><dt>Характер работы</dt><dd>${job.needsClarification?'Требует уточнения у работодателя':'Постоянная работа'}</dd></div><div><dt>Социальные гарантии</dt><dd>${esc(job.guarantees)}</dd></div><div><dt>Количество работников</dt><dd>${job.positions}</dd></div></dl></section></div><div class="career-card-actions">${link(content.careers.phoneHref,'Позвонить по вакансии','button button-primary','phone')}${link(careerEmail(job),'Подготовить письмо','button career-email-button','mail')}<span>Письмо откроется в вашей почтовой программе.</span></div></div></details>`;
}
function careersPage(){
 const c=content.careers;const min=c.items.length?Math.min(...c.items.map(x=>x.salary)):0,max=c.items.length?Math.max(...c.items.map(x=>x.salary)):0;
 return `<section class="careers-hero"><div class="container"><nav class="breadcrumbs" aria-label="Путь к странице"><a href="/">Главная</a>${icon('chevron')}<span class="current">Вакансии</span></nav><div class="careers-hero-grid"><div><div class="eyebrow">Работа в АО «ППЭС»</div><h1>Вакансии</h1><p class="careers-lead">Ваш опыт —<br><span>энергия нашего города.</span></p><p class="careers-intro">Инженерные специальности, обслуживание электрических сетей и рабочие профессии в Комсомольске-на-Амуре.</p><div class="careers-hero-actions">${link('#careers-list','Смотреть вакансии','button button-primary','arrow')}${link(c.phoneHref,'Связаться с отделом кадров','text-link','phone')}</div></div><div class="careers-overview"><span class="careers-overview-label">В опубликованном перечне</span><div class="careers-total"><strong>${c.items.length}</strong><div>вакансий<span>Подробные условия — в карточках</span></div></div>${c.items.length?`<div class="careers-salary-range"><span>Заработная плата по перечню</span><strong>${salaryText(min)}–${salaryText(max)} ₽</strong><small>Условия начисления указаны в карточках</small></div>`:""}<div class="careers-overview-location">${icon('pin')}<span>Комсомольск-на-Амуре</span></div></div></div></div></section>
 <section class="container careers-body" id="careers-list"><div class="careers-main"><div class="careers-list-heading"><div><div class="eyebrow">Найдите своё направление</div><h2>Выберите вакансию</h2></div><span id="career-result-count" role="status" aria-live="polite">Показано ${c.items.length} из ${c.items.length}</span></div><form class="career-filters" id="career-filter-form" role="search" aria-label="Поиск вакансий"><div class="career-filter-row"><label class="career-query">${icon('search')}<input type="search" id="career-query" aria-label="Название, обязанности или навык" placeholder="Название, обязанности или навык…" autocomplete="off"></label><label class="career-schedule"><span>График</span><select id="career-schedule" aria-label="График работы"><option value="all">Любой график</option><option value="day">08:00–17:00</option><option value="shift">Сменный</option></select></label></div><div class="career-categories" role="group" aria-label="Направление работы">${careerGroups.map(([id,label])=>`<button type="button" class="career-category-button ${id==='all'?'selected':''}" data-career-group="${id}" aria-pressed="${id==='all'}">${label}<span>${id==='all'?c.items.length:c.items.filter(x=>x.category===id).length}</span></button>`).join('')}</div><div class="career-filter-footer"><span>Откройте карточку, чтобы посмотреть обязанности и требования.</span><button type="button" data-job-reset hidden>Сбросить фильтры</button></div></form><div class="career-list">${c.items.length?c.items.map(careerCard).join(''):'<p>Открытых вакансий пока нет. Уточните возможности трудоустройства у инспектора по кадрам.</p>'}</div><div class="career-empty" id="career-empty" hidden>${icon('search')}<h3>Подходящих вакансий не найдено</h3><p>Попробуйте другое название или выберите любой график.</p><button type="button" class="button button-primary" data-job-reset>Показать все вакансии</button></div><div class="career-salary-note">${icon('info')}<p>Суммы приведены в формулировке работодателя «с учётом НДФЛ». Размер выплаты на руки, наличие мест и окончательные условия уточните у инспектора по кадрам.</p></div><div class="career-source-line"><span>Сведения сверены ${esc(c.verifiedOn)}</span>${link(c.source,'Исходный перечень работодателя','text-link','external')}</div></div>
 <aside class="careers-aside" aria-label="Контакты для трудоустройства"><section class="career-contact-panel"><span class="career-contact-icon">${icon('user')}</span><div class="eyebrow">Поможем с выбором</div><h2>Есть вопросы<br>о работе?</h2><p>Позвоните инспектору по кадрам: уточните наличие вакансии, требования и порядок подачи резюме.</p><span class="career-contact-label">Инспектор по кадрам</span><a class="career-hr-phone" href="${esc(c.phoneHref)}">${esc(c.phone)}</a>${link(c.phoneHref,'Позвонить','button button-light','phone')}<div class="career-general-email"><span>Общая почта предприятия</span><a href="${esc(careerEmail())}">${esc(c.email)} ${icon('external')}</a><small>В теме письма укажите выбранную вакансию.</small></div></section><section class="career-location-panel">${icon('pin')}<div><h3>Адрес предприятия</h3><p>${esc(c.address)}</p>${link('/contacts','Все контакты','text-link','arrow')}</div></section><section class="career-about-note"><h3>АО «ППЭС»</h3><p>Производственное предприятие электрических сетей. Работаем для жителей, предприятий и социальных объектов города с 1978 года.</p>${link('/about','О предприятии','text-link','arrow')}</section></aside></section>
 <section class="careers-apply"><div class="container"><div class="eyebrow">Следующий шаг</div><h2>Как откликнуться</h2><div class="career-steps"><div><span>01</span><h3>Выберите должность</h3><p>Сравните требования к образованию и опыту, график и задачи в карточках вакансий.</p></div><div><span>02</span><h3>Свяжитесь с кадровой службой</h3><p>Назовите интересующую должность и уточните, свободно ли место и какие документы нужны.</p></div><div><span>03</span><h3>Согласуйте следующий шаг</h3><p>Уточните, как направить резюме и договориться о встрече. В письме укажите имя, телефон и опыт работы.</p></div></div><div class="career-apply-bottom">${link(c.phoneHref,'Инспектор по кадрам: '+esc(c.phone),'button button-primary','phone')}${link(careerEmail(),'Подготовить письмо','text-link','mail')}</div></div></section>`;
}
function careerMatches(job,query='',group='all',schedule='all'){
 const words=normalizeText(query).split(' ').filter(Boolean);
 const haystack=normalizeText([job.title,job.summary,job.duties,job.requirements,job.education].join(' '));
 return (group==='all'||job.category===group)&&(schedule==='all'||job.schedule===schedule)&&words.every(word=>haystack.includes(word));
}
function enhanceCareersPage(){
 const form=document.querySelector('#career-filter-form');if(!form)return;
 const query=form.querySelector('#career-query'),schedule=form.querySelector('#career-schedule');
 const buttons=[...form.querySelectorAll('[data-career-group]')];let selected='all';
 const apply=()=>{
  let count=0;
  for(const job of content.careers.items){const card=document.getElementById(job.id);const visible=careerMatches(job,query.value,selected,schedule.value);card.hidden=!visible;if(visible)count++;}
  document.querySelector('#career-result-count').textContent=`Показано ${count} из ${content.careers.items.length}`;
  document.querySelector('#career-empty').hidden=count>0;
  form.querySelector('[data-job-reset]').hidden=!query.value&&selected==='all'&&schedule.value==='all';
  buttons.forEach(button=>{const active=button.dataset.careerGroup===selected;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});
 };
 form.addEventListener('submit',event=>{event.preventDefault();apply();});
 query.addEventListener('input',apply);schedule.addEventListener('change',apply);
 buttons.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.careerGroup;apply();}));
 document.querySelectorAll('[data-job-reset]').forEach(button=>button.addEventListener('click',()=>{query.value='';schedule.value='all';selected='all';apply();}));
}
function revealCareerFromHash(){
 if(!/^#vacancy-[a-z0-9-]+$/.test(location.hash))return;
 const card=document.getElementById(location.hash.slice(1));if(!card)return;
 if(card.hidden)document.querySelector('[data-job-reset]')?.click();
 card.open=true;card.scrollIntoView({block:'start',behavior:'instant'});card.querySelector('summary')?.focus({preventScroll:true});
}
function enhancePage(){
 const articleEl=document.querySelector('.article-content');
 if(!articleEl)return;
 const fileLinks=articleEl.querySelectorAll('.file a');
 if(fileLinks.length>4){
  const search=document.createElement('label');search.className='inline-search';search.innerHTML=icon('search')+'<input type="search" placeholder="Найти документ на странице…" aria-label="Найти документ на странице">';
  const fileBlock=articleEl.querySelector('.field-name-field-file');
  if(fileBlock){fileBlock.prepend(search);const empty=document.createElement('p');empty.className='filter-empty';empty.textContent='Документы не найдены. Измените запрос.';empty.hidden=true;fileBlock.append(empty);
   search.querySelector('input').addEventListener('input',e=>{const q=normalizeText(e.target.value);let count=0;fileLinks.forEach(a=>{const show=normalizeText(a.textContent).includes(q);a.closest('.field-item').hidden=!show;if(show)count++;});empty.hidden=count>0;});
  }
 }
 articleEl.querySelectorAll('.views-field-body').forEach(el=>{
  if(el.textContent.trim().startsWith('*/'))el.textContent=el.textContent.replace(/^\s*\*\/\s*/,'');
 });
}
function normalizeText(s){return String(s).toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim();}
function buildSearchIndex(){
 const uniqueDocs=new Map();
 searchIndex=Object.entries(content.pages).filter(([path,p])=>!path.includes('?')&&!(p.kind==='careers'&&path!==paths.jobs)).map(([path,p])=>({title:p.title,href:path,text:normalizeText(p.title+' '+p.text),type:'Страница'}));
 if(content.careers)searchIndex.push(...content.careers.items.map(job=>({title:job.title,href:paths.jobs+'#'+job.id,text:normalizeText(job.title+' '+job.summary+' '+job.requirements),type:'Вакансия · '+salaryText(job.salary)+' ₽ · '+job.scheduleLabel})));
 const parser=new DOMParser();
 for(const [path,p] of Object.entries(content.pages)){
  if(path.includes('?'))continue;
  const doc=parser.parseFromString(p.html,'text/html');
  for(const a of doc.querySelectorAll('a[href]')){
   const href=a.getAttribute('href');
   if(href.includes('/sites/default/files/')&&a.textContent.trim()&&!uniqueDocs.has(href))uniqueDocs.set(href,{title:a.textContent.trim(),href,text:normalizeText(a.textContent),type:'Документ · '+p.title});
  }
 }
 searchIndex.push(...uniqueDocs.values());
}
function renderSearch(value=''){
 const results=document.querySelector('#search-results');const q=normalizeText(value);
 if(!q){results.innerHTML='<p class="search-results-label">Популярные разделы</p>'+[
  ['Технологическое присоединение',paths.connection],['Сведения о тарифах на услуги',paths.info+'/сведения-о-тарифах-на-услуги'],['Контакты','/contacts'],['Вакансии',paths.jobs],['Паспорта услуг',paths.passports]
 ].map(([title,href])=>link(href,`<strong>${title}</strong><span>Перейти в раздел →</span>`,'search-result')).join('');return;}
 const words=q.split(' ');const matches=searchIndex.filter(item=>words.every(w=>item.text.includes(w))).map(item=>({...item,score:normalizeText(item.title).includes(q)?3:words.every(w=>normalizeText(item.title).includes(w))?2:1})).sort((a,b)=>b.score-a.score);
 results.innerHTML=matches.length?`<p class="search-results-label">Найдено: ${matches.length}${matches.length>40?' · показаны первые 40':''}</p>`+matches.slice(0,40).map(x=>link(x.href,`<strong>${esc(x.title)}</strong><span>${esc(x.type)} ${external(x.href)?'↗':'→'}</span>`,'search-result')).join(''):'<p class="search-empty">По этому запросу ничего не найдено. Попробуйте другое слово: например, «тарифы» или «присоединение».</p>';
}
document.querySelectorAll('.search-open').forEach(button=>button.addEventListener('click',()=>{if(!content)return;searchDialog.showModal();searchInput.value='';renderSearch();searchInput.focus();}));
document.querySelector('.search-close').addEventListener('click',()=>searchDialog.close());
searchDialog.addEventListener('click',e=>{if(e.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)searchDialog.close();}});
searchInput.addEventListener('input',e=>renderSearch(e.target.value));
document.querySelector('.mobile-toggle').addEventListener('click',e=>{const open=navigation.classList.toggle('mobile-open');e.currentTarget.setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{
 if(!e.target.closest('.nav-item'))closeDropdowns();
 const a=e.target.closest('a[href]');
 if(!a||a.target==='_blank'||a.hasAttribute('download')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0||!content)return;
 const url=new URL(a.href,location.origin);
 if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol)||url.hash)return;
 const route=canonical(url);
 if(route==='/'||content.pages[route]){e.preventDefault();history.pushState({route},'',url.pathname+url.search);render(route);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMobile();}if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();document.querySelector('.search-open').click();}});
window.addEventListener('popstate',()=>{if(content)render(canonical(location.href));});
window.addEventListener('hashchange',()=>{if(content&&currentRoute.startsWith(paths.jobs))revealCareerFromHash();});
document.querySelector('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const contrastButton=document.querySelector('#contrast-toggle');
function setContrast(enabled){document.body.classList.toggle('high-contrast',enabled);contrastButton.setAttribute('aria-pressed',String(enabled));contrastButton.textContent=enabled?'Обычная версия':'Версия для слабовидящих';try{localStorage.setItem('ppes-contrast',enabled?'1':'0');}catch{}}
try{if(localStorage.getItem('ppes-contrast')==='1')setContrast(true);}catch{}
contrastButton.addEventListener('click',()=>setContrast(!document.body.classList.contains('high-contrast')));
fetch('/api/site-content', {cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('Content unavailable');return response.json();}).then(data=>{content=data;renderNav();buildSearchIndex();render(canonical(location.href),false);}).catch(()=>{main.innerHTML=`<div class="container error-state"><h1>Не удалось загрузить материалы</h1><p>Обновите страницу или воспользуйтесь действующим сайтом предприятия.</p>${link('/internet-priemnaya','Открыть сайт предприятия','button button-primary','external')}</div>`;});

function applySiteSettings(){
 const settings=content?.settings;if(!settings)return;
 const branding=content.branding;if(branding){document.querySelectorAll('.brand img,.footer-brand img').forEach(img=>{img.src=branding.logo;img.alt=branding.name});document.querySelectorAll('.brand-caption').forEach(n=>n.textContent=branding.name);document.querySelectorAll('.footer-brand>p').forEach(n=>n.textContent=branding.footer);}
 document.querySelectorAll('[data-site-phone]').forEach(a=>{a.textContent=settings.phone;a.href='tel:'+settings.phone.replace(/[^+0-9]/g,'')});
 document.querySelectorAll('[data-site-email]').forEach(a=>{a.textContent=settings.email;a.href='mailto:'+settings.email});
 document.querySelectorAll('[data-site-address]').forEach(el=>{el.textContent=settings.address});
}
