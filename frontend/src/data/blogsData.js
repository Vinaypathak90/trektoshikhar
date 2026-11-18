// TrekToShikhar — Himalayan Trail Journals, Field Guides & Mountain Stories
// Single Source of Truth shared between Homepage (#blog), /blog, and /blog/:slug

export const BLOG_HERO_SLIDES = [
  {
    id: 'blog-slide-1',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85',
    title: 'High Ridge Field Dispatches',
    location: 'Garhwal & Kinnaur Himalayas',
    caption: 'Real-world trekking wisdom written by NIM & ABVIMAS certified leaders.'
  },
  {
    id: 'blog-slide-2',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    title: 'Winter Summit Chronicles',
    location: 'Kedarkantha & Brahmatal',
    caption: 'Sub-zero layering tactics, snowcraft, and dawn ridge strategies.'
  },
  {
    id: 'blog-slide-3',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    title: 'Alpine Meadow Journals',
    location: 'Shimla & Narkanda Foothills',
    caption: 'Weekend summit escapes, cedar forests, and ancient mountain folklore.'
  },
  {
    id: 'blog-slide-4',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=85',
    title: 'High-Altitude Safety Notes',
    location: '10,000 ft – 14,500 ft Trails',
    caption: 'Acclimatization, hydration, and zero-trace mountain ethics for every Shikharite.'
  }
];

export const BLOG_CATEGORIES = [
  'All',
  'Beginner Guides',
  'Destinations',
  'Gear & Packing',
  'Safety & Altitude',
  'Mountain Stories'
];

export const BLOG_POSTS = [
  {
    id: 1,
    slug: 'first-time-trekking-in-himalayas-7-rookie-mistakes',
    title: 'First Time Trekking in Himalayas? Top 7 Rookie Mistakes to Avoid',
    subtitle: 'From packing heavy cotton hoodies to rushing the first 2 km — here is everything our certified trek leaders want you to know before stepping onto your first Himalayan trail.',
    excerpt: 'From packing heavy cotton sweaters to ignoring hydration: here is everything certified guides want you to know before your first mountain trip.',
    category: 'Beginner Guides',
    tags: ['First Trek', 'Beginners', 'Fitness', 'Packing', 'Hydration'],
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
    readTime: '5 min read',
    readMinutes: 5,
    publishedAt: 'Nov 2026',
    seasonTag: 'All Seasons',
    difficultyTag: 'Essential Reading',
    views: '4.8k',
    featured: true,
    featuredOnHome: true,
    relatedTrekSlug: 'nag-tibba-weekend-trek',
    relatedTrekName: 'Nag Tibba Weekend Trek',
    author: {
      name: 'Vikram Rawat',
      role: 'Chief Expedition Leader (NIM Uttarkashi)',
      base: 'Dehradun Base Camp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Over 11 years leading high-altitude winter and monsoon expeditions across Garhwal and Himachal. Passionate about turning nervous first-timers into lifelong Shikharites.'
    },
    keyTakeaways: [
      'Never wear cotton on a Himalayan trail — sweat freezes fast once you stop moving.',
      'Break in your trekking shoes at least 2 weeks before departure to avoid summit-ending blisters.',
      'Walk slow, breathe rhythmically, and sip 3–4 liters of water daily to prevent altitude headaches.',
      'Pack light (under 7–8 kg for weekend treks) — every extra kilo feels like three above 10,000 ft.'
    ],
    sections: [
      {
        id: 'cotton-trap',
        heading: '1. Wearing Cotton Layers Instead of Quick-Dry Synthetics',
        paragraphs: [
          'In the plains, a thick cotton sweatshirt feels cozy. In the Himalayas, mountaineers call cotton the "silent chiller." As you climb steep oak-forest switchbacks, your body sweats heavily. Cotton absorbs that moisture like a sponge and holds it right against your skin.',
          'The moment you pause at a windy ridge or reach camp at sunset, wet cotton drains your body heat rapidly. Always start with a moisture-wicking polyester or merino wool base layer, add a lightweight fleece, and carry a windproof shell in your daypack.'
        ],
        tipBox: {
          type: 'tip',
          title: 'Shikhar Leader Rule: Start Slightly Cool',
          text: 'If you feel warm standing still at the trailhead, you are overdressed. You should feel slightly chilly for the first 10 minutes — your body warms up fast once the climb begins.'
        }
      },
      {
        id: 'brand-new-shoes',
        heading: '2. Bringing Brand-New, Unbroken Trekking Shoes',
        paragraphs: [
          'Nothing ruins a dream summit sunrise faster than raw heel blisters on Day 1. Buying high-ankle waterproof boots two days before your train to Dehradun or Shimla is one of the most common first-timer mistakes we witness.',
          'Walk at least 15–20 km in your trekking boots around your city, including stairs, wearing the exact woolen socks you plan to trek in. Also trim your toenails short — downhill descents press toes straight into the front of the boot.'
        ]
      },
      {
        id: 'pacing-and-hydration',
        heading: '3. Sprinting the First Hour & Forgetting Water',
        paragraphs: [
          'Adrenaline runs high at the trailhead. First-timers often overtake the trek leader in the opening kilometer, burn through their glycogen reserves, and hit a wall halfway to camp. Trekking is not a race; it is a rhythmic, meditative cadence.',
          'Cold mountain air suppresses your thirst reflex even while dry high-altitude air dehydrates you twice as fast. Take small sips every 20 minutes rather than gulping a liter at rest stops.'
        ],
        quote: {
          text: 'The mountains do not reward the fastest climber; they reward the climber who respects their breath and listens to the trail.',
          author: 'Vikram Rawat, TrekToShikhar Lead'
        }
      },
      {
        id: 'overpacking-and-silence',
        heading: '4. Overpacking & Hiding Early Altitude Symptoms',
        paragraphs: [
          'Skip denim jeans, heavy power banks, five outfit changes, and oversized cosmetics. On a 2-to-5 day Himalayan trek, simplicity is freedom. Two quick-dry tees, one fleece, one down jacket, thermal sleepwear, and a headlamp cover 95% of your needs.',
          'Finally, never hide a throbbing headache, nausea, or dizziness out of fear of slowing the group down. Our leaders carry pulse oximeters and oxygen cylinders on every batch — speaking up early turns a minor hiccup into a safe, joyful summit.'
        ],
        tipBox: {
          type: 'warning',
          title: 'Golden Safety Protocol',
          text: 'Report any headache or loss of appetite to your Trek Leader immediately at camp. Early hydration, rest, and oxygen monitoring resolve 99% of mild acclimatization discomfort.'
        }
      }
    ]
  },
  {
    id: 2,
    slug: 'why-nag-tibba-and-hatu-peak-are-indias-best-weekend-escapes',
    title: "Why Nag Tibba & Hatu Peak are India's Best Weekend Escapes",
    subtitle: 'Zero office leaves required. Trade Friday evening city traffic for 10,000+ ft Himalayan summits, ancient wooden temples, and starry alpine camps by Saturday night.',
    excerpt: 'Quick access from Delhi, Chandigarh, and Dehradun with zero leaves required. Experience real 10,000 ft snowscapes in 48 hours.',
    category: 'Destinations',
    tags: ['Weekend Treks', 'Nag Tibba', 'Hatu Peak', 'Dehradun', 'Shimla'],
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    readTime: '6 min read',
    readMinutes: 6,
    publishedAt: 'Oct 2026',
    seasonTag: 'Oct – May',
    difficultyTag: 'Weekend Special',
    views: '3.9k',
    featured: false,
    featuredOnHome: true,
    relatedTrekSlug: 'hatu-peak-alpine-ridge',
    relatedTrekName: 'Hatu Peak & Alpine Ridge',
    author: {
      name: 'Meera Thakur',
      role: 'Shimla Operations & Alpine Guide (ABVIMAS)',
      base: 'Shimla Base Camp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Born in the apple valleys of Himachal, Meera curates quiet forest ridge routes around Narkanda, Shimla, and Kinnaur with a deep love for Pahari architecture and local storytelling.'
    },
    keyTakeaways: [
      'Both summits sit around 10,000–11,150 ft yet require only Saturday & Sunday off work.',
      'Nag Tibba (Dehradun base) offers dramatic 360° views of Bandarpoonch, Swargarohini & Kedarnath.',
      'Hatu Peak (Shimla/Narkanda base) blends cedar forests, Jor Bagh meadows & the sacred wooden Hatu Mata temple.',
      'Both are ideal confidence-builders before stepping up to 12,500+ ft expeditions like Kedarkantha or Brahmatal.'
    ],
    sections: [
      {
        id: 'weekend-revolution',
        heading: 'The 48-Hour Himalayan Reset',
        paragraphs: [
          'For most working professionals and students across Delhi NCR, Chandigarh, and Dehradun, getting a full week off work is rare. That does not mean you have to settle for crowded mall roads and noisy hill-station traffic jams.',
          'Within 3.5 hours of Dehradun or Shimla, two extraordinary high-altitude summits offer true alpine camping, ancient oak and deodar forests, and sweeping snow-clad horizons — all wrapped neatly into a Saturday–Sunday itinerary.'
        ]
      },
      {
        id: 'nag-tibba-magic',
        heading: "Nag Tibba (9,915 ft): Garhwal's Serpent Peak",
        paragraphs: [
          'Starting from the picturesque village of Pantwari beyond Mussoorie, Nag Tibba climbs steadily through rhododendron corridors and traditional Goat Village trails up to a sheltered clearing at 7,600 ft.',
          'At dawn on Sunday, a thrilling 3.5 km push brings you to the Nag Tibba Flag Top. On clear mornings, the entire Garhwal skyline ignites in gold — Bandarpoonch, Kala Nag, Srikantha, and Gangotri peaks standing shoulder to shoulder.'
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
          caption: 'Alpine dome tents glowing beneath the Himalayan night sky at base camp.'
        }
      },
      {
        id: 'hatu-peak-magic',
        heading: 'Hatu Peak (11,150 ft): Shimla’s Sacred Cedar Crown',
        paragraphs: [
          'Rising quietly above Narkanda’s famous apple orchards, Hatu Peak is Himachal’s hidden gem for trekkers who crave stillness. Instead of dusty tourist paths, TrekToShikhar takes you through towering Himalayan spruce forests and the emerald pastures of Jor Bagh.',
          'At the summit stands the exquisitely hand-carved wooden Hatu Mata Temple, flanked by ancient stone hearths linked to the Pandavas and sweeping panoramas of the Pir Panjal and Kinnaur Kailash ranges.'
        ],
        tipBox: {
          type: 'tip',
          title: 'Which One Should You Pick First?',
          text: 'Choose Nag Tibba if you are travelling via Dehradun/Delhi and want a steeper, classic summit push. Choose Hatu Peak if you are coming via Chandigarh/Shimla and love serene deodar forests and wooden Pahari heritage.'
        }
      }
    ]
  },
  {
    id: 3,
    slug: 'essential-winter-trek-gear-checklist-3-layer-system',
    title: 'Essential Winter Trek Gear Checklist: The 3-Layer System Explained',
    subtitle: 'Stop carrying bulky 2 kg coats that trap sweat. Master the exact alpine layering science used by mountaineers to stay warm at -10°C without weighing down your pack.',
    excerpt: 'How base layers, fleece insulation, and waterproof windbreakers keep you toasty even at sub-zero summit temperatures.',
    category: 'Gear & Packing',
    tags: ['Winter Treks', 'Layering', 'Gear Checklist', 'Kedarkantha', 'Sub-Zero'],
    coverImage: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=85',
    readTime: '6 min read',
    readMinutes: 6,
    publishedAt: 'Oct 2026',
    seasonTag: 'Dec – Mar',
    difficultyTag: 'Gear Mastery',
    views: '5.2k',
    featured: false,
    featuredOnHome: true,
    relatedTrekSlug: 'kedarkantha-summit-expedition',
    relatedTrekName: 'Kedarkantha Summit Expedition',
    author: {
      name: 'Rohan Negi',
      role: 'Winter Snowcraft & Gear Specialist',
      base: 'Dehradun Base Camp',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Equipment quartermaster at TrekToShikhar. Obsessed with ultralight winter layering, crampon safety, and helping trekkers avoid wasting money on overpriced gear.'
    },
    keyTakeaways: [
      'Layer 1 (Base): Snug synthetic or merino wool thermal that wicks sweat off your skin.',
      'Layer 2 (Mid): Breathable fleece + padded down/synthetic jacket to trap warm air pockets.',
      'Layer 3 (Shell): Windproof & waterproof outer hardshell that blocks icy summit gusts.',
      'Protect your extremities — 40% of perceived cold comes from wet socks, bare ears, or uninsulated fingers.'
    ],
    sections: [
      {
        id: 'why-layering-wins',
        heading: 'Why 3 Thin Layers Beat 1 Heavy Jacket',
        paragraphs: [
          'On a winter trek like Kedarkantha or Brahmatal, temperatures swing wildly — from +10°C under bright noon sun on an uphill climb to -10°C at 3:00 AM during your summit push.',
          'One massive parka gives you only two modes: roasting in sweat or freezing without it. A smart 3-layer system lets you zip, peel, and add warmth effortlessly as the mountain weather shifts.'
        ]
      },
      {
        id: 'three-layers-breakdown',
        heading: 'Breaking Down Each Layer Like a Pro',
        paragraphs: [
          '1) Base Layer (Moisture Management): A snug-fitting polyester or merino wool thermal top and bottom. It should feel like a second skin, moving sweat outward so you stay bone dry.',
          '2) Mid Layer (Heat Retention): A lightweight fleece pullover for active hiking, paired with a compressible down or synthetic puffer jacket (-5°C to -10°C rated) that you throw on immediately when reaching camp or pausing on summit ridges.',
          '3) Outer Shell (Weather Shield): A breathable, seam-sealed windproof and waterproof jacket. Even if it is not snowing, a 35 km/h Himalayan ridge wind cuts straight through fleece without a wind-blocking shell.'
        ],
        tipBox: {
          type: 'tip',
          title: 'Sleeping Bag Warmth Hack',
          text: 'Keep one dedicated pair of dry woolen socks and fresh thermals strictly for sleeping. Never crawl into your sleeping bag wearing the damp clothes you trekked in all day.'
        }
      },
      {
        id: 'extremities-and-optics',
        heading: 'Hands, Feet & Eyes: The Non-Negotiables',
        paragraphs: [
          'Carry two-layer hand protection: thin fleece liner gloves for camera use and trekking poles, plus waterproof insulated ski gloves for snow mornings. Always pack UV-400 polarized sunglasses — fresh snow reflects up to 80% of UV rays and can cause painful snow blindness within two hours.',
          'Finally, pack a reliable headlamp (200+ lumens) with spare batteries kept warm inside your sleeping bag overnight, as sub-zero cold drains lithium cells rapidly.'
        ]
      }
    ]
  },
  {
    id: 4,
    slug: 'kedarkantha-vs-brahmatal-which-winter-snow-trek-fits-you',
    title: 'Kedarkantha vs Brahmatal: Which Winter Snow Trek Should You Pick?',
    subtitle: 'Two iconic Uttarakhand snow giants, two completely different mountain personalities. Here is an honest side-by-side comparison from leaders who walk both every winter.',
    excerpt: 'Confused between Kedarkantha’s famous 360° summit push and Brahmatal’s frozen alpine lakes? Compare views, crowds, snow depth, and difficulty.',
    category: 'Destinations',
    tags: ['Kedarkantha', 'Brahmatal', 'Winter Snow', 'Comparison', 'Uttarakhand'],
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    readTime: '7 min read',
    readMinutes: 7,
    publishedAt: 'Nov 2026',
    seasonTag: 'Dec – Mar',
    difficultyTag: 'Winter Guide',
    views: '4.1k',
    featured: false,
    featuredOnHome: false,
    relatedTrekSlug: 'brahmatal-winter-trek',
    relatedTrekName: 'Brahmatal Winter Trek',
    author: {
      name: 'Vikram Rawat',
      role: 'Chief Expedition Leader (NIM Uttarkashi)',
      base: 'Dehradun Base Camp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Over 11 years leading high-altitude winter and monsoon expeditions across Garhwal and Himachal.'
    },
    keyTakeaways: [
      'Kedarkantha (12,500 ft) shines for its dramatic conical summit climb and iconic Juda Ka Talab pine campsite.',
      'Brahmatal (12,250 ft) offers quieter trails, TWO high-altitude frozen lakes, and jaw-dropping close-ups of Mt. Trishul & Nanda Ghunti.',
      'Kedarkantha is slightly shorter and punchier; Brahmatal rewards you with longer, continuous ridge walks above the treeline.'
    ],
    sections: [
      {
        id: 'trail-personality',
        heading: 'Two Winter Legends, Two Distinct Vibes',
        paragraphs: [
          'Every December, our WhatsApp inbox floods with one classic question: "Should my winter snow trek be Kedarkantha or Brahmatal?" Both sit right around 12,250–12,500 ft in Uttarakhand, both stay knee-deep in powder snow from late December to March, and both are beginner-accessible with decent fitness.',
          'Yet on the trail, they feel worlds apart. Understanding what excites you most — a dramatic midnight summit push or serene ridge walks past frozen alpine lakes — makes the decision effortless.'
        ]
      },
      {
        id: 'why-kedarkantha',
        heading: 'Choose Kedarkantha For The Classic Summit Dream',
        paragraphs: [
          'Starting from Sankri village, Kedarkantha delivers a fairy-tale progression: whispering pine woods, the mystical frozen pond of Juda Ka Talab, and a wide-open snow base camp right below the peak.',
          'The pre-dawn 3:00 AM summit climb with a ribbon of headlamps snaking up the ridge and a 360-degree sunrise over Swargarohini and Black Peak is an unforgettable rite of passage for any trekker.'
        ]
      },
      {
        id: 'why-brahmatal',
        heading: 'Choose Brahmatal For Solitude & Giant 7,000m Peaks',
        paragraphs: [
          'Starting from Lohajung in the Chamoli district, Brahmatal trades summit-day crowds for vast alpine silence. You camp beside Bekaltal and trek right past the frozen mirror of Brahmatal Lake.',
          'The showstopper is the Brahmatal Ridge — where Mt. Trishul (7,120 m) and Mt. Nanda Ghunti tower so close across the valley it feels like you could reach out and touch their glaciers.'
        ],
        quote: {
          text: 'Kedarkantha gives you the thrill of conquering a crown; Brahmatal gives you the grace of walking beside Himalayan royalty.',
          author: 'TrekToShikhar Winter Dispatch'
        }
      }
    ]
  },
  {
    id: 5,
    slug: 'acclimatization-and-ams-staying-safe-above-10000-feet',
    title: 'High-Altitude Acclimatization: How Your Body Adapts Above 10,000 Feet',
    subtitle: 'Oxygen drops with every step upward — here is the simple, science-backed Shikharite playbook for spotting Acute Mountain Sickness early and summiting feeling strong.',
    excerpt: 'Understand SpO2 readings, the "Climb High, Sleep Low" rule, and why slow hydration beats raw gym strength at high altitude.',
    category: 'Safety & Altitude',
    tags: ['AMS', 'Safety', 'Acclimatization', 'SpO2', 'Health'],
    coverImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85',
    readTime: '6 min read',
    readMinutes: 6,
    publishedAt: 'Nov 2026',
    seasonTag: 'All Seasons',
    difficultyTag: 'Safety Protocol',
    views: '2.7k',
    featured: false,
    featuredOnHome: false,
    relatedTrekSlug: 'kuari-pass-lord-curzon-trail',
    relatedTrekName: 'Kuari Pass Trail',
    author: {
      name: 'Dr. Aarav Sharma',
      role: 'Wilderness First Responder & Safety Advisor',
      base: 'Shimla Base Camp',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      bio: 'Mountain medicine specialist who designs TrekToShikhar’s medical kits, daily SpO2 logs, and emergency evacuation protocols.'
    },
    keyTakeaways: [
      'AMS can affect marathon runners and beginners alike — acclimatization depends on ascent rate, not bicep size.',
      'TrekToShikhar conducts mandatory morning & evening pulse oximeter (SpO2) checks at every camp.',
      'Avoid alcohol, smoking, and sleeping pills completely on the trek — they depress night-time breathing.',
      'Warm garlic soup, ginger tea, and 3.5+ liters of water are your best natural allies above 10,000 ft.'
    ],
    sections: [
      {
        id: 'what-happens-up-high',
        heading: 'What Actually Happens Above 10,000 Feet?',
        paragraphs: [
          'Contrary to popular myth, the percentage of oxygen in mountain air is still ~21%. What drops is barometric pressure — meaning air molecules are spaced farther apart, so every breath delivers fewer oxygen molecules into your bloodstream.',
          'Given a gradual ascent, your body performs a remarkable biological upgrade: breathing deepens, resting heart rate rises slightly, and red blood cell efficiency improves. Rushing altitude without giving your body time to adjust triggers Acute Mountain Sickness (AMS).'
        ]
      },
      {
        id: 'three-golden-rules',
        heading: 'The 3 Golden Rules of High-Altitude Safety',
        paragraphs: [
          '1) Climb High, Sleep Low: Our itineraries intentionally include short afternoon acclimatization walks 300–500 ft above camp before descending to sleep. This nudges your body to adapt without over-stressing it overnight.',
          '2) Never Ascend With Symptoms: Mild headaches, loss of appetite, or fatigue are early yellow flags. Rest, hydrate, and let your leader monitor your SpO2 before moving higher.',
          '3) Fuel With Complex Carbs: Above 11,000 ft, carbohydrates require less oxygen to metabolize than heavy fats. That is why hot dal-khichdi, parathas, and steaming soup taste like heaven at alpine camps.'
        ],
        tipBox: {
          type: 'warning',
          title: 'How TrekToShikhar Keeps You Protected',
          text: 'Every single TrekToShikhar batch carries calibrated pulse oximeters, blood pressure monitors, medical oxygen cylinders, and a WFR/NIM-certified leader trained in rapid high-altitude assessment.'
        }
      }
    ]
  },
  {
    id: 6,
    slug: '4-week-himalayan-trek-fitness-plan-for-busy-people',
    title: 'The 4-Week Himalayan Trek Fitness Plan (Zero Gym Required)',
    subtitle: 'Short on time before your departure? This practical 35-minute-a-day cardio, stair, and leg-endurance blueprint gets your lungs and knees summit-ready.',
    excerpt: 'Build real trail stamina, knee stability for steep descents, and lung capacity with just 35 minutes a day at home or in a local park.',
    category: 'Beginner Guides',
    tags: ['Fitness', 'Training', 'Cardio', 'Stamina', 'Prep'],
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    readTime: '5 min read',
    readMinutes: 5,
    publishedAt: 'Sep 2026',
    seasonTag: 'Pre-Trek Prep',
    difficultyTag: 'Training Plan',
    views: '3.4k',
    featured: false,
    featuredOnHome: false,
    relatedTrekSlug: 'chandrashila-chopta-tungnath',
    relatedTrekName: 'Chopta Tungnath & Chandrashila',
    author: {
      name: 'Rohan Negi',
      role: 'Winter Snowcraft & Gear Specialist',
      base: 'Dehradun Base Camp',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Equipment quartermaster and endurance coach at TrekToShikhar.'
    },
    keyTakeaways: [
      'Cardiovascular endurance (jogging/brisk walking) matters far more than heavy weightlifting.',
      'Stair climbing with a 5 kg backpack is the closest city simulation to Himalayan switchbacks.',
      'Strong quads and glutes protect your knees during long 6 km downhill descents.',
      'Taper off intense leg workouts 3 days before departure so you arrive fresh at base camp.'
    ],
    sections: [
      {
        id: 'cardio-benchmark',
        heading: 'Your Simple Readiness Benchmark',
        paragraphs: [
          'You do not need to be an ultra-athlete to enjoy a Himalayan trek. A great benchmark for Easy-to-Moderate treks is being able to jog 5 km comfortably in under 35–38 minutes, or climb 10–12 floors of stairs without gasping for air.',
          'Consistency beats heroic weekend workouts. Four focused 35-minute sessions per week over 4 weeks completely transforms how much you enjoy the mountain views instead of staring at your boots.'
        ]
      },
      {
        id: 'weekly-blueprint',
        heading: 'The 4-Week Progressive Schedule',
        paragraphs: [
          'Weeks 1–2 (Foundation): Alternate 30 minutes of brisk walking/easy jogging (3 days/week) with bodyweight strength (2 days/week: 3 sets of 15 squats, 12 lunges per leg, 45-second planks, and 20 calf raises).',
          'Weeks 3–4 (Trail Simulation): Strap on a 5–6 kg backpack wearing your actual trekking shoes and climb stairs or a local hill incline for 25–30 minutes twice a week. Focus on controlled, quiet footfalls going DOWN stairs — that builds eccentric quad strength that saves your knees on summit descent day.'
        ],
        tipBox: {
          type: 'tip',
          title: 'Don’t Skip Breathing & Stretching',
          text: 'Add 5 minutes of slow nasal breathing (box breathing: 4 sec inhale, 4 sec hold, 4 sec exhale) after every run. Calm, deep breathing works wonders when the air thins above 11,000 ft.'
        }
      }
    ]
  },
  {
    id: 7,
    slug: 'once-a-shikharite-life-inside-ancient-wooden-villages-of-har-ki-dun',
    title: 'Once a Shikharite: Chai, Cedar & Timeless Bonds in Har Ki Dun',
    subtitle: 'Beyond the altitude numbers and summit selfies lies the real heartbeat of TrekToShikhar — slow evenings around wood-fired chulhas and friendships forged at 11,500 feet.',
    excerpt: 'Step inside the 3,000-year-old wooden villages of Osla and Gangad, where strangers arrive as solo trekkers and leave as lifelong family.',
    category: 'Mountain Stories',
    tags: ['Har Ki Dun', 'Pahari Culture', 'Shikharite Family', 'Solo Travel', 'Stories'],
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    readTime: '5 min read',
    readMinutes: 5,
    publishedAt: 'Sep 2026',
    seasonTag: 'Spring & Autumn',
    difficultyTag: 'Trail Chronicle',
    views: '3.1k',
    featured: false,
    featuredOnHome: false,
    relatedTrekSlug: 'har-ki-dun-cradle-of-ancient-legends',
    relatedTrekName: 'Har Ki Dun Valley',
    author: {
      name: 'Meera Thakur',
      role: 'Shimla Operations & Alpine Guide (ABVIMAS)',
      base: 'Shimla Base Camp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Born in the apple valleys of Himachal, Meera curates quiet forest ridge routes with a deep love for Pahari architecture and storytelling.'
    },
    keyTakeaways: [
      'Over 65% of TrekToShikhar trekkers sign up solo — and finish the trail with a group chat that never dies.',
      'Ancient villages like Osla & Gangad preserve centuries-old Kath-Kuni deodar architecture without nails.',
      'Small 12–15 trekker batches allow genuine conversations with local mountain hosts and cooks.'
    ],
    sections: [
      {
        id: 'strangers-at-base',
        heading: 'How Twelve Strangers Become a Family in 72 Hours',
        paragraphs: [
          'At 6:00 AM outside Dehradun Railway Station, everyone is polite and quiet — clutching backpacks, checking phones, wondering if they made the right decision signing up solo. By the second night beside the Supin River, mobile signals are gone, hot ginger tea is passing hand to hand, and laughter echoes off the deodar valley.',
          'Without notifications or deadlines, people show up as their truest selves. Sharing an extra pair of dry gloves, cheering someone up the final 200 meters of a ridge, and watching the Milky Way rise above Swargarohini builds a bond that city life rarely allows.'
        ],
        quote: {
          text: 'Not just a journey, but a bond that stays forever. Because the best journeys aren’t just about where you go, but how you feel along the way.',
          author: 'The Shikharite Ethos'
        }
      },
      {
        id: 'living-heritage',
        heading: 'Walking Gently Through Living Himalayan Heritage',
        paragraphs: [
          'In the cradle of Har Ki Dun, villages like Osla and Seema are not museum props — they are living Himalayan communities. We encourage every Shikharite to ask before photographing elders, carry back every single wrapper in their pocket, and listen to local mountain folklore around the kitchen fire.',
          'When you descend back to the plains, your legs recover in three days. The warmth of the mountains — and the family you met along the ridge — stays with you forever.'
        ]
      }
    ]
  }
];

export const getBlogBySlug = (slug) =>
  BLOG_POSTS.find((post) => post.slug === slug) || null;
