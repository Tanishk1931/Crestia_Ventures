import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getMedicalHeadingTransition,
  getMedicalSubtitleTransition,
  medicalSectionHeadingVariants,
  useMedicalSectionHeading,
} from './medical-section-heading-motion.js';
import './transforming-recruitment.css';

const circles = [
  {
    id: 'needs',
    image: 'assets/recruitment-needs.jpg',
    imageAlt: 'Healthcare professional consulting a patient in a clinic',
    title: 'Understanding Your Needs',
    description:
      'Every recruitment journey starts with understanding people. We focus on learning about organizational hiring requirements and individual career aspirations.',
  },
  {
    id: 'opportunity',
    image: 'assets/recruitment-opportunity.jpg',
    imageAlt: 'Healthcare professional and recruitment representative collaborating around a laptop',
    title: 'Connecting Talent With Opportunity',
    description:
      'We aim to connect healthcare professionals with opportunities that align with their qualifications, experience and career goals, while helping organizations identify suitable talent.',
  },
  {
    id: 'meaningful',
    image: 'assets/recruitment-meaningful.jpg',
    imageAlt: 'Diverse healthcare team collaborating around a laptop',
    title: 'Supporting Meaningful Recruitment',
    description:
      'We focus on creating relevant professional connections by understanding role expectations, candidate experience and organizational workforce needs.',
  },
];

const circleEntrance = {
  hidden: { opacity: 0, y: 42, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function RecruitmentCircle({ circle, index, activeId, setActiveId, inView, reduceMotion }) {
  const active = activeId === circle.id;

  function toggleFromKeyboard(event) {
    if (event.key === 'Escape') {
      setActiveId(null);
      event.currentTarget.blur();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveId((current) => (current === circle.id ? null : circle.id));
    }
  }

  function toggleFromPointer(event) {
    if (event.detail === 0 || event.nativeEvent.pointerType === 'mouse') return;
    setActiveId((current) => (current === circle.id ? null : circle.id));
  }

  return (
    <motion.div
      className="recruitment-circle-entry"
      variants={circleEntrance}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || inView ? 'visible' : 'hidden'}
      transition={{
        duration: reduceMotion || !inView ? 0.01 : 1.1,
        delay: reduceMotion || !inView ? 0 : 1.05 + index * 0.2,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      <button
        className={`recruitment-circle${active ? ' is-active' : ''}`}
        type="button"
        aria-label={circle.title}
        aria-expanded={active}
        aria-controls={`recruitment-description-${circle.id}`}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setActiveId(circle.id);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') {
            setActiveId((current) => (current === circle.id ? null : current));
          }
        }}
        onFocus={() => setActiveId(circle.id)}
        onBlur={() => setActiveId((current) => (current === circle.id ? null : current))}
        onClick={toggleFromPointer}
        onKeyDown={toggleFromKeyboard}
      >
        <img
          className="recruitment-circle-photo"
          src={circle.image}
          alt={circle.imageAlt}
          loading="lazy"
          decoding="async"
        />
        <span className="recruitment-circle-panel">
          <span className="recruitment-circle-copy">
            <span className="recruitment-circle-title">{circle.title}</span>
            <span
              className="recruitment-circle-description"
              id={`recruitment-description-${circle.id}`}
              aria-hidden={!active}
            >
              {circle.description}
            </span>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

export default function TransformingRecruitment() {
  const sectionRef = useRef(null);
  const { reduceMotion, inView, showEntrance } = useMedicalSectionHeading(sectionRef);
  const [activeId, setActiveId] = useState(null);

  return (
    <section
      id="transforming-recruitment"
      className="transforming-recruitment"
      ref={sectionRef}
      aria-labelledby="transforming-recruitment-title"
    >
      <div className="transforming-recruitment-inner">
        <header className="transforming-recruitment-heading">
          <motion.h2
            id="transforming-recruitment-title"
            className="medical-editorial-heading"
            initial={reduceMotion ? false : 'hidden'}
            animate={showEntrance ? 'visible' : 'hidden'}
            variants={medicalSectionHeadingVariants}
            transition={getMedicalHeadingTransition(reduceMotion, inView)}
          >
            <span>Transforming </span>
            <span className="transforming-recruitment-highlight medical-editorial-highlight">
              Healthcare Recruitment
            </span>
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : 'hidden'}
            animate={showEntrance ? 'visible' : 'hidden'}
            variants={medicalSectionHeadingVariants}
            transition={getMedicalSubtitleTransition(reduceMotion, inView)}
          >
            We bring healthcare professionals and organizations together, creating meaningful
            connections between talent, opportunity and workforce needs.
          </motion.p>
        </header>

        <div className="transforming-recruitment-grid">
          {circles.map((circle, index) => (
            <RecruitmentCircle
              key={circle.id}
              circle={circle}
              index={index}
              activeId={activeId}
              setActiveId={setActiveId}
              inView={inView}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
