/* =====================================================================
   RCM page FX: pointer-driven page-bg parallax + soft gold glow, and
   hero stage tilt/lift.
   Writes CSS vars:
     .page-bg  --px --py (parallax) --sx --sy --sa (soft glow)
     #stage    --tx --ty --hv
   Does not touch the GSAP monitor timeline in rcm.js.
   ===================================================================== */
(function () {
  'use strict';

  var page = document.body;
  var bg = document.querySelector('.page-bg');
  var hero = document.getElementById('hero');
  var stage = document.getElementById('stage');
  if (!bg || !hero || !stage) return;
  var col = hero.querySelector('.hero-stage-col') || stage;

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine), (any-hover: hover) and (any-pointer: fine)');
  var amp = 1;

  var S = { px: 0, py: 0, tx: 0, ty: 0, hv: 0, sa: 0, sx: 0, sy: 0 };
  var T = { px: 0, py: 0, tx: 0, ty: 0, hv: 0, sa: 0, sx: 0, sy: 0 };
  var L = { px: 0.05, py: 0.05, tx: 0.085, ty: 0.085, hv: 0.08, sa: 0.06, sx: 0.12, sy: 0.12 };

  var mode = 'still';
  var raf = 0, lastT = 0;
  var written = {};

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function r3(v) { return Math.round(v * 1000) / 1000; }

  function setVar(el, name, val) {
    var key = name + (el === bg ? 'b' : 's');
    if (written[key] === val) return;
    written[key] = val;
    el.style.setProperty(name, val);
  }

  function write() {
    setVar(bg, '--px', r3(S.px));
    setVar(bg, '--py', r3(S.py));
    setVar(bg, '--sx', Math.round(S.sx * 10) / 10 + 'px');
    setVar(bg, '--sy', Math.round(S.sy * 10) / 10 + 'px');
    setVar(bg, '--sa', r3(S.sa));
    setVar(stage, '--tx', r3(S.tx));
    setVar(stage, '--ty', r3(S.ty));
    setVar(stage, '--hv', r3(S.hv));
  }

  function tick(now) {
    raf = 0;
    var dt = Math.min(now - lastT, 64);
    lastT = now;
    var k = dt / 16.667, moving = false, key, d, f;
    for (key in L) {
      d = T[key] - S[key];
      f = 1 - Math.pow(1 - L[key], k);
      S[key] += d * f;
      if (Math.abs(d) > (key === 'sx' || key === 'sy' ? 0.4 : 0.0008)) moving = true;
    }
    write();
    if (moving) raf = requestAnimationFrame(tick);
  }

  function kick() {
    if (raf || mode !== 'pointer') return;
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    if (mode !== 'pointer' || e.pointerType === 'touch') return;
    var vw = window.innerWidth || 1;
    var vh = window.innerHeight || 1;
    var x = e.clientX, y = e.clientY;
    var c = col.getBoundingClientRect();

    T.px = clamp((x / vw) * 2 - 1, -1, 1) * amp;
    T.py = clamp((y / vh) * 2 - 1, -1, 1) * amp;
    T.sx = x; T.sy = y; T.sa = 1;

    /* stage tilt only while pointer is over the hero column area */
    if (y >= c.top - 40 && y <= c.bottom + 40) {
      T.tx = clamp((e.clientX - (c.left + c.width / 2)) / 620, -1, 1) * amp;
      T.ty = clamp((e.clientY - (c.top + c.height / 2)) / 380, -1, 1) * amp;
    } else {
      T.tx = 0; T.ty = 0;
    }
    kick();
  }

  function onLeave() {
    T.px = T.py = T.tx = T.ty = T.hv = T.sa = 0;
    kick();
  }

  function onStageEnter(e) {
    if (mode === 'pointer' && e.pointerType !== 'touch') { T.hv = 1; kick(); }
  }
  function onStageLeave() { T.hv = 0; kick(); }

  function setMode() {
    var next = mqFine.matches ? 'pointer' : 'auto';
    amp = mqReduce.matches ? 0.6 : 1;
    mode = next;
    page.classList.toggle('fx-auto', next === 'auto');
    page.classList.toggle('fx-pointer', next === 'pointer');
    if (next !== 'pointer') onLeave();
  }

  /* pause bg CSS animations when tab hidden */
  function syncVisibility() {
    page.classList.toggle('is-bg-off', document.hidden);
    hero.classList.toggle('is-off', document.hidden);
  }
  document.addEventListener('visibilitychange', syncVisibility);

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave, { passive: true });
  col.addEventListener('pointerenter', onStageEnter, { passive: true });
  col.addEventListener('pointerleave', onStageLeave, { passive: true });
  (mqReduce.addEventListener ? mqReduce.addEventListener('change', setMode) : mqReduce.addListener(setMode));
  (mqFine.addEventListener ? mqFine.addEventListener('change', setMode) : mqFine.addListener(setMode));
  window.addEventListener('pagehide', function () { if (raf) cancelAnimationFrame(raf); raf = 0; });

  setMode();

  window.RCMHeroFX = { get mode() { return mode; }, state: S, target: T };
})();
