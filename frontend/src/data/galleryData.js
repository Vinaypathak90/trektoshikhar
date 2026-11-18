// Curated Trek-Wise Expedition Gallery Data for TrekToShikhar
// Single source of truth shared between /gallery page & Homepage #gallery showcase

export const GALLERY_HERO_SLIDES = [
  {
    id: 'gh-1',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    title: 'Kedarkantha Summit Sunrise',
    location: 'Sankri, Uttarakhand (12,500 ft)',
    caption: 'First golden rays hitting the Swargarohini & Bandarpoonch amphitheater.'
  },
  {
    id: 'gh-2',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85',
    title: 'Alpine Ridge Expedition Walk',
    location: 'Garhwal Himalayas (11,400 ft)',
    caption: 'Small-batch Shikharites moving steadily along a pristine winter snow crest.'
  },
  {
    id: 'gh-3',
    url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1920&q=85',
    title: 'Starlit Base Camp Glow',
    location: 'Nag Tibba Base Camp (7,600 ft)',
    caption: '4-season waterproof dome tents glowing warmly under crisp Himalayan skies.'
  },
  {
    id: 'gh-4',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    title: 'Shimla Pine & Alpine Valley',
    location: 'Narkanda / Hatu Peak (11,150 ft)',
    caption: 'Misty cedar canopies opening out into emerald and snow-dusted horizons.'
  }
];

export const GALLERY_PHOTOS = [
  // ====================================================================
  // 1. KEDARKANTHA SUMMIT EXPEDITION
  // ====================================================================
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    title: 'Kedarkantha Dawn Summit Panorama',
    trekName: 'Kedarkantha Summit Expedition',
    trekSlug: 'kedarkantha-summit-expedition',
    category: 'Summit Views',
    location: 'Sankri, Uttarakhand',
    altitude: '12,500 ft',
    capturedAt: 'Jan 2026 • 6:22 AM',
    photographer: 'Raghav Chauhan (Lead Guide)',
    details: 'Captured moments after our 3:00 AM alpine push from Hargaon Base. At -7°C, the entire Garhwal skyline ignited in molten gold across Swargarohini, Black Peak, and Gangotri.',
    featuredOnHome: true
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
    title: 'Final Ridge Push in Knee-Deep Snow',
    trekName: 'Kedarkantha Summit Expedition',
    trekSlug: 'kedarkantha-summit-expedition',
    category: 'Winter Snow',
    location: 'Kedarkantha Shoulder Ridge',
    altitude: '11,850 ft',
    capturedAt: 'Dec 2025 • 5:45 AM',
    photographer: 'Vinay Pathak',
    details: 'Our strict 14-trekker Shikharite batch moving in calm single-file rhythm with microspikes and gaiters. Clear skies, crunchy fresh powder, and unstoppable team spirit.',
    featuredOnHome: false
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    title: 'Milky Way Over Juda Ka Talab',
    trekName: 'Kedarkantha Summit Expedition',
    trekSlug: 'kedarkantha-summit-expedition',
    category: 'Camp Life',
    location: 'Juda Ka Talab Campsite',
    altitude: '9,100 ft',
    capturedAt: 'Jan 2026 • 10:15 PM',
    photographer: 'Devendra Negi',
    details: 'After hot mountain soup and stories around camp, the frozen pine-ringed lake reflected millions of winter stars with zero light pollution.',
    featuredOnHome: false
  },

  // ====================================================================
  // 2. NAG TIBBA WEEKEND TREK
  // ====================================================================
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    title: 'Nag Tibba Flag Crest & Garhwal Wall',
    trekName: 'Nag Tibba Weekend Trek',
    trekSlug: 'nag-tibba-weekend-trek',
    category: 'Summit Views',
    location: 'Pantwari, Dehradun Base',
    altitude: '9,915 ft',
    capturedAt: 'Feb 2026 • 7:40 AM',
    photographer: 'Ananya Rawat',
    details: 'Standing at the Serpent’s Peak summit with fluttering Tibetan prayer flags and an unobstructed 360-degree view of Bandarpoonch and Kedarnath domes.',
    featuredOnHome: true
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1400&q=85',
    title: 'Nag Tibba Base Camp Twilight Tents',
    trekName: 'Nag Tibba Weekend Trek',
    trekSlug: 'nag-tibba-weekend-trek',
    category: 'Camp Life',
    location: 'Nag Tibba Base Clearing',
    altitude: '7,600 ft',
    capturedAt: 'Nov 2025 • 6:10 PM',
    photographer: 'Vinay Pathak',
    details: 'Freshly pitched 4-season waterproof dome tents nestled amidst ancient oak canopies just as hot ginger-lemon tea and pakoras were served to our weekend batch.',
    featuredOnHome: true
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85',
    title: 'Sunbeams Through Dense Oak Canopy',
    trekName: 'Nag Tibba Weekend Trek',
    trekSlug: 'nag-tibba-weekend-trek',
    category: 'Forest Trails',
    location: 'Pantwari to Goat Village Trail',
    altitude: '6,400 ft',
    capturedAt: 'Mar 2026 • 9:30 AM',
    photographer: 'Shikharite Batch #42',
    details: 'Morning rays piercing moss-covered oak and rhododendron forests during Day 1 ascent. Ideal cool shade and gentle gradients for first-time Himalayan trekkers.',
    featuredOnHome: true
  },

  // ====================================================================
  // 3. HATU PEAK & ALPINE RIDGE (SHIMLA)
  // ====================================================================
  {
    id: 'gal-7',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    title: 'Shimla Alpine Valley Pastel Sunrise',
    trekName: 'Hatu Peak & Alpine Ridge',
    trekSlug: 'hatu-peak-alpine-ridge',
    category: 'Summit Views',
    location: 'Narkanda, Shimla Base',
    altitude: '11,150 ft',
    capturedAt: 'Feb 2026 • 6:50 AM',
    photographer: 'Raghav Chauhan',
    details: 'Looking across the serene Narkanda valleys and Greater Himalayan snow line from the ancient wooden Hatu Mata sanctuary ridge.',
    featuredOnHome: true
  },
  {
    id: 'gal-8',
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85',
    title: 'Snow-Dusted Deodar Ridge Walk',
    trekName: 'Hatu Peak & Alpine Ridge',
    trekSlug: 'hatu-peak-alpine-ridge',
    category: 'Winter Snow',
    location: 'Hatu Forest Crest, Himachal',
    altitude: '10,600 ft',
    capturedAt: 'Jan 2026 • 11:05 AM',
    photographer: 'Ananya Rawat',
    details: 'Crisp winter air, untouched white deodar boughs, and dramatic cloud inversions drifting beneath our boots along the Shimla alpine trail.',
    featuredOnHome: false
  },
  {
    id: 'gal-9',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
    title: 'Sea of Clouds Below Narkanda Crest',
    trekName: 'Hatu Peak & Alpine Ridge',
    trekSlug: 'hatu-peak-alpine-ridge',
    category: 'Forest Trails',
    location: 'Hatu Viewpoint',
    altitude: '11,020 ft',
    capturedAt: 'Oct 2025 • 4:55 PM',
    photographer: 'Devendra Negi',
    details: 'Post-monsoon clarity created a surreal ocean of valley clouds right beneath the ridge as our group paused for trail snacks and group portraits.',
    featuredOnHome: false
  },

  // ====================================================================
  // 4. CHURDHAR SANCTUARY TREK (SHIMLA)
  // ====================================================================
  {
    id: 'gal-10',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=85',
    title: 'Churdhar Peak Dramatic Silhouette',
    trekName: 'Churdhar Sanctuary Trek',
    trekSlug: 'churdhar-sanctuary-trek',
    category: 'Summit Views',
    location: 'Nauradhar, Himachal Pradesh',
    altitude: '11,965 ft',
    capturedAt: 'Nov 2025 • 8:15 AM',
    photographer: 'Raghav Chauhan',
    details: 'The highest peak of the Outer Himalayas standing tall above glacial boulder fields and sacred wildlife sanctuary ridges.',
    featuredOnHome: true
  },
  {
    id: 'gal-11',
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85',
    title: 'Sacred Deodar Trail Into Wilderness',
    trekName: 'Churdhar Sanctuary Trek',
    trekSlug: 'churdhar-sanctuary-trek',
    category: 'Forest Trails',
    location: 'Teesri Meadow Approach',
    altitude: '9,800 ft',
    capturedAt: 'Oct 2025 • 1:20 PM',
    photographer: 'Vinay Pathak',
    details: 'Walking deep inside Churdhar Wildlife Sanctuary where ancient cedar trees give way to sweeping high-altitude meadows and wild Himalayan herbs.',
    featuredOnHome: false
  },

  // ====================================================================
  // 5. BRAHMATAL WINTER SUMMIT TREK
  // ====================================================================
  {
    id: 'gal-12',
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1400&q=85',
    title: 'Trishul & Nanda Ghunti From Brahmatal',
    trekName: 'Brahmatal Winter Summit Trek',
    trekSlug: 'brahmatal-winter-summit-trek',
    category: 'Winter Snow',
    location: 'Lohajung, Chamoli',
    altitude: '12,250 ft',
    capturedAt: 'Feb 2026 • 8:05 AM',
    photographer: 'Ananya Rawat',
    details: 'Face-to-face with the towering 7,000-meter giants Mt. Trishul and Nanda Ghunti gleaming under cobalt winter skies after a fresh overnight snowfall.',
    featuredOnHome: false
  },
  {
    id: 'gal-13',
    url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1400&q=85',
    title: 'Sub-Zero Alpine Tent Life at Bekaltal',
    trekName: 'Brahmatal Winter Summit Trek',
    trekSlug: 'brahmatal-winter-summit-trek',
    category: 'Camp Life',
    location: 'Bekaltal Frozen Lake Camp',
    altitude: '9,885 ft',
    capturedAt: 'Jan 2026 • 7:20 PM',
    photographer: 'Devendra Negi',
    details: 'Inside -10°C rated thermal sleeping bags with evening oximeter checks complete — cozy warmth and laughter echoing across the silent snow meadow.',
    featuredOnHome: false
  },

  // ====================================================================
  // 6. HAR KI DUN & SHIKHARITE COMMUNITY
  // ====================================================================
  {
    id: 'gal-14',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',
    title: 'Valley of Gods River Crossing Panorama',
    trekName: 'Har Ki Dun Valley Trek',
    trekSlug: 'har-ki-dun-valley-trek',
    category: 'Summit Views',
    location: 'Osla Village, Govind Wildlife Sanctuary',
    altitude: '11,700 ft',
    capturedAt: 'Apr 2026 • 10:45 AM',
    photographer: 'Vinay Pathak',
    details: 'Glacial turquoise Supin river winding past centuries-old wooden Himalayan villages on the iconic Har Ki Dun valley approach.',
    featuredOnHome: false
  },
  {
    id: 'gal-15',
    url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1400&q=85',
    title: 'Once a Shikharite, Always a Shikharite',
    trekName: 'Har Ki Dun Valley Trek',
    trekSlug: 'har-ki-dun-valley-trek',
    category: 'Shikharite Family',
    location: 'Kalkattiyadhar Meadow',
    altitude: '10,400 ft',
    capturedAt: 'Apr 2026 • 4:10 PM',
    photographer: 'Batch #51 Memories',
    details: 'Strangers who met at Dehradun station five days earlier celebrating together above the clouds — proving that the best part of every trail is the family you find.',
    featuredOnHome: false
  }
];
