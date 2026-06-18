const SCENES = [
  {img:'img/hero.png',     kicker:'白から、組む。', jp:'弟子屈・美留和に、六芒星の村を建てる。', en:'From white, we build — a hexagram village in Teshikaga.', au:'audio/s0.mp3'},
  {svg:true,               kicker:'六芒星の意味', jp:'二つの三角。のぼる＝体・頭・祭。くだる＝泊・食・癒。', en:'Two triangles. Rising: Body·Mind·Festival. Falling: Stay·Eat·Heal.', au:'audio/s1.mp3'},
  {img:'img/cabin.png',    kicker:'初期 · 10人', jp:'はじまりは、一棟から。六つの頂点に、十人が眠る。', en:'It starts with one cabin. Six points, ten guests, a fire at the center.', au:'audio/s2.mp3'},
  {img:'img/village.png',  kicker:'将来 · 100人', jp:'増やすと、村そのものが、また六芒星になる。', en:'Add more, and the village itself becomes a hexagram. A hundred around one fire.', au:'audio/s3.mp3'},
  {img:'img/dome.png',     kicker:'中心 · 火と道場', jp:'村の中心は、火と、大きなドームの道場。', en:'At the heart: fire and a great dome dojo. On the tatami, we grapple.', au:'audio/s4.mp3'},
  {img:'img/festival.png', kicker:'祭 · 音楽フェス', jp:'夜は、火を囲んでステージが立つ。村は祭になる。', en:'At night a stage rises around the fire. The village becomes a festival.', au:'audio/s5.mp3'},
  {img:'img/meaning.png',  kicker:'BIM · 一体と個別', jp:'村全体と一棟を、同じ画面で。法規もその場で判定。', en:'Whole village and single cabin on one screen. Code checked on the spot.', au:'audio/s6.mp3'},
  {img:'img/hero.png',     kicker:'白から、組む。', jp:'安く、早く、世界品質で。泊まって、組んで、祭る。', en:'Cheap, fast, world-class. Stay, grapple, celebrate.', au:'audio/s7.mp3'},
];

const HEX_SVG = `
<svg viewBox="0 0 400 380" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="g"><feGaussianBlur stdDeviation="3"/></filter></defs>
  <polygon points="200,30 340,280 60,280" fill="none" stroke="#f2c14e" stroke-width="2.5"/>
  <polygon points="200,350 60,100 340,100" fill="none" stroke="#dfe7f0" stroke-width="2.5" opacity=".85"/>
  <circle cx="200" cy="190" r="16" fill="#ff8a3c" filter="url(#g)"/>
  <circle cx="200" cy="190" r="9" fill="#ffd9a0"/>
  <g font-family="sans-serif" font-weight="700" text-anchor="middle">
    <text x="200" y="20"  fill="#f2c14e" font-size="22">祭</text>
    <text x="352" y="98"  fill="#dfe7f0" font-size="22">食</text>
    <text x="352" y="296" fill="#f2c14e" font-size="22">頭</text>
    <text x="200" y="375" fill="#dfe7f0" font-size="22">癒</text>
    <text x="48"  y="296" fill="#f2c14e" font-size="22">体</text>
    <text x="48"  y="98"  fill="#dfe7f0" font-size="22">泊</text>
    <text x="200" y="196" fill="#1a0d04" font-size="13">火</text>
  </g>
</svg>`;

const scenesEl = document.getElementById('scenes');
const dotsEl = document.getElementById('dots');
SCENES.forEach((s,i)=>{
  const d = document.createElement('div'); d.className='scene'; d.dataset.i=i;
  const visual = s.svg ? `<div class="svgscene">${HEX_SVG}</div>`
                       : `<img class="bg" src="${s.img}" alt="">`;
  d.innerHTML = `${visual}<div class="grad"></div>
    <div class="cap"><div class="kicker">${s.kicker}</div>
    <div class="jp">${s.jp}</div><div class="en">${s.en}</div></div>`;
  scenesEl.appendChild(d);
  const dot = document.createElement('i'); dot.dataset.i=i; dotsEl.appendChild(dot);
});

const sceneNodes = [...document.querySelectorAll('.scene')];
const dotNodes = [...document.querySelectorAll('.dots i')];
const au = document.getElementById('au');
let cur = -1, playing = false;

function show(i){
  if(i<0||i>=SCENES.length) return;
  cur = i;
  sceneNodes.forEach((n,k)=>n.classList.toggle('on',k===i));
  dotNodes.forEach((n,k)=>n.classList.toggle('on',k===i));
  // restart Ken Burns
  const img = sceneNodes[i].querySelector('.bg');
  if(img){img.style.animation='none'; void img.offsetWidth; img.style.animation='';}
  au.src = SCENES[i].au;
  if(playing){ au.play().catch(()=>{}); }
}
function play(){ playing=true; document.getElementById('toggle').textContent='⏸'; au.play().catch(()=>{}); }
function pause(){ playing=false; document.getElementById('toggle').textContent='▶'; au.pause(); }

au.addEventListener('ended', ()=>{ if(cur < SCENES.length-1){ show(cur+1); } else { pause(); } });
document.getElementById('next').onclick = ()=> show(Math.min(cur+1,SCENES.length-1));
document.getElementById('prev').onclick = ()=> show(Math.max(cur-1,0));
document.getElementById('toggle').onclick = ()=> playing ? pause() : (play());
dotNodes.forEach(d=> d.onclick = ()=> show(+d.dataset.i));

document.getElementById('goBtn').onclick = ()=>{
  document.getElementById('start').style.display='none';
  playing = true; show(0);
};

// パース ⇄ BIM トグル
document.querySelectorAll('.bimcol.pb').forEach(col=>{
  const ifr = col.querySelector('iframe'), bim = col.dataset.bim;
  col.querySelectorAll('.pbtab button').forEach(btn=>{
    btn.onclick = ()=>{
      col.querySelectorAll('.pbtab button').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      if(btn.dataset.m==='bim'){ if(!ifr.src) ifr.src = bim; col.classList.add('show-bim'); }
      else col.classList.remove('show-bim');
    };
  });
});

// ---------- i18n: 日本語 / English ----------
const RELEASED = '2026-06-19';
function fmtDate(l){
  try{ return new Intl.DateTimeFormat(l==='en'?'en-US':'ja-JP',
    {year:'numeric',month:'long',day:'numeric'}).format(new Date(RELEASED)); }
  catch(e){ return RELEASED; }
}
function applyLang(l){
  document.documentElement.lang = l;
  document.querySelectorAll('[data-en]').forEach(el=>{
    if(el.dataset.ja === undefined) el.dataset.ja = el.innerHTML;
    el.innerHTML = (l==='en') ? el.dataset.en : el.dataset.ja;
  });
  document.getElementById('langToggle').textContent = (l==='en') ? '日本語' : 'EN';
  const u = document.getElementById('updated');
  if(u) u.textContent = (l==='en'? 'Updated ' : '更新 ') + fmtDate(l);
  try{ localStorage.setItem('lang', l); }catch(e){}
}
let curLang = (new URLSearchParams(location.search).get('lang')
  || (function(){try{return localStorage.getItem('lang');}catch(e){return null;}})()
  || (navigator.language||'ja').slice(0,2));
curLang = (curLang === 'en') ? 'en' : 'ja';
document.getElementById('langToggle').onclick = ()=>{
  curLang = (curLang === 'en') ? 'ja' : 'en'; applyLang(curLang);
};
applyLang(curLang);
