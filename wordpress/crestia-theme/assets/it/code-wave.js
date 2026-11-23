/* =====================================================================
   IT page — coding-wave background + cursor repulsion.
   Viewport-sized sticky canvas (not full section height) for smooth scroll.
   ===================================================================== */
(function () {
  'use strict';

  var canvas = document.getElementById('code-wave');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqNarrow = window.matchMedia('(max-width: 900px)');
  var cover = document.getElementById('it-wave-cover') || document.body;
  var forceMotion = !/(?:\?|&)motion=0(?:&|$)/.test(location.search);

  var dpr = 1;
  var w = 0;
  var h = 0;
  var raf = 0;
  var running = false;
  var inView = true;
  var lastT = 0;
  var phase = 0;
  var frameBudget = 1000 / 32; /* ~32fps idle */
  var accum = 0;
  var loopWidth = 1600;
  var metricsReady = false;

  var pointer = { x: -1, y: -1, tx: -1, ty: -1, active: 0, tActive: 0 };
  var heroHover = 0;
  var heroHoverT = 0;
  var GLOW_R = 130;
  var FORCE_R = 150;
  var FORCE_STR = 54;

  var STREAM =
    'const hire = async () => { await matchTalent(role) }   ·   ' +
    'export function Team() { const [stack, setStack] = useState([]) }   ·   ' +
    'useEffect(() => { loadRoles() }, [])   ·   ' +
    'return <section className="crew">{children}</section>   ·   ' +
    'import { filter, map } from "talent"   ·   ' +
    'display: flex; align-items: center; position: relative;   ·   ' +
    'transform: translateY(-2px); transition: all 280ms ease;   ·   ' +
    '<header /><main /><article /><button />   ·   ' +
    'className="rounded-2xl shadow-sm"   ·   ' +
    '=> engineers.filter(isSenior)   ·   ' +
    'async function screen(candidate) { if (skills && cultureFit) return true }   ·   ' +
    '{} [] () === && || </> ; <div> </div> <span> map() filter() await const let';

  var STREAM_LEN = STREAM.length;
  var COLORS = ['#1148D7', '#6D86C4', '#7B8399', '#4A7AEB'];
  var BAND_Y_FULL = [0.07, 0.15, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86, 0.94];
  var BAND_Y_MOBILE = [0.12, 0.28, 0.46, 0.64, 0.82];
  var BAND_OPACITY = [0.58, 0.48, 0.28, 0.2, 0.18, 0.22, 0.34, 0.5, 0.6];

  var bandY = BAND_Y_FULL.slice();
  var offsets = [];
  var speeds = [];
  var amps = [];
  var freqs = [];

  function rebuildBands() {
    bandY = mqNarrow.matches ? BAND_Y_MOBILE.slice() : BAND_Y_FULL.slice();
    offsets = bandY.map(function (_, i) { return (i * 97) % 400; });
    speeds = bandY.map(function (_, i) {
      var base = 70 + ((i * 19) % 48);
      return i % 2 === 0 ? base : -base;
    });
    amps = bandY.map(function (_, i) { return 18 + (i % 4) * 8; });
    freqs = bandY.map(function (_, i) { return 1.05 + (i % 5) * 0.28; });
  }

  function bandOpacity(i) {
    return BAND_OPACITY[i] != null ? BAND_OPACITY[i] : 0.3;
  }

  function edgeFade(x) {
    var m = Math.max(40, w * 0.05);
    if (x < m) return Math.max(0, x / m);
    if (x > w - m) return Math.max(0, (w - x) / m);
    return 1;
  }

  function waveY(baseY, x, p, amp, freq, tilt, harmonic) {
    var n = (x / Math.max(w, 1)) * Math.PI * 2 * freq;
    return baseY
      + Math.sin(n + p) * amp
      + Math.sin(n * 0.5 + p * 0.88) * (amp * harmonic)
      + x * tilt;
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function smooth(cur, target, k) {
    return cur + (target - cur) * k;
  }

  function coverPoint(clientX, clientY) {
    var r = cover.getBoundingClientRect();
    return {
      x: clientX - r.left,
      y: clientY - r.top,
      inside:
        clientX >= r.left && clientX <= r.right &&
        clientY >= r.top && clientY <= r.bottom
    };
  }

  function applyForce(x, y) {
    if (pointer.active < 0.02 || pointer.x < 0) {
      return { x: x, y: y, bend: 0, boost: 0 };
    }
    var dx = x - pointer.x;
    var dy = y - pointer.y;
    var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    if (dist > FORCE_R) {
      return { x: x, y: y, bend: 0, boost: 0 };
    }
    var t = 1 - dist / FORCE_R;
    var fall = t * t * (3 - 2 * t);
    var strength = FORCE_STR * fall * pointer.active;
    var nx = dx / dist;
    var ny = dy / dist;
    var swirl = fall * 0.5 * pointer.active;
    return {
      x: x + nx * strength - ny * strength * swirl * 0.35,
      y: y + ny * strength + nx * strength * swirl * 0.35,
      bend: fall * 0.8 * pointer.active,
      boost: fall * 0.32 * pointer.active
    };
  }

  function allowPointerFX() {
    return forceMotion || !mqReduce.matches;
  }

  function ensureMetrics() {
    if (metricsReady) return;
    ctx.font = '500 13px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';
    loopWidth = Math.max(1100, ctx.measureText(STREAM).width + 120);
    metricsReady = true;
  }

  function drawGlow() {
    if (heroHover > 0.04) {
      var hx = w * 0.72;
      var hy = Math.min(h * 0.42, 400);
      var hr = Math.max(160, Math.min(w, h) * 0.26);
      var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      var ha = 0.1 * heroHover;
      hg.addColorStop(0, 'rgba(17, 72, 215,' + (ha * 1.15).toFixed(3) + ')');
      hg.addColorStop(0.45, 'rgba(74, 122, 235,' + (ha * 0.35).toFixed(3) + ')');
      hg.addColorStop(1, 'rgba(17, 72, 215, 0)');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!allowPointerFX() || pointer.active < 0.03 || pointer.x < 0) return;
    var g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, GLOW_R);
    var a = 0.14 * pointer.active;
    g.addColorStop(0, 'rgba(17, 72, 215,' + (a * 1.1).toFixed(3) + ')');
    g.addColorStop(0.35, 'rgba(74, 122, 235,' + (a * 0.4).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(17, 72, 215, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, GLOW_R, 0, Math.PI * 2);
    ctx.fill();
  }

  function resize() {
    var maxDpr = mqNarrow.matches ? 1.15 : 1.35;
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    w = Math.max(1, Math.floor(window.innerWidth));
    h = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    metricsReady = false;
    rebuildBands();
    ensureMetrics();
    draw(phase);
  }

  function draw(p) {
    if (document.hidden || !inView) return;
    ensureMetrics();
    ctx.clearRect(0, 0, w, h);
    drawGlow();

    ctx.textBaseline = 'middle';
    ctx.font = '500 13px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';

    var step = mqNarrow.matches ? 13.5 : 11;
    var useForce = allowPointerFX() && pointer.active > 0.02;
    var i, baseY, amp, freq, tilt, harmonic, color, opacity;
    var scroll, x, charIndex, ch, y0, y1, angle, y, fade, a, forced, fx, fy;

    for (i = 0; i < bandY.length; i++) {
      baseY = bandY[i] * h;
      amp = amps[i];
      freq = freqs[i];
      tilt = (i % 2 === 0 ? 1 : -1) * 0.012;
      harmonic = 0.32 + (i % 3) * 0.08;
      color = COLORS[i % COLORS.length];
      opacity = bandOpacity(i);
      scroll = ((offsets[i] % loopWidth) + loopWidth) % loopWidth;

      x = -loopWidth + scroll;
      charIndex = Math.floor(scroll / step) % STREAM_LEN;
      if (charIndex < 0) charIndex += STREAM_LEN;

      while (x < w + 40) {
        if (x > -40) {
          ch = STREAM.charAt(charIndex % STREAM_LEN);
          y = waveY(baseY, x, p + i * 0.45, amp, freq, tilt, harmonic);
          y0 = waveY(baseY, x - 1, p + i * 0.45, amp, freq, tilt, harmonic);
          y1 = waveY(baseY, x + 1, p + i * 0.45, amp, freq, tilt, harmonic);
          angle = Math.atan2(y1 - y0, 2);

          if (useForce) {
            forced = applyForce(x, y);
            fx = forced.x;
            fy = forced.y;
            angle += (forced.y - y) * 0.012 + forced.bend * ((i % 2 === 0) ? 0.3 : -0.3);
          } else {
            forced = null;
            fx = x;
            fy = y;
          }

          fade = edgeFade(x);
          a = (opacity + (forced ? forced.boost * 0.22 : 0)) * fade;

          if (a > 0.035 && fy > -30 && fy < h + 30) {
            ctx.save();
            ctx.translate(fx, fy);
            ctx.rotate(angle);
            ctx.globalAlpha = Math.min(0.8, a);
            ctx.fillStyle = color;
            if (forced && forced.boost > 0.1) {
              ctx.shadowColor = 'rgba(17, 72, 215,' + (0.28 * forced.boost).toFixed(3) + ')';
              ctx.shadowBlur = 8 * forced.boost;
            } else {
              ctx.shadowBlur = 0;
            }
            ctx.fillText(ch, 0, 0);
            ctx.restore();
          }
        }

        charIndex += 1;
        x += step;
      }
    }
  }

  function tick(now) {
    if (!running) return;

    if (document.hidden || !inView) {
      running = false;
      raf = 0;
      return;
    }

    raf = requestAnimationFrame(tick);

    var dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    var interacting = pointer.active > 0.05 || heroHoverT > 0.05 || heroHover > 0.05;
    frameBudget = interacting ? 1000 / 48 : 1000 / 28;
    accum += now - (tick._prev || now);
    tick._prev = now;
    if (!interacting && accum < frameBudget) return;
    accum = 0;

    heroHover = smooth(heroHover, heroHoverT, clamp(1 - Math.pow(0.001, dt), 0.08, 0.4));
    var speedScale = (!forceMotion && mqReduce.matches) ? 0.4 : 1;
    speedScale *= 1 + heroHover * 0.7;
    phase += 1.35 * dt * speedScale;

    var i;
    for (i = 0; i < offsets.length; i++) {
      offsets[i] += speeds[i] * dt * speedScale;
    }

    var ease = 1 - Math.pow(0.001, dt);
    if (allowPointerFX() && pointer.tx >= 0) {
      if (pointer.x < 0) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      } else {
        pointer.x = smooth(pointer.x, pointer.tx, clamp(ease * 14, 0.12, 0.45));
        pointer.y = smooth(pointer.y, pointer.ty, clamp(ease * 14, 0.12, 0.45));
      }
    }
    pointer.active = smooth(
      pointer.active,
      allowPointerFX() ? pointer.tActive : 0,
      clamp(ease * 10, 0.08, 0.35)
    );

    draw(phase);
  }

  function start() {
    if (running || document.hidden || !inView) return;
    running = true;
    lastT = performance.now();
    tick._prev = lastT;
    accum = frameBudget;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function onPointerMove(e) {
    if (!allowPointerFX()) return;
    if (e.pointerType === 'touch' && e.isPrimary === false) return;
    var pt = coverPoint(e.clientX, e.clientY);
    if (!pt.inside) {
      pointer.tActive = 0;
      return;
    }
    /* Map pointer into sticky viewport canvas coords */
    var cr = canvas.getBoundingClientRect();
    pointer.tx = e.clientX - cr.left;
    pointer.ty = e.clientY - cr.top;
    pointer.tActive = 1;
    start();
  }

  function onPointerLeave() {
    pointer.tActive = 0;
  }

  function onVisibility() {
    if (document.hidden) {
      stop();
      return;
    }
    lastT = performance.now();
    start();
  }

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      start();
    }, 80);
  }

  rebuildBands();
  resize();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      inView = !!(entry && entry.isIntersecting);
      if (inView) start();
      else stop();
    }, { rootMargin: '80px 0px', threshold: 0.01 });
    io.observe(cover);
  } else {
    inView = true;
    start();
  }

  var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(cover);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', onResize);
  if (mqReduce.addEventListener) {
    mqReduce.addEventListener('change', function () {
      if (!allowPointerFX()) {
        pointer.tActive = 0;
        pointer.active = 0;
      }
      start();
    });
  }

  window.addEventListener('pagehide', function () {
    stop();
    if (ro) ro.disconnect();
  });

  function setHeroHover(on) {
    heroHoverT = on ? 1 : 0;
    start();
  }

  window.ITCodeWave = {
    start: start,
    stop: stop,
    resize: resize,
    setHeroHover: setHeroHover,
    get pointer() { return pointer; }
  };

  if (!mqFine.matches) {
    window.addEventListener('touchmove', function (e) {
      if (!allowPointerFX() || !e.touches || !e.touches[0]) return;
      var t = e.touches[0];
      var pt = coverPoint(t.clientX, t.clientY);
      if (!pt.inside) {
        pointer.tActive = 0;
        return;
      }
      var cr = canvas.getBoundingClientRect();
      pointer.tx = t.clientX - cr.left;
      pointer.ty = t.clientY - cr.top;
      pointer.tActive = 0.65;
      start();
    }, { passive: true });
    window.addEventListener('touchend', onPointerLeave, { passive: true });
  }
})();
