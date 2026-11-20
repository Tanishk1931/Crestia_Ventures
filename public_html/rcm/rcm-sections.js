(function () {
  "use strict";

  var root = document.documentElement;
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-rcm-section]"));
  if (!sections.length) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  root.classList.add("js");
  root.classList.toggle("rcm-motion-paused", document.hidden);

  function setIconLengths(section) {
    Array.prototype.forEach.call(section.querySelectorAll("[data-rcm-icon]"), function (icon) {
      Array.prototype.forEach.call(icon.querySelectorAll("path, circle, rect, line, polyline, polygon"), function (shape) {
        if (typeof shape.getTotalLength === "function") {
          shape.style.setProperty("--rcm-icon-length", shape.getTotalLength());
        }
      });
    });
  }

  function prepareSection(section) {
    var cards = Array.prototype.slice.call(section.querySelectorAll(".rcm-workflow__step, .rcm-metric-card"));
    var glowDuration = parseFloat(getComputedStyle(section).getPropertyValue("--rcm-glow-speed")) || 8;
    var stagger = parseFloat(getComputedStyle(section).getPropertyValue("--rcm-stagger")) || 80;
    cards.forEach(function (card, index) {
      card.style.setProperty("--rcm-stagger-delay", (index * stagger) + "ms");
      card.style.setProperty("--rcm-badge-delay", (index * stagger + 100) + "ms");
      card.style.setProperty("--rcm-icon-delay", (index * stagger + 120) + "ms");
      card.style.setProperty("--rcm-glow-delay", (index * glowDuration / Math.max(cards.length, 1)) + "s");

      if (finePointer.matches && !reducedMotion.matches) {
        var maxTilt = parseFloat(getComputedStyle(section).getPropertyValue("--rcm-tilt-angle")) || 6;
        card.addEventListener("pointermove", function (event) {
          if (event.pointerType === "touch") return;
          var bounds = card.getBoundingClientRect();
          var x = (event.clientX - bounds.left) / bounds.width - 0.5;
          var y = (event.clientY - bounds.top) / bounds.height - 0.5;
          card.style.setProperty("--rcm-tilt-x", (-y * maxTilt * 2) + "deg");
          card.style.setProperty("--rcm-tilt-y", (x * maxTilt * 2) + "deg");
        });
        card.addEventListener("pointerleave", function () {
          card.style.setProperty("--rcm-tilt-x", "0deg");
          card.style.setProperty("--rcm-tilt-y", "0deg");
        });
      }
    });

    setIconLengths(section);
    section.__rcmHead = section.querySelector(".rcm-section-head");
  }

  sections.forEach(prepareSection);

  function reveal(section, isInView) {
    section.classList.toggle("rcm-is-in-view", isInView);
    if (section.__rcmHead) section.__rcmHead.classList.toggle("rcm-is-in-view", isInView);
    if (!isInView || section.classList.contains("rcm-is-revealed")) return;
    section.classList.add("rcm-is-revealed");
    if (section.__rcmHead) section.__rcmHead.classList.add("rcm-is-revealed");
  }

  if (reducedMotion.matches) {
    root.classList.add("rcm-motion-reduced");
    sections.forEach(function (section) {
      section.classList.add("rcm-is-revealed");
      if (section.__rcmHead) section.__rcmHead.classList.add("rcm-is-revealed");
    });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        reveal(entry.target, entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  } else {
    sections.forEach(function (section) {
      section.classList.add("rcm-is-revealed");
      if (section.__rcmHead) section.__rcmHead.classList.add("rcm-is-revealed");
    });
  }

  var parallaxFrame = 0;
  function updateParallax() {
    parallaxFrame = 0;
    if (document.hidden || reducedMotion.matches) {
      sections.forEach(function (section) { section.style.setProperty("--rcm-parallax-y", "0px"); });
      return;
    }
    var center = (window.innerHeight || 0) / 2;
    sections.forEach(function (section) {
      var bounds = section.getBoundingClientRect();
      var offset = ((bounds.top + bounds.height / 2) - center) / Math.max(window.innerHeight || 1, 1);
      var shift = Math.max(-8, Math.min(8, -offset * 8));
      section.style.setProperty("--rcm-parallax-y", shift + "px");
    });
  }

  function requestParallax() {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
  }

  document.addEventListener("visibilitychange", function () {
    root.classList.toggle("rcm-motion-paused", document.hidden);
    requestParallax();
  });
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax, { passive: true });
  requestParallax();

  function syncMotionPreference() {
    var reduce = reducedMotion.matches;
    root.classList.toggle("rcm-motion-reduced", reduce);
    if (reduce) {
      sections.forEach(function (section) {
        section.classList.add("rcm-is-revealed");
        if (section.__rcmHead) section.__rcmHead.classList.add("rcm-is-revealed");
      });
    }
    requestParallax();
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", syncMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(syncMotionPreference);
  }

  root.classList.add("rcm-sections-ready");
})();
