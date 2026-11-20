import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getMedicalHeadingTransition,
  getMedicalSubtitleTransition,
  medicalSectionHeadingVariants,
  useMedicalSectionHeading,
} from './medical-section-heading-motion.js';
import './healthcare-specializations.css';

const specializations = [
  {
    id: 'nursing',
    title: 'Nursing',
    description:
      'Connecting registered nurses, nursing assistants and specialized nursing professionals with healthcare organizations that value compassionate, skilled patient care.',
    image: 'assets/nurse-card.jpg',
    imagePosition: 'center 30%',
  },
  {
    id: 'allied-health',
    title: 'Allied Health',
    description:
      'Supporting recruitment across diagnostic, therapeutic and rehabilitation services, including professionals who play an essential role in patient care.',
    image: 'assets/specialization-allied-health.jpg',
    imagePosition: 'center 35%',
  },
  {
    id: 'clinical-support',
    title: 'Clinical Support',
    description:
      'Connecting healthcare organizations with skilled professionals who support clinical operations, patient services and the smooth delivery of care.',
    image: 'assets/specialization-clinical-support.jpg',
    imagePosition: 'center 42%',
  },
  {
    id: 'healthcare-administration',
    title: 'Healthcare Administration',
    description:
      'Helping organizations find professionals in hospital management, operations, healthcare coordination and administrative leadership.',
    image: 'assets/specialization-administration.jpg',
    imagePosition: '65% center',
  },
  {
    id: 'revenue-cycle-management',
    title: 'Revenue Cycle Management (RCM)',
    description:
      'Connecting organizations with talent across medical billing, coding, claims processing, payment management and revenue cycle operations.',
    image: 'assets/specialization-revenue-cycle.jpg',
    imagePosition: '68% center',
  },
  {
    id: 'healthcare-it',
    title: 'Healthcare IT',
    description:
      'Bringing together healthcare and technology talent across health information systems, medical technology, data management and digital healthcare solutions.',
    image: 'assets/specialization-healthcare-it.jpg',
    imagePosition: '68% center',
  },
];

function SpecializationCard({ specialization, active, setActiveId }) {
  const lastPointerType = useRef(null);
  const descriptionId = `specialization-description-${specialization.id}`;

  function toggleFromKeyboard(event) {
    if (event.key === 'Escape') {
      setActiveId(null);
      event.currentTarget.blur();
    }
  }

  function toggleFromPointer(event) {
    if (event.detail === 0) {
      lastPointerType.current = null;
      setActiveId((current) => (current === specialization.id ? null : specialization.id));
      return;
    }

    const pointerType = event.nativeEvent.pointerType || lastPointerType.current;
    lastPointerType.current = null;

    if (pointerType === 'mouse') return;
    setActiveId((current) => (current === specialization.id ? null : specialization.id));
  }

  return (
    <button
      className={`healthcare-specialization-card${active ? ' is-expanded' : ''}`}
      type="button"
      aria-expanded={active}
      aria-controls={descriptionId}
      onPointerDown={(event) => {
        lastPointerType.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setActiveId(specialization.id);
      }}
      onFocus={() => {
        if (lastPointerType.current !== 'touch' && lastPointerType.current !== 'pen') {
          setActiveId(specialization.id);
        }
      }}
      onBlur={() => {
        setActiveId((current) => (current === specialization.id ? null : current));
      }}
      onClick={toggleFromPointer}
      onKeyDown={toggleFromKeyboard}
    >
      <img
        className="healthcare-specialization-image"
        src={specialization.image}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ objectPosition: specialization.imagePosition }}
      />
      <span className="healthcare-specialization-overlay" aria-hidden="true" />
      <span className="healthcare-specialization-copy">
        <span className="healthcare-specialization-title" role="heading" aria-level="3">
          {specialization.title}
        </span>
        <span
          className="healthcare-specialization-description"
          id={descriptionId}
          aria-hidden={!active}
        >
          {specialization.description}
        </span>
      </span>
    </button>
  );
}

export default function HealthcareSpecializations() {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const { reduceMotion, inView, showEntrance } = useMedicalSectionHeading(sectionRef);
  const hasActiveCard = activeId !== null;

  return (
    <section
      ref={sectionRef}
      className="healthcare-specializations"
      aria-labelledby="healthcare-specializations-title"
    >
      <div className="healthcare-specializations-inner">
        <header className="healthcare-specializations-heading">
          <motion.h2
            id="healthcare-specializations-title"
            className="medical-editorial-heading"
            initial={reduceMotion ? false : 'hidden'}
            animate={showEntrance ? 'visible' : 'hidden'}
            variants={medicalSectionHeadingVariants}
            transition={getMedicalHeadingTransition(reduceMotion, inView)}
          >
            Healthcare{' '}
            <span className="medical-editorial-highlight">Specializations</span>
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : 'hidden'}
            animate={showEntrance ? 'visible' : 'hidden'}
            variants={medicalSectionHeadingVariants}
            transition={getMedicalSubtitleTransition(reduceMotion, inView)}
          >
            From clinical care to healthcare technology, we connect skilled professionals with
            opportunities across the healthcare ecosystem.
          </motion.p>
        </header>

        <div
          className={`healthcare-specializations-scroll${hasActiveCard ? ' has-active-card' : ''}`}
          role="group"
          aria-label="Healthcare specializations"
          onPointerLeave={(event) => {
            if (
              event.pointerType === 'mouse' &&
              !event.currentTarget.querySelector(':focus-visible')
            ) {
              setActiveId(null);
            }
          }}
        >
          <div className="healthcare-specializations-track">
            {specializations.map((specialization) => (
              <SpecializationCard
                key={specialization.id}
                specialization={specialization}
                active={activeId === specialization.id}
                setActiveId={setActiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
