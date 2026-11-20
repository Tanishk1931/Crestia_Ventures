/* =====================================================================
   Crestia Ventures — shared global navbar behavior
   Sticky scroll state, mobile menu, active route, Escape/outside close.
   ===================================================================== */
(function () {
  'use strict';

  var nav = document.querySelector('.cv-nav');
  if (!nav) return;

  var toggle = nav.querySelector('.cv-nav-toggle');
  var links = nav.querySelector('.cv-nav-links');
  var page = (nav.getAttribute('data-page') || '').toLowerCase();

  var ROUTES = {
    rcm: '/rcm/',
    it: '/it/',
    healthcare: '/healthcare-recruitment/'
  };

  function pathOf(href) {
    try {
      return new URL(href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
    } catch (e) {
      return href;
    }
  }

  function currentPath() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
  }

  function markActive() {
    var here = currentPath();
    nav.querySelectorAll('.cv-nav-links a[data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      var isActive = false;

      if (key === 'contact') {
        isActive = window.location.hash === '#contact';
      } else if (key && ROUTES[key]) {
        isActive = page === key || here === pathOf(ROUTES[key]);
      }

      a.classList.toggle('is-active', isActive);
      if (isActive && key !== 'contact') {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  function setOpen(open) {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
    document.body.classList.toggle('cv-nav-open', open);
  }

  function closeMenu() {
    setOpen(false);
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        /* Only close immediately for in-page anchors. Cross-page
           navigations remount the header closed; closing first can
           cancel the click when the drawer layout collapses. */
        var href = a.getAttribute('href') || '';
        if (href.charAt(0) === '#') closeMenu();
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && document.body.classList.contains('cv-nav-open')) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  window.addEventListener('hashchange', markActive);
  markActive();
  nav.classList.toggle('is-scrolled', window.scrollY > 10);
})();
