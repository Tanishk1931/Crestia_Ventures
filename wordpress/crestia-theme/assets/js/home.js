(function () {
  window.crestiaAnimationState = {
    emergence: 0,
    assembly: 0,
    turn: 0,
    travel: 0,
    heroScale: 1.04,
    heroX: 0.31,
    heroY: 0,
    navX: 0,
    navY: 0,
    navScale: 0.06,
    wordmarkX: 0,
    wordmarkY: 0,
    wordmarkScale: 1,
  };

  var ABOUT_ANIM = {
    scrub: 1,
    ease: 'power2.inOut',
    floatEase: 'sine.inOut',
    floatDelayStep: 0.24,
    entryEnd: 0.17,
    headlineStart: 0.035,
    headlineDuration: 0.065,
    headlineStagger: 0.035,
    introStart: 0.09,
    introDuration: 0.06,
    introStagger: 0.08,
    footerStart: 0.12,
    footerDuration: 0.06,
    footerStagger: 0.08,
    firstChapterStart: 0.145,
    chapterTwoAt: 0.42,
    chapterThreeAt: 0.64,
    exitStart: 0.88,
    panelFadeDuration: 0.055,
    panelEnterDuration: 0.01,
    panelCopyDuration: 0.045,
    panelCopyStagger: 0.04,
    chipRevealDuration: 0.035,
    chipRevealStagger: 0.008,
    reducedFadeDuration: 0.025,
    reducedStagger: 0.01,
    transitionOffset: 0.006,
    imageScale: 1.25,
    chapterImageScale: 1.08,
    chapterImageSettleDuration: 0.11,
    floatDurations: [6.8, 7.7, 8.6],
    floatDistances: [5, 7, 9],
  };

  var CHAPTER_RANGE_START = ABOUT_ANIM.entryEnd;
  var CHAPTER_RANGE_END = ABOUT_ANIM.exitStart;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function getChapterIndex(progress) {
    if (progress < ABOUT_ANIM.chapterTwoAt) return 0;
    if (progress < ABOUT_ANIM.chapterThreeAt) return 1;
    return 2;
  }

  ready(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    initScrollStory();
    initAboutStage();
    initServicesShowcase();
    initClosing();

    var refreshTimer = 0;
    function scheduleRefresh() {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(function () {
        refreshTimer = 0;
        ScrollTrigger.refresh();
      }, 80);
    }

    requestAnimationFrame(scheduleRefresh);
    window.addEventListener('load', scheduleRefresh);
    window.addEventListener('resize', scheduleRefresh);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleRefresh);
    }
  });

  function initScrollStory() {
    var state = window.crestiaAnimationState;
    var story = document.getElementById('brand-story');
    var slot = document.getElementById('nav-logo-slot');
    var navWordmark = document.getElementById('nav-wordmark');
    var hero = document.getElementById('hero-copy');
    var heroWordmark = document.getElementById('hero-wordmark');
    var heroEyebrow = document.getElementById('hero-eyebrow');
    var heroSupport = document.getElementById('hero-support');
    var reveal = document.getElementById('logo-reveal');
    var progress = document.getElementById('story-progress');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var CAMERA_Z = 9;
    var CAMERA_FOV = 36;
    var MODEL_HEIGHT = 3;
    var NAV_TRANSITION_START = 6.6;
    var NAV_TRANSITION_DURATION = 3.4;

    function measureDestinations() {
      var width = document.documentElement.clientWidth;
      var height = window.innerHeight;
      var visibleHeight = 2 * CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360);
      if (slot) {
        var bounds = slot.getBoundingClientRect();
        state.navX = ((bounds.left + bounds.width / 2) / width - 0.5) * visibleHeight * (width / height);
        state.navY = (0.5 - (bounds.top + bounds.height / 2) / height) * visibleHeight;
        state.navScale = Math.max(0.01, (bounds.height / height) * (visibleHeight / MODEL_HEIGHT));
      }
      if (!heroWordmark || !navWordmark) return;
      var titleBounds = heroWordmark.getBoundingClientRect();
      var wordmarkBounds = navWordmark.getBoundingClientRect();
      var titleX = Number(gsap.getProperty(heroWordmark, 'x')) || 0;
      var titleY = Number(gsap.getProperty(heroWordmark, 'y')) || 0;
      var titleScaleY = Number(gsap.getProperty(heroWordmark, 'scaleY')) || 1;
      state.wordmarkX = wordmarkBounds.left - (titleBounds.left - titleX);
      state.wordmarkY = wordmarkBounds.top - (titleBounds.top - titleY);
      state.wordmarkScale = wordmarkBounds.height / (titleBounds.height / titleScaleY);
    }

    measureDestinations();
    window.addEventListener('resize', measureDestinations);

    if (!story || reducedMotion) {
      state.emergence = 1;
      state.assembly = 1;
      if (navWordmark) gsap.set(navWordmark, { autoAlpha: 0 });
      return;
    }

    gsap.set(reveal, { autoAlpha: 0 });
    gsap.set(navWordmark, { autoAlpha: 0 });

    var timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: story,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
        invalidateOnRefresh: true,
        onRefresh: measureDestinations,
      },
    });

    timeline
      .to(state, { emergence: 1, duration: 1.6, ease: 'power1.out' }, 0)
      .to(state, { assembly: 1, duration: 1.7, ease: 'power2.inOut' }, 1.6)
      .to(state, { turn: Math.PI * 2, duration: 1.6, ease: 'power2.out' }, 3.3)
      .to(reveal, { autoAlpha: 1, duration: 0.25 }, 3.15)
      .to(reveal, { autoAlpha: 0, duration: 0.3 }, 4.65)
      .to(heroEyebrow, { autoAlpha: 0, y: -10, duration: 0.4 }, NAV_TRANSITION_START)
      .to(heroSupport, { autoAlpha: 0, y: -18, duration: 0.45 }, NAV_TRANSITION_START)
      .to(
        heroWordmark,
        {
          x: function () { return state.wordmarkX; },
          y: function () { return state.wordmarkY; },
          scale: function () { return state.wordmarkScale; },
          duration: NAV_TRANSITION_DURATION,
          ease: 'power2.inOut',
        },
        NAV_TRANSITION_START
      )
      .to(state, { travel: 1, duration: NAV_TRANSITION_DURATION, ease: 'power2.inOut' }, NAV_TRANSITION_START)
      .to(navWordmark, { autoAlpha: 1, duration: 0.22 }, 9.82)
      .to(hero, { autoAlpha: 0, duration: 0.22 }, 9.82)
      .to(progress, { autoAlpha: 0, duration: 0.28 }, 11.45);
  }

  function initAboutStage() {
    var track = document.getElementById('company-card');
    var stage = document.getElementById('about-stage');
    if (!track || !stage) return;

    var imageLayers = Array.prototype.slice.call(stage.querySelectorAll('.about-imageLayer'));
    var chapterPanels = Array.prototype.slice.call(stage.querySelectorAll('.about-chapterPanel'));
    var overline = stage.querySelector('.about-overline');
    var headlineLines = Array.prototype.slice.call(stage.querySelectorAll('[data-headline-line]'));
    var introDetails = Array.prototype.slice.call(stage.querySelectorAll('[data-intro-detail]'));
    var footerItems = Array.prototype.slice.call(stage.querySelectorAll('[data-footer-item]'));
    var floatingChips = Array.prototype.slice.call(stage.querySelectorAll('[data-float-chip]'));
    var progressFill = document.getElementById('about-progress-fill');
    var progressBar = document.getElementById('about-progress');
    var counter = document.getElementById('about-counter');
    var indicator = document.getElementById('about-tab-indicator');
    var vignette = document.getElementById('about-vignette');
    var tabs = Array.prototype.slice.call(stage.querySelectorAll('[data-about-tab]'));
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var activeIndex = 0;
    var chapterCount = Math.max(chapterPanels.length, 1);

    function setActive(index) {
      activeIndex = index;
      if (counter) counter.textContent = '0' + (index + 1) + ' / 0' + chapterCount;
      chapterPanels.forEach(function (panel, i) {
        panel.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        panel.tabIndex = i === index ? 0 : -1;
      });
      tabs.forEach(function (tab, i) {
        tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var index = Number(tab.getAttribute('data-about-tab'));
        var trigger = ScrollTrigger.getById('about-stage');
        if (trigger) {
          var range = CHAPTER_RANGE_END - CHAPTER_RANGE_START;
          var targetProgress = CHAPTER_RANGE_START + ((index + 0.5) / chapterCount) * range;
          trigger.scroll(trigger.start + (trigger.end - trigger.start) * targetProgress);
        }
        setActive(index);
      });
    });

    var panelCopyAndChips = chapterPanels.reduce(function (list, panel) {
      return list.concat(
        Array.prototype.slice.call(panel.querySelectorAll('[data-copy], [data-chip]'))
      );
    }, []);

    gsap.set(imageLayers, { autoAlpha: 0, xPercent: 0 });
    if (imageLayers[0]) gsap.set(imageLayers[0], { autoAlpha: 1 });
    gsap.set(chapterPanels, { autoAlpha: 0, xPercent: 0 });
    if (chapterPanels[0]) gsap.set(chapterPanels[0], { autoAlpha: 1 });
    gsap.set(panelCopyAndChips, { autoAlpha: 0, y: reducedMotion ? 0 : 14 });

    if (reducedMotion) {
      gsap.set(stage, { clipPath: 'inset(0% round 34px)', scale: 1, autoAlpha: 1 });
      if (overline) gsap.set(overline, { autoAlpha: 1, y: 0 });
      gsap.set(headlineLines, { autoAlpha: 1, yPercent: 0 });
      gsap.set(introDetails, { autoAlpha: 1, y: 0 });
      gsap.set(footerItems, { autoAlpha: 1, y: 0 });
      gsap.set(panelCopyAndChips, { autoAlpha: 1, y: 0 });
      if (imageLayers[0]) {
        var firstImg = imageLayers[0].querySelector('img');
        if (firstImg) gsap.set(firstImg, { scale: 1 });
      }
    } else {
      if (overline) gsap.set(overline, { autoAlpha: 0, y: 12 });
      gsap.set(headlineLines, { autoAlpha: 0, yPercent: 110 });
      gsap.set(introDetails, { autoAlpha: 0, y: 18 });
      gsap.set(footerItems, { autoAlpha: 0, y: 14 });
      gsap.set(stage, { clipPath: 'inset(18% 22% round 30px)', scale: 0.985, autoAlpha: 1 });
    }

    var floatTweens = !reducedMotion
      ? floatingChips.map(function (chip, index) {
          return gsap.to(chip, {
            y: -ABOUT_ANIM.floatDistances[index % ABOUT_ANIM.floatDistances.length],
            duration: ABOUT_ANIM.floatDurations[index % ABOUT_ANIM.floatDurations.length],
            delay: index * ABOUT_ANIM.floatDelayStep,
            ease: ABOUT_ANIM.floatEase,
            repeat: -1,
            yoyo: true,
            paused: true,
          });
        })
      : [];

    var timeline = gsap.timeline({
      defaults: { ease: ABOUT_ANIM.ease },
      scrollTrigger: {
        id: 'about-stage',
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: ABOUT_ANIM.scrub,
        invalidateOnRefresh: true,
        onEnter: function () {
          floatTweens.forEach(function (tween) { tween.play(); });
        },
        onEnterBack: function () {
          floatTweens.forEach(function (tween) { tween.play(); });
        },
        onLeave: function () {
          floatTweens.forEach(function (tween) { tween.pause(); });
        },
        onLeaveBack: function () {
          floatTweens.forEach(function (tween) { tween.pause(); });
        },
        onUpdate: function (self) {
          var nextIndex = getChapterIndex(self.progress);
          if (nextIndex !== activeIndex) setActive(nextIndex);

          var chapterProgress = gsap.utils.clamp(
            0,
            1,
            ((self.progress - CHAPTER_RANGE_START) / (CHAPTER_RANGE_END - CHAPTER_RANGE_START))
              * chapterCount - nextIndex
          );
          if (progressFill) gsap.set(progressFill, { scaleX: chapterProgress });
          if (progressBar) progressBar.setAttribute('aria-valuenow', String(Math.round(chapterProgress * 100)));
        },
      },
    });

    function revealChapter(index, position) {
      var panel = chapterPanels[index];
      if (!panel) return;
      var copy = Array.prototype.slice.call(panel.querySelectorAll('[data-copy]'));
      var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-chip]'));

      timeline
        .to(panel, {
          autoAlpha: 1,
          xPercent: 0,
          duration: ABOUT_ANIM.panelEnterDuration,
        }, position)
        .fromTo(
          copy,
          { autoAlpha: 0, y: reducedMotion ? 0 : 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reducedMotion ? ABOUT_ANIM.reducedFadeDuration : ABOUT_ANIM.panelCopyDuration,
            stagger: reducedMotion ? ABOUT_ANIM.reducedStagger : ABOUT_ANIM.panelCopyStagger,
          },
          position + ABOUT_ANIM.transitionOffset
        )
        .fromTo(
          chips,
          { autoAlpha: 0, y: reducedMotion ? 0 : 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reducedMotion ? ABOUT_ANIM.reducedFadeDuration : ABOUT_ANIM.chipRevealDuration,
            stagger: reducedMotion ? ABOUT_ANIM.reducedStagger : ABOUT_ANIM.chipRevealStagger,
          },
          position + ABOUT_ANIM.transitionOffset
        );
    }

    if (!reducedMotion) {
      var firstImage = imageLayers[0] && imageLayers[0].querySelector('img');
      timeline
        .fromTo(
          stage,
          { clipPath: 'inset(18% 22% round 30px)', scale: 0.985 },
          { clipPath: 'inset(0% 0% round 34px)', scale: 1, duration: ABOUT_ANIM.entryEnd },
          0
        );

      if (firstImage) {
        timeline.fromTo(
          firstImage,
          { scale: ABOUT_ANIM.imageScale },
          { scale: 1, duration: ABOUT_ANIM.entryEnd },
          0
        );
      }

      if (vignette) {
        timeline.fromTo(
          vignette,
          { autoAlpha: 0.74 },
          { autoAlpha: 1, duration: ABOUT_ANIM.entryEnd },
          0
        );
      }

      if (overline) {
        timeline.to(overline, {
          autoAlpha: 1,
          y: 0,
          duration: ABOUT_ANIM.introDuration,
        }, ABOUT_ANIM.headlineStart);
      }

      timeline
        .to(headlineLines, {
          autoAlpha: 1,
          yPercent: 0,
          duration: ABOUT_ANIM.headlineDuration,
          stagger: ABOUT_ANIM.headlineStagger,
        }, ABOUT_ANIM.headlineStart)
        .to(introDetails, {
          autoAlpha: 1,
          y: 0,
          duration: ABOUT_ANIM.introDuration,
          stagger: ABOUT_ANIM.introStagger,
        }, ABOUT_ANIM.introStart)
        .to(footerItems, {
          autoAlpha: 1,
          y: 0,
          duration: ABOUT_ANIM.footerDuration,
          stagger: ABOUT_ANIM.footerStagger,
        }, ABOUT_ANIM.footerStart);
    } else {
      if (overline) {
        timeline.to(overline, {
          autoAlpha: 1,
          duration: ABOUT_ANIM.reducedFadeDuration,
        }, 0);
      }

      timeline
        .to(headlineLines, {
          autoAlpha: 1,
          duration: ABOUT_ANIM.reducedFadeDuration,
          stagger: ABOUT_ANIM.reducedStagger,
        }, 0)
        .to(introDetails, {
          autoAlpha: 1,
          duration: ABOUT_ANIM.reducedFadeDuration,
          stagger: ABOUT_ANIM.reducedStagger,
        }, 0)
        .to(footerItems, {
          autoAlpha: 1,
          duration: ABOUT_ANIM.reducedFadeDuration,
          stagger: ABOUT_ANIM.reducedStagger,
        }, 0);
    }

    revealChapter(0, ABOUT_ANIM.firstChapterStart);

    for (var index = 1; index < chapterPanels.length; index += 1) {
      var transitionAt = index === 1 ? ABOUT_ANIM.chapterTwoAt : ABOUT_ANIM.chapterThreeAt;
      var previous = chapterPanels[index - 1];
      var next = chapterPanels[index];
      var previousImage = imageLayers[index - 1];
      var nextImage = imageLayers[index];
      var duration = ABOUT_ANIM.panelFadeDuration;

      timeline
        .to(previous, {
          autoAlpha: 0,
          xPercent: reducedMotion ? 0 : -2,
          duration: duration,
        }, transitionAt)
        .fromTo(
          next,
          { autoAlpha: 0, xPercent: reducedMotion ? 0 : 2 },
          { autoAlpha: 1, xPercent: 0, duration: duration },
          transitionAt
        );

      if (previousImage) {
        timeline.to(previousImage, {
          autoAlpha: 0,
          xPercent: reducedMotion ? 0 : -1.5,
          duration: duration,
        }, transitionAt);
      }

      if (nextImage) {
        timeline.fromTo(
          nextImage,
          { autoAlpha: 0, xPercent: reducedMotion ? 0 : 1.5 },
          { autoAlpha: 1, xPercent: 0, duration: duration },
          transitionAt
        );

        var nextImgEl = nextImage.querySelector('img');
        if (nextImgEl) {
          timeline.fromTo(
            nextImgEl,
            { scale: reducedMotion ? 1 : ABOUT_ANIM.chapterImageScale },
            {
              scale: 1,
              duration: reducedMotion
                ? ABOUT_ANIM.reducedFadeDuration
                : ABOUT_ANIM.chapterImageSettleDuration,
            },
            transitionAt + ABOUT_ANIM.transitionOffset
          );
        }
      }

      if (indicator) {
        timeline.to(indicator, { xPercent: index * 100, duration: duration }, transitionAt);
      }

      revealChapter(index, transitionAt + ABOUT_ANIM.transitionOffset);
    }

    timeline.to(stage, {
      scale: reducedMotion ? 1 : 0.96,
      autoAlpha: 0,
      clipPath: reducedMotion ? 'inset(0% round 34px)' : 'inset(3% round 42px)',
      duration: 1 - ABOUT_ANIM.exitStart,
      ease: ABOUT_ANIM.ease,
    }, ABOUT_ANIM.exitStart);
  }

  function initServicesShowcase() {
    var section = document.getElementById('services');
    if (!section) return;

    var slides = Array.prototype.slice.call(section.querySelectorAll('.showcase-slide'));
    if (!slides.length) return;

    var progressFill = section.querySelector('.showcase-progress-fill');
    var progressStep = section.querySelector('.showcase-progress-step');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobile = window.matchMedia('(max-width: 600px)').matches;
    var travel = reducedMotion ? 0 : 90;
    var rotation = reducedMotion ? 0 : mobile ? 5 : 9;
    var travelDuration = reducedMotion ? 0.12 : 0.85;
    var stageGap = 1.2;

    gsap.context(function () {
      slides.forEach(function (slide, index) {
        var left = slide.querySelector('.showcase-image--left');
        var right = slide.querySelector('.showcase-image--right');
        var content = slide.querySelector('.showcase-content');
        var isFirst = index === 0;

        gsap.set(slide, {
          autoAlpha: isFirst ? 1 : 0,
          pointerEvents: 'none',
        });
        if (left) {
          gsap.set(left, {
            autoAlpha: 0,
            xPercent: -travel,
            yPercent: mobile ? 0 : -46,
            y: isFirst ? 24 : 38,
            rotation: isFirst ? -rotation : rotation,
            scale: 0.91,
          });
        }
        if (right) {
          gsap.set(right, {
            autoAlpha: 0,
            xPercent: travel,
            yPercent: mobile ? 0 : -54,
            y: isFirst ? 32 : 20,
            rotation: isFirst ? rotation : -rotation,
            scale: 0.91,
          });
        }
        if (content) {
          gsap.set(content, {
            autoAlpha: isFirst ? 1 : 0,
            xPercent: -50,
            yPercent: -50,
            y: 22,
          });
        }
      });

      var timelineDuration = (slides.length - 1) * stageGap + travelDuration + 0.06;
      var tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? true : 0.8,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var elapsed = self.progress * timelineDuration;
            var activeIndex = Math.min(
              slides.length - 1,
              Math.floor(elapsed / stageGap)
            );
            slides.forEach(function (slide, index) {
              var isActive = index === activeIndex;
              slide.style.pointerEvents = isActive ? 'auto' : 'none';
              slide.setAttribute('aria-hidden', String(!isActive));
            });
            if (progressStep) {
              progressStep.textContent = '0' + (activeIndex + 1) + ' / 0' + slides.length;
            }
            if (progressFill) gsap.set(progressFill, { scaleX: self.progress });
          },
        },
      });

      function enter(slide, position) {
        var left = slide.querySelector('.showcase-image--left');
        var right = slide.querySelector('.showcase-image--right');
        var content = slide.querySelector('.showcase-content');

        tl.to(slide, { autoAlpha: 1, duration: 0.01 }, position);
        if (left) {
          tl.to(left, {
            autoAlpha: 1,
            xPercent: 0,
            y: 0,
            rotation: -rotation * 0.65,
            scale: 1,
            duration: travelDuration,
          }, position);
        }
        if (right) {
          tl.to(right, {
            autoAlpha: 1,
            xPercent: 0,
            y: 0,
            rotation: rotation * 0.65,
            scale: 1,
            duration: travelDuration,
          }, position + 0.06);
        }
        if (content) {
          tl.to(content, {
            autoAlpha: 1,
            xPercent: -50,
            yPercent: -50,
            y: 0,
            duration: travelDuration * 0.78,
          }, position + 0.12);
        }
      }

      function leave(slide, position) {
        var left = slide.querySelector('.showcase-image--left');
        var right = slide.querySelector('.showcase-image--right');
        var content = slide.querySelector('.showcase-content');

        if (left) {
          tl.to(left, {
            autoAlpha: 0,
            xPercent: -travel,
            y: -42,
            rotation: -rotation * 1.5,
            scale: 0.9,
            duration: travelDuration,
          }, position);
        }
        if (right) {
          tl.to(right, {
            autoAlpha: 0,
            xPercent: travel,
            y: 40,
            rotation: rotation * 1.5,
            scale: 0.9,
            duration: travelDuration,
          }, position);
        }
        if (content) {
          tl.to(content, {
            autoAlpha: 0,
            xPercent: -50,
            yPercent: -50,
            y: -18,
            duration: travelDuration * 0.68,
          }, position);
        }
      }

      enter(slides[0], 0);
      for (var index = 1; index < slides.length; index += 1) {
        var transitionAt = index * stageGap;
        leave(slides[index - 1], transitionAt);
        enter(slides[index], transitionAt);
      }
    }, section);
  }

  function initClosing() {
    var copy = document.querySelector('.closing-copy');
    if (!copy) return;
    gsap.from(copy, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      scrollTrigger: { trigger: copy, start: 'top 70%', once: true },
    });
  }
})();
