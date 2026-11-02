fetch('/api/site-content',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{
 const b=d.branding;if(b)document.querySelectorAll('header img').forEach(img=>{img.src=b.logo;img.alt=b.name});
 if(!location.pathname.startsWith('/statistics'))return;
 const s=d.statistics;if(!s)return;const tbody=document.querySelector('tbody');tbody.replaceChildren();for(const row of s.items){const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=row.label;td.textContent=Number(row.value).toLocaleString('ru-RU');tr.append(th,td);tbody.append(tr)}
 const metrics=document.querySelector('.metrics');metrics.replaceChildren();for(const row of s.items.slice(0,3)){const a=document.createElement('article'),strong=document.createElement('strong');a.className='metric';a.append(row.label);strong.textContent=Number(row.value).toLocaleString('ru-RU');a.append(strong);metrics.append(a)}
 document.querySelector('.notice').textContent=s.note;
}).catch(()=>{if(location.pathname.startsWith('/statistics')){const note=document.querySelector('.notice');if(note)note.append(' Не удалось загрузить обновления; показана сохранённая версия.')}});
