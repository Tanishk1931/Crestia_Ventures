import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowUpRight, BriefcaseMedical, UsersRound } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import TransformingRecruitment from './TransformingRecruitment.jsx';
import HealthcareSpecializations from './HealthcareSpecializations.jsx';
import RecruitmentProcess from './RecruitmentProcess.jsx';
import './medical-cards.css';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const headingSequence = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.92,
      staggerChildren: 0.29,
    },
  },
};

const headingWord = {
  hidden: { opacity: 0, y: 18, transition: { duration: 0.01 } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.18, 0.8, 0.24, 1] },
  },
};

const cardEntrance = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 },
};

function FlipCard({ item, destination, reduceMotion, sectionInView }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = item.Icon;

  function toggleCard(event) {
    if (event.target.closest('a, button')) return;
    setFlipped((current) => !current);
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFlipped((current) => !current);
    }
  }

  return (
    <motion.div
      className="medical-choice-entry"
      variants={cardEntrance}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || sectionInView ? 'visible' : 'hidden'}
      transition={{
        duration: reduceMotion || !sectionInView ? 0.01 : 1.4,
        delay: 0,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      <article
        className={`medical-choice-card medical-choice-card--${item.id}`}
        role="group"
        tabIndex={0}
        aria-label={`${item.title} card. Press Enter or Space to flip.`}
        aria-expanded={flipped}
        onClick={toggleCard}
        onKeyDown={handleKeyDown}
      >
        <div className={`medical-choice-flipper${flipped ? ' is-flipped' : ''}`}>
          <div className="medical-choice-face medical-choice-front" aria-hidden={flipped} inert={flipped}>
            <img
              className="medical-choice-image"
              src={item.image}
              alt={item.imageAlt}
              loading="lazy"
            />
            <div className="medical-choice-front-content">
              <Icon className="medical-choice-icon" size={25} strokeWidth={1.7} aria-hidden="true" />
              <h3>{item.title}</h3>
              <span className="medical-choice-accent-line" aria-hidden="true"></span>
              <span className="medical-choice-hint">
                Click to explore
                <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="medical-choice-face medical-choice-back" aria-hidden={!flipped} inert={!flipped}>
            <div className="medical-choice-back-content">
              <Icon className="medical-choice-icon" size={27} strokeWidth={1.7} aria-hidden="true" />
              <h3>{item.backHeading}</h3>
              <p>{item.description}</p>
              {destination ? (
                <a className="medical-choice-cta" href={destination} onClick={(event) => event.stopPropagation()}>
                  {item.cta}
                  <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                </a>
              ) : (
                <button
                  className="medical-choice-cta"
                  type="button"
                  disabled
                  title="Configure this destination when the page is available."
                >
                  {item.cta}
                  <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

const CARD_ITEMS = [
  {
    id: 'jobs',
    title: 'Find a Job',
    Icon: BriefcaseMedical,
    image: 'assets/nurse-card.jpg',
    imageAlt: 'Smiling healthcare professional in green scrubs with a stethoscope',
    backHeading: 'Find Your Next Opportunity',
    description: 'Explore healthcare career opportunities that match your skills, experience and professional goals.',
    cta: 'Explore Jobs',
  },
  {
    id: 'talent',
    title: 'Hire Talent',
    Icon: UsersRound,
    image: 'assets/team-card.jpg',
    imageAlt: 'Two healthcare professionals reviewing a tablet together',
    backHeading: 'Build Your Healthcare Team',
    description: 'Connect with qualified healthcare professionals to strengthen your organization and workforce.',
    cta: 'Find Talent',
  },
];

function MedicalChoices({ candidateUrl, employerUrl }) {
  const reduceMotion = Boolean(useReducedMotion());
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, {
    amount: 0.2,
    margin: '0px 0px -100px 0px',
  });
  const showText = reduceMotion || sectionInView;
  const activeHeadingSequence = reduceMotion
    ? { hidden: {}, visible: {} }
    : headingSequence;
  const activeHeadingWord = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.01 } },
      }
    : headingWord;
  const destinations = { jobs: candidateUrl, talent: employerUrl };

  return (
    <section
      ref={sectionRef}
      className="medical-choices"
      id="medical-choices"
      aria-labelledby="medical-choices-title"
    >
      <div className="medical-choices-inner">
        <header className="medical-choices-heading">
          <motion.p
            className="medical-choices-eyebrow"
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            animate={showText ? 'visible' : 'hidden'}
            transition={{
              duration: reduceMotion || !sectionInView ? 0.01 : 0.85,
              ease: [0.18, 0.8, 0.24, 1],
            }}
          >
            CRESTIA VENTURES <span aria-hidden="true">•</span> HEALTHCARE
          </motion.p>
          <motion.h2
            id="medical-choices-title"
            className="medical-editorial-heading"
            aria-label="How can we help you?"
            variants={activeHeadingSequence}
            initial={reduceMotion ? false : 'hidden'}
            animate={showText ? 'visible' : 'hidden'}
            transition={{
              duration: reduceMotion || !sectionInView ? 0.01 : 0.72,
              ease: [0.18, 0.8, 0.24, 1],
            }}
          >
            <motion.span className="medical-choice-word" variants={activeHeadingWord}>How</motion.span>{' '}
            <motion.span className="medical-choice-word" variants={activeHeadingWord}>can</motion.span>{' '}
            <motion.span className="medical-choice-word" variants={activeHeadingWord}>we</motion.span>{' '}
            <motion.span className="medical-choice-word medical-heading-highlight medical-editorial-highlight" variants={activeHeadingWord}>help</motion.span>{' '}
            <motion.span className="medical-choice-word medical-heading-highlight medical-editorial-highlight" variants={activeHeadingWord}>you?</motion.span>
          </motion.h2>
          <motion.p
            className="medical-choices-subtitle"
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            animate={showText ? 'visible' : 'hidden'}
            transition={{
              duration: reduceMotion || !sectionInView ? 0.01 : 0.85,
              delay: reduceMotion || !sectionInView ? 0 : 2.85,
              ease: [0.18, 0.8, 0.24, 1],
            }}
          >
            Choose the path that best describes what you're looking for.
          </motion.p>
        </header>

        <div className="medical-choices-grid">
          {CARD_ITEMS.map((item) => (
            <FlipCard
              key={item.id}
              item={item}
              destination={destinations[item.id]}
              reduceMotion={reduceMotion}
              sectionInView={sectionInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const mount = document.getElementById('medical-choices-root');
if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <>
        <MedicalChoices
          candidateUrl={mount.dataset.candidateUrl}
          employerUrl={mount.dataset.employerUrl}
        />
        <TransformingRecruitment />
        <HealthcareSpecializations />
        <RecruitmentProcess />
      </>
    </StrictMode>
  );
}
