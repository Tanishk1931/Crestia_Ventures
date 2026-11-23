(function () {
  "use strict";

  var section = document.querySelector("[data-rcm-cycle]");
  if (!section) return;

  var stage = section.querySelector(".rcm-cycle-stage");
  var svg = section.querySelector(".rcm-cycle-arrows");
  var grid = section.querySelector(".rcm-cycle-grid");
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".rcm-cycle-card"));
  var dot = svg.querySelector(".rcm-cycle-dot");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var svgNamespace = "http://www.w3.org/2000/svg";
  var routeGroup = document.createElementNS(svgNamespace, "g");
  var routeSegments = [];
  var routeLengths = [];
  var routeTotalLength = 0;
  var currentArrowGroup = null;
  var started = false;
  var inView = false;
  var animationFrame = 0;
  var lastFrameTime = null;
  var elapsed = 0;
  var dotElapsed = 0;
  var dotStarted = false;
  var dotStartTime = 0;
  var durationMs = 7000;
  var dotStartDelayMs = 0;

  function timeInMilliseconds(value, fallback) {
    var text = String(value || "").trim();
    var amount = parseFloat(text);
    if (!isFinite(amount)) return fallback;
    return /ms$/i.test(text) ? amount : amount * 1000;
  }

  function timeInSeconds(value, fallback) {
    var text = String(value || "").trim();
    var amount = parseFloat(text);
    if (!isFinite(amount)) return fallback;
    return /ms$/i.test(text) ? amount / 1000 : amount;
  }

  function makePath(start, end) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      var curveX = Math.min(40, Math.abs(dx) * 0.38) * (dx < 0 ? -1 : 1);
      return "M" + start.x + " " + start.y +
        " C" + (start.x + curveX) + " " + start.y +
        " " + (end.x - curveX) + " " + end.y +
        " " + end.x + " " + end.y;
    }
    var curveY = Math.min(40, Math.abs(dy) * 0.38) * (dy < 0 ? -1 : 1);
    return "M" + start.x + " " + start.y +
      " C" + start.x + " " + (start.y + curveY) +
      " " + end.x + " " + (end.y - curveY) +
      " " + end.x + " " + end.y;
  }

  function sideConnectorPath(stageWidth, first, second) {
    var radius = 18;
    var routeX = stageWidth - 16;
    var startX = first.x + first.width;
    var startY = first.y + first.height / 2;
    var endX = second.x + second.width;
    var endY = second.y + second.height / 2;
    return "M" + startX + " " + startY +
      " L" + (routeX - radius) + " " + startY +
      " Q" + routeX + " " + startY + " " + routeX + " " + (startY + radius) +
      " L" + routeX + " " + (endY - radius) +
      " Q" + routeX + " " + endY + " " + (routeX - radius) + " " + endY +
      " L" + endX + " " + endY;
  }

  function edgePoints(first, second) {
    var firstCenter = { x: first.x + first.width / 2, y: first.y + first.height / 2 };
    var secondCenter = { x: second.x + second.width / 2, y: second.y + second.height / 2 };
    var dx = secondCenter.x - firstCenter.x;
    var dy = secondCenter.y - firstCenter.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0
        ? [{ x: first.x + first.width, y: firstCenter.y }, { x: second.x, y: secondCenter.y }]
        : [{ x: first.x, y: firstCenter.y }, { x: second.x + second.width, y: secondCenter.y }];
    }
    return dy >= 0
      ? [{ x: firstCenter.x, y: first.y + first.height }, { x: secondCenter.x, y: second.y }]
      : [{ x: firstCenter.x, y: first.y }, { x: secondCenter.x, y: second.y + second.height }];
  }

  function returnPath(mode, stageWidth, stageHeight, first, last) {
    var radius = 16;
    if (mode === "tablet") {
      var routeX = stageWidth - 16;
      var topY = 16;
      var startX = last.x + last.width;
      var startY = last.y + last.height / 2;
      var endX = first.x + first.width / 2;
      var endY = first.y;
      return "M" + startX + " " + startY +
        " L" + (routeX - radius) + " " + startY +
        " Q" + routeX + " " + startY + " " + routeX + " " + (startY - radius) +
        " L" + routeX + " " + (topY + radius) +
        " Q" + routeX + " " + topY + " " + (routeX - radius) + " " + topY +
        " L" + endX + " " + topY +
        " Q" + endX + " " + topY + " " + endX + " " + (topY + radius) +
        " L" + endX + " " + endY;
    }

    var loopX = 16;
    var startLeft = last.x;
    var startMiddle = last.y + last.height / 2;
    var endLeft = first.x;
    var endMiddle = first.y + first.height / 2;
    return "M" + startLeft + " " + startMiddle +
      " L" + (loopX + radius) + " " + startMiddle +
      " Q" + loopX + " " + startMiddle + " " + loopX + " " + (startMiddle - radius) +
      " L" + loopX + " " + (endMiddle + radius) +
      " Q" + loopX + " " + endMiddle + " " + (loopX + radius) + " " + endMiddle +
      " L" + endLeft + " " + endMiddle;
  }

  function makeRouteGroup() {
    routeGroup.setAttribute("class", "rcm-cycle-route");
    routeGroup.setAttribute("aria-hidden", "true");
    cards.forEach(function (card, index) {
      var path = document.createElementNS(svgNamespace, "path");
      path.setAttribute("class", "rcm-cycle-route-segment");
      path.setAttribute("data-rcm-cycle-route", index);
      routeGroup.appendChild(path);
      routeSegments.push(path);
    });
    svg.insertBefore(routeGroup, dot);
  }

  function activeLayout() {
    if (window.matchMedia("(max-width: 599px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 899px)").matches) return "tablet";
    return "desktop";
  }

  function setArrowGroup(layout) {
    currentArrowGroup = svg.querySelector(".rcm-cycle-arrow-set--" + layout);
  }

  function rebuildPaths() {
    var stageRect = stage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return;
    var layout = activeLayout();
    setArrowGroup(layout);
    svg.setAttribute("viewBox", "0 0 " + stageRect.width + " " + stageRect.height);

    var rects = cards.map(function (card) {
      var rect = card.getBoundingClientRect();
      return {
        x: rect.left - stageRect.left,
        y: rect.top - stageRect.top,
        width: rect.width,
        height: rect.height
      };
    });
    var arrowPaths = [];
    for (var index = 0; index < rects.length - 1; index += 1) {
      var points = edgePoints(rects[index], rects[index + 1]);
      arrowPaths.push(layout === "desktop" && index === 2
        ? sideConnectorPath(stageRect.width, rects[index], rects[index + 1])
        : makePath(points[0], points[1]));
    }
    arrowPaths.push(returnPath(layout, stageRect.width, stageRect.height, rects[0], rects[rects.length - 1]));

    var baseArrows = Array.prototype.slice.call(currentArrowGroup.querySelectorAll("[data-rcm-cycle-arrow]"));
    var flowArrows = Array.prototype.slice.call(currentArrowGroup.querySelectorAll("[data-rcm-cycle-flow]"));
    var entryMs = timeInMilliseconds(getComputedStyle(section).getPropertyValue("--rcm-cycle-stagger"), 80);
    var cardDuration = timeInMilliseconds(getComputedStyle(section).getPropertyValue("--rcm-cycle-card-entry"), 700);
    var drawDuration = timeInMilliseconds(getComputedStyle(section).getPropertyValue("--rcm-cycle-arrow-draw"), 480);
    var arrowStagger = timeInMilliseconds(getComputedStyle(section).getPropertyValue("--rcm-cycle-arrow-stagger"), 440);
    var arrowStart = (cards.length - 1) * entryMs + cardDuration + 160;
    dotStartDelayMs = arrowStart + (arrowPaths.length - 1) * arrowStagger + drawDuration + 120;
    durationMs = timeInSeconds(getComputedStyle(section).getPropertyValue("--rcm-cycle-lap"), 7) * 1000;

    cards.forEach(function (card, index) {
      var delay = index * entryMs;
      card.style.setProperty("--rcm-cycle-entry-delay", delay + "ms");
      card.style.setProperty("--rcm-cycle-badge-delay", (delay + 110) + "ms");
    });

    baseArrows.forEach(function (path, index) {
      var pathData = arrowPaths[index];
      path.setAttribute("d", pathData);
      path.style.setProperty("--rcm-cycle-arrow-delay", (arrowStart + index * arrowStagger) + "ms");
      path.style.setProperty("--rcm-cycle-path-length", path.getTotalLength());
      path.style.strokeDasharray = path.getTotalLength() + " " + path.getTotalLength();
      path.style.strokeDashoffset = path.getTotalLength();
      if (marker) path.setAttribute("marker-end", "url(#" + marker.id + ")");

      if (flowArrows[index]) {
        flowArrows[index].setAttribute("d", pathData);
        flowArrows[index].style.setProperty("--rcm-cycle-flow-delay", (arrowStart + index * arrowStagger + drawDuration) + "ms");
      }
    });

    routeSegments.forEach(function (path, index) {
      if (index < routeSegments.length - 1) {
        path.setAttribute("d", arrowPaths[index]);
      } else {
        path.setAttribute("d", returnPath(layout, stageRect.width, stageRect.height, rects[0], rects[rects.length - 1]));
      }
    });
    routeLengths = routeSegments.map(function (path) { return path.getTotalLength(); });
    routeTotalLength = routeLengths.reduce(function (sum, length) { return sum + length; }, 0);
    if (dotStarted) updateDotPosition();
  }

  function updateDotPosition() {
    if (!routeTotalLength || !routeLengths.length) return;
    var distance = Math.min(dotElapsed, durationMs) / durationMs * routeTotalLength;
    var passed = 0;
    var segmentIndex = routeLengths.length - 1;
    for (var index = 0; index < routeLengths.length; index += 1) {
      if (distance <= passed + routeLengths[index] || index === routeLengths.length - 1) {
        segmentIndex = index;
        break;
      }
      passed += routeLengths[index];
    }
    var localDistance = Math.max(0, Math.min(routeLengths[segmentIndex], distance - passed));
    var point = routeSegments[segmentIndex].getPointAtLength(localDistance);
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);
  }

  function animate(now) {
    animationFrame = 0;
    if (!started || !inView || document.hidden || reducedMotion.matches) {
      syncPlayback();
      return;
    }
    if (lastFrameTime !== null) {
      var delta = Math.min(64, now - lastFrameTime);
      elapsed += delta;
      if (elapsed >= dotStartDelayMs) {
        if (!dotStarted) {
          dotStarted = true;
          section.classList.add("rcm-cycle-is-dot-active");
        }
        dotElapsed = Math.min(dotElapsed + delta, durationMs);
        updateDotPosition();
        if (dotElapsed >= durationMs) {
          section.classList.add("rcm-cycle-is-complete");
          syncPlayback();
          return;
        }
      }
    }
    lastFrameTime = now;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function syncPlayback() {
    var canPlay = started && inView && !document.hidden && !reducedMotion.matches &&
      !section.classList.contains("rcm-cycle-is-complete");
    section.classList.toggle("rcm-cycle-is-playing", canPlay);
    section.classList.toggle("rcm-cycle-is-paused", !canPlay);
    if (canPlay && !animationFrame) {
      lastFrameTime = null;
      animationFrame = window.requestAnimationFrame(animate);
    } else if (!canPlay && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrameTime = null;
    }
  }

  function startOnce() {
    if (started) return;
    started = true;
    section.classList.add("rcm-cycle-is-started");
    syncPlayback();
  }

  var marker = svg.querySelector("marker");
  if (marker) marker.id = "rcm-cycle-arrowhead-" + Math.random().toString(36).slice(2);
  makeRouteGroup();

  function onMotionPreferenceChange() {
    section.classList.toggle("rcm-cycle-motion-reduced", reducedMotion.matches);
    syncPlayback();
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", onMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(onMotionPreferenceChange);
  }

  document.addEventListener("visibilitychange", syncPlayback);

  var resizeFrame = 0;
  function requestRebuild() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = 0;
      rebuildPaths();
    });
  }

  if ("ResizeObserver" in window) {
    var resizeObserver = new ResizeObserver(requestRebuild);
    resizeObserver.observe(stage);
    cards.forEach(function (card) { resizeObserver.observe(card); });
  } else {
    window.addEventListener("resize", requestRebuild, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    var intersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== section) return;
        inView = entry.isIntersecting;
        if (inView) startOnce();
        syncPlayback();
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    intersectionObserver.observe(section);
  } else {
    inView = true;
    startOnce();
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(requestRebuild);
  rebuildPaths();
  section.classList.add("rcm-cycle-is-ready");
  onMotionPreferenceChange();
})();
