"use strict";
const $=(s,scope=document)=>scope.querySelector(s), $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const state={products:[],filter:'All'};
const money=p=>typeof p.price==='number'&&p.currency?new Intl.NumberFormat('en-US',{style:'currency',currency:p.currency,maximumFractionDigits:0}).format(p.price):'Price on request';
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadProducts(){
 try{const response=await fetch('data/products.json');if(!response.ok)throw Error('Local JSON unavailable');state.products=await response.json()}
 catch(error){state.products=window.ALBERT0_FALLBACK||[]}
 renderProducts();renderGallery();
}
function productCard(p){return `<article class="product-card"><button class="product-image" data-id="${escapeHtml(p.id)}" aria-label="View ${escapeHtml(p.name)} details"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy"><span class="product-tag">${escapeHtml(p.category.toUpperCase())}</span><span class="quick-view">VIEW DETAILS ↗</span></button><div class="product-meta">${escapeHtml(p.movement.toUpperCase())} / ${escapeHtml(p.material.toUpperCase())}</div><h3 class="product-name">${escapeHtml(p.name)}</h3><p class="product-excerpt">${escapeHtml(p.description)}</p><div class="product-bottom"><span class="product-price">${money(p)}</span><button class="product-detail" data-id="${escapeHtml(p.id)}">View details ↗</button></div></article>`}
function renderProducts(){const list=state.filter==='All'?state.products:state.products.filter(p=>p.category===state.filter);$('#products-grid').innerHTML=list.length?list.map(productCard).join(''):'<p>No products found.</p>'}
function renderGallery(){const list=state.products.filter(p=>p.featured).slice(0,4);$('#gallery-grid').innerHTML=list.map(p=>`<button type="button" class="gallery-trigger" data-id="${escapeHtml(p.id)}" aria-label="View ${escapeHtml(p.name)} details"><img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"><span>${escapeHtml(p.name)} ↗</span></button>`).join('')}
function openProduct(id){const p=state.products.find(x=>x.id===id);if(!p)return;$('#modal-content').innerHTML=`<div class="product-page-layout"><div class="product-page-photo"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"></div><div class="product-page-details"><p class="eyebrow">${escapeHtml(p.category.toUpperCase())}</p><h2 id="modal-title">${escapeHtml(p.name)}</h2><p class="page-price">${money(p)}</p><p>${escapeHtml(p.description)}</p><dl><div><dt>Movement</dt><dd>${escapeHtml(p.movement)}</dd></div><div><dt>Material</dt><dd>${escapeHtml(p.material)}</dd></div><div><dt>Dial</dt><dd>${escapeHtml(p.dial)}</dd></div><div><dt>Reference</dt><dd>${escapeHtml(p.id)}</dd></div></dl><p class="helper">Prices are illustrative for this student eProject.</p></div></div>`;$('#product-dialog').showModal()}
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{state.filter=btn.dataset.filter;$$('.filter').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});renderProducts()}));
document.addEventListener('click',e=>{const btn=e.target.closest('[data-id]');if(btn)openProduct(btn.dataset.id)});
$('#modal-close').addEventListener('click',()=>$('#product-dialog').close());$('#product-dialog').addEventListener('click',e=>{if(e.target.id==='product-dialog')e.target.close()});
const menu=$('#mobile-nav');$('#menu-toggle').addEventListener('click',()=>{menu.hidden=!menu.hidden;$('#menu-toggle').setAttribute('aria-expanded',String(!menu.hidden))});$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false')}));
function updateNav(){const key=(location.hash||'#home').slice(1);$$('[data-nav],#mobile-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+key))}window.addEventListener('hashchange',updateNav);updateNav();
let visits=1;try{visits=Number(localStorage.getItem('alberto_demo_visits')||0)+1;localStorage.setItem('alberto_demo_visits',String(visits))}catch(e){}$('#visitor-count').textContent=visits;$('#year').textContent=new Date().getFullYear();
let locationLabel='Location not shared';function updateTicker(){const now=new Date(),dt=now.toLocaleString(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});const message=`ALBERTO WATCH COMPANY  ✦  ${dt}  ✦  ${locationLabel}  ✦  TIMELESS DESIGN, MODERN PERSPECTIVE  ✦`;$('#ticker-text').textContent=message;$('#ticker-copy').textContent=message}updateTicker();setInterval(updateTicker,1000);
function requestGeo(){if(!navigator.geolocation){locationLabel='Geolocation unavailable';updateTicker();$('#locator-message').textContent='Your browser does not support geolocation.';return}$('#locator-message').textContent='Requesting location permission…';navigator.geolocation.getCurrentPosition(pos=>{const {latitude,longitude}=pos.coords;locationLabel=`${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;updateTicker();$('#locator-message').textContent='Location detected. Open a map centered on your coordinates.';window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(latitude+','+longitude)}`,'_blank','noopener,noreferrer')},err=>{$('#locator-message').textContent='Location unavailable or permission denied. You can search by city instead.';locationLabel='Location permission not granted';updateTicker()},{timeout:10000,enableHighAccuracy:false})}
$('#use-location').addEventListener('click',requestGeo);
$('#location-button').addEventListener('click',()=>{const q=$('#location-search').value.trim();if(!q){$('#locator-message').textContent='Enter a city or area first.';return}window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q),'_blank','noopener,noreferrer');$('#locator-message').textContent='Opened a map for '+q+'. This does not confirm an Alberto store there.'});
const contactForm=$('#contact-form');
const nameInput=contactForm.elements.namedItem('name');
const emailInput=contactForm.elements.namedItem('email');
const messageInput=contactForm.elements.namedItem('message');
const subjectInput=contactForm.elements.namedItem('subject');
const formStatus=$('#form-status');
function validateField(input){
 const value=input.value.trim(); let error='';
 if(input===nameInput){if((value.match(/\p{L}/gu)||[]).length<3)error='Name must contain at least 3 letters.';else if(!/^[\p{L}][\p{L} .'-]*$/u.test(value))error='Name can contain letters, spaces, apostrophes and hyphens only.';}
 if(input===emailInput){if(!/^[A-Za-z]{3,}[A-Za-z0-9]*@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(value))error='Email needs at least 3 letters before @, optional numbers, and gmail.com, yahoo.com or outlook.com.';}
 if(input===subjectInput){if(!value)error='Please select a subject.';}
 if(input===messageInput){if((value.match(/\p{L}/gu)||[]).length<10)error='Message must contain at least 10 letters.';}
 input.setCustomValidity(error);input.setAttribute('aria-invalid',String(Boolean(error)));
 let hint=input.parentElement.querySelector('.field-error');
 if(!hint){hint=document.createElement('small');hint.className='field-error';hint.setAttribute('role','alert');input.insertAdjacentElement('afterend',hint)}
 hint.textContent=error;return !error;
}
[nameInput,emailInput,subjectInput,messageInput].forEach(input=>{
 input.addEventListener('blur',()=>validateField(input));
 input.addEventListener('input',()=>{if(input.getAttribute('aria-invalid')==='true')validateField(input)});
});
contactForm.addEventListener('submit',e=>{
 e.preventDefault();const valid=[nameInput,emailInput,subjectInput,messageInput].map(validateField);
 if(valid.some(v=>!v)){formStatus.textContent='Please correct the highlighted fields before submitting.';[nameInput,emailInput,subjectInput,messageInput].find(i=>i.getAttribute('aria-invalid')==='true').focus();return}
 formStatus.textContent='Form submitted successfully! This is a demo submission; no message was sent to a server.';
 formStatus.style.color='#247a48';
 contactForm.reset();
 [nameInput,emailInput,subjectInput,messageInput].forEach(input=>{
  input.setCustomValidity('');
  input.removeAttribute('aria-invalid');
  const hint=input.parentElement.querySelector('.field-error');
  if(hint)hint.textContent='';
 });
});
loadProducts();