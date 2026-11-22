export type Chapter = {
  id: string;
  date: string;
  eyebrow: string;
  title: string;
  summary: string;
  narrative: string[];
  status: 'prototype' | 'planned';
};

// Editorial condensation of docs/canon/CURRENT_CANON.md (v2.4 canon), not verbatim narration.
export const chapters: Chapter[] = [
  {
    id: 'arrival', date: 'T−19 MONTHS', eyebrow: '01 / EMPLACEMENT', title: 'Before the First Signal',
    summary: 'The Caravan enters the Solar System unseen. An industry takes shape between the Earth and the Moon.',
    narrative: [
      'Earth is not the destination of an exploratory voyage. It is the subject of a chartered acquisition with a six-year deadline.',
      'The Foundry network turns asteroidal rock into propellant, structure and munition bodies. What it cannot make — compact fusion cores, beam directors, high-grade seekers, dense compute — arrived once, on a finite manifest.',
      'Six unexplained infrared sources at lunar distance enter survey data. A working group files them as probably instrumental.'
    ], status: 'prototype'
  },
  {
    id: 'notification', date: 'H+0:00', eyebrow: '02 / FIRST CONTACT', title: 'The Notification',
    summary: 'A nonhuman transmission announces that military forces are being neutralized, at the same moment the strikes begin.',
    narrative: [
      'The first public contact is not a greeting. It states what is already happening, and what will not be targeted.',
      'Its purpose is to prevent a nuclear misreading: no human state is attacking another. Within minutes, observatories and military sensors can confirm that the objects overhead are not human.',
      'Within hours, a government can send a challenge through an authenticated channel and watch a Warden answer it with an observable manoeuvre.'
    ], status: 'prototype'
  },
  {
    id: 'first-hour', date: 'H+0 TO H+6', eyebrow: '03 / GLOBAL SUPPRESSION', title: 'The First Cut',
    summary: 'Within the hour, strategic launch, air defence, combat aviation and major naval forces stop working as systems. Bulk dismantling follows.',
    narrative: [
      'Quivers release Scythes and Mattocks after atmospheric entry. Aegis and Picket cover strategic launches; Merlins, Snares and Shrikes cover the sky.',
      'Some aircraft get airborne and some local engagements succeed. They do not restore an integrated air picture.',
      'Cities, hospitals, grids and water systems keep working. The Company needs them to.'
    ], status: 'planned'
  },
  {
    id: 'terms', date: 'H+12 TO H+48', eyebrow: '04 / TERMS', title: 'Restrictions, Not Surrender',
    summary: 'Governments accept operational restrictions while refusing to recognise Company sovereignty.',
    narrative: [
      'Interim terms forbid strategic launch, unauthorized military take-off and armed naval sorties, and require that grids, water, hospitals, food distribution and reactors stay staffed.',
      'At H+30 the Company sorts military movement into compliant, safety-authorized and hostile. The world acquires a de facto military air-traffic-control regime.',
      'Human governments survive because the Company needs their administrative capacity.'
    ], status: 'planned'
  },
  {
    id: 'footholds', date: 'DAY 2 TO DAY 30', eyebrow: '05 / FIRST FOOTHOLDS', title: 'A Network, Not a Planet',
    summary: 'Airfield access becomes the first reward for cooperation. Refusing a site does not keep Company aircraft away; it moves the benefits next door.',
    narrative: [
      'Nominated airfields pass through expendable qualification packages and robotic conversion before the first reusable aircraft lands.',
      'A Kestrel never creates a site. It rewards one that already works.',
      'By Day 30 the Company runs a logistics and administrative network. It does not control the planet\'s territory.'
    ], status: 'planned'
  }
];
