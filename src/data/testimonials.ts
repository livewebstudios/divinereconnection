// Launch set only. Serious-illness testimonials and the Depression and
// Facilitating Birth ones are held off the launch site (see the handoff).
// To add a category, add it to `categories` and tag new entries with it.
export type Testimonial = { quote: string; name: string; role: string; category: string; home?: boolean };

export const categories = ['Life path guidance', 'Anxiety and stress'];

export const testimonials: Testimonial[] = [
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
  {
    quote: 'Thank you Stella! Seems as if there is a definite improvement! Thank you and God bless!',
    name: 'P.',
    role: 'Grandmother',
    category: 'Anxiety and stress',
  },
];
