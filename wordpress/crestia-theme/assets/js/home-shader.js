/**
 * Crestia home background — CSS gradient + paper grain only.
 * No continuous canvas animation (was causing scroll jank).
 */
(function () {
  var canvas = document.getElementById('crestia-shader');
  if (!canvas) return;

  canvas.style.pointerEvents = 'none';
  canvas.setAttribute('aria-hidden', 'true');
  // Keep element for layout/compat; wallpaper lives on body.crestia-home::before.
  canvas.width = 1;
  canvas.height = 1;
})();
