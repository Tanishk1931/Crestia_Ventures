/* =====================================================================
   IT page — continuous coding-wave background + cursor repulsion.
   Canvas stays pointer-events: none (clicks/scroll never blocked).
   ===================================================================== */
(function () {
  'use strict';

  var canvas = document.getElementById('code-wave');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var cover = document.getElementById('it-wave-cover') || document.body;
  /* ?motion=1 forces full effects even if OS "Reduce motion" is on */
  var forceMotion = /(?:\?|&)motion=1(?:&|$)/.test(location.search);

  var dpr = 1;
  var w = 0;
  var h = 0;
  var raf = 0;
  var running = false;
  var lastT = 0;
  var phase = 0;

  /* Smoothed pointer in cover-local coords; -1 = inactive */
  var pointer = { x: -1, y: -1, tx: -1, ty: -1, active: 0, tActive: 0 };
  var heroHover = 0; /* 0–1 boost while hero photo is hovered/flipped */
  var heroHoverT = 0;
  var GLOW_R = 150;
  var FORCE_R = 170;
  var FORCE_STR = 62;

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

  var COLORS = ['#1148D7', '#6D86C4', '#7B8399', '#4A7AEB'];
  var BAND_Y = [0.07, 0.15, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86, 0.94];

  var offsets = BAND_Y.map(function (_, i) { return (i * 97) % 400; });
  var speeds = BAND_Y.map(function (_, i) {
    /* 78–128 px/s — clearly visible, still elegant */
    var base = 78 + ((i * 19) % 51);
    return i % 2 === 0 ? base : -base;
  });
  var amps = BAND_Y.map(function (_, i) { return 22 + (i % 4) * 10; });
  var freqs = BAND_Y.map(function (_, i) { return 1.05 + (i % 5) * 0.32; });

  function bandOpacity(i) {
    var vals = [0.58, 0.48, 0.28, 0.2, 0.18, 0.22, 0.34, 0.5, 0.6];
    return vals[i] != null ? vals[i] : 0.3;
  }

  function edgeFade(x) {
    var m = Math.max(48, w * 0.06);
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

  /* Soft repulsion: push glyphs away from pointer with falloff */
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
    /* smoothstep for organic falloff */
    var fall = t * t * (3 - 2 * t);
    var strength = FORCE_STR * fall * pointer.active;
    var nx = dx / dist;
    var ny = dy / dist;
    /* Lateral swirl so lines bend around the cursor, not only radiate */
    var swirl = fall * 0.55 * pointer.active;
    return {
      x: x + nx * strength - ny * strength * swirl * 0.35,
      y: y + ny * strength + nx * strength * swirl * 0.35,
      bend: fall * 0.85 * pointer.active,
      boost: fall * 0.35 * pointer.active
    };
  }

  function allowPointerFX() {
    return forceMotion || !mqReduce.matches;
  }

  function drawGlow() {
    /* Soft field while hero photo is hovered */
    if (heroHover > 0.04) {
      var hx = w * 0.72;
      var hy = Math.min(h * 0.42, 420);
      var hr = Math.max(180, Math.min(w, h) * 0.28);
      var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      var ha = 0.12 * heroHover;
      hg.addColorStop(0, 'rgba(17, 72, 215,' + (ha * 1.2).toFixed(3) + ')');
      hg.addColorStop(0.45, 'rgba(74, 122, 235,' + (ha * 0.4).toFixed(3) + ')');
      hg.addColorStop(1, 'rgba(17, 72, 215, 0)');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!allowPointerFX()) return;
    if (pointer.active < 0.03 || pointer.x < 0) return;
    var g = ctx.createRadialGradient(
      pointer.x, pointer.y, 0,
      pointer.x, pointer.y, GLOW_R
    );
    var a = 0.16 * pointer.active;
    g.addColorStop(0, 'rgba(17, 72, 215,' + (a * 1.15).toFixed(3) + ')');
    g.addColorStop(0.35, 'rgba(74, 122, 235,' + (a * 0.45).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(17, 72, 215, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, GLOW_R, 0, Math.PI * 2);
    ctx.fill();
  }

  function resize() {
    var rect = cover.getBoundingClientRect
      ? cover.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width || window.innerWidth));
    h = Math.max(1, Math.floor(rect.height || window.innerHeight));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(phase, true);
  }

  function draw(p, force) {
    if (!force && document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    drawGlow();

    ctx.textBaseline = 'middle';
    ctx.font = '500 13.5px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';

    var i, baseY, amp, freq, tilt, harmonic, color, opacity;
    var step, loopWidth, scroll, x, charIndex, ch;
    var y0, y1, angle, y, fade, a, forced, fx, fy;

    for (i = 0; i < BAND_Y.length; i++) {
      baseY = BAND_Y[i] * h;
      amp = amps[i];
      freq = freqs[i];
      tilt = (i % 2 === 0 ? 1 : -1) * 0.014;
      harmonic = 0.36 + (i % 3) * 0.1;
      color = COLORS[i % COLORS.length];
      opacity = bandOpacity(i);
      step = 8.4;
      loopWidth = Math.max(1200, ctx.measureText(STREAM).width + 140);
      scroll = ((offsets[i] % loopWidth) + loopWidth) % loopWidth;

      x = -loopWidth + scroll;
      charIndex = 0;

      while (x < w + loopWidth) {
        ch = STREAM.charAt(charIndex % STREAM.length);
        charIndex += 1;

        y = waveY(baseY, x, p + i * 0.45, amp, freq, tilt, harmonic);
        y0 = waveY(baseY, x - 1, p + i * 0.45, amp, freq, tilt, harmonic);
        y1 = waveY(baseY, x + 1, p + i * 0.45, amp, freq, tilt, harmonic);
        angle = Math.atan2(y1 - y0, 2);

        forced = allowPointerFX()
          ? applyForce(x, y)
          : { x: x, y: y, bend: 0, boost: 0 };
        fx = forced.x;
        fy = forced.y;
        angle += (forced.y - y) * 0.012 + forced.bend * ((i % 2 === 0) ? 0.35 : -0.35);

        fade = edgeFade(x);
        a = (opacity + forced.boost * 0.25) * fade;

        if (a > 0.03 && fx > -40 && fx < w + 40 && fy > -40 && fy < h + 40) {
          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(angle);
          ctx.globalAlpha = Math.min(0.85, a);
          ctx.fillStyle = color;
          if (forced.boost > 0.08) {
            ctx.shadowColor = 'rgba(17, 72, 215,' + (0.35 * forced.boost).toFixed(3) + ')';
            ctx.shadowBlur = 10 * forced.boost;
          }
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        }

        x += step;
      }
    }
  }

  function tick(now) {
    if (!running) return;
    if (document.hidden) {
      lastT = now;
      raf = requestAnimationFrame(tick);
      return;
    }

    raf = requestAnimationFrame(tick);
    var dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    /* Always keep base flow alive (OS reduce-motion only softens interaction). */
    heroHover = smooth(heroHover, heroHoverT, clamp(1 - Math.pow(0.001, dt), 0.08, 0.4));
    var speedScale = (!forceMotion && mqReduce.matches) ? 0.45 : 1;
    speedScale *= 1 + heroHover * 0.85; /* faster flowing code while hero hovered */
    phase += 1.55 * dt * speedScale;
    var i;
    for (i = 0; i < offsets.length; i++) {
      offsets[i] += speeds[i] * dt * speedScale;
    }

    /* Smooth pointer follow / fade-out */
    var ease = 1 - Math.pow(0.001, dt); /* ~frame-rate independent */
    if (allowPointerFX() && pointer.tx >= 0) {
      if (pointer.x < 0) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      } else {
        pointer.x = smooth(pointer.x, pointer.tx, clamp(ease * 14, 0.12, 0.45));
        pointer.y = smooth(pointer.y, pointer.ty, clamp(ease * 14, 0.12, 0.45));
      }
    }
    var targetActive = allowPointerFX() ? pointer.tActive : 0;
    pointer.active = smooth(pointer.active, targetActive, clamp(ease * 10, 0.08, 0.35));

    draw(phase, false);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function onPointerMove(e) {
    if (!allowPointerFX()) return;
    /* Prefer mouse/pen; ignore multi-touch clutter */
    if (e.pointerType === 'touch' && e.isPrimary === false) return;
    var pt = coverPoint(e.clientX, e.clientY);
    if (!pt.inside) {
      pointer.tActive = 0;
      return;
    }
    pointer.tx = pt.x;
    pointer.ty = pt.y;
    pointer.tActive = 1;
    if (!running) start();
  }

  function onPointerLeave() {
    pointer.tActive = 0;
  }

  function onVisibility() {
    if (document.hidden) return;
    lastT = performance.now();
    start();
  }

  function onReduceChange() {
    if (!allowPointerFX()) {
      pointer.tActive = 0;
      pointer.active = 0;
    }
    if (!running) start();
  }

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 60);
  }

  resize();
  start();

  var ro = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(onResize)
    : null;
  if (ro) ro.observe(cover);

  /* Listen on window so canvas can stay pointer-events: none */
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', onReduceChange);
  else mqReduce.addListener(onReduceChange);
  window.addEventListener('pagehide', function () {
    stop();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onPointerLeave);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    if (ro) ro.disconnect();
  });

  function setHeroHover(on) {
    heroHoverT = on ? 1 : 0;
    if (!running) start();
  }

  window.ITCodeWave = {
    start: start,
    stop: stop,
    resize: resize,
    setHeroHover: setHeroHover,
    get pointer() { return pointer; }
  };

  /* Touch: light support without blocking scroll — only when primary contact moves over cover */
  if (!mqFine.matches) {
    window.addEventListener('touchmove', function (e) {
      if (!allowPointerFX() || !e.touches || !e.touches[0]) return;
      var t = e.touches[0];
      var pt = coverPoint(t.clientX, t.clientY);
      if (!pt.inside) {
        pointer.tActive = 0;
        return;
      }
      pointer.tx = pt.x;
      pointer.ty = pt.y;
      pointer.tActive = 0.7;
    }, { passive: true });
    window.addEventListener('touchend', onPointerLeave, { passive: true });
  }
})();
