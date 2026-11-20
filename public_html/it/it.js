/* =====================================================================
   IT Recruitment page interactions — nav, reveals, wave cover sizing.
   Isolated from RCM scripts.
   ===================================================================== */
(function () {
  'use strict';

  var year = document.getElementById('yr');
  if (year) year.textContent = String(new Date().getFullYear());

  var nav = document.querySelector('.it-nav');
  var toggle = document.querySelector('.it-nav-toggle');
  var links = document.querySelector('.it-nav-links');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Career Consultancy destination — configurable, page not required yet */
  window.IT_NAV = window.IT_NAV || {
    careerConsultancy: '/career-consultancy/'
  };
  document.querySelectorAll('[data-nav="career"]').forEach(function (el) {
    if (window.IT_NAV.careerConsultancy) {
      el.setAttribute('href', window.IT_NAV.careerConsultancy);
    }
  });

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
    document.body.classList.remove('it-nav-open');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      links.classList.toggle('is-open', !open);
      document.body.classList.toggle('it-nav-open', !open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  window.addEventListener('scroll', function () {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }, { passive: true });

  /* Smooth in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });

  /* Size coding-wave cover to span hero through expertise */
  var cover = document.getElementById('it-wave-cover');
  var hero = document.getElementById('hero');
  var expertise = document.getElementById('expertise');

  function syncWaveCover() {
    if (!cover || !hero) return;
    var top = 0;
    var bottomEl = expertise || hero;
    var bottom = bottomEl.offsetTop + bottomEl.offsetHeight;
    cover.style.top = top + 'px';
    cover.style.height = Math.max(bottom - top, window.innerHeight) + 'px';
    if (window.ITCodeWave && typeof window.ITCodeWave.resize === 'function') {
      window.ITCodeWave.resize();
    }
  }

  syncWaveCover();
  window.addEventListener('resize', syncWaveCover, { passive: true });
  window.addEventListener('load', syncWaveCover);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncWaveCover);
  }

  /* Hero image + role-label flip (hover / tap / keyboard) */
  (function initHeroFlip() {
    var root = document.getElementById('hero-flip-root');
    var scene = document.getElementById('hero-flip');
    if (!root || !scene) return;

    var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var mqCoarse = window.matchMedia('(pointer: coarse)');
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var locked = false;
    var lockTimer = 0;

    function setHot(on) {
      document.body.classList.toggle('is-hero-hot', !!on);
      if (window.ITCodeWave && typeof window.ITCodeWave.setHeroHover === 'function') {
        window.ITCodeWave.setHeroHover(!!on);
      }
    }

    function setFlipped(on) {
      var next = !!on;
      if (root.classList.contains('is-flipped') === next) return;
      root.classList.toggle('is-flipped', next);
      scene.setAttribute('aria-pressed', next ? 'true' : 'false');
      setHot(next);
    }

    function toggleFlip() {
      if (locked) return;
      locked = true;
      setFlipped(!root.classList.contains('is-flipped'));
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(function () { locked = false; }, 1050);
    }

    /* Hover on outer wrapper — labels have pointer-events:none to avoid flicker */
    root.addEventListener('mouseenter', function () {
      if (mqCoarse.matches) return;
      setFlipped(true);
    });
    root.addEventListener('mouseleave', function () {
      if (mqCoarse.matches) return;
      setFlipped(false);
    });

    scene.addEventListener('click', function (e) {
      if (!mqCoarse.matches && mqFine.matches) return;
      e.preventDefault();
      toggleFlip();
    });

    scene.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      toggleFlip();
    });

    /* Reduced-motion: CSS swaps faces with fade instead of 3D rotation */
    if (mqReduce.addEventListener) {
      mqReduce.addEventListener('change', function () {
        if (mqReduce.matches) setFlipped(false);
      });
    }
  })();

  /* Recruitment process — one-shot cinematic 3D sequence */
  (function initProcessMotion() {
    var section = document.getElementById('process');
    var stage = document.getElementById('it-process-cycle');
    if (!section || !stage) return;

    /* Respect OS reduce-motion unless ?motion=1 (same as hero flip) */
    var reduce = document.documentElement.classList.contains('it-reduce-motion');

    function playStatic() {
      section.classList.add('is-process-static');
    }

    function playSequence() {
      if (section.classList.contains('is-process-play') ||
          section.classList.contains('is-process-static')) {
        return;
      }
      section.classList.add('is-process-play');
    }

    if (reduce || !('IntersectionObserver' in window)) {
      playStatic();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (!entry || !entry.isIntersecting) return;
      playSequence();
      io.disconnect(); /* once per page visit */
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.22 });

    io.observe(section);
  })();

  /* Scroll reveals */
  var reveals = document.querySelectorAll('.it-reveal');
  if (!reveals.length) return;

  if (mqReduce.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  reveals.forEach(function (el) { io.observe(el); });
})();
