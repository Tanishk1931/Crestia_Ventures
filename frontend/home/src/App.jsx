import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './components/HeroSection.jsx';
import LogoReveal from './components/LogoReveal.jsx';
import AboutStage from './components/AboutStage.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ScrollController from './components/ScrollController.jsx';
import ShaderBackground from './components/ui/ShaderBackground.jsx';
import { brand } from './data/brand.js';

const LogoAssembly = lazy(() => import('./components/LogoAssembly.jsx'));

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const storyRef = useRef(null);
  const logoSlotRef = useRef(null);
  const navWordmarkRef = useRef(null);
  const heroRef = useRef(null);
  const heroWordmarkRef = useRef(null);
  const heroEyebrowRef = useRef(null);
  const heroSupportRef = useRef(null);
  const revealRef = useRef(null);
  const progressRef = useRef(null);
  const animationState = useRef({
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
  });

  useEffect(() => {
    let idleCallbackId;
    let timeoutId;
    const loadScene = () => setSceneReady(true);

    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(loadScene, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(loadScene, 0);
    }

    return () => {
      if (idleCallbackId !== undefined) window.cancelIdleCallback(idleCallbackId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <ShaderBackground className="shader-background-canvas" />

      <Navbar logoSlotRef={logoSlotRef} wordmarkRef={navWordmarkRef} />
      {sceneReady && (
        <Suspense fallback={null}>
          <LogoAssembly animationState={animationState} />
        </Suspense>
      )}

      <main>
        <div className="story-track" ref={storyRef} id="brand-story">
          <HeroSection
            ref={heroRef}
            wordmarkRef={heroWordmarkRef}
            eyebrowRef={heroEyebrowRef}
            supportRef={heroSupportRef}
          />
          <LogoReveal revealRef={revealRef} />
          <div ref={progressRef} className="story-progress-label" aria-hidden="true">
            <span>Scroll to explore</span>
            <span className="progress-line" />
          </div>
        </div>

        <AboutStage />
        <ServicesSection />

        <section className="closing-section" id="contact">
          <motion.div
            className="closing-copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow"><span className="eyebrow-rule" />The next chapter starts here</p>
            <h2>Let’s make<br />something matter.</h2>
            <a href={`mailto:${brand.contactEmail}`} className="closing-link">
              Say hello <span aria-hidden="true">↗</span>
            </a>
          </motion.div>
          <div className="closing-footer">
            <span>{brand.shortName}</span>
            <span>Independent by design · Est. 20XX</span>
            <a href="#brand-story">Back to the beginning ↑</a>
          </div>
        </section>
      </main>

      <Footer />

      <ScrollController
        storyRef={storyRef}
        stateRef={animationState}
        logoSlotRef={logoSlotRef}
        navWordmarkRef={navWordmarkRef}
        heroRef={heroRef}
        heroWordmarkRef={heroWordmarkRef}
        heroEyebrowRef={heroEyebrowRef}
        heroSupportRef={heroSupportRef}
        revealRef={revealRef}
        progressRef={progressRef}
      />
    </>
  );
}
