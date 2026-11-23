import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CAMERA_Z = 9;
const CAMERA_FOV = 36;
const MODEL_HEIGHT = 3;
const NAV_TRANSITION_START = 6.6;
const NAV_TRANSITION_DURATION = 3.4;

export default function ScrollController({
  storyRef,
  stateRef,
  logoSlotRef,
  navWordmarkRef,
  heroRef,
  heroWordmarkRef,
  heroEyebrowRef,
  heroSupportRef,
  revealRef,
  progressRef,
}) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const state = stateRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measureDestinations = () => {
      const slot = logoSlotRef.current;
      const title = heroWordmarkRef.current;
      const wordmark = navWordmarkRef.current;
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const visibleHeight = 2 * CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360);

      if (slot) {
        const bounds = slot.getBoundingClientRect();
        state.navX = ((bounds.left + bounds.width / 2) / width - 0.5) * visibleHeight * (width / height);
        state.navY = (0.5 - (bounds.top + bounds.height / 2) / height) * visibleHeight;
        state.navScale = Math.max(0.01, (bounds.height / height) * (visibleHeight / MODEL_HEIGHT));
      }

      if (!title || !wordmark) return;

      const titleBounds = title.getBoundingClientRect();
      const wordmarkBounds = wordmark.getBoundingClientRect();
      const titleX = Number(gsap.getProperty(title, 'x')) || 0;
      const titleY = Number(gsap.getProperty(title, 'y')) || 0;
      const titleScaleY = Number(gsap.getProperty(title, 'scaleY')) || 1;

      state.wordmarkX = wordmarkBounds.left - (titleBounds.left - titleX);
      state.wordmarkY = wordmarkBounds.top - (titleBounds.top - titleY);
      state.wordmarkScale = wordmarkBounds.height / (titleBounds.height / titleScaleY);
    };

    measureDestinations();
    window.addEventListener('resize', measureDestinations);

    if (!storyRef.current || reducedMotion) {
      state.emergence = 1;
      state.assembly = 1;
      state.turn = 0;
      state.travel = 0;
      gsap.set(navWordmarkRef.current, { autoAlpha: 0 });

      return () => window.removeEventListener('resize', measureDestinations);
    }

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: storyRef.current,
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
      .to(revealRef.current, { autoAlpha: 1, duration: 0.25 }, 3.15)
      .to(revealRef.current, { autoAlpha: 0, duration: 0.3 }, 4.65)
      .to(heroEyebrowRef.current, { autoAlpha: 0, y: -10, duration: 0.4 }, NAV_TRANSITION_START)
      .to(heroSupportRef.current, { autoAlpha: 0, y: -18, duration: 0.45 }, NAV_TRANSITION_START)
      .to(
        heroWordmarkRef.current,
        {
          x: () => state.wordmarkX,
          y: () => state.wordmarkY,
          scale: () => state.wordmarkScale,
          duration: NAV_TRANSITION_DURATION,
          ease: 'power2.inOut',
        },
        NAV_TRANSITION_START,
      )
      .to(
        state,
        { travel: 1, duration: NAV_TRANSITION_DURATION, ease: 'power2.inOut' },
        NAV_TRANSITION_START,
      )
      .to(navWordmarkRef.current, { autoAlpha: 1, duration: 0.22 }, 9.82)
      .to(heroRef.current, { autoAlpha: 0, duration: 0.22 }, 9.82)
      .to(progressRef.current, { autoAlpha: 0, duration: 0.28 }, 11.45);

    return () => {
      window.removeEventListener('resize', measureDestinations);
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [
    storyRef,
    stateRef,
    logoSlotRef,
    navWordmarkRef,
    heroRef,
    heroWordmarkRef,
    heroEyebrowRef,
    heroSupportRef,
    revealRef,
    progressRef,
  ]);

  return null;
}
