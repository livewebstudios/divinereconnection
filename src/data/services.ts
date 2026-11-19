// The five services, in the order the handoff sets. One source for the nav
// dropdown, the footer, the services overview and the service pages.
// Copy marked DRAFT in the handoff still needs Stella's review.

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  nav: string; // all-caps nav label is applied in CSS
  name: string; // schema + cards
  door: 'faith' | 'healing' | 'seeker';
  title: string; // <title>
  description: string; // meta description
  h1: string;
  intro: string;
  card: string; // one short paragraph for overview cards
  price: string; // shown on cards, chips and fact cards
  priceNote?: string;
  offerPrice?: string; // numeric price for JSON-LD offers; omitted when there is no fixed figure
  forWho: string[];
  expect: { heading: string; body: string }[];
  faqs: Faq[];
  formService: string; // preselected value in the request form
};

export const SUPPORT_LINE =
  'Sessions are spiritual support. They work alongside the care you get from your doctor or therapist and never replace it.';

// Stella's own wording (2026-11-17). Used on Home and About.
export const FAITH_LINE = 'Stella’s devotion and trust in her own divine connection is at the center of what she does.';

export const services: Service[] = [
  {
    slug: 'prayer',
    nav: 'Prayer',
    name: 'Prayer',
    door: 'faith',
    title: 'Prayer Requests: Divine ReConnection',
    description:
      'Send a prayer request for yourself or someone you love. Stella Crispo prays personally with people of every background. Sliding scale.',
    h1: 'Someone to pray with you.',
    intro:
      'When life is heavy, it helps to know someone is praying with you by name. Send a request for yourself or for someone you love, and Stella prays for them personally.',
    card: 'Someone to pray with you, or for someone you love. Send a request and Stella prays personally.',
    price: 'Sliding scale',
    forWho: [
      'You are grieving, worried or worn down and would like someone to pray with you',
      'Someone you love is going through a hard season and you want them held in prayer',
      'You would rather pray together out loud, by phone, than send a note',
    ],
    expect: [
      {
        heading: 'Send a request',
        body: 'Use the form on this page. Tell Stella who the prayer is for and what is on your heart. Share as much or as little as you like.',
      },
      {
        heading: 'Stella prays personally',
        body: 'Every request is read by Stella and no one else. She prays for the person by name and keeps what you share private.',
      },
      {
        heading: 'Or pray together',
        body: 'If you would like to pray together, leave a phone number and Stella will call to set a time.',
      },
    ],
    faqs: [
      {
        q: 'How do I send a prayer request? Can I ask for someone else?',
        a: 'Use the prayer request form on this page. Yes, you can ask for someone you love. Their first name is all I need.',
      },
      {
        q: 'Do I need to share your beliefs to work with you?',
        a: 'No. People of every background work with me. My devotion and trust in my own divine connection is at the center of what I do.',
      },
    ],
    formService: 'Prayer',
  },
  {
    slug: 'pranic-healing',
    nav: 'Pranic Healing',
    name: 'Pranic Healing',
    door: 'healing',
    title: 'Pranic Healing in Montclair NJ and Remote Sessions',
    description:
      'No-touch Pranic Healing with certified healer Stella Crispo. In person in Essex County or at a distance. $65, sliding scale.',
    h1: 'Pranic Healing with Stella Crispo.',
    intro:
      'Pranic Healing is a no-touch energy practice. Stella works with your energy to clear what feels heavy and strengthen what feels depleted, in person in Montclair or at a distance.',
    card: 'A no-touch energy practice. It works in person or at a distance, and you do not need to be present in real time.',
    price: '$65',
    priceNote: 'per session, sliding scale available',
    offerPrice: '65',
    forWho: [
      'You feel drained, stuck or carrying something heavy and want gentle support',
      'You would like healing sent to someone you love, near or far',
      'You prefer an approach where no one touches you',
    ],
    expect: [
      {
        heading: 'What it is',
        body: 'Pranic Healing was founded by Master Choa Kok Sui. It is non-denominational and works with the body’s energy, called prana. Stella never touches you during a session.',
      },
      {
        heading: 'In person or at a distance',
        body: 'Come to a session in Montclair, or receive one wherever you are. Distance sessions do not need you to be present in real time, so they fit around your day.',
      },
      {
        heading: 'Healing for someone else',
        body: 'You can request a session for someone you love. Tell Stella who it is for and she will follow up with you about the details.',
      },
      {
        heading: 'Stella’s training',
        body: 'Stella began studying Pranic Healing in 2017. She is a Certified Pranic Healer, including Advanced Pranic Healing, Pranic Psychotherapy, Pranic Crystal Healing and Pranic Psychic Self-Defense.',
      },
    ],
    faqs: [
      {
        q: 'What is Pranic Healing?',
        a: 'A no-touch energy healing practice founded by Master Choa Kok Sui. I work with your energy to clear what feels heavy and strengthen what feels depleted.',
      },
      {
        q: 'How does a remote session work?',
        a: 'You send a request and we agree on a time. You do not have to be present in real time. I will walk you through the rest when I reply.',
      },
      {
        q: 'Is this a substitute for medical or mental health care?',
        a: `No. ${SUPPORT_LINE}`,
      },
    ],
    formService: 'Pranic Healing',
  },
  {
    slug: 'spiritual-guidance',
    nav: 'Intuitive Guidance',
    name: 'Intuitive and Psychic Guidance',
    door: 'seeker',
    title: 'Intuitive and Psychic Guidance with Stella Crispo',
    description:
      'Honest guidance for a decision or a relationship with Stella Crispo. $85 a session, in person, by phone or online.',
    h1: 'Guidance for where you are right now.',
    intro:
      'A conversation, not a performance. Bring the decision you keep circling, the conflict you cannot settle or the question you have not said out loud yet, and talk it through with Stella.',
    card: 'Honest, caring guidance when you are at a crossroads, facing a decision or just need to talk it through.',
    price: '$85',
    priceNote: 'per session',
    offerPrice: '85',
    forWho: [
      'You are at a crossroads in work, family or a relationship',
      'You keep circling the same decision and want a clear, caring outside view',
      'You would simply like a spiritual chat with someone who listens',
    ],
    expect: [
      {
        heading: 'A real conversation',
        body: 'Stella shares what she senses and you can ask questions along the way. Life path, decisions, conflict, or just talking things through.',
      },
      {
        heading: 'Cards only if you want them',
        body: 'Some people like to use cards during guidance. If you would rather not, the session is conversation from start to finish.',
      },
      {
        heading: 'Where we meet',
        body: 'In person in Montclair, by phone, or online. Choose whatever helps you speak freely.',
      },
    ],
    faqs: [
      {
        q: 'What happens during a session?',
        a: 'It is a conversation. I share what comes through and you can ask questions along the way. We can meet in person, by phone or online.',
      },
      {
        q: 'What does it cost?',
        a: 'Intuitive and Psychic Guidance is $85 per session.',
      },
    ],
    formService: 'Intuitive and Psychic Guidance',
  },
  {
    slug: 'readings',
    nav: 'Readings',
    name: 'Readings',
    door: 'seeker',
    title: 'Readings with Stella Crispo, Essex County NJ',
    description:
      'Private readings and readings for groups and events with Stella Crispo. $85 a session, in person in Montclair, NJ, or remotely.',
    h1: 'Readings with Stella.',
    intro:
      'Stella’s readings combine intuition, energy, messages from loved ones and plain conversation. She reads privately, and for groups and gatherings.',
    card: 'Private readings and readings for groups, combining intuition, energy and plain conversation.',
    price: '$85',
    priceNote: 'per session',
    offerPrice: '85',
    forWho: [
      'You want a private reading for a question that matters to you',
      'You would like to explore a tarot reading with someone honest',
      'You are planning a party or gathering and want readings for your guests',
    ],
    expect: [
      {
        heading: 'What a reading is',
        body: 'A reading is a conversation. Stella shares what comes through and you can ask questions as you go. Some readings include messages from loved ones who have passed.',
      },
      {
        heading: 'Tarot readings',
        body: 'A reading that changed Stella’s own life led her to study tarot, and that study led to mediumship. If you would like a tarot reading, ask for one in your request.',
      },
      {
        heading: 'Readings for groups and parties',
        body: 'Stella reads at private and public events. Send the date and details through the event form and she will reply with what fits your gathering.',
      },
      {
        heading: 'An honest promise',
        body: '“I can’t promise what will come through. I’ll be honest with you, and I’ll never tell you something just because you want to hear it.”',
      },
    ],
    faqs: [
      {
        q: 'What happens during a reading?',
        a: 'A reading is a conversation. I share what comes through and you can ask questions along the way. We can meet in person, by phone or online.',
      },
      {
        q: 'Do you do readings at parties and events?',
        a: 'Yes. Send the date and details through the event form on the Events page.',
      },
    ],
    formService: 'Readings',
  },
  {
    slug: 'spiritual-communication',
    nav: 'Spiritual Communication',
    name: 'Spiritual Communication',
    door: 'seeker',
    title: 'Spiritual Communication and Grief: Stella Crispo',
    description:
      'Gentle, honest sessions for people missing someone who has passed. $85 a session, in person, by phone or online.',
    h1: 'When you wish you could talk to them one more time.',
    intro:
      'Grief leaves so much unsaid. In a spiritual communication session, Stella listens for messages from loved ones who have passed and shares what comes through, gently and honestly.',
    card: 'Gentle, honest sessions for people missing someone who has passed.',
    price: '$85',
    priceNote: 'per session',
    offerPrice: '85',
    forWho: [
      'You are missing someone and long for a sense of connection',
      'There is something you wish you had said, or heard',
      'You want a calm, caring space to talk about the person you lost',
    ],
    expect: [
      {
        heading: 'What a session is like',
        body: 'Quiet and unhurried. Stella shares what she receives and you are free to ask questions, pause or simply listen.',
      },
      {
        heading: 'What she can and cannot promise',
        body: 'Stella cannot promise who or what will come through. She will be honest with you about what she receives and never tell you something just because you want to hear it.',
      },
      {
        heading: 'Where we meet',
        body: 'In person in Montclair, by phone, or online. Many people find it easier to be at home for this.',
      },
    ],
    faqs: [
      {
        q: 'Can you connect with someone I’ve lost?',
        a: 'Many of my sessions include messages from loved ones who have passed. I can’t promise what will come through. I’ll be honest with you, and I’ll never tell you something just because you want to hear it.',
      },
      {
        q: 'Is this a substitute for grief counseling?',
        a: `No. ${SUPPORT_LINE}`,
      },
    ],
    formService: 'Spiritual Communication',
  },
];

export const serviceOptions = [...services.map((s) => s.formService), 'Not sure yet'];
