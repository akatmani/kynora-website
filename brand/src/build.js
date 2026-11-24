// Builds one HTML guidelines document per direction, then prints each to PDF (1920×1080 pages).
// usage: node build.js [html|pdf|png] [A|B|C]
const fs = require('fs'), path = require('path'), os = require('os');
const { CORE, dirs } = require('./directions');
const OUT = path.join(__dirname, '..');
const MODE = process.argv[2] || 'pdf', ONLY = process.argv[3];

/* ---------- colour maths (real numbers, not guesses) ---------- */
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lum = h => { const c = rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const cmyk = h => { const [r, g, b] = rgb(h).map(v => v / 255); const k = 1 - Math.max(r, g, b); return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(v => Math.round(v * 100)); };
const grade = r => r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Decoration';

const DATE = 'November 2026';
const CSS = d => `
@page{size:1920px 1080px;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#888}
:root{--ivory:#F3EFE6;--carbon:#171717;--verm:#E5482E;--stone:#A7A7A2;--graphite:#4D4B47;--brick:#B23A22;
  --display:${d.fonts.display.family};--text:${d.fonts.text.family};--mono:${d.fonts.mono.family}}
.pg{width:1920px;height:1080px;position:relative;overflow:hidden;break-after:page;background:var(--ivory);color:var(--carbon);font-family:var(--text);-webkit-font-smoothing:antialiased}
.pg.dark{background:var(--carbon);color:var(--ivory)}
.pg.red{background:var(--verm);color:var(--ivory)}
.hd,.ft{position:absolute;left:120px;right:120px;display:flex;justify-content:space-between;font:400 13px var(--mono);letter-spacing:.1em;text-transform:uppercase;opacity:.55}
.hd{top:54px}.ft{bottom:50px}
.in{position:absolute;left:120px;right:120px;top:150px;bottom:120px}
.disp{${d.fonts.display.css}}
.kick{font:500 14px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--verm)}
.dark .kick,.red .kick{color:inherit;opacity:.7}
h1.t{margin:22px 0 0;font-size:84px;line-height:1.02;max-width:1300px}
h2.t{margin:18px 0 0;font-size:56px;line-height:1.05}
.lead{font-size:26px;line-height:1.5;font-weight:400;max-width:860px;margin:30px 0 0;opacity:.82}
p{margin:0}
.mono-s{font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase}
.cols{display:grid;gap:56px}
.c3{grid-template-columns:repeat(3,1fr)}.c2{grid-template-columns:1fr 1fr}
.item h4{margin:0 0 12px;font-size:24px;font-weight:600}
.item p{font-size:18px;line-height:1.55;opacity:.78}
.rule{border-top:1px solid currentColor;opacity:.18}
.tile{border-radius:20px;display:grid;place-items:center;position:relative;overflow:hidden}
.tile .cap{position:absolute;left:22px;bottom:18px;font:400 12px var(--mono);letter-spacing:.1em;text-transform:uppercase;opacity:.65}
.no{position:absolute;right:18px;top:16px;width:34px;height:34px;border-radius:50%;background:var(--verm);color:#fff;display:grid;place-items:center;font:700 18px var(--text)}
.ok{position:absolute;right:18px;top:16px;width:34px;height:34px;border-radius:50%;background:#171717;color:#F3EFE6;display:grid;place-items:center;font:700 16px var(--text)}
.dev-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;margin-top:56px}
.dev-art{height:440px;border-radius:18px;background:#E9E4D9;overflow:hidden;position:relative}
.dev h4{margin:26px 0 10px;font-size:24px;font-weight:600}.dev p{font-size:17px;line-height:1.55;opacity:.78}
/* B + C logo type */
.wmB{font-family:"Bricolage Grotesque";font-weight:800;font-variation-settings:"opsz" 96;letter-spacing:-.035em;line-height:1;white-space:nowrap;display:inline-block}
.wmB i{display:inline-block;width:1.04ex;height:1.04ex;border-radius:50%;margin:0 .02em 0 .015em;vertical-align:-.012ex}
.symB{display:inline-grid;place-items:center;border-radius:50%;font-family:"Bricolage Grotesque";font-weight:800;font-variation-settings:"opsz" 96;line-height:1;padding-bottom:.06em}
.pill-b{display:inline-flex;align-items:center;gap:12px;height:52px;padding:0 24px 0 20px;border-radius:99px;background:#fff;color:#171717}
.pill-b.dark{background:#262524;color:#F3EFE6}
.pill-b i{width:14px;height:14px;border-radius:50%;background:#E5482E;box-shadow:0 0 0 5px rgba(229,72,46,.2)}
.wmC{font-family:"Instrument Serif";font-weight:400;letter-spacing:-.015em;line-height:1;white-space:nowrap;word-spacing:-.08em}
.wmC em{font-style:italic}
.symC{font-family:"Instrument Serif";line-height:1;letter-spacing:-.1em}
.symC em{font-style:italic;margin-left:-.06em}
`;

const pageShell = (d, n, total, section, body, cls = '') => `<section class="pg ${cls}">
  <div class="hd"><span>KYNORA WORKS — Brand guidelines</span><span>${d.standalone ? 'Version 1.0' : `Direction ${d.id} · ${d.name}`}</span></div>
  ${body}
  <div class="ft"><span>${section}</span><span>${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div></section>`;

function pages(d) {
  const P = [];
  const acc = '#E5482E';
  const allColours = [CORE.ivory, CORE.carbon, CORE.verm, CORE.stone, ...d.extra];
  const hex = n => (allColours.find(c => c.name === n) || {}).hex;

  /* 1 cover */
  const cov = { carbon: ['dark', '#F3EFE6', acc], verm: ['red', '#171717', '#F3EFE6'], ivory: ['', '#171717', acc] }[d.coverBg];
  P.push(['', `<div class="in" style="display:flex;flex-direction:column;justify-content:space-between;top:120px">
      <div class="kick">${d.standalone ? 'Brand guidelines' : `Brand guidelines · Direction ${d.id} of 3`}</div>
      <div>${d.wm(d.id === 'A' ? 200 : 210, cov[1], cov[2])}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div><div class="disp" style="font-size:64px;line-height:1">${d.name}</div><p style="font-size:24px;line-height:1.45;max-width:760px;margin-top:20px;opacity:.75">${d.summary}</p></div>
        <div class="mono-s" style="opacity:.6;text-align:right">Version 1.0<br>${DATE}</div></div></div>`, cov[0], 'Cover']);

  /* 2 contents */
  const toc = ['The idea', 'Concept', 'Primary logo', 'Logo system', 'Construction', 'Clear space & sizes', 'Logo on colour', 'Misuse', 'Colour palette', 'Colour in use', 'Typography', 'Type in use', 'Graphic language', 'Digital', 'Print & physical', 'Voice'];
  P.push(['', `<div class="in"><div class="kick">Contents</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:120px;margin-top:60px">${toc.map((t, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(23,23,23,.14);padding:18px 0"><span class="disp" style="font-size:34px">${t}</span><span class="mono-s" style="opacity:.55">${String(i + (i >= 3 ? 4 : 3)).padStart(2, '0')}</span></div>`).join('')}</div></div>`, '', 'Contents']);

  /* 3 the idea */
  P.push(['', `<div class="in"><div class="kick">01 — The idea</div>
    <h1 class="t disp">We build the work and the world around it.</h1>
    <p class="lead">KYNORA WORKS is one team for software, marketing, design and culture. The product and the story are made in the same room, so what launches already works and already has people talking.</p>
    <div class="cols c3" style="margin-top:90px">
      ${[['Technical in substance', 'Everything we make is engineered properly. Precision is the floor, not the pitch.'], ['Creative in expression', 'We have a point of view and show it. The work should be recognisable before you read the name.'], ['Cultural in spirit', 'We make things people bring up in conversation. The brand should feel like a place, not a vendor.']].map(([h, p]) => `<div class="item"><div class="rule" style="margin-bottom:26px"></div><h4>${h}</h4><p>${p}</p></div>`).join('')}
    </div>
    <div style="position:absolute;bottom:0;left:0;right:0;display:flex;gap:16px;align-items:center;font-size:18px"><span class="mono-s" style="opacity:.6;margin-right:12px">Personality</span>${['Precise', 'Warm', 'Confident', 'Plain-spoken', 'Never loud for its own sake'].map(t => `<span style="border:1px solid rgba(23,23,23,.2);border-radius:99px;padding:10px 20px">${t}</span>`).join('')}</div></div>`, '', 'The idea']);

  /* 4 concept */
  P.push(['', `<div class="in" style="display:grid;grid-template-columns:1.25fr 1fr;gap:80px;align-items:center">
    <div style="display:grid;place-items:center">${d.concept()}</div>
    <div><div class="kick">02 — Concept</div><h2 class="t disp">${d.one}</h2>
      <div style="margin-top:50px;display:flex;flex-direction:column;gap:34px">${d.conceptCopy.map(([h, p]) => `<div class="item"><h4>${h}</h4><p>${p}</p></div>`).join('')}</div></div></div>`, '', 'Concept']);

  /* 5 primary logo */
  P.push(['', `<div class="in" style="display:flex;flex-direction:column">
    <div class="kick">03 — Primary logo</div>
    <div style="flex:1;display:grid;place-items:center">${d.wm(d.id === 'A' ? 190 : 200, '#171717', acc)}</div>
    <div style="display:flex;justify-content:space-between;font-size:18px;opacity:.75"><span>The wordmark is the logo. Use it first, everywhere it fits.</span><span class="mono-s">Carbon + Vermilion on Ivory</span></div></div>`, '', 'Primary logo']);

  P.push(['', `<div class="in" style="display:flex;flex-direction:column">
    <div class="kick">03 — Primary logo, reversed</div>
    <div style="flex:1;display:grid;place-items:center">${d.wm(d.id === 'A' ? 190 : 200, '#F3EFE6', acc)}</div>
    <div style="display:flex;justify-content:space-between;font-size:18px;opacity:.75"><span>On dark, the logo turns Ivory. The accent stays Vermilion.</span><span class="mono-s">Ivory + Vermilion on Carbon</span></div></div>`, 'dark', 'Primary logo']);

  /* 6 logo system */
  const sysTile = (art, cap, bg = '#E9E4D9', col = '#171717') => `<div class="tile" style="background:${bg};color:${col}">${art}<span class="cap">${cap}</span></div>`;
  P.push(['', `<div class="in"><div class="kick">04 — Logo system</div><h2 class="t disp">Four parts, one family.</h2>
    <div style="display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:290px 290px;gap:24px;margin-top:56px">
      ${sysTile(d.wm(d.id === 'A' ? 84 : 90, '#171717', acc), 'Wordmark — primary')}
      ${sysTile(d.sym(150, '#171717', acc), 'Symbol — avatars, favicons, small spaces')}
      ${sysTile(d.lockup(d.id === 'A' ? 64 : 70, '#F3EFE6', acc), 'Lockup — formal, legal, partnerships', '#171717', '#F3EFE6')}
      ${sysTile(d.stack(d.id === 'A' ? 54 : 60, '#171717', acc), 'Stacked — print, signage, merch')}
    </div></div>`, '', 'Logo system']);

  /* 7 construction */
  P.push(['', `<div class="in" style="display:grid;grid-template-columns:1.3fr 1fr;gap:90px;align-items:center">
    <div style="display:grid;place-items:center">${d.construction()}</div>
    <div><div class="kick">05 — Construction</div><h2 class="t disp">${d.id === 'A' ? 'Drawn, not typed.' : 'Set once, then locked.'}</h2>
    <div style="margin-top:44px;display:flex;flex-direction:column;gap:20px">${d.constructionNotes.map((t, i) => `<div style="display:grid;grid-template-columns:44px 1fr;font-size:20px;line-height:1.5"><span class="mono-s" style="color:var(--verm);padding-top:5px">0${i + 1}</span><span style="opacity:.85">${t}</span></div>`).join('')}</div>
    <p style="margin-top:44px;font-size:17px;opacity:.6">Always use the master artwork files. The logo is never re-typed or redrawn.</p></div></div>`, '', 'Construction']);

  /* 8 clear space + sizes */
  P.push(['', `<div class="in"><div class="kick">06 — Clear space & minimum sizes</div>
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:80px;margin-top:50px;align-items:start">
      <div style="background:#E9E4D9;border-radius:20px;height:600px;display:grid;place-items:center">
        <div style="position:relative;padding:64px;outline:1.5px dashed #E5482E;outline-offset:0">
          <div style="outline:1px solid rgba(229,72,46,.35)">${d.wm(d.id === 'A' ? 96 : 104, '#171717', acc)}</div>
          ${['left:0;top:50%;translate:0 -50%;width:64px;height:2px', 'right:0;top:50%;translate:0 -50%;width:64px;height:2px', 'top:0;left:50%;translate:-50% 0;height:64px;width:2px', 'bottom:0;left:50%;translate:-50% 0;height:64px;width:2px'].map(s => `<i style="position:absolute;${s};background:rgba(229,72,46,.5)"></i>`).join('')}
          <span class="mono-s" style="position:absolute;left:14px;top:12px;color:#E5482E">x</span></div></div>
      <div><h2 class="t disp" style="font-size:44px;margin-top:0">Give it room.</h2>
        <p style="font-size:20px;line-height:1.55;margin-top:22px;opacity:.82">Keep a margin of <b>x</b> on every side, where x is ${d.clearUnit}. Nothing else enters that space: no text, no edges, no other logos.</p>
        <div style="margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:30px">
          ${[['Wordmark', 'Screen 96 px wide', 'Print 24 mm wide', d.wm(d.id === 'A' ? 13.8 : 13, '#171717', acc)], ['Symbol', 'Screen 16 px', 'Print 5 mm', d.sym(20, '#171717', acc)]].map(([h, a, b, art]) => `<div style="border-top:1px solid rgba(23,23,23,.18);padding-top:20px"><div style="height:56px;display:flex;align-items:center">${art}</div><h4 style="margin:14px 0 6px;font-size:20px">${h}</h4><p style="font-size:16px;opacity:.7;line-height:1.6">${a}<br>${b}</p></div>`).join('')}
        </div></div></div></div>`, '', 'Clear space']);

  /* 9 logo on colour */
  const combos = [['#F3EFE6', '#171717', acc, 'Carbon on Ivory'], ['#171717', '#F3EFE6', acc, 'Ivory on Carbon'], ['#E5482E', '#171717', '#F3EFE6', 'Carbon on Vermilion'], ['#E5482E', '#F3EFE6', '#171717', 'Ivory on Vermilion'], [hex(d.extra[0].name), '#171717', acc, `On ${d.extra[0].name}`], ['url', '#F3EFE6', '#F3EFE6', 'Ivory on photography']];
  P.push(['', `<div class="in"><div class="kick">07 — Logo on colour</div><h2 class="t disp">Approved combinations.</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:280px 280px;gap:22px;margin-top:50px">
      ${combos.map(([bg, c, a, cap]) => `<div class="tile" style="${bg === 'url' ? 'background:linear-gradient(rgba(23,23,23,.35),rgba(23,23,23,.35)),url(../assets/lumen.jpg) center/cover' : `background:${bg};${bg === '#F3EFE6' ? 'box-shadow:inset 0 0 0 1px rgba(23,23,23,.12)' : ''}`};color:${c}">${d.wm(d.id === 'A' ? 58 : 62, c, a)}<span class="cap">${cap}</span></div>`).join('')}
    </div></div>`, '', 'Logo on colour']);

  /* 10 misuse */
  const mis = [['transform:scaleX(1.45)', 'Don’t stretch or squash'], ['transform:rotate(-12deg)', 'Don’t rotate'], ['filter:drop-shadow(8px 10px 0 #E5482E)', 'Don’t add effects'], ['color:#3A6FD8', 'Don’t recolour', '#3A6FD8', '#3A6FD8'], ['opacity:.3', 'Don’t fade it'], ['', 'Don’t place on low contrast', null, null, '#A7A7A2']];
  P.push(['', `<div class="in"><div class="kick">08 — Misuse</div><h2 class="t disp">Please don’t.</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:280px 280px;gap:22px;margin-top:50px">
      ${mis.map(([st, cap, c, a, bg]) => `<div class="tile" style="background:${bg || '#E9E4D9'}"><div style="${st}">${d.wm(d.id === 'A' ? 50 : 56, c || (bg ? '#B5B5B0' : '#171717'), a || (bg ? '#C9C9C4' : acc))}</div><span class="no">✕</span><span class="cap">${cap}</span></div>`).join('')}
    </div></div>`, '', 'Misuse']);

  /* 11 palette */
  const sw = (c, big) => { const [r, g, b] = rgb(c.hex), k = cmyk(c.hex); const light = lum(c.hex) > .4; return `<div style="background:${c.hex};color:${light ? '#171717' : '#F3EFE6'};border-radius:18px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;${c.hex === '#F3EFE6' || c.hex === '#FBF9F4' ? 'box-shadow:inset 0 0 0 1px rgba(23,23,23,.14);' : ''}">
      <div><div class="disp" style="font-size:${big ? 40 : 28}px;line-height:1">${c.name}</div><p style="font-size:${big ? 16 : 14}px;line-height:1.45;margin-top:12px;opacity:.8;max-width:330px">${c.role}</p></div>
      <div style="font:400 ${big ? 14 : 12}px var(--mono);letter-spacing:.06em;line-height:1.7;opacity:.85">${c.hex}<br>RGB ${r} ${g} ${b}<br>CMYK ${k.join(' ')}*</div></div>`; };
  P.push(['', `<div class="in"><div class="kick">09 — Colour palette</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:470px 300px;gap:20px;margin-top:40px">
      ${[CORE.ivory, CORE.carbon, CORE.verm, CORE.stone].map(c => sw(c, true)).join('')}
      ${d.extra.map(c => sw(c)).join('')}
      <div style="padding:10px 6px;font-size:15px;line-height:1.55;opacity:.7"><b>Core four</b> on top, unchanged from today: they already work. <b>Supporting</b> below, added to fix real gaps: readable accent text, secondary text and a ${d.extra[0].name.toLowerCase()} for range.<br><br>*CMYK is a starting point. Proof on the actual stock before any print run.</div>
    </div></div>`, '', 'Colour palette']);

  /* 12 colour in use */
  const pairs = [['#171717', '#F3EFE6', 'Carbon on Ivory'], ['#4D4B47', '#F3EFE6', 'Graphite on Ivory'], ['#B23A22', '#F3EFE6', 'Brick on Ivory'], ['#E5482E', '#F3EFE6', 'Vermilion on Ivory'], ['#A7A7A2', '#F3EFE6', 'Stone on Ivory'], ['#F3EFE6', '#171717', 'Ivory on Carbon'], ['#E5482E', '#171717', 'Vermilion on Carbon'], ['#F3EFE6', '#E5482E', 'Ivory on Vermilion'], ['#171717', '#E5482E', 'Carbon on Vermilion']];
  P.push(['', `<div class="in"><div class="kick">10 — Colour in use</div>
    <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:80px;margin-top:40px">
      <div><h2 class="t disp" style="font-size:48px">Mostly Ivory. A little red goes a long way.</h2>
        <div style="display:flex;height:120px;border-radius:16px;overflow:hidden;margin-top:50px;box-shadow:inset 0 0 0 1px rgba(23,23,23,.12)">${d.ratio.map(([n, p]) => `<div style="flex:${p};background:${hex(n)};border-right:1px solid rgba(23,23,23,.1)"></div>`).join('')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px 26px;margin-top:18px">${d.ratio.map(([n, p]) => `<span style="display:flex;align-items:center;gap:10px;font:400 14px var(--mono)"><i style="width:14px;height:14px;border-radius:4px;background:${hex(n)};box-shadow:inset 0 0 0 1px rgba(23,23,23,.18)"></i>${n} ${p}%</span>`).join('')}</div>
        <p style="font-size:19px;line-height:1.6;margin-top:46px;opacity:.82">Vermilion is the signal, so it only works if it is rare. One Vermilion moment per screen or page: a button, a logo accent, a highlight. For small text or links on Ivory use Brick: same family, readable.</p></div>
      <div><div class="mono-s" style="opacity:.6;margin-bottom:16px">Contrast, measured (WCAG 2.1)</div>
        ${pairs.map(([fg, bg, n]) => { const r = cr(fg, bg); return `<div style="display:grid;grid-template-columns:72px 1fr 90px 120px;align-items:center;gap:20px;border-bottom:1px solid rgba(23,23,23,.12);padding:11px 0"><span style="height:46px;border-radius:10px;background:${bg};color:${fg};display:grid;place-items:center;font:700 22px var(--text);${bg === '#F3EFE6' ? 'box-shadow:inset 0 0 0 1px rgba(23,23,23,.12)' : ''}">Aa</span><span style="font-size:17px">${n}</span><span style="font:400 15px var(--mono)">${r.toFixed(2)}:1</span><span style="font:500 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;${r < 3 ? 'color:#B23A22' : ''}">${grade(r)}</span></div>`; }).join('')}
      </div></div></div>`, '', 'Colour in use']);

  /* 13 typography */
  const F = d.fonts;
  P.push(['', `<div class="in"><div class="kick">11 — Typography</div>
    <div style="display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:50px;margin-top:40px">
      ${[['Display', F.display, `<div class="disp" style="font-size:230px;line-height:.9">Aa</div><div class="disp" style="font-size:30px;margin-top:18px">ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>0123456789</div>`],
         ['Text', F.text, `<div style="font-family:var(--text);font-size:230px;line-height:.9;font-weight:400">Aa</div><div style="font-family:var(--text);font-size:30px;margin-top:18px;line-height:1.3">ABCDEFGHIJKLM<br>abcdefghijklm<br>0123456789</div>`],
         ['Mono', F.mono, `<div style="font-family:var(--mono);font-size:200px;line-height:.98">Aa</div><div style="font-family:var(--mono);font-size:24px;margin-top:22px;line-height:1.45">ABCDEFGHIJKLM<br>abcdefghijklm<br>0123456789</div>`]].map(([role, ft, art]) => `
        <div><div class="mono-s" style="opacity:.55">${role}</div><div style="height:470px;margin-top:16px;overflow:hidden">${art}</div>
          <div class="rule" style="margin:10px 0 20px"></div>
          <h4 style="margin:0;font-size:26px">${ft.name}</h4><p class="mono-s" style="margin-top:8px;opacity:.6">${ft.weights}</p>
          <p style="font-size:16px;line-height:1.55;margin-top:14px;opacity:.8">${ft.why}</p><p style="font-size:14px;margin-top:10px;opacity:.55">${ft.source}</p></div>`).join('')}
    </div></div>`, '', 'Typography']);

  /* 14 type in use */
  P.push(['', `<div class="in" style="display:grid;grid-template-columns:1fr 1.15fr;gap:90px">
    <div><div class="kick">12 — Type in use</div>
      ${[['Display XL', '120 / 1.0', 'Hero headlines'], ['Display L', '72 / 1.05', 'Section titles'], ['Display M', '44 / 1.1', 'Cards, slides'], ['Body L', '22 / 1.5', 'Intros'], ['Body', '17 / 1.6', 'Everything else'], ['Label', '12 / 1.4 · +12% · caps', 'Mono, metadata']].map(([a, b, c]) => `<div style="display:grid;grid-template-columns:200px 220px 1fr;border-bottom:1px solid rgba(23,23,23,.12);padding:20px 0;font-size:17px"><b style="font-weight:600">${a}</b><span style="font-family:var(--mono);font-size:15px">${b}</span><span style="opacity:.65">${c}</span></div>`).join('')}
      <p style="font-size:17px;line-height:1.6;margin-top:36px;opacity:.75">Display is for headlines only, never paragraphs. Text does the reading. Mono is always small, always capitals, and carries facts: numbers, dates, labels.${d.id === 'A' ? ' <b>On Monument:</b> its Ultrabold is a great swap for the display face, but don’t set body copy in Ultralight. Thin extended letters fall apart at reading sizes.' : ''}</p></div>
    <div style="background:#FBF9F4;border-radius:20px;padding:64px;box-shadow:inset 0 0 0 1px rgba(23,23,23,.08);display:flex;flex-direction:column">
      <div class="mono-s" style="color:#B23A22">Case study · Fintech · 2026</div>
      <div class="disp" style="font-size:${d.id === 'A' ? 66 : 80}px;line-height:1.02;margin-top:24px">${d.id === 'C' ? '#1 in Finance, <em>nine days</em> after launch.' : '#1 in Finance, nine days after launch.'}</div>
      <p style="font-size:22px;line-height:1.5;margin-top:30px;opacity:.85">Northfield is a banking app for freelancers. We designed and built it, then ran the launch: the product and the campaign shipped the same week.</p>
      <p style="font-size:17px;line-height:1.65;margin-top:20px;opacity:.7">The release plan and the launch plan were written on the same page. Engineers sat next to the people writing the story, so every feature had a reason to be talked about.</p>
      <div style="margin-top:auto;display:flex;gap:56px;border-top:1px solid rgba(23,23,23,.14);padding-top:24px">${[['Downloads', '180K'], ['Rating', '4.8'], ['Team', '7']].map(([a, b]) => `<div><div class="mono-s" style="opacity:.55">${a}</div><div class="disp" style="font-size:44px;margin-top:6px">${b}</div></div>`).join('')}</div></div></div>`, '', 'Type in use']);

  /* 15 graphic language */
  P.push(['', `<div class="in"><div class="kick">13 — Graphic language</div><h2 class="t disp">${{ A: 'The beam and the seam.', B: 'The dot travels.', C: 'Everything is catalogued.' }[d.id]}</h2>${d.device()}</div>`, '', 'Graphic language']);

  /* 16 digital */
  const head = d.id === 'C' ? 'Software and marketing, <em>made together.</em>' : 'Software and marketing, made together.';
  const navLinks = `<span style="display:flex;gap:30px;font-size:15px;align-items:center"><span>Work</span><span>Studio</span><span>Journal</span><span style="background:${acc};color:#fff;padding:10px 18px;border-radius:99px">Start a project</span></span>`;
  const heroDeco = { A: `<div style="position:absolute;right:-30px;top:120px;display:flex;gap:18px;opacity:.95">${Array.from({ length: 5 }, (_, i) => `<div style="opacity:${1 - i * .18}">${d.sym(220 - i * 26, 'transparent', i ? '#3A3936' : acc).replace('aria-label', 'data-x')}</div>`).join('')}</div>`, B: `<span style="position:absolute;right:90px;top:110px;width:260px;height:260px;border-radius:50%;background:${acc}"></span>`, C: `<div style="position:absolute;right:60px;top:150px;font-family:'Instrument Serif';font-size:280px;line-height:.8;opacity:.1">Nº 041</div>` }[d.id];
  const social = (bg, fg, inner) => `<div style="width:300px;height:300px;border-radius:14px;background:${bg};color:${fg};padding:26px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;position:relative">${inner}</div>`;
  P.push(['', `<div class="in"><div class="kick">14 — Digital</div>
    <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:50px;margin-top:34px">
      <div style="border-radius:16px;overflow:hidden;box-shadow:0 40px 80px -40px rgba(23,23,23,.45);background:${d.id === 'A' ? '#171717' : '#F3EFE6'};color:${d.id === 'A' ? '#F3EFE6' : '#171717'};height:720px;position:relative">
        <div style="height:40px;background:${d.id === 'A' ? '#262524' : '#E6E1D6'};display:flex;align-items:center;gap:8px;padding:0 16px">${'<i style="width:11px;height:11px;border-radius:50%;background:rgba(127,127,127,.45)"></i>'.repeat(3)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:30px 44px">${d.wm(d.id === 'A' ? 26 : 30, d.id === 'A' ? '#F3EFE6' : '#171717', acc)}${navLinks}</div>
        ${heroDeco}
        <div style="position:absolute;left:44px;bottom:60px;max-width:${d.id === 'A' ? 640 : 700}px"><div class="mono-s" style="opacity:.6">Studio for software &amp; marketing</div><div class="disp" style="font-size:${d.id === 'A' ? 58 : 76}px;line-height:1.02;margin-top:20px">${head}</div><p style="font-size:18px;line-height:1.55;opacity:.7;margin-top:22px;max-width:520px">The apps and platforms a business runs on, and the launches that get it seen. One team, one room.</p></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-content:start">
        ${social(acc, '#F3EFE6', `<span class="mono-s">Nº 041 · Okra Foods</span><span class="disp" style="font-size:${d.id === 'A' ? 40 : 54}px;line-height:1">4.2M views. Month one.</span>`)}
        ${social('#171717', '#F3EFE6', `<span class="mono-s" style="opacity:.6">We’re hiring</span><span class="disp" style="font-size:${d.id === 'A' ? 30 : 40}px;line-height:1.05">Senior engineer who likes a launch party.</span>`)}
        ${social('#E9E4D9', '#171717', `<span style="position:absolute;inset:0;background:url(../assets/parallel.jpg) center/cover"></span><span style="position:relative;align-self:flex-start;background:#F3EFE6;padding:6px 12px;border-radius:99px" class="mono-s">Event · 27.11</span><span class="disp" style="position:relative;font-size:${d.id === 'A' ? 30 : 40}px;line-height:1;color:#F3EFE6">Parallel Supper Nº 14</span>`)}
        <div style="display:flex;flex-direction:column;gap:18px;justify-content:center;align-items:center;background:#E9E4D9;border-radius:14px;height:300px">
          <div style="display:flex;gap:16px;align-items:flex-end">${d.appIcon(120, '#171717', '#F3EFE6', acc)}${d.appIcon(84, acc, '#171717', '#F3EFE6')}${d.appIcon(52, '#F3EFE6', '#171717', acc)}</div><span class="mono-s" style="opacity:.6">App icon · avatar · favicon</span></div>
      </div></div></div>`, '', 'Digital']);

  /* 17 print */
  P.push(['', `<div class="in"><div class="kick">15 — Print &amp; physical</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1.05fr;gap:44px;margin-top:40px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:26px">
        <div style="height:330px;border-radius:12px;background:#171717;color:#F3EFE6;padding:36px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 30px 60px -30px rgba(23,23,23,.6)">${d.sym(70, '#F3EFE6', acc)}${d.wm(d.id === 'A' ? 24 : 28, '#F3EFE6', acc)}</div>
        <div style="height:330px;border-radius:12px;background:#FBF9F4;padding:36px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 30px 60px -30px rgba(23,23,23,.4),inset 0 0 0 1px rgba(23,23,23,.06)">
          <div><div style="font-size:24px;font-weight:600">Hamza Wahbi</div><div style="font-size:16px;opacity:.65;margin-top:4px">Founder</div></div>
          <div style="font:400 14px var(--mono);line-height:1.8">hello@kynora.works<br>kynora.works</div></div>
        <span class="mono-s" style="opacity:.55">Business card · 85 × 55 mm</span></div>
      <div><div style="aspect-ratio:1/1.414;border-radius:6px;background:${{ A: '#E5482E', B: '#F5CDBE', C: '#4E5238' }[d.id]};color:${d.id === 'B' ? '#171717' : '#F3EFE6'};padding:40px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;box-shadow:0 30px 60px -30px rgba(23,23,23,.5)">
        <span class="mono-s">Kynora Works presents</span>
        ${{ A: `<div style="position:absolute;right:-40px;top:140px;opacity:.95">${d.sym(360, 'transparent', '#171717')}</div>`, B: `<span style="position:absolute;right:-60px;top:120px;width:380px;height:380px;border-radius:50%;background:#E5482E"></span>`, C: '' }[d.id]}
        <div style="position:relative"><div class="disp" style="font-size:${d.id === 'A' ? 50 : 66}px;line-height:.98">${d.id === 'C' ? 'Built to be <em>talked about.</em>' : 'Built to be talked about.'}</div>
        <div class="mono-s" style="margin-top:24px;display:flex;justify-content:space-between"><span>Talk + drinks</span><span>27.11.26</span><span>London</span></div></div></div>
        <span class="mono-s" style="opacity:.55;display:block;margin-top:26px">Poster · A2</span></div>
      <div><div style="height:560px;border-radius:18px;background:#E9E4D9;position:relative;overflow:hidden">
        <div style="position:absolute;left:50%;top:70px;translate:-50% 0;width:310px;height:400px;background:#F3EFE6;border-radius:4px 4px 10px 10px;box-shadow:0 30px 50px -25px rgba(23,23,23,.45);display:grid;place-items:center">
          <div style="position:absolute;top:-70px;left:70px;width:170px;height:110px;border:14px solid #E3DED2;border-bottom:0;border-radius:90px 90px 0 0"></div>${d.stack(d.id === 'A' ? 30 : 34, '#171717', acc)}</div>
        <div style="position:absolute;right:34px;bottom:34px;rotate:-10deg">${d.id === 'B' ? `<span class="symB" style="width:130px;height:130px;background:#E5482E;color:#F3EFE6;font-size:100px">k</span>` : `<div style="width:130px;height:130px;border-radius:50%;background:#171717;display:grid;place-items:center">${d.sym(60, '#F3EFE6', acc)}</div>`}</div></div>
        <span class="mono-s" style="opacity:.55;display:block;margin-top:26px">Tote + sticker</span></div>
    </div></div>`, '', 'Print & physical']);

  /* 18 voice */
  P.push(['', `<div class="in"><div class="kick">16 — Voice</div><h2 class="t disp">Say what happened.</h2>
    <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:90px;margin-top:50px">
      <div style="display:flex;flex-direction:column;gap:30px">${[['Plain over clever', 'If a ten-year-old can’t follow it, rewrite it.'], ['Facts over adjectives', 'A number beats a superlative every time.'], ['Warm, not cute', 'Talk like a friend who is good at their job.'], ['Short sentences', 'One idea each. Full stops are free.']].map(([h, p]) => `<div class="item"><h4 style="margin-bottom:6px">${h}</h4><p>${p}</p></div>`).join('')}</div>
      <div>${[['We designed and built it, then ran the launch.', 'We leverage end-to-end synergies across the product lifecycle.'], ['Bookings up 212% after the rebuild.', 'Unprecedented, game-changing results.'], ['Got something worth building?', 'Ready to disrupt your industry?!'], ['We reply within one working day.', 'Our dedicated team will be in touch shortly.']].map(([y, n]) => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;border-bottom:1px solid rgba(23,23,23,.12);padding:22px 0"><div style="display:flex;gap:14px"><span style="color:#171717;font-weight:700">✓</span><span style="font-size:21px;line-height:1.4">${y}</span></div><div style="display:flex;gap:14px;opacity:.5"><span style="color:#B23A22;font-weight:700">✕</span><span style="font-size:21px;line-height:1.4;text-decoration:line-through;text-decoration-thickness:1px">${n}</span></div></div>`).join('')}</div>
    </div></div>`, '', 'Voice']);

  /* 19 close */
  P.push(['', `<div class="in" style="display:flex;flex-direction:column;justify-content:space-between;top:120px">
    <div class="kick">Thank you</div>
    <div>${d.wm(d.id === 'A' ? 150 : 160, '#F3EFE6', acc)}</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><p style="font-size:22px;line-height:1.55;max-width:820px;opacity:.75">${d.standalone ? '' : `Direction ${d.id} of three. `}Fonts are free and ready to use; the logo is ${d.id === 'A' ? 'drawn' : 'set'} as master artwork, so it can be exported to SVG, PNG and PDF in every colourway from these guidelines.</p><span class="mono-s" style="opacity:.6">hello@kynora.works</span></div></div>`, 'dark', 'End']);

  return P;
}

function html(d) {
  const P = pages(d);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>KYNORA WORKS — Brand guidelines — ${d.name}</title>
<link href="${d.fontsHref}" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS(d)}</style></head><body>
${P.map(([_, body, cls, sec], i) => i === 0 ? `<section class="pg ${cls}">${body}</section>` : pageShell(d, i + 1, P.length, sec, body, cls)).join('\n')}
</body></html>`;
}

(async () => {
  const list = dirs.filter(d => !ONLY || d.id === ONLY);
  for (const d of list) fs.writeFileSync(path.join(OUT, d.file + '.html'), html(d));
  if (MODE === 'html') return;
  const { chromium } = require('/private/tmp/claude-502/-Users-akram-atmani-Library-Application-Support-Claude-scratch-workspaces-4215f3ff-6b63-4401-a033-c26341909f9d-56c19847-e688-4537-8890-cd1d1a961d8e-scratch-2026-11-19-65ef54/af122bd9-27d1-48a3-a286-969e90c91990/scratchpad/rec/node_modules/playwright-core');
  const EXE = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  const b = await chromium.launch({ executablePath: EXE });
  for (const d of list) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    p.on('pageerror', e => console.log(d.id, 'PAGEERROR', e.message));
    await p.goto(`http://127.0.0.1:5173/brand/${d.file}.html`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    if (MODE === 'png') {
      const dir = process.env.SHOTS; fs.mkdirSync(dir, { recursive: true });
      const els = await p.$$('.pg');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(dir, `${d.id}-${String(i + 1).padStart(2, '0')}.png`) });
    } else {
      await p.pdf({ path: path.join(OUT, d.file + '.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
    }
    console.log(d.id, 'done');
    await p.close();
  }
  await b.close();
})();
