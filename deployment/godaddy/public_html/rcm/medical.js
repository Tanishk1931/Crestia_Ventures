(function () {
  'use strict';

  const video = document.getElementById('medical-video');
  const green = document.querySelector('.medical-green');
  const wipe = document.querySelector('.light-wipe');
  const copy = document.querySelector('.medical-copy');
  const eyebrow = document.getElementById('medical-eyebrow');
  const healthcare = document.querySelector('.healthcare');
  const connected = document.querySelector('.connected');
  const support = document.getElementById('medical-support');
  const pageCanvas = document.querySelector('.medical-page-canvas');
  let transitionComplete = false;

  document.getElementById('medical-year').textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    if (video) video.pause();
    pageCanvas.classList.add('has-revealed-intro');
    return;
  }

  const secondBackgroundLine = document.querySelector('.medical-page-line--secondary');
  const backgroundPulses = Array.from(document.querySelectorAll('.medical-page-pulse'));
  let backgroundPulsesStarted = false;

  if (secondBackgroundLine) {
    secondBackgroundLine.addEventListener('animationend', function (event) {
      if (event.animationName !== 'medical-page-line-draw' || backgroundPulsesStarted) return;
      backgroundPulsesStarted = true;

      backgroundPulses.forEach(function (pulse) {
        pulse.classList.add('is-active');
        pulse.querySelector('animateMotion').beginElement();
      });
    });
  }

  if (!window.gsap) {
    green.style.opacity = '1';
    copy.style.opacity = '1';
    copy.style.visibility = 'visible';
    eyebrow.style.opacity = '1';
    eyebrow.style.transform = 'none';
    healthcare.style.opacity = '1';
    healthcare.style.transform = 'none';
    connected.style.opacity = '1';
    connected.style.transform = 'none';
    support.style.opacity = '1';

    if (!video || video.ended) {
      if (video) video.style.opacity = '0';
      pageCanvas.classList.add('has-revealed-intro');
    } else {
      video.addEventListener('ended', function () {
        video.style.opacity = '0';
        pageCanvas.classList.add('has-revealed-intro');
      }, { once: true });
    }
    return;
  }

  const gsap = window.gsap;
  let timeline = null;
  let transitionStarted = false;

  const groups = support.textContent.trim().split(/\s+/);
  support.textContent = '';
  groups.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'medical-support-word';
    span.textContent = word;
    support.appendChild(span);
    if (index < groups.length - 1) support.appendChild(document.createTextNode(' '));
  });
  const supportWords = Array.from(support.querySelectorAll('.medical-support-word'));

  gsap.set(wipe, { clipPath: 'circle(0.35% at 50% 50%)', opacity: 0 });

  function revealBackgroundWhenReady() {
    if (transitionComplete && (!video || video.ended)) {
      pageCanvas.classList.add('has-revealed-intro');
    }
  }

  function markTransitionComplete() {
    transitionComplete = true;
    revealBackgroundWhenReady();
  }

  function buildTimeline() {
    if (timeline) timeline.kill();
    timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

    timeline
      .set(copy, { visibility: 'visible' })
      .set(green, { opacity: 0 })
      .set(wipe, { clipPath: 'circle(0.35% at 50% 50%)', opacity: 1 })
      .to(green, { opacity: 1, duration: 0.55, ease: 'power1.inOut' }, 0)
      .to(wipe, { clipPath: 'circle(150% at 50% 50%)', duration: 0.74, ease: 'power3.out' }, 0)
      .to(wipe, { clipPath: 'circle(0.35% at 50% 50%)', duration: 0.78, ease: 'power3.in' }, 0.74)
      .to(wipe, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 1.62)
      .to(document.querySelector('.medical-hospital'), { opacity: 0, duration: 0.18 }, 1.72)
      .to(copy, { opacity: 1, duration: 0.24 }, 1.82)
      .call(markTransitionComplete, null, '>')
      .to(eyebrow, { opacity: 1, y: 0, duration: 1.05, ease: 'power2.out' }, 1.95)
      .to(healthcare, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.35, ease: 'power2.out' }, 3.08)
      .to(connected, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.35, ease: 'power2.out' }, 4.38)
      .to(supportWords, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power2.out'
      }, 5.75);

    return timeline;
  }

  timeline = buildTimeline();

  function startTransition() {
    if (transitionStarted) return;
    transitionStarted = true;
    timeline.play(0);
  }

  function checkVideoTime() {
    if (!video || !Number.isFinite(video.duration)) return;
    if (video.currentTime >= Math.max(7.15, video.duration - 2.85)) startTransition();
  }

  function handleVideoEnded() {
    startTransition();
    revealBackgroundWhenReady();
  }

  video.addEventListener('timeupdate', checkVideoTime);
  video.addEventListener('ended', handleVideoEnded);
  video.addEventListener('canplay', function () {
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(function () {
        if (video.duration) {
          video.addEventListener('click', function () { video.play(); }, { once: true });
        }
      });
    }
  }, { once: true });

  if (video.readyState >= 3) video.play().catch(function () {});

  window.addEventListener('pagehide', function () {
    video.pause();
    if (timeline) timeline.kill();
  });

  window.MedicalIntro = {
    timeline: timeline,
    startTransition: startTransition
  };
})();
