// Renders work/src/out/*.html (from visuals.py) to JPGs in work/img/.
// Usage: node render.js   (needs playwright-core and a local Chromium; set CHROME to its path)
const { chromium } = require('playwright-core');
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, 'out'), IMG = path.join(__dirname, '..', 'img');
const { first, covers } = JSON.parse(fs.readFileSync(path.join(OUT, 'jobs.json')));
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  for (const [html, jpg, w, h] of [...first, ...covers]) { // covers use screens rendered in the first pass
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w > 1000 ? 1.25 : 2 });
    await p.goto('file://' + path.join(OUT, html), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(IMG, jpg), type: 'jpeg', quality: 82 });
    await p.close(); console.log(jpg);
  }
  await b.close();
})();
