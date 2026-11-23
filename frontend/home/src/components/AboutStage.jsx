import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutStage.module.css';

const ABOUT = {
  animation: {
    scrollLengthVh: 250,
    scrub: 1,
    ease: 'power2.inOut',
    pointerEase: 'power2.out',
    floatEase: 'sine.inOut',
    magneticEase: 'elastic.out(1, 0.55)',
    uiEase: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    microDurationMs: 220,
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
    cursorDuration: 0.2,
    magneticDuration: 0.32,
    cursorFadeDuration: 0.2,
    magneticRadius: 80,
    magneticStrength: 0.18,
    pointerDepth: 12,
    swipeThreshold: 48,
    floatDurations: [6.8, 7.7, 8.6],
    floatDistances: [5, 7, 9],
    tabJumpBehavior: 'smooth',
  },
  images: {
    revenue: {
      src: '/about/rcm-1600.webp',
      srcSet: '/about/rcm-800.webp 800w, /about/rcm-1600.webp 1600w',
      alt: 'Hands reviewing documents beside a laptop in warm daylight',
    },
    it: {
      src: '/about/it-1600.webp',
      srcSet: '/about/it-800.webp 800w, /about/it-1600.webp 1600w',
      alt: 'A team working around laptops at a shared desk',
    },
    healthcare: {
      src: '/about/healthcare-1600.webp',
      srcSet: '/about/healthcare-800.webp 800w, /about/healthcare-1600.webp 1600w',
      alt: 'A clinician in a white coat using a phone with a stethoscope',
    },
  },
  chapters: [
    {
      id: 'revenue',
      tab: 'Revenue Cycle',
      title: 'Revenue Cycle Management',
      description: 'Move from fragmented billing activity to connected revenue operations.',
      chips: [
        'Eligibility',
        'Coding support',
        'Claims',
        'Denials',
        'AR follow-up',
        'Payment posting',
        'Credentialing',
        'Reporting',
      ],
    },
    {
      id: 'it',
      tab: 'IT Staffing',
      title: 'IT Recruitment & Staffing',
      description: 'Build the capacity to deliver technology projects with confidence.',
      chips: [
        'Software',
        'Cloud & DevOps',
        'Data & Analytics',
        'Cybersecurity',
        'Enterprise platforms',
        'Infrastructure & Support',
      ],
    },
    {
      id: 'healthcare',
      tab: 'Healthcare',
      title: 'Healthcare Recruitment',
      description: 'Support clinical and non-clinical workforce priorities.',
      chips: [
        'Nursing',
        'Allied health',
        'Clinical support',
        'Administration',
        'RCM professionals',
        'Healthcare IT',
      ],
    },
  ],
};

// Unsplash photos used under the Unsplash License: https://unsplash.com/license
const ABOUT_IMAGES = ABOUT.images;
const CHAPTER_RANGE_START = ABOUT.animation.entryEnd;
const CHAPTER_RANGE_END = ABOUT.animation.exitStart;

function getChapterIndex(progress) {
  if (progress < ABOUT.animation.chapterTwoAt) return 0;
  if (progress < ABOUT.animation.chapterThreeAt) return 1;
  return 2;
}

export default function AboutStage() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const imageDepthRef = useRef(null);
  const vignetteRef = useRef(null);
  const cursorRef = useRef(null);
  const ctaRef = useRef(null);
  const progressFillRef = useRef(null);
  const progressBarRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const touchStartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const jumpToChapter = useCallback((index) => {
    const trigger = ScrollTrigger.getById('about-stage');
    if (!trigger) return;

    const range = CHAPTER_RANGE_END - CHAPTER_RANGE_START;
    const targetProgress = CHAPTER_RANGE_START + ((index + 0.5) / ABOUT.chapters.length) * range;
    const target = trigger.start + targetProgress * (trigger.end - trigger.start);

    window.scrollTo({
      top: target,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : ABOUT.animation.tabJumpBehavior,
    });
  }, []);

  const handleTabKeyDown = useCallback((event, index) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % ABOUT.chapters.length;
    if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + ABOUT.chapters.length) % ABOUT.chapters.length;
    }
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = ABOUT.chapters.length - 1;
    if (nextIndex === index) return;

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    jumpToChapter(nextIndex);
  }, [jumpToChapter]);

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    touchStartRef.current = null;
    if (Math.abs(deltaX) < ABOUT.animation.swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;

    const direction = deltaX < 0 ? 1 : -1;
    jumpToChapter(Math.max(0, Math.min(ABOUT.chapters.length - 1, activeIndexRef.current + direction)));
  };

  useEffect(() => {
    const image = ABOUT_IMAGES.revenue;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = image.src;
    link.setAttribute('imagesrcset', image.srcSet);
    link.setAttribute('imagesizes', '(max-width: 600px) 100vw, 1600px');
    link.dataset.aboutImagePreload = 'true';
    document.head.appendChild(link);

    return () => link.remove();
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const imageLayers = gsap.utils.toArray(`.${styles.imageLayer}`, stage);
    const chapterPanels = gsap.utils.toArray(`.${styles.chapterPanel}`, stage);
    const headlineLines = gsap.utils.toArray('[data-headline-line]', stage);
    const introDetails = gsap.utils.toArray('[data-intro-detail]', stage);
    const footerItems = gsap.utils.toArray('[data-footer-item]', stage);
    const floatingChips = gsap.utils.toArray('[data-float-chip]', stage);
    const interactionCleanups = [];
    const context = gsap.context(() => {
      const floatTweens = !reducedMotion
        ? floatingChips.map((chip, index) => gsap.to(chip, {
          y: -ABOUT.animation.floatDistances[index % ABOUT.animation.floatDistances.length],
          duration: ABOUT.animation.floatDurations[index % ABOUT.animation.floatDurations.length],
          delay: index * ABOUT.animation.floatDelayStep,
          ease: ABOUT.animation.floatEase,
          repeat: -1,
          yoyo: true,
          paused: true,
        }))
        : [];

      gsap.set(imageLayers, { autoAlpha: 0, xPercent: 0 });
      gsap.set(imageLayers[0], { autoAlpha: 1 });
      if (reducedMotion) {
        gsap.set(imageLayers.map((layer) => layer.querySelector('img')), { scale: 1 });
      }
      gsap.set(chapterPanels, { autoAlpha: 0, xPercent: 0 });
      gsap.set(chapterPanels[0], { autoAlpha: 1 });
      gsap.set(chapterPanels.flatMap((panel) => [...panel.querySelectorAll('[data-copy], [data-chip]')]), {
        autoAlpha: 0,
        y: reducedMotion ? 0 : 14,
      });

      if (reducedMotion) {
        gsap.set(stage, { clipPath: 'inset(0% round 34px)', scale: 1, autoAlpha: 1 });
        gsap.set(headlineLines, { autoAlpha: 1, yPercent: 0 });
        gsap.set(introDetails, { autoAlpha: 1, y: 0 });
        gsap.set(footerItems, { autoAlpha: 1, y: 0 });
        gsap.set(chapterPanels.flatMap((panel) => [...panel.querySelectorAll('[data-copy], [data-chip]')]), {
          autoAlpha: 1,
          y: 0,
        });
      } else {
        gsap.set(headlineLines, { autoAlpha: 0, yPercent: 110 });
        gsap.set(introDetails, { autoAlpha: 0, y: 18 });
        gsap.set(footerItems, { autoAlpha: 0, y: 14 });
        gsap.set(stage, { clipPath: 'inset(18% 22% round 30px)', scale: 0.985, autoAlpha: 1 });
      }

      const timeline = gsap.timeline({
        defaults: { ease: ABOUT.animation.ease },
        scrollTrigger: {
          id: 'about-stage',
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: ABOUT.animation.scrub,
          invalidateOnRefresh: true,
          onEnter: () => floatTweens.forEach((tween) => tween.play()),
          onEnterBack: () => floatTweens.forEach((tween) => tween.play()),
          onLeave: () => floatTweens.forEach((tween) => tween.pause()),
          onLeaveBack: () => floatTweens.forEach((tween) => tween.pause()),
          onUpdate: (self) => {
            const nextIndex = getChapterIndex(self.progress);
            if (nextIndex !== activeIndexRef.current) {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            }

            const chapterProgress = gsap.utils.clamp(
              0,
              1,
              ((self.progress - CHAPTER_RANGE_START) / (CHAPTER_RANGE_END - CHAPTER_RANGE_START))
                * ABOUT.chapters.length - nextIndex,
            );
            gsap.set(progressFillRef.current, { scaleX: chapterProgress });
            progressBarRef.current?.setAttribute(
              'aria-valuenow',
              String(Math.round(chapterProgress * 100)),
            );
          },
        },
      });

      if (!reducedMotion) {
        timeline
          .fromTo(
            stage,
            { clipPath: 'inset(18% 22% round 30px)', scale: 0.985 },
            { clipPath: 'inset(0% 0% round 34px)', scale: 1, duration: ABOUT.animation.entryEnd },
            0,
          )
          .fromTo(
            imageLayers[0].querySelector('img'),
            { scale: ABOUT.animation.imageScale },
            { scale: 1, duration: ABOUT.animation.entryEnd },
            0,
          )
          .fromTo(vignetteRef.current, { autoAlpha: 0.74 }, { autoAlpha: 1, duration: ABOUT.animation.entryEnd }, 0)
          .to(headlineLines, {
            autoAlpha: 1,
            yPercent: 0,
            duration: ABOUT.animation.headlineDuration,
            stagger: ABOUT.animation.headlineStagger,
          }, ABOUT.animation.headlineStart)
          .to(introDetails, {
            autoAlpha: 1,
            y: 0,
            duration: ABOUT.animation.introDuration,
            stagger: ABOUT.animation.introStagger,
          }, ABOUT.animation.introStart)
          .to(footerItems, {
            autoAlpha: 1,
            y: 0,
            duration: ABOUT.animation.footerDuration,
            stagger: ABOUT.animation.footerStagger,
          }, ABOUT.animation.footerStart);
      } else {
        timeline
          .to(headlineLines, {
            autoAlpha: 1,
            duration: ABOUT.animation.reducedFadeDuration,
            stagger: ABOUT.animation.reducedStagger,
          }, 0)
          .to(introDetails, {
            autoAlpha: 1,
            duration: ABOUT.animation.reducedFadeDuration,
            stagger: ABOUT.animation.reducedStagger,
          }, 0)
          .to(footerItems, {
            autoAlpha: 1,
            duration: ABOUT.animation.reducedFadeDuration,
            stagger: ABOUT.animation.reducedStagger,
          }, 0);
      }

      const revealChapter = (index, position) => {
        const copy = [...chapterPanels[index].querySelectorAll('[data-copy]')];
        const chips = [...chapterPanels[index].querySelectorAll('[data-chip]')];
        timeline
          .to(chapterPanels[index], {
            autoAlpha: 1,
            xPercent: 0,
            duration: ABOUT.animation.panelEnterDuration,
          }, position)
          .fromTo(
            copy,
            { autoAlpha: 0, y: reducedMotion ? 0 : 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: reducedMotion
                ? ABOUT.animation.reducedFadeDuration
                : ABOUT.animation.panelCopyDuration,
              stagger: reducedMotion
                ? ABOUT.animation.reducedStagger
                : ABOUT.animation.panelCopyStagger,
            },
            position + ABOUT.animation.transitionOffset,
          )
          .fromTo(
            chips,
            { autoAlpha: 0, y: reducedMotion ? 0 : 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: reducedMotion
                ? ABOUT.animation.reducedFadeDuration
                : ABOUT.animation.chipRevealDuration,
              stagger: reducedMotion
                ? ABOUT.animation.reducedStagger
                : ABOUT.animation.chipRevealStagger,
            },
            position + ABOUT.animation.transitionOffset,
          );
      };

      revealChapter(0, ABOUT.animation.firstChapterStart);
      for (let index = 1; index < chapterPanels.length; index += 1) {
        const transitionAt = index === 1
          ? ABOUT.animation.chapterTwoAt
          : ABOUT.animation.chapterThreeAt;
        const previous = chapterPanels[index - 1];
        const next = chapterPanels[index];
        const previousImage = imageLayers[index - 1];
        const nextImage = imageLayers[index];
        const duration = ABOUT.animation.panelFadeDuration;

        timeline
          .to(previous, {
            autoAlpha: 0,
            xPercent: reducedMotion ? 0 : -2,
            duration,
          }, transitionAt)
          .fromTo(
            next,
            { autoAlpha: 0, xPercent: reducedMotion ? 0 : 2 },
            { autoAlpha: 1, xPercent: 0, duration },
            transitionAt,
          )
          .to(previousImage, {
            autoAlpha: 0,
            xPercent: reducedMotion ? 0 : -1.5,
            duration,
          }, transitionAt)
          .fromTo(
            nextImage,
            { autoAlpha: 0, xPercent: reducedMotion ? 0 : 1.5 },
            { autoAlpha: 1, xPercent: 0, duration },
            transitionAt,
          )
          .to(indicatorRef.current, { xPercent: index * 100, duration }, transitionAt);

        timeline.fromTo(
          imageLayers[index].querySelector('img'),
          { scale: reducedMotion ? 1 : ABOUT.animation.chapterImageScale },
          {
            scale: 1,
            duration: reducedMotion
              ? ABOUT.animation.reducedFadeDuration
              : ABOUT.animation.chapterImageSettleDuration,
          },
          transitionAt + ABOUT.animation.transitionOffset,
        );
        revealChapter(index, transitionAt + ABOUT.animation.transitionOffset);
      }

      timeline
        .to(stage, {
          scale: reducedMotion ? 1 : 0.96,
          autoAlpha: 0,
          clipPath: reducedMotion ? 'inset(0% round 34px)' : 'inset(3% round 42px)',
          duration: 1 - ABOUT.animation.exitStart,
          ease: ABOUT.animation.ease,
        }, ABOUT.animation.exitStart);

      if (desktopPointer && !reducedMotion) {
        const cursor = cursorRef.current;
        const depth = imageDepthRef.current;
        const cta = ctaRef.current;
        const cursorX = gsap.quickTo(cursor, 'x', {
          duration: ABOUT.animation.cursorDuration,
          ease: ABOUT.animation.pointerEase,
        });
        const cursorY = gsap.quickTo(cursor, 'y', {
          duration: ABOUT.animation.cursorDuration,
          ease: ABOUT.animation.pointerEase,
        });
        const depthX = gsap.quickTo(depth, 'x', {
          duration: ABOUT.animation.cursorDuration,
          ease: ABOUT.animation.pointerEase,
        });
        const depthY = gsap.quickTo(depth, 'y', {
          duration: ABOUT.animation.cursorDuration,
          ease: ABOUT.animation.pointerEase,
        });
        const ctaX = gsap.quickTo(cta, 'x', {
          duration: ABOUT.animation.magneticDuration,
          ease: ABOUT.animation.magneticEase,
        });
        const ctaY = gsap.quickTo(cta, 'y', {
          duration: ABOUT.animation.magneticDuration,
          ease: ABOUT.animation.magneticEase,
        });
        let ctaBounds = null;

        const onStageEnter = () => gsap.to(cursor, {
          autoAlpha: 1,
          duration: ABOUT.animation.cursorFadeDuration,
        });
        const onStageLeave = () => {
          gsap.to(cursor, {
            autoAlpha: 0,
            duration: ABOUT.animation.cursorFadeDuration,
          });
          depthX(0);
          depthY(0);
        };
        const onStageMove = (event) => {
          const bounds = stage.getBoundingClientRect();
          const localX = event.clientX - bounds.left;
          const localY = event.clientY - bounds.top;
          cursorX(localX);
          cursorY(localY);
          depthX(-((localX / bounds.width) - 0.5) * ABOUT.animation.pointerDepth * 2);
          depthY(-((localY / bounds.height) - 0.5) * ABOUT.animation.pointerDepth * 2);
        };
        const onCtaEnter = () => {
          ctaBounds = cta.getBoundingClientRect();
        };
        const onCtaMove = (event) => {
          if (!ctaBounds) return;
          const deltaX = event.clientX - (ctaBounds.left + ctaBounds.width / 2);
          const deltaY = event.clientY - (ctaBounds.top + ctaBounds.height / 2);
          const distance = Math.hypot(deltaX, deltaY);
          if (distance > ABOUT.animation.magneticRadius) {
            ctaX(0);
            ctaY(0);
            return;
          }

          const pull =
            (ABOUT.animation.magneticRadius - distance) / ABOUT.animation.magneticRadius
            * ABOUT.animation.magneticStrength;
          ctaX(deltaX * pull);
          ctaY(deltaY * pull);
        };
        const onCtaLeave = () => {
          ctaBounds = null;
          ctaX(0);
          ctaY(0);
        };

        gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        stage.addEventListener('pointerenter', onStageEnter);
        stage.addEventListener('pointerleave', onStageLeave);
        stage.addEventListener('pointermove', onStageMove);
        cta.addEventListener('pointerenter', onCtaEnter);
        cta.addEventListener('pointermove', onCtaMove);
        cta.addEventListener('pointerleave', onCtaLeave);

        interactionCleanups.push(() => {
          stage.removeEventListener('pointerenter', onStageEnter);
          stage.removeEventListener('pointerleave', onStageLeave);
          stage.removeEventListener('pointermove', onStageMove);
          cta.removeEventListener('pointerenter', onCtaEnter);
          cta.removeEventListener('pointermove', onCtaMove);
          cta.removeEventListener('pointerleave', onCtaLeave);
          gsap.killTweensOf([cursor, depth, cta]);
        });
      }
    }, track);

    return () => {
      interactionCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  const onTouchStart = (event) => handleTouchStart(event);
  const onTouchEnd = (event) => handleTouchEnd(event);

  return (
    <section
      className={styles.track}
      id="company-card"
      ref={trackRef}
      aria-label="A little about us"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        '--scroll-length': `${ABOUT.animation.scrollLengthVh}vh`,
        '--micro-duration': `${ABOUT.animation.microDurationMs}ms`,
        '--ui-ease': ABOUT.animation.uiEase,
      }}
    >
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.imageDepth} ref={imageDepthRef}>
          {Object.values(ABOUT_IMAGES).map((image, index) => (
            <div
              className={styles.imageLayer}
              key={image.src}
              aria-hidden={activeIndex !== index}
            >
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="(max-width: 600px) 100vw, 1600px"
                alt={image.alt}
                width="1600"
                height="1067"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div className={styles.vignette} ref={vignetteRef} />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.content}>
          <header className={styles.intro}>
            <div className={styles.overline}>
              <span className={styles.eyebrow}>A LITTLE ABOUT US</span>
              <span className={styles.counter} aria-live="polite">
                0{activeIndex + 1} / 03
              </span>
            </div>
            <h2 className={styles.headline}>
              <span className={styles.headlineMask}>
                <span data-headline-line>Stronger operations.</span>
              </span>
              <span className={styles.headlineMask}>
                <span data-headline-line>Better talent.</span>
              </span>
            </h2>
            <p className={styles.subcopy} data-intro-detail>
              An integrated partner for healthcare revenue operations, technology recruitment, and healthcare workforce solutions.
            </p>
            <p className={styles.positioning} data-intro-detail>
              Purpose-built for the U.S. market.
            </p>
          </header>

          <div className={styles.chapterArea}>
            {ABOUT.chapters.map((chapter, index) => (
              <article
                className={styles.chapterPanel}
                key={chapter.id}
                id={`about-panel-${chapter.id}`}
                role="tabpanel"
                aria-labelledby={`about-tab-${chapter.id}`}
                aria-hidden={activeIndex !== index}
                tabIndex={activeIndex === index ? 0 : -1}
              >
                <h3 className={styles.chapterTitle}>
                  <span data-copy>{chapter.title}</span>
                </h3>
                <p className={styles.chapterDescription}>
                  <span data-copy>{chapter.description}</span>
                </p>
                <div className={styles.chips}>
                  {chapter.chips.map((chip, chipIndex) => (
                    <span
                      className={styles.chipFloat}
                      key={chip}
                      data-float-chip={chipIndex < 3 ? '' : undefined}
                    >
                      <span className={styles.chip} data-chip>{chip}</span>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <footer className={styles.footer}>
            <p className={styles.closingLine} data-footer-item>
              One relationship. Three ways to move your business forward.
            </p>
            <a
              className={styles.cta}
              href="#contact"
              ref={ctaRef}
              data-footer-item
            >
              Explore our world <span aria-hidden="true">↗</span>
            </a>
            <div className={styles.chapterControls} data-footer-item>
              <div
                className={styles.chapterProgress}
                ref={progressBarRef}
                role="progressbar"
                aria-label="Chapter progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0"
              >
                <span className={styles.chapterProgressFill} ref={progressFillRef} />
              </div>
              <div
                className={styles.tabList}
                role="tablist"
                aria-label="About divisions"
              >
                <span className={styles.tabIndicator} ref={indicatorRef} aria-hidden="true" />
                {ABOUT.chapters.map((chapter, index) => (
                  <button
                    className={styles.tab}
                    key={chapter.id}
                    id={`about-tab-${chapter.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeIndex === index}
                    aria-controls={`about-panel-${chapter.id}`}
                    tabIndex={activeIndex === index ? 0 : -1}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    onClick={() => jumpToChapter(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    {chapter.tab}
                  </button>
                ))}
              </div>
            </div>
          </footer>
        </div>

        <div className={styles.cursor} ref={cursorRef} aria-hidden="true">
          Explore
        </div>
      </div>
    </section>
  );
}
