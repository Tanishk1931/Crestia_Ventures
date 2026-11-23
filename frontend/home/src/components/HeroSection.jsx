import { forwardRef } from 'react';
import { brand } from '../data/brand.js';

const HeroSection = forwardRef(function HeroSection(
  { wordmarkRef, eyebrowRef, supportRef },
  ref,
) {
  return (
    <section ref={ref} className="hero-copy" aria-label="Brand introduction">
      <p className="eyebrow hero-eyebrow" ref={eyebrowRef}>
        <span className="eyebrow-rule" />
        {brand.category}
      </p>
      <div className="hero-wordmark" ref={wordmarkRef} aria-label={brand.name}>
        <span className="wordmark-line">CRESTIA</span>
        <span className="wordmark-divider" aria-hidden="true" />
        <span className="wordmark-line">VENTURES</span>
      </div>
      <div className="hero-support" ref={supportRef}>
        <h1 className="hero-headline">
          <span>Stronger operations.</span>
          <span>Better talent.</span>
        </h1>
        <p className="hero-description">{brand.introduction}</p>
        <a href="#brand-story" className="scroll-cue">
          <span>Scroll to discover</span>
          <span className="scroll-cue-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
});

export default HeroSection;
