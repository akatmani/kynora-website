// KYNORA logo geometry. Cap height = 100 units. All letters are built from rectangles,
// parallelogram bands and stadium curves, so every logo file is exact and reproducible.
let uid = 0;
const f = n => +n.toFixed(2);
const poly = (pts, fill = 'currentColor') => `<polygon fill="${fill}" points="${pts.map(p => p.map(f).join(',')).join(' ')}"/>`;
const rect = (x, y, w, h, fill = 'currentColor') => `<rect fill="${fill}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/>`;
const rr = (x, y, w, h, r) => `M${f(x + r)},${f(y)}H${f(x + w - r)}A${f(r)},${f(r)} 0 0 1 ${f(x + w)},${f(y + r)}V${f(y + h - r)}A${f(r)},${f(r)} 0 0 1 ${f(x + w - r)},${f(y + h)}H${f(x + r)}A${f(r)},${f(r)} 0 0 1 ${f(x)},${f(y + h - r)}V${f(y + r)}A${f(r)},${f(r)} 0 0 1 ${f(x + r)},${f(y)}Z`;
const dOf = (wp, dx, dy) => wp / Math.sin(Math.atan2(Math.abs(dy), Math.abs(dx)));
const clip = (inner, x, y, w, h) => { const id = 'kc' + (++uid); return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };

const ST = 27;          // stem
const DG = ST * 0.9;   // diagonals, optically a touch lighter
const SEAM = 8;         // the gap in the K

const L = {
  K({ split = true, arm = 'currentColor', stem = 'currentColor' } = {}) {
    const W = 98, c = split ? 13 : 0;
    const px = split ? ST + SEAM - c : ST * 0.2;
    let d = 30; for (let i = 0; i < 8; i++) d = dOf(DG, (W - d) - px, 50);
    const tx = W - d;
    const chev = poly([[px, 50], [tx, 0], [tx + d, 0], [px + d, 50], [tx + d, 100], [tx, 100]], arm);
    return { adv: W, body: rect(0, 0, ST, 100, stem) + (split ? clip(chev, ST + SEAM, -1, W, 102) : chev) };
  },
  Y() {
    const W = 106, yv = 60; const d = dOf(DG, 50, yv); const yi = yv * (50 - d) / 50;
    const m = W / 2; const yi2 = yv * (m - d) / m;
    return { adv: W, body: clip(poly([[0, 0], [d, 0], [m, yi2], [W - d, 0], [W, 0], [m, yv]]) + rect(m - ST / 2, yi2, ST, 100 - yi2), 0, 0, W, 100) };
  },
  N() {
    const W = 102; let d = 30; for (let i = 0; i < 8; i++) d = dOf(DG, W - d, 100);
    return { adv: W, body: rect(0, 0, ST, 100) + rect(W - ST, 0, ST, 100) + poly([[0, 0], [d, 0], [W, 100], [W - d, 100]]) };
  },
  O() {
    const W = 128, os = 1.6, ws = ST * 1.12, wt = ST * 0.86;
    const ih = 100 + 2 * os - 2 * wt;
    return { adv: W, body: `<path fill="currentColor" fill-rule="evenodd" d="${rr(0, -os, W, 100 + 2 * os, (100 + 2 * os) / 2)}${rr(ws, -os + wt, W - 2 * ws, ih, ih / 2)}"/>` };
  },
  R() {
    const W = 104, hb = 60, R = hb / 2, ox = 98 - R, t = ST * 0.72, ir = (hb - 2 * t) / 2, ix = 98 - ST * 1.02 - ir;
    const bowl = `<path fill="currentColor" fill-rule="evenodd" d="M0,0H${f(ox)}A${R},${R} 0 0 1 ${f(ox)},${hb}H0Z M${ST},${f(t)}H${f(ix)}A${f(ir)},${f(ir)} 0 0 1 ${f(ix)},${f(hb - t)}H${ST}Z"/>`;
    const xl = 36, yt = hb - t + 2; let d = 30; for (let i = 0; i < 8; i++) d = dOf(DG, (W - d) - xl, 100 - yt);
    return { adv: W, body: rect(0, 0, ST, 100) + bowl + clip(poly([[xl, yt], [xl + d, yt], [W, 100], [W - d, 100]]), 0, 0, W, 100) };
  },
  A() {
    const W = 120, ya = -18, h = W / 2; const d = dOf(DG, h, 100 - ya); const yi = 100 + (ya - 100) * (h - d) / h;
    const id = 'ka' + (++uid);
    const outer = [[0, 100], [h, ya], [W, 100]];
    const bar = `<clipPath id="${id}"><polygon points="${outer.map(p => p.map(f).join(',')).join(' ')}"/></clipPath><g clip-path="url(#${id})">${rect(0, 66, W, ST * 0.78)}</g>`;
    return { adv: W, body: clip(poly([[0, 100], [h, ya], [W, 100], [W - d, 100], [h, yi], [d, 100]]) + bar, 0, 0, W, 100) };
  },
};

const KERN = { KY: -4, YN: -6, NO: 0, OR: 0, RA: -8 };
const TRACK = 16;

// Direction A wordmark: KYNORA with the split K. opts.accent colours the K's beam.
function wordmarkA({ accent = null, split = true } = {}) {
  let x = 0, out = '', prev = '';
  for (const ch of 'KYNORA') {
    if (prev) x += TRACK + (KERN[prev + ch] || 0);
    const g = ch === 'K' ? L.K({ split, arm: accent || 'currentColor' }) : L[ch]();
    out += `<g transform="translate(${f(x)} 0)">${g.body}</g>`;
    x += g.adv; prev = ch;
  }
  return { w: f(x), svg: (cls = '', style = '') => `<svg class="${cls}" style="${style}" viewBox="0 -2 ${f(x)} 104" xmlns="http://www.w3.org/2000/svg" aria-label="KYNORA">${out}</svg>` };
}
// Direction A symbol: the split K on its own.
function symbolA({ stem = 'currentColor', arm = 'currentColor', pad = 0 } = {}) {
  const g = L.K({ split: true, stem, arm });
  return (cls = '', style = '') => `<svg class="${cls}" style="${style}" viewBox="${-pad} ${-pad} ${g.adv + 2 * pad} ${100 + 2 * pad}" xmlns="http://www.w3.org/2000/svg" aria-label="KYNORA symbol">${g.body}</svg>`;
}
module.exports = { L, wordmarkA, symbolA, ST, SEAM, TRACK, rr, poly, rect, f };
