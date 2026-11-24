// Events. Jon updates this file (Decap stays blog-only for now).
// Add upcoming events with an ISO date; past ones move down automatically.
export type EventItem = { title: string; role: string; date: string; place?: string; url?: string };

export const events: EventItem[] = [
  { title: 'Holistic WellCare Advisers MeetUp', role: 'Guest speaker', date: '2026-03-19' },
];

export type Podcast = { id: string; show: string; detail: string; note?: string };

// note: optional plain-text line under the show name (no link: the player is right above it)
export const podcasts: Podcast[] = [
  // Permission to embed: CONFIRM with Stella. Label with show and episode only.
  {
    id: 'OBYm5sZcwAE',
    show: 'Linda Love Talks',
    detail: 'Season 4, Episode 2',
    note: 'Listen to Stella’s 2026 predictions here!',
  },
  // Title and host: CONFIRM. Believed to be her Global Podcast Network interview.
  { id: 'm4cV-Fzdqz0', show: 'Podcast interview', detail: 'Stella on healing' },
];
