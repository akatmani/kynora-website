// KYNORA WORKS case studies: smooth scroll, letter blur-in titles, blur-fade reveals,
// an auto-cycling browser, a phone that follows the "What we did" list, count-up numbers, Soft's hover weight.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';

  /* ---------- showcase: cycles through the site's screens (works without GSAP too) ---------- */
  const stack = $$('.stack img'), tabs = $$('.tabs button');
  if (stack.length) {
    let cur = 0, elapsed = 0, last = performance.now(), visible = false;
    const DUR = 3600; // time on each screen; the clock only runs while the browser is on screen
    const show = i => {
      cur = i; elapsed = 0;
      stack.forEach((im, j) => im.classList.toggle('on', j === i));
      tabs.forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('done', j < i); $('b', b).style.width = j < i ? '100%' : '0'; });
    };
    tabs.forEach((b, j) => b.addEventListener('click', () => show(j)));
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .35 }).observe($('.showcase'));
    const tick = now => {
      const dt = now - last; last = now;
      if (visible && !reduce) {
        elapsed += dt;
        const p = Math.min(1, elapsed / DUR);
        const bar = $('b', tabs[cur]); if (bar) bar.style.width = (p * 100) + '%';
        if (p >= 1) show((cur + 1) % stack.length);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- what we did: the phone swaps to match the item in view ---------- */
  const items = $$('.did li'), shot = $('.phone.sticky img');
  if (items.length) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      items.forEach(li => li.classList.toggle('on', li === en.target));
      const src = en.target.dataset.shot;
      if (shot && !shot.src.endsWith(src)) { shot.style.opacity = 0; setTimeout(() => { shot.src = src; shot.style.opacity = 1; }, 200); }
    }), { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(li => io.observe(li));
    items[0].classList.add('on');
  }

  if (!hasGsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  const ez = gsap.parseEase('power3.out');

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }

  // letters in spans, grouped per word so a name never breaks mid-word
  const split = el => {
    el.innerHTML = el.textContent.split(' ').map(w => `<span class="wd">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
    return $$('.ch', el);
  };

  // hero: name blurs in letter by letter (the case pages also fade up their wall of screens behind it)
  const h1 = $('.hero h1') || $('.aw-t'), chars = h1 ? split(h1) : [];
  const hasWall = !!$('.wall');
  const intro = gsap.timeline();
  if (hasWall) intro.from('.wall', { opacity: 0, scale: 1.08, duration: 1.8, ease: ez }, 0);
  intro.from('.hdr > *', { y: -14, opacity: 0, filter: 'blur(6px)', duration: .7, ease: ez, stagger: .08, clearProps: 'transform,filter,opacity' }, .1)
    .from(chars, { y: 24, opacity: 0, filter: 'blur(14px)', duration: .8, ease: ez, stagger: .04 }, .2)
    .from('.hero .rv, .aw .rv', { y: 24, opacity: 0, filter: 'blur(6px)', duration: .8, ease: ez, stagger: .08, clearProps: 'filter' }, .5);
  // the wall tilts with the mouse and sinks as you scroll away
  const plane = $('.plane');
  if (plane && matchMedia('(hover: hover)').matches) {
    $('.hero').addEventListener('mousemove', ev => {
      const x = ev.clientX / innerWidth - .5, y = ev.clientY / innerHeight - .5;
      gsap.to(plane, { rotateX: 48 - y * 6, rotateZ: -24 + x * 5, duration: 1.4, ease: 'power3.out' });
    });
  }
  if (hasWall) gsap.to('.wall', { yPercent: 18, opacity: .5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // all work: covers drift a little inside their frames, and a "View case" pill follows the cursor
  $$('.awc .im img').forEach(im => gsap.fromTo(im, { yPercent: -4, scale: 1.1 }, { yPercent: 4, scale: 1.1, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.awc').forEach(card => {
    const pill = $('.pill', card), box = $('.im', card);
    if (!pill) return;
    const px = gsap.quickTo(pill, 'x', { duration: .5, ease: 'power3.out' }), py = gsap.quickTo(pill, 'y', { duration: .5, ease: 'power3.out' });
    box.addEventListener('mousemove', ev => { const r = box.getBoundingClientRect(); px(ev.clientX - r.left - pill.offsetWidth / 2); py(ev.clientY - r.top - pill.offsetHeight / 2); });
  });

  // everything else fades up with a blur as it arrives
  $$('.rv').filter(el => !el.closest('.hero, .aw')).forEach(el => {
    gsap.from(el, { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1, ease: ez, clearProps: 'filter',
      scrollTrigger: { trigger: el, start: el.closest('.contact') ? 'top bottom' : 'top 88%' } });
  });

  // the big browser rises and straightens as it comes in
  gsap.fromTo('.browser.big', { rotateX: 14, y: 60, transformPerspective: 1600, transformOrigin: '50% 100%' },
    { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.showcase', start: 'top bottom', end: 'top 25%', scrub: true } });

  // fanned phones drift at different speeds
  $$('.frow .phone').forEach((ph, i) => {
    gsap.fromTo(ph, { y: 80 + (i % 3) * 50, rotate: (i - 1.5) * 3 }, { y: -40 - (i % 2) * 40, rotate: 0, ease: 'none',
      scrollTrigger: { trigger: '.fan', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // gallery and photo parallax
  $$('.g-b').forEach(el => gsap.to(el, { y: -80, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.mosaic img').forEach(im => gsap.fromTo(im, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.mosaic figure').forEach((f, i) => gsap.from(f, { opacity: 0, y: 60, scale: .96, duration: 1.1, ease: ez, delay: (i % 3) * .08, scrollTrigger: { trigger: f, start: 'top 92%' } }));

  // numbers count up
  $$('.count').forEach(el => {
    const m = el.textContent.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!m) return;
    const [, pre, num, post] = m, dec = (num.split('.')[1] || '').length, target = parseFloat(num.replace(/,/g, ''));
    const o = { v: 0 };
    gsap.to(o, { v: target, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = pre + o.v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post; } });
  });

  // next project
  const nn = $('.nn');
  if (nn) {
    const nc = split(nn);
    gsap.from(nc, { opacity: 0, y: 20, filter: 'blur(10px)', stagger: .035, duration: .7, ease: ez, scrollTrigger: { trigger: nn, start: 'top 88%' } });
    gsap.fromTo('.nx img', { xPercent: 12, rotate: 3 }, { xPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.nx', start: 'top bottom', end: 'center center', scrub: true } });
  }

  // hover weight: letters near the cursor go lighter (needs the variable stand-in font)
  const hoverWeight = (el, cs, base = 800, hover = 330) => {
    if (!el || matchMedia('(hover: none)').matches) return;
    // lock every letter to its full-weight width, so lighter letters never shrink the line and re-wrap the title
    const lock = () => { cs.forEach(c => { c.style.width = ''; }); const w = cs.map(c => c.getBoundingClientRect().width); cs.forEach((c, i) => { c.style.width = w[i] + 'px'; }); };
    document.fonts.ready.then(lock);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(lock, 150); });
    const FALL = [1, .7, .4, .15];
    el.addEventListener('mousemove', ev => {
      let best = 0, bd = 1e9;
      cs.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.hypot(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2)); if (d < bd) { bd = d; best = i; } });
      cs.forEach((c, i) => { const f = FALL[Math.abs(i - best)] || 0; gsap.to(c, { fontVariationSettings: `"wght" ${Math.round(base - (base - hover) * f)}`, duration: f ? .22 : .5, ease: 'power2.out', overwrite: 'auto' }); });
    });
    el.addEventListener('mouseleave', () => cs.forEach(c => gsap.to(c, { fontVariationSettings: `"wght" ${base}`, duration: .6, ease: 'power2.out', overwrite: 'auto' })));
  };
  hoverWeight(h1, chars);
  if (nn) hoverWeight(nn, $$('.ch', nn));

  // header logo stays light over the dark sections
  const hdr = $('.hdr');
  const darks = $$('[data-dark]');
  const setHdr = () => { const y = 40; hdr.classList.toggle('dark', darks.some(s => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; })); };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: setHdr }); setHdr();
})();
