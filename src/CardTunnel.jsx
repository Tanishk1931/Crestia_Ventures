import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * Map t∈[0,1] along a side rail:
 * t→0 centre depth (smaller/farther), t→1 outer edge (larger/closer).
 * Lateral spacing keeps cards clear of the heading column and each other.
 */
function pose(side, t) {
  const u = t < 0 ? 0 : t > 1 ? 1 : t;
  return {
    x: side * (310 + u * 290),
    y: (u - 0.5) * 64,
    z: -380 + u * 320,
    scale: 0.74 + u * 0.28,
    rotateY: side * (8 + u * 11),
  };
}

/**
 * Auto-gliding 3D corridor gallery.
 * Heading at TOP stays static. Cards glide along rails — scroll never drives motion.
 */
function GalleryCard({ item, side, rank, amp }) {
  const Icon = item.Icon;
  const t0 = rank / 5;
  // Stay inside the card's corridor slot so neighbours don't collide
  const d = 0.08 * amp;
  const a = pose(side, t0 - d);
  const b = pose(side, t0 + d);
  const duration = 7.4 + rank * 0.95;
  const delay = rank * 0.35 + (side < 0 ? 0 : 0.22);

  return (
    <motion.article
      className="rsv-gallery-card"
      role="listitem"
      tabIndex={0}
      style={{ zIndex: 10 + rank }}
      initial={a}
      animate={{
        x: [a.x, b.x],
        y: [a.y, b.y],
        z: [a.z, b.z],
        scale: [a.scale, b.scale],
        rotateY: [a.rotateY, b.rotateY],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
    >
      <div className="rsv-card-top">
        <span className="rsv-no">{item.no}</span>
        <span className="rsv-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.75} />
        </span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
      <span className="rsv-arrow" aria-hidden="true">
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </span>
    </motion.article>
  );
}

export function CardTunnel({ services, title }) {
  const reduce = useReducedMotion();
  const amp = reduce ? 0.4 : 1;

  const layout = useMemo(
    () =>
      services.map((item, i) => ({
        item,
        side: i % 2 === 0 ? -1 : 1,
        rank: Math.floor(i / 2),
      })),
    [services]
  );

  return (
    <div className="rsv-gallery">
      <div className="rsv-gallery-heading">{title}</div>
      <div className="rsv-gallery-scene" role="list">
        {layout.map(({ item, side, rank }) => (
          <GalleryCard key={item.no} item={item} side={side} rank={rank} amp={amp} />
        ))}
      </div>
    </div>
  );
}

/** Mobile / tablet: readable stacked (or 2-col) list — no 3D gallery. */
export function ServicesList({ services, title }) {
  const reduce = useReducedMotion();
  const amp = reduce ? 0.55 : 1;

  return (
    <div className="rsv-list-wrap">
      <div className="rsv-list-heading">{title}</div>
      <div className="rsv-list-grid" role="list">
        {services.map((item, i) => {
          const Icon = item.Icon;
          return (
            <motion.article
              key={item.no}
              className="rsv-card"
              role="listitem"
              tabIndex={0}
              initial={{ opacity: 0, y: 18 * amp }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 * amp, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rsv-card-top">
                <span className="rsv-no">{item.no}</span>
                <span className="rsv-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="rsv-arrow" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.75} />
              </span>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export function useIsNarrow(breakpoint = 899) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return narrow;
}
