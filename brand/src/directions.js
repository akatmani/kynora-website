// The three brand directions: logo builders, colour, type, concept copy and graphic device.
const { L, wordmarkA, symbolA, ST, SEAM, f } = require('./logos');

const CORE = {
  ivory: { name: 'Ivory', hex: '#F3EFE6', role: 'Main background. Paper, screens, packaging.' },
  carbon: { name: 'Carbon', hex: '#171717', role: 'Text, logo, dark sections. Never pure black.' },
  verm: { name: 'Vermilion', hex: '#E5482E', role: 'The signal. Logo accent, buttons, one moment per layout.' },
  stone: { name: 'Stone', hex: '#A7A7A2', role: 'Rules, borders, quiet UI. Decoration only, never text on Ivory.' },
};

/* ------------------------------------------------------------------ A · SEAM */
const wmA = wordmarkA(), wmA_acc = c => wordmarkA({ accent: c });
const A = {
  id: 'A', name: 'Seam', file: 'KYNORA-Brand-A-Seam',
  standalone: true,
  one: 'One letter, two practices.',
  summary: 'An extended, engineered wordmark whose K splits into the build and the story, with a deliberate gap where they meet.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap',
  fonts: {
    display: { family: '"Archivo", sans-serif', css: 'font-family:"Archivo";font-stretch:125%;font-weight:800;letter-spacing:-.012em', name: 'Archivo Expanded', weights: 'ExtraBold 800 · Bold 700', source: 'Free, Google Fonts. Swap for Monument Extended Ultrabold 1:1 if you license it.', why: 'Wide, flat-topped and engineered. It carries the same stance as the wordmark, so headlines feel like part of the logo.' },
    text: { family: '"Geist", sans-serif', name: 'Geist', weights: 'Light 300 · Regular 400 · Medium 500', source: 'Free, open source (Vercel).', why: 'A neutral grotesk drawn for interfaces. It reads cleanly at 15px and lets the extended display do the talking.' },
    mono: { family: '"Geist Mono", monospace', name: 'Geist Mono', weights: 'Regular 400 · Medium 500', source: 'Free, open source (Vercel).', why: 'Labels, numbers, captions and code. The technical voice, used small and in capitals.' },
  },
  extra: [
    { name: 'Ember', hex: '#F0805A', role: 'Gradient partner for Vermilion. Glows and motion only.' },
    { name: 'Graphite', hex: '#4D4B47', role: 'Secondary text on Ivory.' },
    { name: 'Brick', hex: '#B23A22', role: 'Vermilion for small text and links on Ivory (passes AA).' },
  ],
  ratio: [['Ivory', 52], ['Carbon', 28], ['Stone', 8], ['Vermilion', 9], ['Ember', 3]],
  coverBg: 'carbon',
  wm: (h, col = 'currentColor', acc = null) => (acc ? wmA_acc(acc) : wmA).svg('', `height:${h}px;color:${col};display:block`),
  sym: (h, col = 'currentColor', acc = null) => symbolA({ stem: col, arm: acc || col })('', `height:${h}px;display:block`),
  wmRatio: wmA.w / 104,
  lockup: (h, col, acc) => `<div style="display:flex;align-items:flex-end;gap:${h * .32}px;color:${col}">${A.wm(h, col, acc)}<span style="font:500 ${h * .26}px 'Geist Mono';letter-spacing:.32em;line-height:1;margin-bottom:${h * .01}px">WORKS</span></div>`,
  stack: (h, col, acc) => `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:${h * .22}px;color:${col}">${A.wm(h, col, acc)}<span style="font:500 ${h * .2}px 'Geist Mono';letter-spacing:.62em;line-height:1">WORKS · SOFTWARE · MARKETING</span></div>`,
  appIcon: (s, bg, fg, acc) => `<div style="width:${s}px;height:${s}px;border-radius:${s * .23}px;background:${bg};display:grid;place-items:center">${symbolA({ stem: fg, arm: acc })('', `height:${s * .46}px`)}</div>`,
  concept: () => {
    const k = L.K({ split: true, stem: '#171717', arm: '#E5482E' });
    const W = k.adv;
    return `<div style="position:relative;width:820px;height:640px">
      <svg viewBox="-60 -30 ${W + 120} 160" style="width:820px;display:block;overflow:visible">
        ${k.body}
        <g stroke="#A7A7A2" stroke-width=".5" fill="none" stroke-dasharray="2 2">
          <line x1="${ST / 2}" y1="104" x2="${ST / 2}" y2="122"/><line x1="${ST + SEAM / 2}" y1="50" x2="${ST + SEAM / 2}" y2="-18"/><line x1="${W - 10}" y1="20" x2="${W + 30}" y2="20"/>
        </g>
        <g font-family="Geist Mono" font-size="5" letter-spacing=".5" fill="#171717">
          <text x="${ST / 2}" y="128" text-anchor="middle">THE BUILD</text>
          <text x="${ST + SEAM / 2}" y="-21" text-anchor="middle">THE SEAM</text>
          <text x="${W + 32}" y="21.6">THE STORY</text>
        </g>
      </svg></div>`;
  },
  conceptCopy: [
    ['The build', 'The stem. Vertical, load-bearing, exact. Software, systems, the thing that has to work.'],
    ['The story', 'The beam. An open angle that projects outward like a signal or a megaphone. Marketing, launches, reach.'],
    ['The seam', 'The gap between them is constant and deliberate. It is where the two practices meet, and it is what makes the K ours. Read quickly, it is also <b>|&lt;</b>: a cursor and a bracket.'],
  ],
  construction: () => {
    const k = L.K({ split: true }); const W = k.adv;
    const gx = [0, ST, ST + SEAM, W], gy = [0, 50, 100];
    return `<svg viewBox="-26 -22 ${W + 52} 150" style="width:640px;display:block;overflow:visible">
      <g stroke="#E5482E" stroke-width=".35">${gx.map(x => `<line x1="${f(x)}" y1="-14" x2="${f(x)}" y2="114"/>`).join('')}${gy.map(y => `<line x1="-14" y1="${y}" x2="${W + 14}" y2="${y}"/>`).join('')}</g>
      <g fill="#171717" opacity=".92">${k.body}</g>
      <g font-family="Geist Mono" font-size="4" fill="#E5482E" text-anchor="middle">
        <text x="${ST / 2}" y="122">1u</text><text x="${ST + SEAM / 2}" y="122">0.3u</text><text x="${(ST + SEAM + W) / 2}" y="122">2.4u</text>
        <text x="-19" y="27" >½</text><text x="-19" y="77">½</text>
      </g></svg>`;
  },
  constructionNotes: ['1u = stem width. Every letter in the wordmark is built from it.', 'Seam = 0.3u. It never closes, never widens.', 'Arms meet at the exact vertical centre.', 'All terminals are cut flat, top and bottom. No rounded ends.'],
  clearUnit: 'the stem width × 2',
  device: () => {
    const chev = (h, c) => { const g = L.K({ split: true, stem: 'transparent', arm: c }); return `<svg viewBox="${ST + SEAM} 0 ${g.adv - ST - SEAM} 100" style="height:${h}px;display:block">${g.body}</svg>`; };
    const beam = Array.from({ length: 7 }, (_, i) => `<div style="opacity:${1 - i * .09}">${chev(150 - i * 10, i === 0 ? '#E5482E' : '#171717')}</div>`).join('');
    return `
    <div class="dev-grid">
      <div class="dev"><div class="dev-art" style="display:flex;align-items:center;gap:28px;padding-left:40px;transform:scaleX(-1)">${beam}</div><h4>The beam</h4><p>The K's arm, repeated with a growing gap, becomes a signal travelling outward. Use it for launch moments, motion and section openers. One per layout.</p></div>
      <div class="dev"><div class="dev-art" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:0">
        <div style="background:url(../assets/northfield.jpg) center/cover;filter:grayscale(1) contrast(1.05)"></div>
        <div style="background:#E5482E;color:#F3EFE6;padding:34px;display:flex;flex-direction:column;justify-content:space-between"><span class="mono-s">STORY</span><span style="font-family:Archivo;font-stretch:125%;font-weight:800;font-size:40px;line-height:1">#1 in<br>Finance</span></div></div>
        <h4>The seam</h4><p>Pair the build and the story side by side with a fixed gap: product on the left, the result it earned on the right. The gap matches the seam in the K.</p></div>
      <div class="dev"><div class="dev-art" style="display:flex;flex-direction:column;justify-content:center;gap:22px;padding:44px">
        ${['Software', 'Marketing', 'Design', 'Culture'].map((t, i) => `<div style="display:flex;align-items:center;gap:20px;font-family:Archivo;font-stretch:125%;font-weight:800;font-size:34px"><span style="transform:scaleX(-1)">${chev(26, i === 1 ? '#E5482E' : '#171717')}</span>${t}</div>`).join('')}
      </div><h4>Pointers</h4><p>A single arm works as the arrow, bullet and cursor across the whole system. It always points right: forward.</p></div>
    </div>`;
  },
};

/* ------------------------------------------------------------------ B · SIGNAL */
const B = {
  id: 'B', name: 'Signal', file: 'KYNORA-Brand-B-Signal',
  one: 'The dot is the moment people start talking.',
  summary: 'A warm, characterful lowercase wordmark where the o is a solid vermilion dot: a light switching on.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=DM+Sans:opsz,wght@9..40,300..700&family=DM+Mono:wght@400;500&display=swap',
  fonts: {
    display: { family: '"Bricolage Grotesque", sans-serif', css: 'font-family:"Bricolage Grotesque";font-weight:800;font-variation-settings:"opsz" 96;letter-spacing:-.035em', name: 'Bricolage Grotesque', weights: 'ExtraBold 800 · Bold 700 · SemiBold 600', source: 'Free, Google Fonts.', why: 'A grotesque with ink traps and a bit of swagger. Big sizes get tighter and more expressive, which is where culture and marketing live.' },
    text: { family: '"DM Sans", sans-serif', name: 'DM Sans', weights: 'Light 300 · Regular 400 · Medium 500', source: 'Free, Google Fonts.', why: 'Round, open and friendly at small sizes. It calms Bricolage down without going cold.' },
    mono: { family: '"DM Mono", monospace', name: 'DM Mono', weights: 'Regular 400 · Medium 500', source: 'Free, Google Fonts.', why: 'Drawn alongside DM Sans, so labels and numbers sit naturally next to body text.' },
  },
  extra: [
    { name: 'Blush', hex: '#F5CDBE', role: 'Soft fields behind Vermilion. Social, packaging, events.' },
    { name: 'Oxblood', hex: '#4A1A12', role: 'Deep partner for posters and night events.' },
    { name: 'Brick', hex: '#B23A22', role: 'Vermilion for small text and links on Ivory (passes AA).' },
  ],
  ratio: [['Ivory', 46], ['Carbon', 24], ['Vermilion', 16], ['Blush', 8], ['Stone', 6]],
  coverBg: 'verm',
  wm: (h, col = '#171717', acc = '#E5482E') => `<span class="wmB" style="font-size:${h * 1.42}px;color:${col}">kyn<i style="background:${acc || col}"></i>ra</span>`,
  sym: (h, col = '#171717', acc = '#E5482E') => `<span class="symB" style="width:${h}px;height:${h}px;background:${acc || col};color:${acc ? '#F3EFE6' : '#F3EFE6'};font-size:${h * .78}px">k</span>`,
  lockup: (h, col, acc) => `<div style="display:flex;align-items:baseline;gap:${h * .3}px;color:${col}">${B.wm(h, col, acc)}<span style="font:500 ${h * .26}px 'DM Mono';letter-spacing:.2em">works</span></div>`,
  stack: (h, col, acc) => `<div style="display:flex;flex-direction:column;gap:${h * .12}px;color:${col}">${B.wm(h, col, acc)}<span style="font:500 ${h * .2}px 'DM Mono';letter-spacing:.3em;padding-left:.2em">WORKS — SOFTWARE &amp; MARKETING</span></div>`,
  appIcon: (s, bg, fg, acc) => `<div style="width:${s}px;height:${s}px;border-radius:${s * .23}px;background:${bg};display:grid;place-items:center"><span class="symB" style="width:${s * .62}px;height:${s * .62}px;background:${acc};color:${bg === '#E5482E' ? '#171717' : '#F3EFE6'};font-size:${s * .48}px">k</span></div>`,
  concept: () => `<div style="display:flex;flex-direction:column;gap:70px">
      <div style="position:relative">${B.wm(190)}<div style="position:absolute;left:452px;top:-58px;font:500 15px 'DM Mono';letter-spacing:.12em;color:#E5482E">↓ THE SIGNAL</div></div>
      <div style="display:flex;gap:26px;align-items:center;font:400 20px 'DM Sans'">
        <span class="pill-b"><i></i>Live now</span><span class="pill-b"><i></i>Booking for 2027</span><span class="pill-b"><i></i>4.2M views</span>
      </div></div>`,
  conceptCopy: [
    ['The signal', 'The o is a solid dot: a light switching on, a record, a full stop on a launch. It is the only element that is always Vermilion.'],
    ['Lowercase', 'Lowercase feels like a person talking, not a company announcing. Warm, direct, a little bold.'],
    ['The dot travels', 'The same dot turns up as a live status, a play button, a sticker and a bullet. Seeing it anywhere should mean KYNORA.'],
  ],
  construction: () => `<div style="position:relative;display:inline-block;padding:60px;border:1px dashed #E5482E">${B.wm(170)}
     <div style="position:absolute;left:0;right:0;top:60px;height:0;border-top:1px solid rgba(229,72,46,.5)"></div></div>`,
  constructionNotes: ['The dot is 1.04× the x-height, so it reads optically the same size as the letters.', 'It sits on the baseline with a 1% overshoot, like any round letter.', 'Tracking is −3.5% and set by the file: never re-type the logo.', 'Vermilion dot on every version except one-colour print.'],
  clearUnit: 'the dot\'s diameter',
  device: () => `
    <div class="dev-grid">
      <div class="dev"><div class="dev-art" style="display:grid;place-items:center;background:#171717"><div style="display:flex;flex-direction:column;gap:22px;font:400 22px 'DM Sans';color:#F3EFE6"><span class="pill-b dark"><i></i>Booking projects for 2027</span><span class="pill-b dark"><i></i>Live: Okra launch week</span><span class="pill-b dark"><i style="background:#A7A7A2"></i>Studio closed, back Monday</span></div></div><h4>Status</h4><p>The dot is our live light. Use it for availability, launches and anything happening now. Grey when off.</p></div>
      <div class="dev"><div class="dev-art" style="background:url(../assets/okra.jpg) center/cover;position:relative">
        <span style="position:absolute;left:50%;top:50%;width:150px;height:150px;translate:-50% -50%;border-radius:50%;background:#E5482E;display:grid;place-items:center"><svg viewBox="0 0 24 24" width="46" fill="#F3EFE6"><path d="M7 4.5v15l12-7.5z"/></svg></span>
        <span style="position:absolute;right:30px;top:30px;width:120px;height:120px;border-radius:50%;background:#F3EFE6;color:#171717;display:grid;place-items:center;text-align:center;font:800 24px/1 'Bricolage Grotesque';rotate:12deg">new<br>work</span></div><h4>Play &amp; sticker</h4><p>Over photography the dot becomes the play button or a rotated sticker. Never more than one dot per frame.</p></div>
      <div class="dev"><div class="dev-art" style="background:#F5CDBE;display:grid;place-items:center"><div style="display:grid;grid-template-columns:repeat(9,1fr);gap:14px">${Array.from({ length: 63 }, (_, i) => { const r = Math.hypot((i % 9) - 6, Math.floor(i / 9) - 2); const s = Math.max(6, 34 - r * 6); return `<i style="width:34px;height:34px;display:grid;place-items:center"><b style="width:${s}px;height:${s}px;border-radius:50%;background:#E5482E;display:block"></b></i>`; }).join('')}</div></div><h4>Halftone</h4><p>Dots scaling away from a point make our pattern: a conversation spreading. For backgrounds, merch and motion.</p></div>
    </div>`,
};

/* ------------------------------------------------------------------ C · IMPRINT */
const C = {
  id: 'C', name: 'Imprint', file: 'KYNORA-Brand-C-Imprint',
  one: 'A studio that publishes its work.',
  summary: 'An editorial serif wordmark and a catalogue system: every project is numbered, credited and released like a publication.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;500&display=swap',
  fonts: {
    display: { family: '"Instrument Serif", serif', css: 'font-family:"Instrument Serif";font-weight:400;letter-spacing:-.015em', name: 'Instrument Serif', weights: 'Regular · Italic', source: 'Free, Google Fonts.', why: 'A condensed, sharp-edged serif with real italics. It makes headlines feel published rather than marketed.' },
    text: { family: '"Instrument Sans", sans-serif', name: 'Instrument Sans', weights: 'Regular 400 · Medium 500 · SemiBold 600', source: 'Free, Google Fonts.', why: 'Its sister sans. Same proportions and rhythm, so a serif headline and a sans paragraph look made together.' },
    mono: { family: '"JetBrains Mono", monospace', name: 'JetBrains Mono', weights: 'Regular 400 · Medium 500', source: 'Free, open source.', why: 'Catalogue numbers, credits and dates. A developer face, quietly signalling the engineering behind the studio.' },
  },
  extra: [
    { name: 'Paper', hex: '#FBF9F4', role: 'Raised surfaces, cards and page stock.' },
    { name: 'Moss', hex: '#4E5238', role: 'Cultural accent for events and print. Use sparingly.' },
    { name: 'Brick', hex: '#B23A22', role: 'Vermilion for small text and links on Ivory (passes AA).' },
  ],
  ratio: [['Ivory', 60], ['Carbon', 26], ['Stone', 7], ['Moss', 3], ['Vermilion', 4]],
  coverBg: 'ivory',
  wm: (h, col = '#171717', acc = null) => `<span class="wmC" style="font-size:${h * 1.4}px;color:${col}">Kynora <em style="color:${acc || col}">Works</em></span>`,
  sym: (h, col = '#171717', acc = null) => `<span class="symC" style="font-size:${h * 1.25}px;color:${col}">K<em style="color:${acc || col}">w</em></span>`,
  lockup: (h, col, acc) => `<div style="display:flex;align-items:baseline;gap:${h * .5}px;color:${col}">${C.wm(h, col, acc)}<span style="font:400 ${h * .2}px 'JetBrains Mono';letter-spacing:.12em">EST. LONDON</span></div>`,
  stack: (h, col, acc) => `<div style="display:flex;flex-direction:column;gap:${h * .2}px;color:${col}"><span class="wmC" style="font-size:${h * 1.4}px;line-height:.9">Kynora<br><em style="color:${acc || col}">Works</em></span><span style="font:400 ${h * .18}px 'JetBrains Mono';letter-spacing:.14em">SOFTWARE · MARKETING · DESIGN · CULTURE</span></div>`,
  appIcon: (s, bg, fg, acc) => `<div style="width:${s}px;height:${s}px;border-radius:${s * .23}px;background:${bg};display:grid;place-items:center"><span class="symC" style="font-size:${s * .56}px;color:${fg}">K<em style="color:${acc}">w</em></span></div>`,
  concept: () => `<div style="position:relative;padding-top:40px">
      ${C.wm(200, '#171717', '#E5482E')}
      <div style="display:flex;gap:0;margin-top:36px;font:400 15px 'JetBrains Mono';letter-spacing:.1em">
        <span style="width:580px;border-top:1px solid #171717;padding-top:14px">ROMAN — THE STUDIO</span><span style="width:520px;border-top:1px solid #E5482E;color:#E5482E;padding-top:14px">ITALIC — THE WORK</span></div></div>`,
  conceptCopy: [
    ['Roman and italic', '“Kynora” is set upright: the studio, steady. “Works” is italic: the output, in motion. Two voices, one line.'],
    ['Publisher, not agency', 'We release work like a small press releases books. Numbered, credited, dated, collectable.'],
    ['Quiet confidence', 'Vermilion is used once, on “Works”. Everything else is ink on paper. Restraint is the flex.'],
  ],
  construction: () => `<div style="position:relative;display:inline-block;padding:56px 64px;border:1px dashed #E5482E">${C.wm(160, '#171717', '#E5482E')}</div>`,
  constructionNotes: ['Set in Instrument Serif, tracking −1.5%, then outlined. Never retype it.', 'The word space is tightened to 70% so the two words read as one name.', '“Works” may be Vermilion or match “Kynora”. Never another colour.', 'Monogram Kw: the italic w tucks under the K\'s arm by 8%.'],
  clearUnit: 'the height of the K',
  device: () => `
    <div class="dev-grid">
      <div class="dev"><div class="dev-art" style="padding:40px;display:flex;flex-direction:column;justify-content:space-between">
        <span style="font:400 14px 'JetBrains Mono';letter-spacing:.1em">KYNORA WORKS — CATALOGUE</span>
        <span style="font-family:'Instrument Serif';font-size:170px;line-height:.8">Nº 041</span>
        <span style="font:400 14px 'JetBrains Mono';letter-spacing:.1em;display:flex;justify-content:space-between;border-top:1px solid #171717;padding-top:12px"><span>OKRA FOODS</span><span>LAUNCH</span><span>2026</span></span></div>
        <h4>Catalogue numbers</h4><p>Every project gets a number in the order it shipped. It appears on case studies, decks, merch and credits. Never skip, never reuse.</p></div>
      <div class="dev"><div class="dev-art" style="padding:40px;background:#FBF9F4">
        ${[['041', 'Okra Foods', 'Launch'], ['040', 'Parallel', 'Community'], ['039', 'Lumen Health', 'Platform'], ['038', 'Northfield', 'Fintech app'], ['037', 'Atlas Run', 'Event']].map(([n, a, b]) => `<div style="display:grid;grid-template-columns:70px 1fr auto;align-items:baseline;border-bottom:1px solid #A7A7A2;padding:13px 0"><span style="font:400 13px 'JetBrains Mono'">${n}</span><span style="font-family:'Instrument Serif';font-size:32px">${a}</span><span style="font:400 13px 'JetBrains Mono';letter-spacing:.08em;text-transform:uppercase">${b}</span></div>`).join('')}</div>
        <h4>The index</h4><p>Lists, menus and archives use a ruled index: number, name, discipline. Hairlines in Stone, never boxes.</p></div>
      <div class="dev"><div class="dev-art" style="padding:44px;background:#4E5238;color:#F3EFE6;display:flex;flex-direction:column;justify-content:space-between">
        <span style="font-family:'Instrument Serif';font-size:52px;line-height:1.05">“They didn’t just ship our app. They gave people a reason to <em>talk about it.</em>”</span>
        <span style="font:400 13px 'JetBrains Mono';letter-spacing:.1em">— FOUNDER, NORTHFIELD · Nº 038</span></div>
        <h4>Pull quotes</h4><p>Italic carries emphasis, not bold. Quotes are always credited with the project's number.</p></div>
    </div>`,
};

module.exports = { CORE, dirs: [A, B, C] };
