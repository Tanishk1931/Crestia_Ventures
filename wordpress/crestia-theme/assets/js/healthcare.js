(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealOnView() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.js-fade-up').forEach(function (el) {
        el.style.opacity = '1';
      });
      document.querySelectorAll('.js-process-card').forEach(function (el) {
        el.style.opacity = '1';
      });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.js-fade-up').forEach(function (el) {
      if (reduce) {
        el.style.opacity = '1';
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });
  }

  function bindProcessScroll() {
    var section = document.querySelector('.recruitment-process');
    var grid = document.querySelector('[data-process-grid]');
    if (!section || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.js-process-card'));
    if (!cards.length) return;

    if (reduce || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      cards.forEach(function (card) {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var offsets = [];
    var isMobile = false;

    function measure() {
      isMobile = window.matchMedia('(max-width: 620px)').matches;
      var gridCenter = grid.clientWidth / 2;
      offsets = cards.map(function (card) {
        return isMobile ? 0 : gridCenter - (card.offsetLeft + card.offsetWidth / 2);
      });
    }

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function applyProgress(value) {
      cards.forEach(function (card, index) {
        var start = isMobile ? 0.02 + index * 0.145 : 0.02 + index * 0.16;
        var duration = isMobile ? 0.13 : 0.135;
        var linear = Math.max(0, Math.min(1, (value - start) / duration));
        var p = smoothstep(linear);
        var centerOffset = offsets[index] || 0;
        gsap.set(card, {
          opacity: p,
          x: isMobile ? 0 : centerOffset * (1 - p),
          y: isMobile ? 24 * (1 - p) : 0,
          rotation: isMobile ? 0 : (index % 2 === 0 ? 6 : -6) * (1 - p),
          scale: isMobile ? 0.97 + 0.03 * p : 0.92 + 0.08 * p,
          zIndex: index + 1,
        });
      });
    }

    measure();
    applyProgress(0);

    var trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: function (self) {
        applyProgress(self.progress);
      },
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();
        applyProgress(trigger.progress);
        ScrollTrigger.refresh();
      }, 120);
    });
  }

  function bindFlipCards() {
    document.querySelectorAll('[data-flip-card]').forEach(function (card) {
      function toggle() {
        var flipper = card.querySelector('.medical-choice-flipper');
        var flipped = flipper.classList.toggle('is-flipped');
        card.setAttribute('aria-expanded', flipped ? 'true' : 'false');
        var front = card.querySelector('.medical-choice-front');
        var back = card.querySelector('.medical-choice-back');
        if (front) front.setAttribute('aria-hidden', flipped ? 'true' : 'false');
        if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      }
      card.addEventListener('click', function (event) {
        if (event.target.closest('a, button.medical-choice-cta')) return;
        toggle();
      });
      card.addEventListener('keydown', function (event) {
        if (event.target !== card) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    });
  }

  function bindCircles() {
    var root = document.querySelector('[data-recruitment-circles]');
    if (!root) return;
    var activeId = null;

    function setActive(id) {
      activeId = id;
      root.querySelectorAll('.recruitment-circle').forEach(function (btn) {
        var on = btn.getAttribute('data-circle-id') === id;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        var desc = btn.querySelector('.recruitment-circle-description');
        if (desc) desc.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    }

    root.querySelectorAll('.recruitment-circle').forEach(function (btn) {
      var id = btn.getAttribute('data-circle-id');
      btn.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'mouse') setActive(id);
      });
      btn.addEventListener('pointerleave', function (event) {
        if (event.pointerType === 'mouse' && activeId === id) setActive(null);
      });
      btn.addEventListener('focus', function () {
        setActive(id);
      });
      btn.addEventListener('blur', function () {
        if (activeId === id) setActive(null);
      });
      btn.addEventListener('click', function (event) {
        if (event.pointerType === 'mouse' || event.detail === 0) return;
        setActive(activeId === id ? null : id);
      });
      btn.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          setActive(null);
          btn.blur();
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActive(activeId === id ? null : id);
        }
      });
    });
  }

  function bindSpecializations() {
    var root = document.querySelector('[data-specializations]');
    if (!root) return;
    var activeId = null;

    function setActive(id) {
      activeId = id;
      root.classList.toggle('has-active-card', id !== null);
      root.querySelectorAll('.healthcare-specialization-card').forEach(function (card) {
        var on = card.getAttribute('data-spec-id') === id;
        card.classList.toggle('is-expanded', on);
        card.setAttribute('aria-expanded', on ? 'true' : 'false');
        var desc = card.querySelector('.healthcare-specialization-description');
        if (desc) desc.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    }

    root.addEventListener('pointerleave', function (event) {
      if (
        event.pointerType === 'mouse' &&
        !root.querySelector(':focus-visible')
      ) {
        setActive(null);
      }
    });

    root.querySelectorAll('.healthcare-specialization-card').forEach(function (btn) {
      var id = btn.getAttribute('data-spec-id');
      var lastPointerType = null;

      btn.addEventListener('pointerdown', function (event) {
        lastPointerType = event.pointerType;
      });
      btn.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'mouse') setActive(id);
      });
      btn.addEventListener('focus', function () {
        if (lastPointerType !== 'touch' && lastPointerType !== 'pen') {
          setActive(id);
        }
      });
      btn.addEventListener('blur', function () {
        if (activeId === id) setActive(null);
      });
      btn.addEventListener('click', function (event) {
        if (event.detail === 0) {
          lastPointerType = null;
          setActive(activeId === id ? null : id);
          return;
        }
        var pointerType = event.pointerType || lastPointerType;
        lastPointerType = null;
        if (pointerType === 'mouse') return;
        setActive(activeId === id ? null : id);
      });
      btn.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          setActive(null);
          btn.blur();
        }
      });
    });
  }

  function refreshTriggers() {
    if (typeof ScrollTrigger === 'undefined') return;
    ScrollTrigger.refresh();
  }

  function init() {
    bindFlipCards();
    bindCircles();
    bindSpecializations();
    revealOnView();
    bindProcessScroll();

    window.addEventListener('load', refreshTriggers);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshTriggers).catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
