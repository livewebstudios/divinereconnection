// Stella's full set (StellaTestimonials.docx, approved by Jon 2026-11-19).
// Quotes are verbatim. Words in parentheses are Stella's notes on what
// happened; they render lighter so they read as context, not as the client's
// own words. `context` is a note set apart below the quote.
// To add a category, add it to `categories` and tag new entries with it.
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  category: string;
  context?: string;
  home?: boolean; // home page strip (non-medical picks only)
  healing?: boolean; // shown on the Pranic Healing page
};

export const categories = [
  'Cancer',
  'Anxiety and stress',
  'Coronavirus',
  'Depression',
  'Facilitating birth',
  'Internal bleeding',
  'Life path guidance',
];

export const testimonials: Testimonial[] = [
  {
    quote: 'Good Morning Stella!! Great news about O (teen). She IS in remission. No cancer showing up. I thank you for everything!!',
    name: 'L.',
    role: 'Aunt',
    category: 'Cancer',
  },
  {
    quote: 'Great news! J had his Petscan. His doc and radiologist report complete remission. God is so good! Thank you!!',
    name: 'M.',
    role: 'Wife',
    category: 'Cancer',
    healing: true,
  },
  {
    quote: 'Thank you Stella! Seems as if there is a definite improvement! Thank you and God bless!',
    name: 'P.',
    role: 'Grandmother',
    category: 'Anxiety and stress',
  },
  {
    quote:
      'Hi Stella. I really can’t believe it. They were saying a few days ago that it would be another 2-3 weeks at least. But C. was able to come off the ventilator at 2:00 this afternoon. (After 2 distant healing sessions) I can’t tell you how much I and my family and her family appreciate and thank you.',
    name: 'Marie',
    role: 'Healthcare professional',
    category: 'Coronavirus',
    healing: true,
  },
  {
    quote: 'S. is very depressed can’t get out of bed. (After 1 session) I know she got out of bed. Went to the supermarket. You are amazing.',
    name: 'Jill',
    role: 'Psychic medium',
    category: 'Depression',
    healing: true,
  },
  {
    quote: 'L. went in for her scheduled induction but didn’t need Pitocin. Two pushes and the baby was out.',
    name: 'Cathy',
    role: 'Childcare',
    category: 'Facilitating birth',
  },
  {
    quote:
      'R. in ICU most of the night…lost a lot of blood…God-willing tomorrow they find the bleeding. (The next day and after 2 healings) Not much blood today.',
    context: 'The following day, back home and source of bleeding found.',
    name: 'Riche',
    role: 'Business owner',
    category: 'Internal bleeding',
  },
  {
    quote: 'Thank you, Stella, for the guidance. It was bang on. Super grateful, feel much calmer and lighter.',
    name: 'R.',
    role: 'Admin',
    category: 'Life path guidance',
    home: true,
  },
  {
    quote: 'That was spot on. Very, very incredible powers and sensitivities you have. You are amazing!',
    name: 'S.',
    role: 'Musician',
    category: 'Life path guidance',
    home: true,
  },
];

// Splits a quote into the client's words and Stella's parenthetical notes,
// so both the Astro note and the React filter can style the notes lighter.
export function quoteParts(quote: string): { text: string; note: boolean }[] {
  return quote
    .split(/(\([^)]*\))/)
    .filter((t) => t.length > 0)
    .map((t) => ({ text: t, note: /^\(.*\)$/.test(t) }));
}
