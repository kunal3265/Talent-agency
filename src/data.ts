// Every string, option and seed record the site shows lives here. Edit this
// file to make the agency yours: copy, roster, work, journal and offices.

// ---------------------------------------------------------------------------
// Photography. Every portrait and still on the site goes through PHOTOS:
// keys are talent slugs, 'agent-<slug>', project slugs and post slugs. The
// shipped images are generated placeholders of fictional people and scenes;
// point an entry at your own photograph in /public to replace it, or delete
// the entry to fall back to the drawn duotone art.
const PHOTO_KEYS = [
  'ines-varga', 'theo-adebayo', 'mei-lin-park', 'callum-reyes', 'amara-osei', 'oskar-lindahl', 'lucia-fontaine',
  'kwame-mensah', 'sasha-novak', 'diego-almeida', 'hana-ito', 'priya-raman', 'jonah-weiss', 'rosa-quintero',
  'agent-noor-haddad', 'agent-marco-bellini', 'agent-jae-soo-han', 'agent-freya-moss',
  'glasswing', 'lowlight', 'paper-lanterns', 'the-proving-ground', 'ember-year', 'second-helpings', 'iron-bloom',
  'the-long-field', 'tia-problems', 'moonrise-avenue', 'northern-waters', 'skylark',
  'glasswing-opens', 'welcome-amara-osei', 'micro-drama-casting', 'self-tape-guide', 'seoul-office',
]
// Images resolve against the page itself, so the same module works when
// served from a host, from a sub-path or opened straight from disk. Plain Node
// (the API functions) never renders images and falls back to the site root.
const ASSET_BASE = typeof document === 'undefined' ? '/' : new URL('.', document.baseURI).href

export const PHOTOS: Partial<Record<string, string>> = Object.fromEntries(PHOTO_KEYS.map((k) => [k, `${ASSET_BASE}images/${k}.webp`]))

/** The hero render. Set to null to draw the animated SVG dragonfly instead. */
export const HERO_RENDER: string | null = `${ASSET_BASE}images/dragonfly.webp`

export const SITE = {
  name: 'Bravura Talent',
  short: 'Bravura',
  role: 'Talent agency for performers, voices, directors and creators',
  email: 'hello@bravura.example',
  bookings: 'bookings@bravura.example',
  phone: '+44 20 7946 0321',
  founded: 2009,
  tagline:
    'Bravura Talent is a global agency built for the bold, a home for performers, voices and makers who give audiences cinematic experiences that move the soul and stretch the imagination.',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Vimeo', href: 'https://vimeo.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
}

export const NAV_LEFT = [
  { label: 'Talent', to: '/talent' },
  { label: 'Work', to: '/work' },
  { label: 'About us', to: '/about' },
]
export const NAV_RIGHT = [
  { label: 'Journal', to: '/journal' },
  { label: 'Join the roster', to: '/join' },
  { label: 'Contact', to: '/contact' },
]

// ---------------------------------------------------------------------------
// Divisions

export type DivisionId = 'performers' | 'voices' | 'directors' | 'creators'

export const DIVISIONS: { id: DivisionId; label: string; plural: string; blurb: string }[] = [
  { id: 'performers', label: 'Performer', plural: 'Performers', blurb: 'Screen and stage actors for features, series and micro-dramas.' },
  { id: 'voices', label: 'Voice', plural: 'Voices', blurb: 'Narrators, character voices and singers for animation, games and audio.' },
  { id: 'directors', label: 'Director', plural: 'Directors', blurb: 'Directors and showrunners for scripted, unscripted and branded film.' },
  { id: 'creators', label: 'Creator', plural: 'Creators', blurb: 'Hosts and creators who build audiences and bring them along.' },
]

export const divisionLabel = (id: DivisionId) => DIVISIONS.find((d) => d.id === id)?.label ?? id

// ---------------------------------------------------------------------------
// Roster

export type Availability = 'available' | 'limited' | 'booked'

export const AVAILABILITY: Record<Availability, string> = {
  available: 'Available',
  limited: 'Limited dates',
  booked: 'On production',
}

export type Credit = { year: number; title: string; role: string; kind: string }

export type Talent = {
  slug: string
  name: string
  division: DivisionId
  role: string
  base: string
  languages: string[]
  skills: string[]
  playing?: string
  availability: Availability
  agent: string
  hue: number
  pose: number
  featured?: boolean
  quote: string
  bio: string[]
  credits: Credit[]
  reel: { title: string; seconds: number }
  stats: { label: string; value: string }[]
}

export const TALENT: Talent[] = [
  {
    slug: 'ines-varga',
    name: 'Ines Varga',
    division: 'performers',
    role: 'Actor',
    base: 'London',
    languages: ['English', 'Hungarian', 'French'],
    skills: ['Stage combat', 'Horse riding', 'Mezzo-soprano'],
    playing: '25–35',
    availability: 'limited',
    agent: 'noor-haddad',
    hue: 268,
    pose: 0,
    featured: true,
    quote: 'I look for the scene nobody else wants to play.',
    bio: [
      'Ines trained at a conservatoire in Budapest before a decade on the London stage. Her breakout came as the lead in the period thriller Glasswing, which earned her a best-newcomer nomination.',
      'She moves between prestige series and tightly shot micro-dramas with the same appetite, and is drawn to roles with a physical edge.',
    ],
    credits: [
      { year: 2026, title: 'Glasswing', role: 'Lead, Orsolya', kind: 'Feature film' },
      { year: 2025, title: 'The Salt Road', role: 'Series regular', kind: 'Series' },
      { year: 2024, title: 'Ninety Seconds', role: 'Lead', kind: 'Micro-drama' },
      { year: 2023, title: 'A Doll’s House', role: 'Nora', kind: 'Stage' },
    ],
    reel: { title: 'Showreel 2026', seconds: 154 },
    stats: [
      { label: 'Screen credits', value: '18' },
      { label: 'Nominations', value: '3' },
      { label: 'With Bravura', value: '6 yrs' },
    ],
  },
  {
    slug: 'theo-adebayo',
    name: 'Theo Adebayo',
    division: 'performers',
    role: 'Actor',
    base: 'Los Angeles',
    languages: ['English', 'Yoruba'],
    skills: ['Boxing', 'Free running', 'Accents: West African, Southern US'],
    playing: '28–38',
    availability: 'booked',
    agent: 'marco-bellini',
    hue: 18,
    pose: 1,
    featured: true,
    quote: 'Stillness is the loudest thing on screen.',
    bio: [
      'Theo spent his twenties in stunt work before stepping in front of the lens. Directors cast him for an intensity that never needs to raise its voice.',
      'He is currently shooting the second season of Lowlight and develops his own projects through a first-look deal.',
    ],
    credits: [
      { year: 2026, title: 'Lowlight, season two', role: 'Lead, Detective Ade', kind: 'Series' },
      { year: 2025, title: 'Heavy Weather', role: 'Supporting', kind: 'Feature film' },
      { year: 2024, title: 'Lowlight', role: 'Lead', kind: 'Series' },
    ],
    reel: { title: 'Action and drama reel', seconds: 128 },
    stats: [
      { label: 'Screen credits', value: '24' },
      { label: 'Lead roles', value: '7' },
      { label: 'With Bravura', value: '4 yrs' },
    ],
  },
  {
    slug: 'mei-lin-park',
    name: 'Mei-Lin Park',
    division: 'performers',
    role: 'Actor and singer',
    base: 'Seoul',
    languages: ['Korean', 'English', 'Mandarin'],
    skills: ['Contemporary dance', 'Piano', 'Wirework'],
    playing: '20–28',
    availability: 'available',
    agent: 'jae-soo-han',
    hue: 320,
    pose: 2,
    featured: true,
    quote: 'Every take is a chance to surprise myself.',
    bio: [
      'Mei-Lin began in musical theatre in Seoul and crossed into screen with a run of vertical micro-dramas that found tens of millions of viewers.',
      'She now splits her time between Korean and English-language productions and records her own music.',
    ],
    credits: [
      { year: 2026, title: 'Paper Lanterns', role: 'Lead', kind: 'Micro-drama' },
      { year: 2025, title: 'Second Act', role: 'Series regular', kind: 'Series' },
      { year: 2024, title: 'Moonrise Avenue', role: 'Lead', kind: 'Micro-drama' },
    ],
    reel: { title: 'Bilingual reel', seconds: 96 },
    stats: [
      { label: 'Episodes', value: '210' },
      { label: 'Views', value: '84M' },
      { label: 'With Bravura', value: '2 yrs' },
    ],
  },
  {
    slug: 'callum-reyes',
    name: 'Callum Reyes',
    division: 'performers',
    role: 'Actor',
    base: 'Dublin',
    languages: ['English', 'Spanish', 'Irish'],
    skills: ['Fiddle', 'Sailing', 'Improvisation'],
    playing: '35–45',
    availability: 'available',
    agent: 'noor-haddad',
    hue: 198,
    pose: 3,
    quote: 'Comedy and grief live on the same street.',
    bio: [
      'Callum is a character actor with a long stage career and a reputation for finding the laugh inside the sad scene.',
      'He has led two Irish-language features and is a regular on British comedy panels.',
    ],
    credits: [
      { year: 2025, title: 'The Long Field', role: 'Lead', kind: 'Feature film' },
      { year: 2024, title: 'Small Hours', role: 'Recurring', kind: 'Series' },
      { year: 2023, title: 'Harbour Lights', role: 'Lead', kind: 'Feature film' },
    ],
    reel: { title: 'Comedy and drama reel', seconds: 118 },
    stats: [
      { label: 'Screen credits', value: '31' },
      { label: 'Stage seasons', value: '12' },
      { label: 'With Bravura', value: '9 yrs' },
    ],
  },
  {
    slug: 'amara-osei',
    name: 'Amara Osei',
    division: 'performers',
    role: 'Actor',
    base: 'London',
    languages: ['English', 'Twi'],
    skills: ['Ballet', 'Fencing', 'Accents: RP, Ghanaian'],
    playing: '18–25',
    availability: 'available',
    agent: 'marco-bellini',
    hue: 40,
    pose: 1,
    quote: 'I want people to leave the cinema talking.',
    bio: [
      'Amara left drama school a year early to take the lead in Ember Year, the coming-of-age film that opened a festival’s new-voices strand.',
      'She is one of the youngest members of the roster and already one of its busiest.',
    ],
    credits: [
      { year: 2026, title: 'Ember Year', role: 'Lead, Abena', kind: 'Feature film' },
      { year: 2025, title: 'Afterparty', role: 'Lead', kind: 'Micro-drama' },
    ],
    reel: { title: 'Showreel', seconds: 84 },
    stats: [
      { label: 'Screen credits', value: '6' },
      { label: 'Festival selections', value: '4' },
      { label: 'With Bravura', value: '1 yr' },
    ],
  },
  {
    slug: 'oskar-lindahl',
    name: 'Oskar Lindahl',
    division: 'voices',
    role: 'Voice actor and narrator',
    base: 'Stockholm',
    languages: ['Swedish', 'English', 'German'],
    skills: ['Audiobook narration', 'Creature voices', 'Home studio'],
    availability: 'available',
    agent: 'freya-moss',
    hue: 230,
    pose: 2,
    featured: true,
    quote: 'A voice can build a whole world before the first frame.',
    bio: [
      'Oskar is the voice behind three of the most played game franchises of the decade and narrates nature documentaries in three languages.',
      'He records from a broadcast-grade home studio and turns around pickups the same day.',
    ],
    credits: [
      { year: 2026, title: 'Hollow Crown: Rebirth', role: 'King Aldric', kind: 'Game' },
      { year: 2025, title: 'Northern Waters', role: 'Narrator', kind: 'Documentary' },
      { year: 2024, title: 'The Ferryman', role: 'Narrator', kind: 'Audiobook' },
    ],
    reel: { title: 'Character voice reel', seconds: 72 },
    stats: [
      { label: 'Game titles', value: '40+' },
      { label: 'Audiobooks', value: '65' },
      { label: 'Turnaround', value: '24 h' },
    ],
  },
  {
    slug: 'lucia-fontaine',
    name: 'Lucía Fontaine',
    division: 'voices',
    role: 'Voice actor and singer',
    base: 'Madrid',
    languages: ['Spanish', 'French', 'English'],
    skills: ['Soprano', 'Dubbing', 'Animation'],
    availability: 'limited',
    agent: 'freya-moss',
    hue: 350,
    pose: 0,
    quote: 'Sing it like you mean it, then say it like you sang it.',
    bio: [
      'Lucía is a classically trained soprano who lends her voice to animated features and the Spanish dubs of major releases.',
      'She has voiced the lead in four animated features and tours a solo recital each spring.',
    ],
    credits: [
      { year: 2026, title: 'Skylark', role: 'Wren (Spanish)', kind: 'Animation' },
      { year: 2025, title: 'Tidepool', role: 'Marina', kind: 'Animation' },
      { year: 2024, title: 'Canciones del Mar', role: 'Soloist', kind: 'Album' },
    ],
    reel: { title: 'Voice and song reel', seconds: 90 },
    stats: [
      { label: 'Animated features', value: '9' },
      { label: 'Dub credits', value: '120' },
      { label: 'With Bravura', value: '5 yrs' },
    ],
  },
  {
    slug: 'kwame-mensah',
    name: 'Kwame Mensah',
    division: 'voices',
    role: 'Voice actor',
    base: 'Accra',
    languages: ['English', 'Twi', 'Ga'],
    skills: ['Trailer voice', 'Commercials', 'Podcast host'],
    availability: 'available',
    agent: 'freya-moss',
    hue: 28,
    pose: 3,
    quote: 'The right word, at the right weight.',
    bio: [
      'Kwame is the trailer voice for a string of blockbuster campaigns and hosts a long-running storytelling podcast.',
      'His low, warm register is in demand for brand films and documentary series.',
    ],
    credits: [
      { year: 2026, title: 'Heavy Weather', role: 'Trailer voice', kind: 'Campaign' },
      { year: 2025, title: 'Gold Coast Stories', role: 'Host', kind: 'Podcast' },
    ],
    reel: { title: 'Trailer and commercial reel', seconds: 60 },
    stats: [
      { label: 'Campaigns', value: '75' },
      { label: 'Podcast episodes', value: '310' },
      { label: 'Turnaround', value: '48 h' },
    ],
  },
  {
    slug: 'sasha-novak',
    name: 'Sasha Novak',
    division: 'directors',
    role: 'Director',
    base: 'Prague',
    languages: ['Czech', 'English', 'Russian'],
    skills: ['Genre', 'VFX-heavy', 'Practical effects'],
    availability: 'limited',
    agent: 'marco-bellini',
    hue: 280,
    pose: 2,
    featured: true,
    quote: 'Make the impossible look handmade.',
    bio: [
      'Sasha directs genre film with a love for practical effects and creatures built in the workshop rather than the render farm.',
      'Her feature Glasswing opened to festival acclaim, and she is in development on a fantasy series.',
    ],
    credits: [
      { year: 2026, title: 'Glasswing', role: 'Director', kind: 'Feature film' },
      { year: 2024, title: 'The Mothhouse', role: 'Director', kind: 'Short' },
      { year: 2023, title: 'Iron Bloom', role: 'Director', kind: 'Commercial' },
    ],
    reel: { title: 'Director’s reel', seconds: 142 },
    stats: [
      { label: 'Features', value: '2' },
      { label: 'Festival awards', value: '6' },
      { label: 'Commercials', value: '30+' },
    ],
  },
  {
    slug: 'diego-almeida',
    name: 'Diego Almeida',
    division: 'directors',
    role: 'Director and showrunner',
    base: 'São Paulo',
    languages: ['Portuguese', 'Spanish', 'English'],
    skills: ['Unscripted', 'Docuseries', 'Live events'],
    availability: 'available',
    agent: 'noor-haddad',
    hue: 150,
    pose: 1,
    quote: 'Real people are the best plot twist.',
    bio: [
      'Diego builds unscripted formats that feel like drama: high stakes, real people and a camera that never blinks.',
      'His docuseries Ninety Days South has run for four seasons across Latin America.',
    ],
    credits: [
      { year: 2026, title: 'The Proving Ground', role: 'Showrunner', kind: 'Unscripted' },
      { year: 2025, title: 'Ninety Days South, season four', role: 'Director', kind: 'Docuseries' },
    ],
    reel: { title: 'Unscripted reel', seconds: 110 },
    stats: [
      { label: 'Seasons', value: '11' },
      { label: 'Territories', value: '22' },
      { label: 'With Bravura', value: '7 yrs' },
    ],
  },
  {
    slug: 'hana-ito',
    name: 'Hana Ito',
    division: 'directors',
    role: 'Director',
    base: 'Tokyo',
    languages: ['Japanese', 'English'],
    skills: ['Micro-drama', 'Vertical', 'Music video'],
    availability: 'booked',
    agent: 'jae-soo-han',
    hue: 0,
    pose: 0,
    quote: 'Ninety seconds is enough for a heartbreak.',
    bio: [
      'Hana directs vertical micro-dramas built for the phone, with a cliffhanger every ninety seconds and a visual signature all her own.',
      'Her music videos have been nominated at every major ceremony in Japan.',
    ],
    credits: [
      { year: 2026, title: 'Paper Lanterns', role: 'Director', kind: 'Micro-drama' },
      { year: 2025, title: 'Neon Psalm', role: 'Director', kind: 'Music video' },
      { year: 2024, title: 'Moonrise Avenue', role: 'Director', kind: 'Micro-drama' },
    ],
    reel: { title: 'Vertical reel', seconds: 66 },
    stats: [
      { label: 'Episodes', value: '480' },
      { label: 'Views', value: '1.2B' },
      { label: 'Music videos', value: '35' },
    ],
  },
  {
    slug: 'priya-raman',
    name: 'Priya Raman',
    division: 'creators',
    role: 'Host and creator',
    base: 'London',
    languages: ['English', 'Tamil', 'Hindi'],
    skills: ['Live hosting', 'Food', 'Travel'],
    availability: 'available',
    agent: 'freya-moss',
    hue: 45,
    pose: 3,
    featured: true,
    quote: 'Bring the audience in the room with you.',
    bio: [
      'Priya hosts the food-and-travel series Second Helpings and a weekly live show watched by a loyal community of home cooks.',
      'Brands work with her for long-form partnerships that her audience actually asks for.',
    ],
    credits: [
      { year: 2026, title: 'Second Helpings', role: 'Host', kind: 'Series' },
      { year: 2025, title: 'Spice Routes', role: 'Host', kind: 'Unscripted' },
    ],
    reel: { title: 'Hosting reel', seconds: 80 },
    stats: [
      { label: 'Followers', value: '3.4M' },
      { label: 'Live shows', value: '220' },
      { label: 'Brand partners', value: '18' },
    ],
  },
  {
    slug: 'jonah-weiss',
    name: 'Jonah Weiss',
    division: 'creators',
    role: 'Creator and filmmaker',
    base: 'Berlin',
    languages: ['German', 'English'],
    skills: ['Short film', 'Drone', 'Editing'],
    availability: 'limited',
    agent: 'jae-soo-han',
    hue: 190,
    pose: 2,
    quote: 'Shoot small, think huge.',
    bio: [
      'Jonah makes cinematic short films on a phone and a drone, and teaches a few million people how he does it.',
      'He directs brand films and has a short in development with a European broadcaster.',
    ],
    credits: [
      { year: 2026, title: 'Concrete Weather', role: 'Director', kind: 'Short' },
      { year: 2025, title: 'Pocket Cinema', role: 'Creator', kind: 'Series' },
    ],
    reel: { title: 'Creator reel', seconds: 58 },
    stats: [
      { label: 'Followers', value: '2.1M' },
      { label: 'Shorts', value: '140' },
      { label: 'Brand films', value: '24' },
    ],
  },
  {
    slug: 'rosa-quintero',
    name: 'Rosa Quintero',
    division: 'creators',
    role: 'Comedian and creator',
    base: 'Mexico City',
    languages: ['Spanish', 'English'],
    skills: ['Sketch', 'Stand-up', 'Writing'],
    availability: 'available',
    agent: 'noor-haddad',
    hue: 300,
    pose: 1,
    quote: 'If it is not a little dangerous, it is not funny.',
    bio: [
      'Rosa writes and performs sketch comedy for an audience spread across two languages, and tours stand-up every autumn.',
      'Her first scripted series, Tía Problems, is in development.',
    ],
    credits: [
      { year: 2026, title: 'Tía Problems', role: 'Creator, writer', kind: 'Series' },
      { year: 2025, title: 'Rosa Live', role: 'Performer', kind: 'Special' },
    ],
    reel: { title: 'Sketch reel', seconds: 74 },
    stats: [
      { label: 'Followers', value: '5.8M' },
      { label: 'Tour dates', value: '46' },
      { label: 'Sketches', value: '600' },
    ],
  },
]

export const talentBySlug = (slug: string) => TALENT.find((t) => t.slug === slug)

// ---------------------------------------------------------------------------
// Agents

export type Agent = { slug: string; name: string; title: string; office: string; email: string; hue: number; pose: number }

export const AGENTS: Agent[] = [
  { slug: 'noor-haddad', name: 'Noor Haddad', title: 'Founding partner, film and series', office: 'London', email: 'noor@bravura.example', hue: 265, pose: 0 },
  { slug: 'marco-bellini', name: 'Marco Bellini', title: 'Partner, features and directors', office: 'Los Angeles', email: 'marco@bravura.example', hue: 20, pose: 1 },
  { slug: 'jae-soo-han', name: 'Jae-soo Han', title: 'Head of micro-drama and Asia', office: 'Seoul', email: 'jaesoo@bravura.example', hue: 330, pose: 3 },
  { slug: 'freya-moss', name: 'Freya Moss', title: 'Head of voices and creators', office: 'London', email: 'freya@bravura.example', hue: 200, pose: 2 },
]

export const agentBySlug = (slug: string) => AGENTS.find((a) => a.slug === slug)

// ---------------------------------------------------------------------------
// Work

export const WORK_KINDS = ['Feature film', 'Series', 'Unscripted', 'Micro-drama', 'Commercial'] as const
export type WorkKind = (typeof WORK_KINDS)[number]
export type WorkStatus = 'Released' | 'In production' | 'Coming soon'

export type Project = {
  slug: string
  title: string
  kind: WorkKind
  year: number
  studio: string
  status: WorkStatus
  logline: string
  talent: string[]
  hue: number
}

export const WORK: Project[] = [
  { slug: 'glasswing', title: 'Glasswing', kind: 'Feature film', year: 2026, studio: 'Northlight Pictures', status: 'Released', logline: 'A glassblower’s apprentice discovers the insects she breathes into life are watching the city for her.', talent: ['ines-varga', 'sasha-novak'], hue: 268 },
  { slug: 'lowlight', title: 'Lowlight, season two', kind: 'Series', year: 2026, studio: 'Harbour Television', status: 'In production', logline: 'A night-shift detective works the cases the day shift would rather forget.', talent: ['theo-adebayo'], hue: 210 },
  { slug: 'paper-lanterns', title: 'Paper Lanterns', kind: 'Micro-drama', year: 2026, studio: 'Reel Ninety', status: 'Released', logline: 'Ninety episodes, ninety seconds each: one summer, two families, a secret neither will name.', talent: ['mei-lin-park', 'hana-ito'], hue: 330 },
  { slug: 'the-proving-ground', title: 'The Proving Ground', kind: 'Unscripted', year: 2026, studio: 'Open Field Media', status: 'Coming soon', logline: 'Twelve strangers, one abandoned film set and thirty days to make a movie.', talent: ['diego-almeida'], hue: 150 },
  { slug: 'ember-year', title: 'Ember Year', kind: 'Feature film', year: 2026, studio: 'Saltmarsh Films', status: 'Released', logline: 'The last summer before university, told through the bonfires of one coastal town.', talent: ['amara-osei'], hue: 30 },
  { slug: 'second-helpings', title: 'Second Helpings', kind: 'Series', year: 2026, studio: 'Larder Studios', status: 'Released', logline: 'Leftovers, reinvented: a road trip through the kitchens of people who never waste a thing.', talent: ['priya-raman'], hue: 45 },
  { slug: 'iron-bloom', title: 'Iron Bloom', kind: 'Commercial', year: 2025, studio: 'Forge Motors', status: 'Released', logline: 'A car, a foundry and a single unbroken take through molten light.', talent: ['sasha-novak'], hue: 15 },
  { slug: 'the-long-field', title: 'The Long Field', kind: 'Feature film', year: 2025, studio: 'Greenway Pictures', status: 'Released', logline: 'A farmer and his estranged son walk the boundary of the land they are about to lose.', talent: ['callum-reyes'], hue: 110 },
  { slug: 'tia-problems', title: 'Tía Problems', kind: 'Series', year: 2026, studio: 'Casa Cómica', status: 'Coming soon', logline: 'An aunt with opinions moves in, and the family group chat will never recover.', talent: ['rosa-quintero'], hue: 300 },
  { slug: 'moonrise-avenue', title: 'Moonrise Avenue', kind: 'Micro-drama', year: 2024, studio: 'Reel Ninety', status: 'Released', logline: 'A night-market vendor and a pop idol swap phones and, briefly, lives.', talent: ['mei-lin-park', 'hana-ito'], hue: 250 },
  { slug: 'northern-waters', title: 'Northern Waters', kind: 'Unscripted', year: 2025, studio: 'Fjord Natural History', status: 'Released', logline: 'A year beneath the ice, narrated from the surface.', talent: ['oskar-lindahl'], hue: 195 },
  { slug: 'skylark', title: 'Skylark', kind: 'Feature film', year: 2026, studio: 'Paperbird Animation', status: 'In production', logline: 'A small bird with a big voice sings a storm out of the sky.', talent: ['lucia-fontaine'], hue: 55 },
]

// ---------------------------------------------------------------------------
// Journal

export type Post = {
  slug: string
  title: string
  date: string
  category: 'News' | 'Signings' | 'Behind the scenes' | 'Advice'
  minutes: number
  excerpt: string
  body: string[]
  hue: number
}

export const POSTS: Post[] = [
  {
    slug: 'glasswing-opens',
    title: 'Glasswing opens to a standing ovation',
    date: '2026-10-24',
    category: 'News',
    minutes: 4,
    excerpt: 'Ines Varga and Sasha Novak on building a city of glass insects with almost no green screen.',
    hue: 268,
    body: [
      'Glasswing premiered to a full house and a long ovation. Director Sasha Novak and lead Ines Varga have been with Bravura for a combined eleven years, and this is the first time they have worked together.',
      'Almost every creature in the film was built by hand. Sasha’s workshop spent eight months blowing, cutting and wiring glass wings that could be lit from inside on set.',
      'Ines trained with a glassblower for six weeks before the shoot. The burns on her character’s hands are make-up; the technique is real.',
    ],
  },
  {
    slug: 'welcome-amara-osei',
    title: 'Welcome to the roster, Amara Osei',
    date: '2026-10-02',
    category: 'Signings',
    minutes: 2,
    excerpt: 'The Ember Year lead joins our London performers list.',
    hue: 40,
    body: [
      'We are proud to welcome Amara Osei to Bravura. Amara left drama school a year early to lead Ember Year, and she has not stopped since.',
      'She will be represented by Marco Bellini in Los Angeles, working closely with our London office.',
    ],
  },
  {
    slug: 'micro-drama-casting',
    title: 'How casting works for a ninety-second drama',
    date: '2026-09-15',
    category: 'Behind the scenes',
    minutes: 6,
    excerpt: 'Hana Ito and Jae-soo Han on casting for the vertical screen, where the audience decides in one second.',
    hue: 330,
    body: [
      'A vertical micro-drama is shot fast: often a hundred episodes in three weeks. Casting is the single biggest decision, because there is no time to fix a pairing on set.',
      'Hana runs chemistry reads in pairs on a phone, framed exactly as the audience will see them. If it does not land on the small screen, it does not land.',
      'For performers, the lesson is simple: play to the lens, not the room.',
    ],
  },
  {
    slug: 'self-tape-guide',
    title: 'A self-tape that gets you in the room',
    date: '2026-08-28',
    category: 'Advice',
    minutes: 5,
    excerpt: 'Light, sound, framing and the slate: what our agents look for in the first ten seconds.',
    hue: 200,
    body: [
      'Face a window or a soft lamp. Avoid overhead light, which hides your eyes.',
      'Sound matters more than picture. Record in a small room with soft furnishings, and keep your reader quieter than you.',
      'Frame from mid-chest up, eyes in the top third. Slate with your name, height and location, then go straight into the scene.',
    ],
  },
  {
    slug: 'seoul-office',
    title: 'Bravura opens in Seoul',
    date: '2026-07-01',
    category: 'News',
    minutes: 3,
    excerpt: 'Our third office brings the micro-drama division closer to where the format was born.',
    hue: 320,
    body: [
      'Our Seoul office opens this month under Jae-soo Han, who leads the micro-drama division and our work across Asia.',
      'The office has a self-tape studio that represented talent can book for free.',
    ],
  },
]

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug)

// ---------------------------------------------------------------------------
// Home

export const HOME = {
  timecodeStart: 3 * 25 + 18,
  hudLabels: [
    { label: 'Performers', to: '/talent?division=performers' },
    { label: 'Voices', to: '/talent?division=voices' },
    { label: 'Directors', to: '/talent?division=directors' },
    { label: 'Creators', to: '/talent?division=creators' },
  ],
  scribble: 'est. 09',
  intro: {
    eyebrow: 'The agency',
    title: 'World-makers, represented.',
    body: 'We represent actors, voices, directors and creators across film, series, unscripted and micro-drama. Small lists, senior agents and a phone that is always answered.',
  },
  stats: [
    { value: '140', label: 'Represented artists' },
    { value: '3', label: 'Offices: London, Los Angeles, Seoul' },
    { value: '1,900', label: 'Bookings last year' },
    { value: '17', label: 'Years in the business' },
  ],
  services: [
    { title: 'Representation', body: 'Career strategy, negotiation and the long view, from first audition to first-look deal.' },
    { title: 'Casting support', body: 'Shortlists in a day for productions, with self-tapes and availability attached.' },
    { title: 'Brand partnerships', body: 'Matching creators and performers with brands for work their audiences welcome.' },
    { title: 'Development', body: 'Packaging writers, directors and talent into projects we take to studios together.' },
  ],
  quotes: [
    { quote: 'They sent a shortlist in four hours and every name on it was right.', name: 'Casting director', org: 'Harbour Television' },
    { quote: 'The only agency that read the whole script before calling.', name: 'Producer', org: 'Northlight Pictures' },
  ],
  cta: { title: 'Casting something bold?', body: 'Tell us about the project and an agent will reply within one working day.', primary: 'Start a booking', secondary: 'Join the roster' },
}

export const ABOUT = {
  eyebrow: 'About us',
  title: 'Built for the bold',
  lead: 'Bravura began in a two-room office above a cinema in 2009 with four clients and one rule: only sign people we would cross the city to watch.',
  body: [
    'We now represent around 140 artists from three offices. We keep each agent’s list short on purpose, so every client gets a senior agent who knows their work scene by scene.',
    'We are as comfortable negotiating a studio feature as a hundred-episode vertical drama. The format changes; the craft and the care do not.',
  ],
  values: [
    { title: 'Small lists', body: 'No agent carries more than forty clients.' },
    { title: 'Read everything', body: 'We read the full script before we put anyone forward.' },
    { title: 'Fair terms', body: 'Standard commission, no hidden fees, no paid workshops.' },
    { title: 'Every format', body: 'Feature, series, unscripted, micro-drama, voice and brand.' },
  ],
  timeline: [
    { year: '2009', text: 'Founded in London with four clients.' },
    { year: '2014', text: 'Voices division launches.' },
    { year: '2018', text: 'Los Angeles office opens.' },
    { year: '2022', text: 'Micro-drama and creators divisions.' },
    { year: '2026', text: 'Seoul office opens.' },
  ],
}

export const OFFICES = [
  { city: 'London', address: '14 Cinema Yard, London W1F 0AA', phone: '+44 20 7946 0321', hours: 'Mon–Fri, 9:00–18:30', time: 'Europe/London' },
  { city: 'Los Angeles', address: '820 Sunset Lane, Los Angeles, CA 90028', phone: '+1 310 555 0144', hours: 'Mon–Fri, 9:00–18:00', time: 'America/Los_Angeles' },
  { city: 'Seoul', address: '31 Hangang-daero, Yongsan-gu, Seoul', phone: '+82 2 555 0190', hours: 'Mon–Fri, 10:00–19:00', time: 'Asia/Seoul' },
]

// ---------------------------------------------------------------------------
// Forms

export const PROJECT_TYPES = ['Feature film', 'Series', 'Unscripted', 'Micro-drama', 'Commercial', 'Voice or audio', 'Brand partnership', 'Live event', 'Other'] as const
export const BUDGETS = ['Under £10k', '£10k–£50k', '£50k–£250k', '£250k+', 'Not sure yet'] as const

export const CONTACT = {
  eyebrow: 'Contact',
  title: 'Start a booking',
  lead: 'Tell us about the project. Bookings and casting requests get a reply from an agent within one working day.',
  success: 'Thank you. An agent will reply within one working day. Your reference is',
}

export const JOIN = {
  eyebrow: 'Join the roster',
  title: 'Represent yourself boldly',
  lead: 'We review every submission. If your work is a fit, an agent will invite you to meet within four weeks.',
  steps: ['About you', 'Your work', 'Confirm'],
  notes: [
    'We never charge a fee to join or to be considered.',
    'You must be 18 or over to submit yourself; under-18s apply through a parent or guardian.',
    'We keep submissions for 12 months, then delete them.',
  ],
  success: 'Submission received. We review every one and reply within four weeks. Your reference is',
}

export const SHORTLIST = {
  title: 'Your shortlist',
  lead: 'Talent you save while browsing stays here on this device. Send the list to us as a brief and we will confirm availability.',
  empty: 'Nothing saved yet. Use the plus on any profile to add it here.',
}

export const FOOTER = {
  newsletter: { title: 'The call sheet', body: 'Signings, premieres and open calls, once a month.' },
  legal: `© ${new Date().getFullYear()} Bravura Talent Ltd. A fictional agency for this template.`,
}
