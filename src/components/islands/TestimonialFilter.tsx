// Testimonials grouped by category. Server-rendered with "All" selected, so
// every note is visible without JavaScript (the filter buttons only work
// once hydrated; without scripts the full grouped list simply stays shown). Notes re-flow on a spring when
// you filter. More categories (Prayer, Readings, Events) appear on their own
// once testimonials with those categories are added to the data file.
import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { quoteParts } from '../../data/testimonials';
import './TestimonialFilter.css';

type T = { quote: string; name: string; role: string; category: string; context?: string };

export default function TestimonialFilter({ items, categories }: { items: T[]; categories: string[] }) {
  const [active, setActive] = useState('All');
  const reduce = useReducedMotion();
  const shown = active === 'All' ? items : items.filter((t) => t.category === active);
  const tabs = ['All', ...categories];

  return (
    <LayoutGroup>
      <div className="tf-tabs" role="group" aria-label="Filter by category">
        {tabs.map((c) => (
          <button key={c} type="button" className="tf-tab" aria-pressed={active === c} onClick={() => setActive(c)}>
            {active === c && <motion.span layoutId="tf-pill" className="tf-pill" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <span className="tf-label">{c}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? 'testimonial' : 'testimonials'}
      </p>
      <motion.ul className="tf-grid" layout={!reduce}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((t, i) => (
            <motion.li
              key={t.quote}
              layout={!reduce}
              className="tf-item"
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 1.5 : -1.5 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <figure className="tf-note">
                <svg width="40" height="30" viewBox="0 0 44 34" aria-hidden="true">
                  <path d="M0 34V20C0 8 6 1 18 0v7c-6 1-9 5-9 11h9v16H0Zm26 0V20C26 8 32 1 44 0v7c-6 1-9 5-9 11h9v16H26Z" fill="#E9E2F1" />
                </svg>
                <blockquote>
                  <p>
                    {quoteParts(t.quote).map((part, k) =>
                      part.note ? (
                        <span key={k} className="tf-ctx">
                          {part.text}
                        </span>
                      ) : (
                        part.text
                      ),
                    )}
                  </p>
                  {t.context && <p className="tf-ctx-after">{t.context}</p>}
                </blockquote>
                <figcaption>
                  <span className="tf-who">
                    {t.name}, {t.role.toLowerCase()}
                  </span>
                  <span className="chip">{t.category}</span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
