// Mobile menu: a full sheet that springs down from the header. The phone and
// the request button sit at the bottom of the sheet, where thumbs are.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './MobileNav.css';

type Link = { label: string; href: string; current?: boolean };
type Props = { links: Link[]; services: Link[]; phone: string; phoneHref: string; cta: string };

export default function MobileNav({ links, services, phone, phoneHref, cta }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('nav-open', open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 160, damping: 20, delay: reduce ? 0 : 0.04 * i + 0.08 },
    }),
  };

  return (
    <>
      <button
        ref={btn}
        className="mn-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span className={`mn-lines ${open ? 'is-open' : ''}`} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mn-sheet"
            initial={{ opacity: 0, y: reduce ? 0 : -24, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <nav aria-label="Mobile">
              <ul className="mn-list">
                {links.map((l, i) => (
                  <motion.li key={l.href} variants={item} initial="hidden" animate="show" custom={i}>
                    <a href={l.href} aria-current={l.current ? 'page' : undefined} onClick={() => setOpen(false)}>
                      {l.label}
                    </a>
                    {l.label === 'Services' && (
                      <ul className="mn-sub">
                        {services.map((s) => (
                          <li key={s.href}>
                            <a href={s.href} onClick={() => setOpen(false)}>
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div className="mn-actions" variants={item} initial="hidden" animate="show" custom={links.length}>
              <a className="btn" href={cta}>
                Request a session
              </a>
              <a className="btn btn--ghost" href={phoneHref}>
                Call {phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
