// One form island for the three Formspree forms (session, prayer, event).
// Server-rendered, so it still posts without JavaScript. With JavaScript it
// sends in place and swaps to a plain thank-you on the same page.
import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './RequestForm.css';

type Kind = 'session' | 'prayer' | 'event';
type Props = {
  kind: Kind;
  action: string;
  services?: string[];
  defaultService?: string;
  phone: string;
  phoneHref: string;
  email: string;
};

const copy: Record<Kind, { button: string; thanks: string; body: string; subject: string }> = {
  session: {
    button: 'Send my request',
    thanks: 'Thank you. Your request is with Stella.',
    body: 'She reads every request herself and will reply personally to find a time that suits you.',
    subject: 'New session request',
  },
  prayer: {
    button: 'Send my prayer request',
    thanks: 'Thank you. Your prayer request is with Stella.',
    body: 'She will pray for the person you named. What you shared stays between you and her.',
    subject: 'New prayer request',
  },
  event: {
    button: 'Send event details',
    thanks: 'Thank you. Your event details are with Stella.',
    body: 'She will reply personally with what fits your gathering and her availability.',
    subject: 'New event inquiry',
  },
};

export default function RequestForm({ kind, action, services = [], defaultService, phone, phoneHref, email }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [forWhom, setForWhom] = useState<'myself' | 'someone'>('myself');
  const c = copy[kind];
  const id = (n: string) => `${kind}-${n}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    try {
      const res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      form.reset();
    } catch {
      setState('error');
    }
  }

  return (
    <div className="rf">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'sent' ? (
          <motion.div
            key="thanks"
            className="rf-thanks"
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="22" fill="#4B2E83" />
              <path d="m13 22.5 6 6 12-13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="rf-thanks-title">{c.thanks}</p>
            <p>{c.body}</p>
            <button type="button" className="text-link rf-again" onClick={() => setState('idle')}>
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={action}
            method="POST"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <input type="hidden" name="_subject" value={c.subject} />
            <div className="rf-hp" aria-hidden="true">
              <label htmlFor={id('gotcha')}>Leave this empty</label>
              <input type="text" id={id('gotcha')} name="_gotcha" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="rf-grid">
              <div className="rf-field">
                <label htmlFor={id('name')}>Your name</label>
                <input id={id('name')} name="name" autoComplete="name" required />
              </div>
              <div className="rf-field">
                <label htmlFor={id('email')}>Email</label>
                <input id={id('email')} name="email" type="email" autoComplete="email" required />
              </div>

              {kind === 'session' && (
                <>
                  <div className="rf-field">
                    <label htmlFor={id('phone')}>Phone</label>
                    <input id={id('phone')} name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div className="rf-field">
                    <label htmlFor={id('service')}>Service of interest</label>
                    <select id={id('service')} name="service" defaultValue={defaultService || ''} required>
                      <option value="" disabled>
                        Choose one
                      </option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <fieldset className="rf-field rf-wide rf-choices">
                    <legend>How would you like to meet?</legend>
                    {['In person (Montclair, NJ)', 'By phone', 'Remote'].map((v, i) => (
                      <label key={v} className="rf-choice">
                        <input type="radio" name="meeting" value={v} defaultChecked={i === 0} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="rf-field rf-wide">
                    <label htmlFor={id('time')}>Best time to reach you</label>
                    <input id={id('time')} name="best_time" placeholder="For example, weekday evenings" />
                  </div>
                </>
              )}

              {kind === 'prayer' && (
                <>
                  <fieldset className="rf-field rf-wide rf-choices">
                    <legend>Who is this prayer for?</legend>
                    <label className="rf-choice">
                      <input type="radio" name="prayer_for" value="Myself" checked={forWhom === 'myself'} onChange={() => setForWhom('myself')} />
                      <span>Myself</span>
                    </label>
                    <label className="rf-choice">
                      <input type="radio" name="prayer_for" value="Someone else" checked={forWhom === 'someone'} onChange={() => setForWhom('someone')} />
                      <span>Someone else</span>
                    </label>
                  </fieldset>
                  {forWhom === 'someone' && (
                    <div className="rf-field rf-wide">
                      <label htmlFor={id('their')}>Their first name</label>
                      <input id={id('their')} name="their_first_name" />
                    </div>
                  )}
                  <div className="rf-field rf-wide">
                    <label htmlFor={id('phone')}>
                      Phone <span className="rf-opt">(optional, if you would like to pray together)</span>
                    </label>
                    <input id={id('phone')} name="phone" type="tel" autoComplete="tel" />
                  </div>
                </>
              )}

              {kind === 'event' && (
                <>
                  <div className="rf-field">
                    <label htmlFor={id('phone')}>Phone</label>
                    <input id={id('phone')} name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div className="rf-field">
                    <label htmlFor={id('date')}>Event date</label>
                    <input id={id('date')} name="event_date" type="date" />
                  </div>
                  <div className="rf-field">
                    <label htmlFor={id('location')}>Location</label>
                    <input id={id('location')} name="location" placeholder="Town, or online" />
                  </div>
                  <div className="rf-field">
                    <label htmlFor={id('type')}>Type of event</label>
                    <select id={id('type')} name="event_type" defaultValue="">
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option>Private party</option>
                      <option>Group or meetup</option>
                      <option>Podcast or interview</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="rf-field">
                    <label htmlFor={id('guests')}>Number of guests</label>
                    <input id={id('guests')} name="guest_count" type="number" min="1" inputMode="numeric" />
                  </div>
                </>
              )}

              <div className="rf-field rf-wide">
                <label htmlFor={id('message')}>
                  {kind === 'prayer' ? 'What would you like prayed for?' : kind === 'event' ? 'Tell Stella about your event' : 'Your message'}
                </label>
                <textarea id={id('message')} name="message" rows={5} required={kind === 'prayer'} />
              </div>
            </div>

            {state === 'error' && (
              <p className="rf-error" role="alert">
                That did not go through. Please try again, or reach Stella directly at <a href={phoneHref}>{phone}</a> or{' '}
                <a href={`mailto:${email}`}>{email}</a>.
              </p>
            )}

            <div className="rf-foot">
              <button className="btn" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : c.button}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <p className="rf-private">Read only by Stella. Never shared.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
