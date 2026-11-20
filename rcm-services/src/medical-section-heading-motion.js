import { useInView, useReducedMotion } from 'framer-motion';

export const medicalSectionHeadingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headingEase = [0.33, 1, 0.68, 1];

export function useMedicalSectionHeading(sectionRef) {
  const reduceMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, {
    once: false,
    amount: 0.2,
    margin: '0px 0px -80px 0px',
  });

  return { reduceMotion, inView, showEntrance: reduceMotion || inView };
}

export function getMedicalHeadingTransition(reduceMotion, inView) {
  return {
    duration: reduceMotion || !inView ? 0.01 : 0.9,
    ease: headingEase,
  };
}

export function getMedicalSubtitleTransition(reduceMotion, inView) {
  return {
    duration: reduceMotion || !inView ? 0.01 : 0.8,
    delay: reduceMotion || !inView ? 0 : 0.2,
    ease: headingEase,
  };
}
