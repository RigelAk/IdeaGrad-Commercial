// in-view animations
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('inview');io.unobserve(e.target)}})},{threshold:.2});document.querySelectorAll('.fade-in-up,.fade-in-left,.fade-in-right').forEach(el=>io.observe(el));

// back-to-top button
const toTopBtn = document.getElementById('toTop');
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
}
// burger
const burger=document.querySelector('.burger');const nav=document.querySelector('.nav');burger?.addEventListener('click',()=>{const opened=nav.style.display==='flex';nav.style.display=opened?'none':'flex';nav.style.flexDirection='column';nav.style.gap='12px';});
// Fan layout (transform-only for perf)
const fan=document.getElementById('fan');const cards=[...fan.querySelectorAll('.card')];const caption=fan.querySelector('.portfolio__caption');const closeBtn=fan.querySelector('.portfolio__close');
let state='closed'; fan.dataset.state='closed';
const GAP=16, W=320, H=320, SCALE=0.84;

function layoutOpen(){
  const wrapW = fan.clientWidth;

  // Detect phone layout (<= 680px) and force 2 columns, centered.
  
const phone = window.matchMedia('(max-width: 680px)').matches;
if (phone){
  // Base (unscaled) size taken from the first card
  const baseW = (cards[0]?.offsetWidth) || 220;
  const baseH = (cards[0]?.offsetHeight) || 220;

  const perRow = Math.min(2, cards.length);
  const GAPm = GAP; // use same gap as desktop
  // Target column width so 2 columns + 3 gaps (left, middle, right) fit container
  const colWidth = (wrapW - 3 * GAPm) / 2;
  const mobScale = Math.min(1, colWidth / baseW);

  const scaledW = baseW * mobScale;
  const scaledH = baseH * mobScale;

  // Total width of a full row, used for centering
  const rowWidth = perRow * scaledW + (perRow - 1) * GAPm;

  // Optional small top padding to keep clear of the title block
  const topPad = 110; // отступ сверху

  // If container has side paddings, we can 'hang' slightly left to visually center to viewport
  let hangLeft = 0;
  const container = fan.closest('.container');
  if (container){
    const cs = getComputedStyle(container);
    const padLeft = parseFloat(cs.paddingLeft) || 0;
    const padRight = parseFloat(cs.paddingRight) || 0;
    hangLeft = Math.min(padLeft, padRight);
  }

  const startX = (wrapW - rowWidth)/2 - hangLeft;
  const rows = Math.ceil(cards.length / perRow);
  const bottomPad = -50; // добавляем отступ снизу
  const totalH = topPad + rows * scaledH + (rows - 1) * GAPm + bottomPad; // добавили bottomPad
  fan.style.height = totalH + 'px';

  closeBtn&&closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeFan(); });
cards.forEach((el, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const x = startX + col * (scaledW + GAPm);
    const y = topPad + row * (scaledH + GAPm);
    el.style.transform = `translate3d(${x - wrapW/2 + scaledW/2}px, ${y - scaledH/2}px, 0) scale(${mobScale}) rotate(0deg)`;
  });
  return;
}


  // === Desktop / tablets: keep existing behavior ===
  const perRow = Math.max(1, Math.min(cards.length, Math.floor((wrapW + GAP)/(W + GAP)) ));
  const rows = Math.ceil(cards.length/perRow);
  const totalH = rows*(H*SCALE + GAP) + 20;
  fan.style.height= totalH + 'px';
  const rowW = (n)=> n*(W+GAP)-GAP;
  cards.forEach((el,i)=>{
    const row=Math.floor(i/perRow), col=i%perRow;
    const rw=rowW(perRow), startX=(wrapW - rw)/2;
    const x=startX + col*(W+GAP);
    const y=row*(H*SCALE + GAP);
    el.style.transform=`translate3d(${x - wrapW/2 + W/2}px, ${y - H/2}px, 0) scale(${SCALE}) rotate(0deg)`;
  });
}
function layoutClosed(){
  const small = window.matchMedia('(max-width: 680px)').matches;
  // фиксированная высота для мобильных и десктопа, чтобы отступы не прыгали
  fan.style.height = small ? '360px' : '440px';
  cards.forEach(el=>el.style.transform='');
}
function openFan(){ if(state==='open') return; state='open'; fan.classList.add('open'); fan.dataset.state='open'; const cb=fan.querySelector('.portfolio__close'); const header=document.querySelector('.site-header'); if(cb){   cb.setAttribute('aria-hidden','false');   const h = header ? Math.ceil(header.getBoundingClientRect().height) : 64;   cb.style.top = (h + 12) + 'px'; } layoutOpen(); }
function closeFan(){ if(state==='closed') return; state='closed'; fan.classList.remove('open'); fan.dataset.state='closed'; const cb=fan.querySelector('.portfolio__close'); if(cb){ cb.setAttribute('aria-hidden','true'); } layoutClosed(); // caption disabled per new design
 }
const touch=window.matchMedia('(hover: none)').matches;
if(!touch){ let t1,t2; fan.addEventListener('mouseenter',()=>{ clearTimeout(t2); t1=setTimeout(openFan,60); }); fan.addEventListener('mouseleave',()=>{ clearTimeout(t1); t2=setTimeout(closeFan,80); }); }
else{ fan.addEventListener('click',()=>{ if(state==='closed') openFan(); }); closeBtn.addEventListener('click',e=>{ e.stopPropagation(); closeFan(); }); }
cards.forEach(c=>{ const t=c.getAttribute('data-title')||''; c.addEventListener('mouseenter',()=>{ // caption disabled per new design
 }); c.addEventListener('mouseleave',()=>{ // caption disabled per new design
 }); c.addEventListener('click', (e) => { if (state !== 'open') { e.preventDefault(); openFan(); } /* when open, follow href normally */ }); });
window.addEventListener('resize', ()=>{ if(state==='open') layoutOpen(); });
// subtle animated geometry
const canvas=document.getElementById('geo');const ctx=canvas.getContext('2d');function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}resize();window.addEventListener('resize',resize);
const isMobile = window.matchMedia('(max-width: 680px)').matches || window.matchMedia('(hover: none)').matches;
let shapes=Array.from({length: (isMobile ? 9 : 16)},(_,i)=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:30+Math.random()*90,vx:(Math.random()-.5)*0.5,vy:(Math.random()-.5)*0.5,a:Math.random()*Math.PI*2}));
(function tick(){
  const speedFactor = (typeof isMobile !== 'undefined' && isMobile) ? 1.1 : 1.8;ctx.clearRect(0,0,canvas.width,canvas.height);shapes.forEach(s=>{s.x+=s.vx*speedFactor;s.y+=s.vy*speedFactor;s.a+=0.006;if(s.x<-100) s.x=canvas.width+100;if(s.x>canvas.width+100) s.x=-100;if(s.y<-100) s.y=canvas.height+100;if(s.y>canvas.height+100) s.y=-100;const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r);g.addColorStop(0,'rgba(0,209,255,0.18)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,s.r*(1+Math.sin(s.a)*0.08),0,Math.PI*2);ctx.fill();});requestAnimationFrame(tick);})();


// Adjust portfolio closed height for small screens
(function portfolioHeightMobile(){
  const fanWrap = document.getElementById('fan');
  if(!fanWrap) return;
  function applyHeight(){
    const small = window.matchMedia('(max-width: 680px)').matches;
    if (fanWrap.dataset.state === 'closed') {
      fanWrap.style.height = small ? '360px' : '440px'; // keep in sync with layoutClosed()
    }
  }
  applyHeight();
  window.addEventListener('resize', applyHeight);
})();

// === Google Sheets integration ===
// Paste your Google Apps Script Web App URL below:
const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwh197iJS-N5kJ1MPf7q_p_g3mWfWJZYc3A9tEChX5PIFSNcsw5mHDo6GrU1zBvr1Qt/exec';

(function(){
  const form = document.getElementById('leadForm');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const isAnimated = submitBtn.classList.contains('animated-button');
    const btnLabel = isAnimated ? submitBtn.querySelector('span:first-child') : submitBtn;
const payload = Object.fromEntries(new FormData(form).entries());
    const meta = {
      page: location.href,
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };
    submitBtn.disabled = true;
    if(btnLabel) btnLabel.textContent = 'Отправляем...';
    try{
      const res = await fetch(SHEETS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors', // apps script can respond opaque; change to 'cors' if you add proper CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ...meta })
      });
      // Show success UI
      form.reset();
      if(btnLabel) btnLabel.textContent = 'Готово!';
      submitBtn.classList.add('btn--success');
      setTimeout(()=>{
        submitBtn.disabled = false;
        if(btnLabel) btnLabel.textContent = 'Отправить';
        submitBtn.classList.remove('btn--success');
      }, 2500);
    }catch(err){
      console.error('Send error', err);
      submitBtn.disabled = false;
      if(btnLabel) btnLabel.textContent = 'Ошибка, попробовать ещё раз';
    }
  });
})();



// --- Mobile burger & dropdown animation override (non-desktop) ---
(function(){
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.site-header .nav');
  if(!header || !burger || !nav) return;
  function isPhone(){ return window.matchMedia('(max-width: 680px)').matches; }
  burger&&burger.addEventListener('click', function(e){
    if(!isPhone()) return; // desktop not touched
    e.preventDefault();
    e.stopImmediatePropagation();
    const open = !header.classList.contains('is-open');
    if(open){
      nav.style.display = 'flex';
      header.classList.add('is-open');
      burger.classList.add('is-open');
      nav.setAttribute('aria-hidden','false');
    }else{
      header.classList.remove('is-open');
      burger.classList.remove('is-open');
      nav.setAttribute('aria-hidden','true');
      nav.addEventListener('transitionend', function h(ev){
        if(ev.propertyName==='max-height'){
          nav.style.display = 'none';
          nav.removeEventListener('transitionend', h);
        }
      }, {once:true});
    }
  }, true);
})();



// Mobile SVG hamburger toggle
(function(){
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-header .nav');
  const ham = document.querySelector('.hamburger .checkbox');
  if(!header || !nav || !ham) return;
  function isPhone(){ return window.matchMedia('(max-width: 680px)').matches; }
  function openMenu(){
    nav.style.display = 'flex';
    header.classList.add('is-open');
    nav.setAttribute('aria-hidden','false');
  }
  function closeMenu(){
    header.classList.remove('is-open');
    nav.setAttribute('aria-hidden','true');
    nav.addEventListener('transitionend', function h(ev){
      if(ev.propertyName==='max-height'){
        nav.style.display = 'none';
        nav.removeEventListener('transitionend', h);
      }
    }, {once:true});
  }
  ham.addEventListener('change', function(){
    if(!isPhone()) return;
    if(this.checked) openMenu(); else closeMenu();
  });
  // Close on link tap
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    if(!isPhone()) return;
    ham.checked = false; closeMenu();
  }));
})();


function updateCloseBtnTop(){
  if(!fan.classList.contains('open')) return;
  const cb = fan.querySelector('.portfolio__close');
  const header = document.querySelector('.site-header');
  if(cb){
    const h = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
    cb.style.top = (h + 12) + 'px';
  }
}
window.addEventListener('resize', updateCloseBtnTop);
window.addEventListener('orientationchange', updateCloseBtnTop);




// === Reposition "Листай!" hint directly onto the first card (top-right edge) ===
(function(){
  var hint = document.getElementById('why-scroll-hint');
  var firstCard = document.querySelector('#why .why .why__item');
  if(!hint || !firstCard) return;
  // Move the hint node into the first card so it's positioned relative to it
  firstCard.appendChild(hint);
  // Ensure it's visible initially (script further below controls hiding after scroll)
  hint.setAttribute('aria-hidden','false');
})();
// Hide "Листай!" hint after first interaction/scroll in the "Почему мы?" section
(function(){
  var scroller = document.querySelector('#why .why');
  var hint = document.getElementById('why-scroll-hint');
  if(!scroller || !hint) return;

  var hidden = false;
  function hideHint(){
    if(hidden) return;
    hidden = true;
    hint.classList.add('scroll-hint--hidden');
    // remove listeners after hiding
    scroller.removeEventListener('scroll', onScroll);
    scroller.removeEventListener('pointerdown', onPointer);
    scroller.removeEventListener('touchstart', onPointer);
    scroller.removeEventListener('wheel', onWheel, {passive:true});
  }
  function onScroll(){
    if(scroller.scrollLeft > 0) hideHint();
  }
  function onPointer(){ hideHint(); }
  function onWheel(){ hideHint(); }

  // In case page loads already scrolled (unlikely), check once
  if(scroller.scrollLeft > 0){ hideHint(); }

  scroller.addEventListener('scroll', onScroll, {passive:true});
  scroller.addEventListener('pointerdown', onPointer, {passive:true});
  scroller.addEventListener('touchstart', onPointer, {passive:true});
  scroller.addEventListener('wheel', onWheel, {passive:true});
})();

// === Keep "Листай!" fixed on the first card after resize ===
window.addEventListener('resize', () => {
  const hint = document.getElementById('why-scroll-hint');
  const firstCard = document.querySelector('#why .why .why__item');
  if (hint && firstCard && !firstCard.contains(hint)) {
    firstCard.appendChild(hint);
  }
});

// Services: click to show blur+dark overlay with description, auto-hide in 4s or on second click
(function(){
  var cards = document.querySelectorAll('#services .service-card');
  if(!cards.length) return;
  var active = null;
  var timer = null;

  function hideActive(){
    if(active){
      active.classList.remove('active');
      var ov = active.querySelector('.service-overlay');
      if(ov) ov.remove();
      active = null;
    }
    if(timer){ clearTimeout(timer); timer = null; }
  }

  cards.forEach(function(card){
    card.addEventListener('click', function(ev){
      ev.stopPropagation();
      if(card.classList.contains('active')){ hideActive(); return; }
      hideActive();
      var desc = card.getAttribute('data-desc') || '';
      var ov = document.createElement('div');
      ov.className = 'service-overlay';
      ov.textContent = desc;
      card.appendChild(ov);
      // Force reflow then activate
      void ov.offsetWidth;
      card.classList.add('active');
      active = card;
      timer = setTimeout(hideActive, 4000);
    });
  });

  document.addEventListener('click', function(e){
    if(!e.target.closest('#services .service-card')) hideActive();
  });
})();
