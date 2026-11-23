import { motion } from 'framer-motion';
import { brand } from '../data/brand.js';
import '../../../../deployment/godaddy/public_html/shared/home-navbar.css';

export default function Navbar({ logoSlotRef, wordmarkRef }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="brand-lockup" href="#brand-story" aria-label={`${brand.name} home`}>
          <span
            ref={logoSlotRef}
            className="nav-logo-slot"
            role="img"
            aria-label={`${brand.name} three-dimensional logo`}
          />
          <span className="brand-name" ref={wordmarkRef} aria-hidden="true">
            <span className="wordmark-line">CRESTIA</span>
            <span className="wordmark-divider" />
            <span className="wordmark-line">VENTURES</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          {[
            ['RCM', '/rcm/'],
            ['IT Staffing', '/it/'],
            ['Medical Staffing', '/medical/'],
          ].map(([label, href], index) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 + index * 0.08 }}
              whileHover={{ opacity: 0.65 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>

        <a className="nav-contact" href="#contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
