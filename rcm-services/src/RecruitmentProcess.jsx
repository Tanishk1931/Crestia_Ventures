import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  getMedicalHeadingTransition,
  getMedicalSubtitleTransition,
  medicalSectionHeadingVariants,
} from './medical-section-heading-motion.js';
import './recruitment-process.css';

const stages = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Understand workforce requirements, organizational goals and the people behind every hiring need.',
    tone: 'forest',
  },
  {
    number: '02',
    title: 'Assess',
    description:
      'Evaluate role requirements, candidate qualifications and experience to identify the right fit.',
    tone: 'dark-green',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Develop a tailored recruitment strategy aligned with hiring priorities and workforce needs.',
    tone: 'emerald',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'Bring the recruitment strategy to life through targeted talent sourcing and candidate engagement.',
    tone: 'sage',
  },
  {
    number: '05',
    title: 'Operate',
    description:
      'Support recruitment activities, coordination and communication throughout the hiring journey.',
    tone: 'mint',
  },
  {
    number: '06',
    title: 'Improve',
    description:
      'Review outcomes, gather insights and refine recruitment strategies for continued improvement.',
    tone: 'white',
  },
];

function RecruitmentProcessCard({
  stage,
  index,
  scrollProgress,
  reduceMotion,
  centerOffset,
  isMobile,
}) {
  const start = isMobile ? 0.02 + index * 0.145 : 0.02 + index * 0.16;
  const duration = isMobile ? 0.13 : 0.135;
  const progress = useTransform(scrollProgress, (value) => {
    const linearProgress = Math.max(0, Math.min(1, (value - start) / duration));
    return linearProgress * linearProgress * (3 - 2 * linearProgress);
  });
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  const x = useTransform(progress, [0, 1], [isMobile ? 0 : centerOffset, 0]);
  const y = useTransform(progress, [0, 1], [isMobile ? 24 : 0, 0]);
  const rotate = useTransform(progress, [0, 1], [
    isMobile ? 0 : index % 2 === 0 ? 6 : -6,
    0,
  ]);
  const scale = useTransform(progress, [0, 1], [isMobile ? 0.97 : 0.92, 1]);

  return (
    <motion.article
      className={`recruitment-process-card recruitment-process-card--${stage.tone}`}
      style={{
        opacity: reduceMotion ? 1 : opacity,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
        rotate: reduceMotion ? 0 : rotate,
        scale: reduceMotion ? 1 : scale,
        zIndex: index + 1,
      }}
    >
      <span className="recruitment-process-number">{stage.number}</span>
      <h3>{stage.title}</h3>
      <p>{stage.description}</p>
    </motion.article>
  );
}

export default function RecruitmentProcess() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [cardLayout, setCardLayout] = useState({ centerOffsets: [], isMobile: false });
  const reduceMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, { once: false, amount: 0.05 });
  const showEntrance = reduceMotion || inView;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'end end'],
  });

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const updateCardLayout = () => {
      const isMobile = window.matchMedia('(max-width: 620px)').matches;
      const gridCenter = grid.clientWidth / 2;
      const centerOffsets = Array.from(grid.children, (card) =>
        isMobile ? 0 : gridCenter - (card.offsetLeft + card.offsetWidth / 2),
      );

      setCardLayout({ centerOffsets, isMobile });
    };

    updateCardLayout();
    window.addEventListener('resize', updateCardLayout);
    return () => window.removeEventListener('resize', updateCardLayout);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="recruitment-process"
      id="our-recruitment-process"
      aria-labelledby="recruitment-process-title"
    >
      <div className="recruitment-process-stage">
        <div className="recruitment-process-inner">
          <header className="recruitment-process-heading">
            <motion.h2
              id="recruitment-process-title"
              className="medical-editorial-heading"
              initial={reduceMotion ? false : 'hidden'}
              animate={showEntrance ? 'visible' : 'hidden'}
              variants={medicalSectionHeadingVariants}
              transition={getMedicalHeadingTransition(reduceMotion, inView)}
            >
              Our Recruitment <span className="medical-editorial-highlight">Process</span>
            </motion.h2>
            <motion.p
              initial={reduceMotion ? false : 'hidden'}
              animate={showEntrance ? 'visible' : 'hidden'}
              variants={medicalSectionHeadingVariants}
              transition={getMedicalSubtitleTransition(reduceMotion, inView)}
            >
              A thoughtful approach to building stronger healthcare teams.
            </motion.p>
          </header>

          <div ref={gridRef} className="recruitment-process-grid">
            {stages.map((stage, index) => (
              <RecruitmentProcessCard
                key={stage.number}
                stage={stage}
                index={index}
                scrollProgress={scrollYProgress}
                reduceMotion={reduceMotion}
                centerOffset={cardLayout.centerOffsets[index] ?? 0}
                isMobile={cardLayout.isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
