export type Chapter = {
  id: string;
  date: string;
  eyebrow: string;
  title: string;
  summary: string;
  narrative: string[];
  status: 'prototype' | 'planned';
};

// Editorial condensation of the v2.0 canon handoff, not verbatim narration.
export const chapters: Chapter[] = [
  {
    id: 'arrival', date: 'T−19 MONTHS', eyebrow: '01 / EMPLACEMENT', title: 'Before the First Signal',
    summary: 'The Company enters the Solar System. Industrial infrastructure takes shape beyond the Moon.',
    narrative: [
      'Earth is not the destination of an exploratory voyage. It is the subject of a chartered acquisition.',
      'In cislunar space, the Foundry network begins converting local resources into the machinery of an occupation. What cannot be manufactured there has already arrived on a finite manifest.',
      'Human observers register anomalies. None of them becomes a warning the world can act upon.'
    ], status: 'prototype'
  },
  {
    id: 'notification', date: 'T+00:00', eyebrow: '02 / FIRST CONTACT', title: 'The Notification',
    summary: 'A nonhuman authority announces the destruction of military equipment. Instructions arrive before the first strikes.',
    narrative: [
      'The first public contact is not a greeting. It is an emergency notice with a schedule.',
      'Technical identity packages and two demonstrations follow. States are offered ways to verify that the sender controls the objects above them.',
      'The regional Wave begins shortly afterwards. Its published sequence becomes, unexpectedly, a public safety resource.'
    ], status: 'prototype'
  },
  {
    id: 'wave', date: 'T+30 HOURS', eyebrow: '03 / THE WAVE', title: 'The Disarmament',
    summary: 'The opening campaign is complete. Many machines are disabled; many surviving forces have disappeared from the target catalogue.',
    narrative: [
      'Quivers release their payloads into the upper atmosphere. Light Scythes attack exposed mechanical functions while Mattocks address protected structures.',
      'The campaign is designed to render military equipment unusable, not to make the planet uninhabitable.',
      'The surviving forces learn that dispersion, concealment, and imperfect coverage still matter.'
    ], status: 'planned'
  },
  {
    id: 'pause', date: 'DAY 2', eyebrow: '04 / THE PAUSE', title: 'The Test of Authority',
    summary: 'The Company waits for human authorities to demonstrate effective control before committing high-value transports.',
    narrative: ['The first landings are freight deliveries, not ceremonies.', 'A site that cannot secure its own perimeter cannot yet receive a Kestrel.'],
    status: 'planned'
  },
  {
    id: 'day30', date: 'DAY 30', eyebrow: '05 / FIRST FOOTHOLDS', title: 'A Network, Not a Planet',
    summary: 'The Company has qualified logistics sites and operating agreements, but it does not control all of Earth.',
    narrative: ['Physical military superiority does not immediately create political legitimacy.', 'The first month ends with the harder part of the acquisition still ahead.'],
    status: 'planned'
  }
];
