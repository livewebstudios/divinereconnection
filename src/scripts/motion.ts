// Site-wide motion: spring reveals and scroll-linked parallax.
// Vocabulary borrowed from the reference template: content lifts 24px and
// fades in on a soft spring, small objects settle from a slight turn, and
// layered elements drift at different speeds as you scroll.
import { animate, inView, scroll } from 'motion';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const spring = { type: 'spring' as const, stiffness: 90, damping: 18, mass: 0.9 };

// After a reveal finishes, hand the element back to CSS so hover transforms work.
function settle(el: Element) {
  return () => {
    el.classList.add('revealed');
    (el as HTMLElement).style.transform = '';
    (el as HTMLElement).style.opacity = '';
  };
}

function reveals() {
  const groups = new Set<Element>();
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const group = el.closest('[data-reveal-group]');
    if (group) groups.add(group);
    else
      inView(
        el,
        () => {
          animate(el, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] }, spring).then(settle(el));
        },
        { margin: '0px 0px -12% 0px' },
      );
  });

  groups.forEach((group) => {
    inView(
      group,
      () => {
        group.querySelectorAll('[data-reveal]').forEach((el, i) => {
          animate(
            el,
            { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
            { ...spring, delay: i * 0.09 },
          ).then(settle(el));
        });
      },
      { margin: '0px 0px -12% 0px' },
    );
  });

  document.querySelectorAll('[data-pop]').forEach((el) => {
    inView(el, () => {
      animate(el, { opacity: [0, 1], transform: ['scale(0.85) rotate(8deg)', 'scale(1) rotate(0deg)'] }, { type: 'spring', stiffness: 160, damping: 14 }).then(settle(el));
    });
  });
}

// data-parallax="0.15" moves an element against the scroll by 15% of the
// distance it travels through the viewport. data-parallax-rotate adds a turn.
function parallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.1');
    const turn = parseFloat(el.dataset.parallaxRotate || '0');
    const target = (el.closest('[data-parallax-scope]') as HTMLElement) || el;
    scroll(
      (progress: number) => {
        const shift = (progress - 0.5) * -speed * 400;
        const r = (progress - 0.5) * turn;
        el.style.translate = `0 ${shift.toFixed(1)}px`;
        if (turn) el.style.rotate = `${r.toFixed(2)}deg`;
      },
      { target, offset: ['start end', 'end start'] },
    );
  });
}

// Header changes from a full-width bar to a floating pill once you leave the
// hero, so it stops competing with the content but stays in reach.
function header() {
  const bar = document.querySelector<HTMLElement>('[data-header]');
  if (!bar) return;
  const update = () => bar.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// data-inview: adds .is-in once, so CSS can play a small scene (cards fanning
// out, a conversation typing) the first time it is seen.
function scenes() {
  document.querySelectorAll('[data-inview]').forEach((el) => {
    if (reduce) return el.classList.add('is-in');
    inView(el, () => {
      el.classList.add('is-in');
    }, { margin: '0px 0px -20% 0px' });
  });
}

header();
scenes();
if (!reduce) {
  reveals();
  parallax();
}
