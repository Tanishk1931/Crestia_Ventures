/* Crestia Ventures - RCM page hero
   One GSAP timeline drives three CSS 3D monitors and their SVG dashboards.
   Override any timing before this script loads:
     window.RCM_HERO_CONFIG = { timing: { line: [1.5, 4.5] } };
*/
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Configuration (seconds). One loop = cycle.                          */
  /* ------------------------------------------------------------------ */
  var DEFAULTS = {
    cycle: 12,
    ease: 'power2.inOut', // must be a symmetric ease (the loop seam sits at its midpoint)
    timing: {
      intro:  [0, 1.5],     // monitor 1 rotates into the foreground
      line:   [1.5, 4],     // revenue line chart
      toBar:  [4, 5],       // monitor 1 -> monitor 2
      bar:    [5, 7.5],     // bar chart
      toPie:  [7.5, 8.5],   // monitor 2 -> monitor 3
      pie:    [8.5, 11],    // donut chart
      toLine: [11, 12]      // monitor 3 -> monitor 1
    }
  };

  var userCfg = window.RCM_HERO_CONFIG || {};
  var CONFIG = {
    cycle: userCfg.cycle || DEFAULTS.cycle,
    ease: userCfg.ease || DEFAULTS.ease,
    timing: Object.assign({}, DEFAULTS.timing, userCfg.timing || {})
  };

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function clamp(v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function qs(root, sel) { return root.querySelector(sel); }
  function qsa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Scroll reveal for the content sections                              */
  /* ------------------------------------------------------------------ */
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var revealEls = qsa(document, '.reveal');
  var revealIO = null;
  if (reduceMQ.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Hero                                                                */
  /* ------------------------------------------------------------------ */
  var hero = document.getElementById('hero');
  var stage = document.getElementById('stage');
  if (!hero || !stage) return;

  var monitors = qsa(stage, '.monitor');
  var dims = monitors.map(function (m) { return qs(m, '.m-dim'); });

  if (typeof window.gsap === 'undefined') {
    // GSAP missing: the CSS resting pose and finished charts remain usable.
    return;
  }
  var gsap = window.gsap;

  /* ---- chart renderers: each draws its whole state from prog (0..1) ---- */

  function makeLine(root) {
    var path = qs(root, '.line'), area = qs(root, '.area');
    var pts = qsa(root, '.pts circle');
    var glow = qs(root, '.peak-glow'), dot = qs(root, '.peak-dot');
    var count = qs(root, '[data-role="count"]');
    var target = 84290, drawEnd = 0.85;
    var easeDraw = gsap.parseEase('power1.inOut');
    var easeCount = gsap.parseEase('power2.out');
    glow.style.transformBox = 'fill-box';
    glow.style.transformOrigin = '50% 50%';
    path.style.strokeDasharray = '1';
    return {
      prog: 0,
      render: function (p) {
        var d = easeDraw(clamp(p / drawEnd));
        path.style.strokeDashoffset = String(1 - d);
        path.style.opacity = d > 0.001 ? '1' : '0';
        area.style.opacity = String(d * 0.9);
        for (var i = 0; i < pts.length; i++) {
          pts[i].style.opacity = String(clamp((d - i / 7) * 14));
        }
        var g = clamp((p - drawEnd) / (1 - drawEnd));
        glow.style.opacity = String(g);
        glow.style.transform = 'scale(' + (0.55 + 0.45 * g) + ')';
        dot.style.opacity = d > 0.985 ? '1' : '0';
        count.textContent = '$' + fmt(target * easeCount(clamp(p / 0.9)));
      }
    };
  }

  function makeBars(root) {
    var bars = qsa(root, '.bars rect');
    var count = qs(root, '[data-role="count"]');
    var target = 1284;
    var easeBar = gsap.parseEase('power3.out');
    var easeCount = gsap.parseEase('power2.out');
    return {
      prog: 0,
      render: function (p) {
        for (var i = 0; i < bars.length; i++) {
          var l = easeBar(clamp((p - i * 0.075) / 0.55));
          bars[i].style.transform = 'scaleY(' + l.toFixed(4) + ')';
        }
        count.textContent = fmt(target * easeCount(clamp(p / 0.9)));
      }
    };
  }

  function makePie(root) {
    var segs = qsa(root, '.seg');
    var rows = qsa(root, '.pie-legend li');
    var vals = rows.map(function (li) { return qs(li, 'b'); });
    var center = qs(root, '[data-role="count"]');
    var lens = segs.map(function (s) { return parseFloat(s.getAttribute('data-len')); });
    var easeSeg = gsap.parseEase('power2.inOut');
    var gap = 1, activeNow = -2;
    function setActive(k) {
      if (k === activeNow) return;
      activeNow = k;
      segs.forEach(function (s, i) { s.classList.toggle('is-active', i === k); });
      rows.forEach(function (r, i) { r.classList.toggle('is-active', i === k); });
    }
    return {
      prog: 0,
      render: function (p) {
        var sum = 0, active = -1;
        for (var k = 0; k < segs.length; k++) {
          var l = easeSeg(clamp((p - k * 0.22) / 0.3));
          var draw = Math.max(0, lens[k] * l - gap * l);
          segs[k].setAttribute('stroke-dasharray', draw.toFixed(2) + ' 100');
          vals[k].textContent = Math.round(lens[k] * l) + '%';
          sum += lens[k] * l;
          if (l > 0 && l < 1) active = k;
        }
        if (active < 0 && p >= 1) active = 0;
        setActive(active);
        center.textContent = Math.round(sum) + '%';
      }
    };
  }

  var charts = [
    makeLine(qs(monitors[0], '[data-chart="line"]')),
    makeBars(qs(monitors[1], '[data-chart="bars"]')),
    makePie(qs(monitors[2], '[data-chart="pie"]'))
  ];
  function renderCharts() { charts.forEach(function (c) { c.render(c.prog); }); }
  function setAllProg(v) { charts.forEach(function (c) { c.prog = v; }); renderCharts(); }

  /* ---- 3D carousel pose ------------------------------------------------ */
  // Monitors sit on a ring. p is the (unwrapped) index of the active monitor.
  // Offset o = i - p wrapped to (-1.5, 1.5]; o=0 front, +/-1 side, +/-1.5 hidden behind.
  var metrics = { mw: 300, spread: 0.64, tilt: 34, zAmp: 0.2 };
  function measure() {
    var cs = getComputedStyle(stage);
    metrics.mw = monitors[0].offsetWidth || 300;
    metrics.spread = parseFloat(cs.getPropertyValue('--spread')) || 0.64;
    metrics.tilt = parseFloat(cs.getPropertyValue('--tilt')) || 34;
    metrics.zAmp = 0.2;
    // Reduced-motion visitors still get the sequence, but with a much gentler 3D swing.
    if (reduceMQ.matches) {
      metrics.tilt = Math.min(metrics.tilt, 10);
      metrics.zAmp = 0.06;
    }
  }

  function renderPose(p) {
    var mw = metrics.mw;
    for (var i = 0; i < monitors.length; i++) {
      var o = (((i - p) % 3) + 3) % 3;
      if (o > 1.5) o -= 3;
      var a = o * 2 * Math.PI / 3;
      var c = Math.cos(a), s = Math.sin(a);
      var x = metrics.spread * mw * s;
      var z = metrics.zAmp * mw * c;
      var rot = -s * metrics.tilt;
      var sc = 0.9 + 0.22 * c;
      monitors[i].style.transform =
        'translate3d(' + x.toFixed(2) + 'px,0,' + z.toFixed(2) + 'px) rotateY(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
      dims[i].style.opacity = (0.28 * (1 - c)).toFixed(3);
    }
  }

  /* ---- timeline -------------------------------------------------------- */
  var tl = null, io = null, pose = { p: 2.5 };

  function dur(seg) { return seg[1] - seg[0]; }
  function mid(seg) { return (seg[0] + seg[1]) / 2; }

  // State of the dashboards at the loop seam (p = 2.5): monitor 3 sits at the left,
  // still showing its finished donut; monitors 1 and 2 are empty (2 is hidden behind).
  // Rewinding the timeline resets every chart, so the seam restores this state.
  function restSeamState() {
    charts[0].prog = 0;
    charts[1].prog = 0;
    charts[2].prog = 1;
    renderCharts();
  }

  function buildTimeline() {
    var T = CONFIG.timing;
    var F = gsap.parseEase(CONFIG.ease);
    var upd = function () { renderPose(pose.p); };

    tl = gsap.timeline({
      repeat: -1,
      paused: true,
      onRepeat: restSeamState
    });

    // Monitor moves (p counts active monitors; 3 == back to monitor 1).
    // The loop seam is the midpoint of one eased move (p = 5.5 == 2.5), where the
    // monitor that wraps behind the screen is hidden, so the repeat is seamless.
    tl.fromTo(pose, { p: 2.5 }, {
      p: 3, duration: dur(T.intro),
      ease: function (u) { return (F(0.5 + 0.5 * u) - 0.5) / 0.5; },
      onUpdate: upd
    }, T.intro[0]);
    tl.fromTo(pose, { p: 3 }, { p: 4, duration: dur(T.toBar), ease: F, onUpdate: upd }, T.toBar[0]);
    tl.fromTo(pose, { p: 4 }, { p: 5, duration: dur(T.toPie), ease: F, onUpdate: upd }, T.toPie[0]);
    tl.fromTo(pose, { p: 5 }, {
      p: 5.5, duration: dur(T.toLine),
      ease: function (u) { return F(0.5 * u) / 0.5; },
      onUpdate: upd
    }, T.toLine[0]);

    // Chart playback, started when each monitor reaches the front.
    [['line', 0], ['bar', 1], ['pie', 2]].forEach(function (pair) {
      var seg = T[pair[0]], c = charts[pair[1]];
      tl.fromTo(c, { prog: 0 }, {
        prog: 1, duration: dur(seg), ease: 'none',
        onUpdate: function () { c.render(c.prog); }
      }, seg[0]);
    });

    // Each chart clears while its monitor passes behind the active one.
    function clearAt(c, t) {
      tl.call(function () { c.prog = 0; c.render(0); }, null, t);
    }
    clearAt(charts[2], mid(T.toBar));   // monitor 3 wraps behind during 1 -> 2
    clearAt(charts[0], mid(T.toPie));   // monitor 1 wraps behind during 2 -> 3
    // Monitor 2 wraps behind exactly at the loop seam; onRepeat redraws it empty.

    // Pad the loop to the configured cycle length without rescaling time.
    if (tl.duration() < CONFIG.cycle) tl.set({}, {}, CONFIG.cycle);
    return tl;
  }

  function startMotion() {
    stopMotion(false);
    measure();
    pose.p = 2.5;
    setAllProg(0);
    renderPose(pose.p);
    buildTimeline();
    restSeamState();
    stage.classList.add('is-animated');

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!tl) return;
          if (e.isIntersecting) tl.play(); else tl.pause();
        });
      }, { threshold: 0.1 });
      io.observe(hero);
    } else {
      tl.play();
    }
  }

  function stopMotion(showStatic) {
    if (io) { io.disconnect(); io = null; }
    if (tl) { tl.kill(); tl = null; }
    stage.classList.remove('is-animated');
    if (showStatic) {
      monitors.forEach(function (m, i) {
        m.style.removeProperty('transform');
        dims[i].style.removeProperty('opacity');
      });
      setAllProg(1);
    }
  }

  var resizeRaf = 0;
  function onResize() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () {
      resizeRaf = 0;
      if (!tl) return;
      measure();
      renderPose(pose.p);
    });
  }

  // The dashboards always animate. When the OS asks for reduced motion the 3D swing is
  // damped (see measure()) instead of switching the whole hero off.
  function applyMotionPreference() {
    startMotion();
  }

  if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', applyMotionPreference);
  else if (reduceMQ.addListener) reduceMQ.addListener(applyMotionPreference);
  window.addEventListener('resize', onResize, { passive: true });

  window.addEventListener('pagehide', function () {
    stopMotion(false);
    if (revealIO) revealIO.disconnect();
    window.removeEventListener('resize', onResize);
  });

  // Expose for debugging / tuning in the console.
  window.RCMHero = {
    config: CONFIG,
    get timeline() { return tl; }
  };

  applyMotionPreference();
})();
