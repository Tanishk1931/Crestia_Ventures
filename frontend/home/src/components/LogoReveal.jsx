import { motion } from 'framer-motion';

export default function LogoReveal({ revealRef }) {
  return (
    <div className="logo-reveal" ref={revealRef} aria-hidden="true">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        <span className="eyebrow-rule" />
        Four elements. One identity.
      </motion.p>
      <span className="reveal-index">01 — 04</span>
    </div>
  );
}
