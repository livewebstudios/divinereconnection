// Events. Jon updates this file (Decap stays blog-only for now).
// Add upcoming events with an ISO date; past ones move down automatically.
export type EventItem = { title: string; role: string; date: string; place?: string; url?: string };

export const events: EventItem[] = [
  { title: 'Holistic WellCare Advisers MeetUp', role: 'Guest speaker', date: '2026-03-19' },
];

export const podcasts = [
  // Permission to embed: CONFIRM with Stella. Label with show and episode only.
  { id: 'OBYm5sZcwAE', show: 'Linda Love Talks', detail: 'Season 4, Episode 2' },
  // Title and host: CONFIRM. Believed to be her Global Podcast Network interview.
  { id: 'm4cV-Fzdqz0', show: 'Podcast interview', detail: 'Stella on healing' },
];
