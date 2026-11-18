import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/blogs_store.json');

const CACHE_PREFIX = 'blogs_';

export const DEFAULT_BLOG_SETTINGS = {
  id: 'global',
  hero_badge: 'Himalayan Trail Journals & Field Guides',
  hero_title_line1: 'STORIES FROM THE HIGH RIDGES,',
  hero_title_cursive: 'wisdom for every climb.',
  hero_subtitle:
    'Packing checklists, winter snowcraft, acclimatization science, and raw camp stories penned by TrekToShikhar’s Shimla & Dehradun expedition leaders.',
  hero_slides: [
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
  ],
  cta_badge: 'Once a Shikharite, Always a Shikharite',
  cta_heading: 'Ready To Turn Reading Into Your Next Summit?',
  cta_subtitle:
    'Join our small-batch Himalayan departures from Shimla & Dehradun — guided by the very leaders who wrote these field journals.'
};

export const DEFAULT_BLOG_POSTS = [
  {
    id: 'post-1',
    slug: 'first-time-trekking-in-himalayas-7-rookie-mistakes',
    title: 'First Time Trekking in Himalayas? Top 7 Rookie Mistakes to Avoid',
    subtitle:
      'From packing heavy cotton hoodies to rushing the first 2 km — here is everything our certified trek leaders want you to know before stepping onto your first Himalayan trail.',
    excerpt:
      'From packing heavy cotton sweaters to ignoring hydration: here is everything certified guides want you to know before your first mountain trip.',
    category: 'Beginner Guides',
    tags: ['First Trek', 'Beginners', 'Fitness', 'Packing', 'Hydration'],
    cover_image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
    read_time: '5 min read',
    read_minutes: 5,
    published_at: 'Nov 2026',
    season_tag: 'All Seasons',
    difficulty_tag: 'Essential Reading',
    views: '4.8k',
    featured: true,
    featured_on_home: true,
    related_trek_slug: 'nag-tibba-weekend-trek',
    related_trek_name: 'Nag Tibba Weekend Trek',
    author_name: 'Vikram Rawat',
    author_role: 'Chief Expedition Leader (NIM Uttarkashi)',
    author_base: 'Dehradun Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Over 11 years leading high-altitude winter and monsoon expeditions across Garhwal and Himachal. Passionate about turning nervous first-timers into lifelong Shikharites.',
    key_takeaways: [
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
    ],
    display_order: 1,
    is_published: true
  },
  {
    id: 'post-2',
    slug: 'why-nag-tibba-and-hatu-peak-are-indias-best-weekend-escapes',
    title: "Why Nag Tibba & Hatu Peak are India's Best Weekend Escapes",
    subtitle:
      'Zero office leaves required. Trade Friday evening city traffic for 10,000+ ft Himalayan summits, ancient wooden temples, and starry alpine camps by Saturday night.',
    excerpt:
      'Quick access from Delhi, Chandigarh, and Dehradun with zero leaves required. Experience real 10,000 ft snowscapes in 48 hours.',
    category: 'Destinations',
    tags: ['Weekend Treks', 'Nag Tibba', 'Hatu Peak', 'Dehradun', 'Shimla'],
    cover_image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    read_time: '6 min read',
    read_minutes: 6,
    published_at: 'Oct 2026',
    season_tag: 'Oct – May',
    difficulty_tag: 'Weekend Special',
    views: '3.9k',
    featured: false,
    featured_on_home: true,
    related_trek_slug: 'hatu-peak-alpine-ridge',
    related_trek_name: 'Hatu Peak & Alpine Ridge',
    author_name: 'Meera Thakur',
    author_role: 'Shimla Operations & Alpine Guide (ABVIMAS)',
    author_base: 'Shimla Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Born in the apple valleys of Himachal, Meera curates quiet forest ridge routes around Narkanda, Shimla, and Kinnaur with a deep love for Pahari architecture and local storytelling.',
    key_takeaways: [
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
        ]
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
    ],
    display_order: 2,
    is_published: true
  },
  {
    id: 'post-3',
    slug: 'essential-winter-trek-gear-checklist-3-layer-system',
    title: 'Essential Winter Trek Gear Checklist: The 3-Layer System Explained',
    subtitle:
      'Stop carrying bulky 2 kg coats that trap sweat. Master the exact alpine layering science used by mountaineers to stay warm at -10°C without weighing down your pack.',
    excerpt:
      'How base layers, fleece insulation, and waterproof windbreakers keep you toasty even at sub-zero summit temperatures.',
    category: 'Gear & Packing',
    tags: ['Winter Treks', 'Layering', 'Gear Checklist', 'Kedarkantha', 'Sub-Zero'],
    cover_image:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=85',
    read_time: '6 min read',
    read_minutes: 6,
    published_at: 'Oct 2026',
    season_tag: 'Dec – Mar',
    difficulty_tag: 'Gear Mastery',
    views: '5.2k',
    featured: false,
    featured_on_home: true,
    related_trek_slug: 'kedarkantha-summit-expedition',
    related_trek_name: 'Kedarkantha Summit Expedition',
    author_name: 'Rohan Negi',
    author_role: 'Winter Snowcraft & Gear Specialist',
    author_base: 'Dehradun Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Equipment quartermaster at TrekToShikhar. Obsessed with ultralight winter layering, crampon safety, and helping trekkers avoid wasting money on overpriced gear.',
    key_takeaways: [
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
      }
    ],
    display_order: 3,
    is_published: true
  },
  {
    id: 'post-4',
    slug: 'kedarkantha-vs-brahmatal-which-winter-snow-trek-fits-you',
    title: 'Kedarkantha vs Brahmatal: Which Winter Snow Trek Should You Pick?',
    subtitle:
      'Two iconic Uttarakhand snow giants, two completely different mountain personalities. Here is an honest side-by-side comparison from leaders who walk both every winter.',
    excerpt:
      'Confused between Kedarkantha’s famous 360° summit push and Brahmatal’s frozen alpine lakes? Compare views, crowds, snow depth, and difficulty.',
    category: 'Destinations',
    tags: ['Kedarkantha', 'Brahmatal', 'Winter Snow', 'Comparison', 'Uttarakhand'],
    cover_image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    read_time: '7 min read',
    read_minutes: 7,
    published_at: 'Nov 2026',
    season_tag: 'Dec – Mar',
    difficulty_tag: 'Winter Guide',
    views: '4.1k',
    featured: false,
    featured_on_home: false,
    related_trek_slug: 'brahmatal-winter-trek',
    related_trek_name: 'Brahmatal Winter Trek',
    author_name: 'Vikram Rawat',
    author_role: 'Chief Expedition Leader (NIM Uttarkashi)',
    author_base: 'Dehradun Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Over 11 years leading high-altitude winter and monsoon expeditions across Garhwal and Himachal.',
    key_takeaways: [
      'Kedarkantha (12,500 ft) shines for its dramatic conical summit climb and iconic Juda Ka Talab pine campsite.',
      'Brahmatal (12,250 ft) offers quieter trails, TWO high-altitude frozen lakes, and jaw-dropping close-ups of Mt. Trishul & Nanda Ghunti.',
      'Kedarkantha is slightly shorter and punchier; Brahmatal rewards you with longer, continuous ridge walks above the treeline.'
    ],
    sections: [
      {
        id: 'trail-personality',
        heading: 'Two Winter Legends, Two Distinct Vibes',
        paragraphs: [
          'Every December, our WhatsApp inbox floods with one classic question: "Should my winter snow trek be Kedarkantha or Brahmatal?" Both sit right around 12,250–12,500 ft in Uttarakhand, both stay knee-deep in powder snow from late December to March, and both are beginner-accessible with decent fitness.'
        ]
      }
    ],
    display_order: 4,
    is_published: true
  },
  {
    id: 'post-5',
    slug: 'acclimatization-and-ams-staying-safe-above-10000-feet',
    title: 'High-Altitude Acclimatization: How Your Body Adapts Above 10,000 Feet',
    subtitle:
      'Oxygen drops with every step upward — here is the simple, science-backed Shikharite playbook for spotting Acute Mountain Sickness early and summiting feeling strong.',
    excerpt:
      'Understand SpO2 readings, the "Climb High, Sleep Low" rule, and why slow hydration beats raw gym strength at high altitude.',
    category: 'Safety & Altitude',
    tags: ['AMS', 'Safety', 'Acclimatization', 'SpO2', 'Health'],
    cover_image:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85',
    read_time: '6 min read',
    read_minutes: 6,
    published_at: 'Nov 2026',
    season_tag: 'All Seasons',
    difficulty_tag: 'Safety Protocol',
    views: '2.7k',
    featured: false,
    featured_on_home: false,
    related_trek_slug: 'kuari-pass-lord-curzon-trail',
    related_trek_name: 'Kuari Pass Trail',
    author_name: 'Dr. Aarav Sharma',
    author_role: 'Wilderness First Responder & Safety Advisor',
    author_base: 'Shimla Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Mountain medicine specialist who designs TrekToShikhar’s medical kits, daily SpO2 logs, and emergency evacuation protocols.',
    key_takeaways: [
      'AMS can affect marathon runners and beginners alike — acclimatization depends on ascent rate, not bicep size.',
      'TrekToShikhar conducts mandatory morning & evening pulse oximeter (SpO2) checks at every camp.',
      'Avoid alcohol, smoking, and sleeping pills completely on the trek — they depress night-time breathing.'
    ],
    sections: [
      {
        id: 'what-happens-up-high',
        heading: 'What Actually Happens Above 10,000 Feet?',
        paragraphs: [
          'Contrary to popular myth, the percentage of oxygen in mountain air is still ~21%. What drops is barometric pressure — meaning air molecules are spaced farther apart.'
        ]
      }
    ],
    display_order: 5,
    is_published: true
  },
  {
    id: 'post-6',
    slug: '4-week-himalayan-trek-fitness-plan-for-busy-people',
    title: 'The 4-Week Himalayan Trek Fitness Plan (Zero Gym Required)',
    subtitle:
      'Short on time before your departure? This practical 35-minute-a-day cardio, stair, and leg-endurance blueprint gets your lungs and knees summit-ready.',
    excerpt:
      'Build real trail stamina, knee stability for steep descents, and lung capacity with just 35 minutes a day at home or in a local park.',
    category: 'Beginner Guides',
    tags: ['Fitness', 'Training', 'Cardio', 'Stamina', 'Prep'],
    cover_image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    read_time: '5 min read',
    read_minutes: 5,
    published_at: 'Sep 2026',
    season_tag: 'Pre-Trek Prep',
    difficulty_tag: 'Training Plan',
    views: '3.4k',
    featured: false,
    featured_on_home: false,
    related_trek_slug: 'chandrashila-chopta-tungnath',
    related_trek_name: 'Chopta Tungnath & Chandrashila',
    author_name: 'Rohan Negi',
    author_role: 'Winter Snowcraft & Gear Specialist',
    author_base: 'Dehradun Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    author_bio: 'Equipment quartermaster and endurance coach at TrekToShikhar.',
    key_takeaways: [
      'Cardiovascular endurance (jogging/brisk walking) matters far more than heavy weightlifting.',
      'Stair climbing with a 5 kg backpack is the closest city simulation to Himalayan switchbacks.'
    ],
    sections: [
      {
        id: 'cardio-benchmark',
        heading: 'Your Simple Readiness Benchmark',
        paragraphs: [
          'You do not need to be an ultra-athlete to enjoy a Himalayan trek. A great benchmark for Easy-to-Moderate treks is being able to jog 5 km comfortably in under 35–38 minutes.'
        ]
      }
    ],
    display_order: 6,
    is_published: true
  },
  {
    id: 'post-7',
    slug: 'once-a-shikharite-life-inside-ancient-wooden-villages-of-har-ki-dun',
    title: 'Once a Shikharite: Chai, Cedar & Timeless Bonds in Har Ki Dun',
    subtitle:
      'Beyond the altitude numbers and summit selfies lies the real heartbeat of TrekToShikhar — slow evenings around wood-fired chulhas and friendships forged at 11,500 feet.',
    excerpt:
      'Step inside the 3,000-year-old wooden villages of Osla and Gangad, where strangers arrive as solo trekkers and leave as lifelong family.',
    category: 'Mountain Stories',
    tags: ['Har Ki Dun', 'Pahari Culture', 'Shikharite Family', 'Solo Travel', 'Stories'],
    cover_image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    read_time: '5 min read',
    read_minutes: 5,
    published_at: 'Sep 2026',
    season_tag: 'Spring & Autumn',
    difficulty_tag: 'Trail Chronicle',
    views: '3.1k',
    featured: false,
    featured_on_home: false,
    related_trek_slug: 'har-ki-dun-cradle-of-ancient-legends',
    related_trek_name: 'Har Ki Dun Valley',
    author_name: 'Meera Thakur',
    author_role: 'Shimla Operations & Alpine Guide (ABVIMAS)',
    author_base: 'Shimla Base Camp',
    author_avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    author_bio:
      'Born in the apple valleys of Himachal, Meera curates quiet forest ridge routes with a deep love for Pahari architecture and storytelling.',
    key_takeaways: [
      'Over 65% of TrekToShikhar trekkers sign up solo — and finish the trail with a group chat that never dies.',
      'Ancient villages like Osla & Gangad preserve centuries-old Kath-Kuni deodar architecture without nails.'
    ],
    sections: [
      {
        id: 'strangers-at-base',
        heading: 'How Twelve Strangers Become a Family in 72 Hours',
        paragraphs: [
          'At 6:00 AM outside Dehradun Railway Station, everyone is polite and quiet — clutching backpacks, checking phones, wondering if they made the right decision signing up solo.'
        ]
      }
    ],
    display_order: 7,
    is_published: true
  }
];

// Helper: Read local persistent file store
function readLocalStore() {
  try {
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      const initial = {
        settings: DEFAULT_BLOG_SETTINGS,
        posts: DEFAULT_BLOG_POSTS,
        lastUpdated: new Date().toISOString()
      };
      fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
      fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      settings: parsed.settings || DEFAULT_BLOG_SETTINGS,
      posts: Array.isArray(parsed.posts) ? parsed.posts : DEFAULT_BLOG_POSTS,
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch (err) {
    console.warn('[blogController] Local store read failed, returning defaults:', err);
    return {
      settings: DEFAULT_BLOG_SETTINGS,
      posts: DEFAULT_BLOG_POSTS,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Helper: Write local persistent file store
function writeLocalStore(data) {
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(
      LOCAL_STORE_PATH,
      JSON.stringify(
        {
          settings: data.settings || DEFAULT_BLOG_SETTINGS,
          posts: data.posts || DEFAULT_BLOG_POSTS,
          lastUpdated: new Date().toISOString()
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch (err) {
    console.warn('[blogController] Local store write failed:', err);
  }
}

function clearBlogCache() {
  appCache.keys().forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      appCache.del(key);
    }
  });
}

function formatPost(row, idx = 0) {
  return {
    id: row.id || `post-${idx + 1}`,
    slug: row.slug || `journal-${idx + 1}`,
    title: row.title || 'Himalayan Trail Journal',
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || '',
    category: row.category || 'Beginner Guides',
    tags: Array.isArray(row.tags) ? row.tags : typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : [],
    coverImage: row.cover_image || row.coverImage || '',
    cover_image: row.cover_image || row.coverImage || '',
    readTime: row.read_time || row.readTime || '5 min read',
    read_time: row.read_time || row.readTime || '5 min read',
    readMinutes: Number(row.read_minutes || row.readMinutes || 5),
    read_minutes: Number(row.read_minutes || row.readMinutes || 5),
    publishedAt: row.published_at || row.publishedAt || 'Nov 2026',
    published_at: row.published_at || row.publishedAt || 'Nov 2026',
    seasonTag: row.season_tag || row.seasonTag || 'All Seasons',
    season_tag: row.season_tag || row.seasonTag || 'All Seasons',
    difficultyTag: row.difficulty_tag || row.difficultyTag || 'Essential Reading',
    difficulty_tag: row.difficulty_tag || row.difficultyTag || 'Essential Reading',
    views: row.views || '1.2k',
    featured: Boolean(row.featured),
    featuredOnHome: Boolean(row.featured_on_home ?? row.featuredOnHome),
    featured_on_home: Boolean(row.featured_on_home ?? row.featuredOnHome),
    relatedTrekSlug: row.related_trek_slug ?? row.relatedTrekSlug ?? '',
    related_trek_slug: row.related_trek_slug ?? row.relatedTrekSlug ?? '',
    relatedTrekName: row.related_trek_name ?? row.relatedTrekName ?? '',
    related_trek_name: row.related_trek_name ?? row.relatedTrekName ?? '',
    author: {
      name: row.author_name || row.author?.name || 'Vikram Rawat',
      role: row.author_role || row.author?.role || 'Chief Expedition Leader (NIM Uttarkashi)',
      base: row.author_base || row.author?.base || 'Dehradun Base Camp',
      avatar: row.author_avatar || row.author?.avatar || '',
      bio: row.author_bio || row.author?.bio || ''
    },
    keyTakeaways: Array.isArray(row.key_takeaways)
      ? row.key_takeaways
      : typeof row.key_takeaways === 'string'
        ? JSON.parse(row.key_takeaways || '[]')
        : [],
    key_takeaways: Array.isArray(row.key_takeaways)
      ? row.key_takeaways
      : typeof row.key_takeaways === 'string'
        ? JSON.parse(row.key_takeaways || '[]')
        : [],
    sections: Array.isArray(row.sections)
      ? row.sections
      : typeof row.sections === 'string'
        ? JSON.parse(row.sections || '[]')
        : [],
    displayOrder: Number(row.display_order ?? row.displayOrder ?? idx + 1),
    display_order: Number(row.display_order ?? row.displayOrder ?? idx + 1),
    isPublished: row.is_published ?? row.isPublished ?? true,
    is_published: row.is_published ?? row.isPublished ?? true,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
  };
}

// ----------------------------------------------------------------------
// 1. GET PUBLIC BLOG DATA: /api/blogs
// ----------------------------------------------------------------------
export const getBlogData = async (req, res) => {
  try {
    const cacheKey = `${CACHE_PREFIX}public_data`;
    const cached = appCache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, source: 'cache' });
    }

    let settings = DEFAULT_BLOG_SETTINGS;
    let posts = [];

    // Try Supabase first
    if (supabase) {
      try {
        const [settingsRes, postsRes] = await Promise.all([
          supabase.from('blog_settings').select('*').eq('id', 'global').maybeSingle(),
          supabase
            .from('blogs')
            .select('*')
            .eq('is_published', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
        ]);

        if (settingsRes.data) {
          settings = { ...DEFAULT_BLOG_SETTINGS, ...settingsRes.data };
        }
        if (postsRes.data && postsRes.data.length > 0) {
          posts = postsRes.data.map(formatPost);
        }
      } catch (err) {
        console.warn('[blogController] Supabase query fallback:', err.message);
      }
    }

    // Fallback to local store if Supabase returned 0 posts or table missing
    if (posts.length === 0) {
      const local = readLocalStore();
      settings = local.settings || DEFAULT_BLOG_SETTINGS;
      posts = (local.posts || DEFAULT_BLOG_POSTS)
        .filter((p) => p.is_published !== false && p.isPublished !== false)
        .map(formatPost);
    }

    const payload = { settings, posts };
    appCache.set(cacheKey, payload, 300); // 5 min TTL
    return res.json({ success: true, ...payload, source: 'live' });
  } catch (error) {
    console.error('[blogController] getBlogData error:', error);
    const local = readLocalStore();
    return res.json({
      success: true,
      settings: local.settings,
      posts: local.posts.map(formatPost),
      source: 'fallback'
    });
  }
};

// ----------------------------------------------------------------------
// 2. GET ADMIN BLOG DATA: /api/blogs/admin/all
// ----------------------------------------------------------------------
export const getAdminBlogData = async (req, res) => {
  try {
    const cacheKey = `${CACHE_PREFIX}admin_all`;
    const cached = appCache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, source: 'cache' });
    }

    let settings = DEFAULT_BLOG_SETTINGS;
    let posts = [];

    if (supabase) {
      try {
        const [settingsRes, postsRes] = await Promise.all([
          supabase.from('blog_settings').select('*').eq('id', 'global').maybeSingle(),
          supabase
            .from('blogs')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
        ]);

        if (settingsRes.data) {
          settings = { ...DEFAULT_BLOG_SETTINGS, ...settingsRes.data };
        }
        if (postsRes.data && postsRes.data.length > 0) {
          posts = postsRes.data.map(formatPost);
        }
      } catch (err) {
        console.warn('[blogController] Supabase admin query fallback:', err.message);
      }
    }

    if (posts.length === 0) {
      const local = readLocalStore();
      settings = local.settings || DEFAULT_BLOG_SETTINGS;
      posts = (local.posts || DEFAULT_BLOG_POSTS).map(formatPost);
    }

    const payload = { settings, posts };
    appCache.set(cacheKey, payload, 60);
    return res.json({ success: true, ...payload, source: 'live' });
  } catch (error) {
    console.error('[blogController] getAdminBlogData error:', error);
    const local = readLocalStore();
    return res.json({
      success: true,
      settings: local.settings,
      posts: local.posts.map(formatPost),
      source: 'fallback'
    });
  }
};

// ----------------------------------------------------------------------
// 3. GET SINGLE POST BY SLUG: /api/blogs/:slug
// ----------------------------------------------------------------------
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: 'Slug required' });

    let post = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (data && !error) {
          post = formatPost(data);
        }
      } catch (err) {
        console.warn('[blogController] getPostBySlug Supabase err:', err.message);
      }
    }

    if (!post) {
      const local = readLocalStore();
      const found = (local.posts || DEFAULT_BLOG_POSTS).find((p) => p.slug === slug);
      if (found) post = formatPost(found);
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Trail journal not found' });
    }

    return res.json({ success: true, post });
  } catch (error) {
    console.error('[blogController] getPostBySlug error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 4. CREATE BLOG POST: POST /api/blogs
// ----------------------------------------------------------------------
export const createPost = async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const slug =
      b.slug?.trim() ||
      b.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newId = crypto.randomUUID();
    const row = {
      id: newId,
      slug,
      title: b.title.trim(),
      subtitle: b.subtitle || '',
      excerpt: b.excerpt || '',
      category: b.category || 'Beginner Guides',
      tags: Array.isArray(b.tags) ? b.tags : [],
      cover_image:
        b.cover_image ||
        b.coverImage ||
        'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
      read_time: b.read_time || b.readTime || '5 min read',
      read_minutes: Number(b.read_minutes || b.readMinutes || 5),
      published_at: b.published_at || b.publishedAt || 'Nov 2026',
      season_tag: b.season_tag || b.seasonTag || 'All Seasons',
      difficulty_tag: b.difficulty_tag || b.difficultyTag || 'Essential Reading',
      views: b.views || '1.1k',
      featured: Boolean(b.featured),
      featured_on_home: Boolean(b.featured_on_home ?? b.featuredOnHome),
      related_trek_slug: b.related_trek_slug ?? b.relatedTrekSlug ?? '',
      related_trek_name: b.related_trek_name ?? b.relatedTrekName ?? '',
      author_name: b.author?.name || b.author_name || 'Vikram Rawat',
      author_role: b.author?.role || b.author_role || 'Chief Expedition Leader (NIM Uttarkashi)',
      author_base: b.author?.base || b.author_base || 'Dehradun Base Camp',
      author_avatar: b.author?.avatar || b.author_avatar || '',
      author_bio: b.author?.bio || b.author_bio || '',
      key_takeaways: Array.isArray(b.key_takeaways ?? b.keyTakeaways) ? b.key_takeaways ?? b.keyTakeaways : [],
      sections: Array.isArray(b.sections) ? b.sections : [],
      display_order: Number(b.display_order ?? b.displayOrder ?? 999),
      is_published: b.is_published ?? b.isPublished ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // If marked featured, unfeature others
    if (row.featured && supabase) {
      await supabase.from('blogs').update({ featured: false }).neq('id', newId);
    }

    let savedRow = row;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('blogs').insert(row).select().single();
        if (!error && data) savedRow = data;
      } catch (err) {
        console.warn('[blogController] Supabase insert failed, saving locally:', err.message);
      }
    }

    // Always update local store
    const local = readLocalStore();
    local.posts = [savedRow, ...local.posts];
    writeLocalStore(local);

    clearBlogCache();
    return res.status(201).json({
      success: true,
      message: 'Trail journal created successfully',
      post: formatPost(savedRow)
    });
  } catch (error) {
    console.error('[blogController] createPost error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 5. UPDATE BLOG POST: PUT /api/blogs/:id
// ----------------------------------------------------------------------
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body || {};

    const updates = {
      ...(b.title && { title: b.title.trim() }),
      ...(b.slug && { slug: b.slug.trim() }),
      ...(b.subtitle !== undefined && { subtitle: b.subtitle }),
      ...(b.excerpt !== undefined && { excerpt: b.excerpt }),
      ...(b.category !== undefined && { category: b.category }),
      ...(b.tags !== undefined && { tags: b.tags }),
      ...((b.cover_image || b.coverImage) && { cover_image: b.cover_image || b.coverImage }),
      ...((b.read_time || b.readTime) && { read_time: b.read_time || b.readTime }),
      ...(b.read_minutes !== undefined && { read_minutes: Number(b.read_minutes) }),
      ...(b.readMinutes !== undefined && { read_minutes: Number(b.readMinutes) }),
      ...((b.published_at || b.publishedAt) && { published_at: b.published_at || b.publishedAt }),
      ...((b.season_tag || b.seasonTag) && { season_tag: b.season_tag || b.seasonTag }),
      ...((b.difficulty_tag || b.difficultyTag) && {
        difficulty_tag: b.difficulty_tag || b.difficultyTag
      }),
      ...(b.views !== undefined && { views: b.views }),
      ...(b.featured !== undefined && { featured: Boolean(b.featured) }),
      ...(b.featured_on_home !== undefined && { featured_on_home: Boolean(b.featured_on_home) }),
      ...(b.featuredOnHome !== undefined && { featured_on_home: Boolean(b.featuredOnHome) }),
      ...(b.related_trek_slug !== undefined && { related_trek_slug: b.related_trek_slug }),
      ...(b.relatedTrekSlug !== undefined && { related_trek_slug: b.relatedTrekSlug }),
      ...(b.related_trek_name !== undefined && { related_trek_name: b.related_trek_name }),
      ...(b.relatedTrekName !== undefined && { related_trek_name: b.relatedTrekName }),
      ...(b.author?.name && { author_name: b.author.name }),
      ...(b.author?.role && { author_role: b.author.role }),
      ...(b.author?.base && { author_base: b.author.base }),
      ...(b.author?.avatar && { author_avatar: b.author.avatar }),
      ...(b.author?.bio && { author_bio: b.author.bio }),
      ...(b.author_name && { author_name: b.author_name }),
      ...(b.author_role && { author_role: b.author_role }),
      ...(b.author_base && { author_base: b.author_base }),
      ...(b.author_avatar && { author_avatar: b.author_avatar }),
      ...(b.author_bio && { author_bio: b.author_bio }),
      ...(b.key_takeaways && { key_takeaways: b.key_takeaways }),
      ...(b.keyTakeaways && { key_takeaways: b.keyTakeaways }),
      ...(b.sections && { sections: b.sections }),
      ...(b.display_order !== undefined && { display_order: Number(b.display_order) }),
      ...(b.displayOrder !== undefined && { display_order: Number(b.displayOrder) }),
      ...(b.is_published !== undefined && { is_published: Boolean(b.is_published) }),
      ...(b.isPublished !== undefined && { is_published: Boolean(b.isPublished) }),
      updated_at: new Date().toISOString()
    };

    if (updates.featured && supabase) {
      await supabase.from('blogs').update({ featured: false }).neq('id', id);
    }

    let updatedPost = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && data) updatedPost = data;
      } catch (err) {
        console.warn('[blogController] Supabase update failed:', err.message);
      }
    }

    // Always sync local store
    const local = readLocalStore();
    const idx = local.posts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      local.posts[idx] = { ...local.posts[idx], ...updates };
      updatedPost = local.posts[idx];
    } else {
      updatedPost = { id, ...updates };
      local.posts.push(updatedPost);
    }
    writeLocalStore(local);

    clearBlogCache();
    return res.json({
      success: true,
      message: 'Trail journal updated successfully',
      post: formatPost(updatedPost)
    });
  } catch (error) {
    console.error('[blogController] updatePost error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 6. DELETE BLOG POST: DELETE /api/blogs/:id
// ----------------------------------------------------------------------
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      try {
        await supabase.from('blogs').delete().eq('id', id);
      } catch (err) {
        console.warn('[blogController] Supabase delete err:', err.message);
      }
    }

    const local = readLocalStore();
    local.posts = local.posts.filter((p) => p.id !== id);
    writeLocalStore(local);

    clearBlogCache();
    return res.json({ success: true, message: 'Trail journal deleted successfully' });
  } catch (error) {
    console.error('[blogController] deletePost error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 7. TOGGLE STATUS: PATCH /api/blogs/:id/status
// ----------------------------------------------------------------------
export const togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (supabase) {
      try {
        await supabase.from('blogs').update({ is_published }).eq('id', id);
      } catch (err) {
        console.warn('[blogController] Supabase status toggle err:', err.message);
      }
    }

    const local = readLocalStore();
    const target = local.posts.find((p) => p.id === id);
    if (target) {
      target.is_published = is_published;
      writeLocalStore(local);
    }

    clearBlogCache();
    return res.json({ success: true, is_published });
  } catch (error) {
    console.error('[blogController] togglePostStatus error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 8. TOGGLE FEATURED: PATCH /api/blogs/:id/featured
// ----------------------------------------------------------------------
export const togglePostFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured, featured_on_home } = req.body;

    const updates = {};
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (featured_on_home !== undefined) updates.featured_on_home = Boolean(featured_on_home);

    if (updates.featured && supabase) {
      await supabase.from('blogs').update({ featured: false }).neq('id', id);
    }

    if (supabase) {
      try {
        await supabase.from('blogs').update(updates).eq('id', id);
      } catch (err) {
        console.warn('[blogController] Supabase featured toggle err:', err.message);
      }
    }

    const local = readLocalStore();
    const target = local.posts.find((p) => p.id === id);
    if (target) {
      if (updates.featured) {
        local.posts.forEach((p) => (p.featured = false));
      }
      Object.assign(target, updates);
      writeLocalStore(local);
    }

    clearBlogCache();
    return res.json({ success: true, updates });
  } catch (error) {
    console.error('[blogController] togglePostFeatured error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 9. UPDATE BLOG SETTINGS: PUT /api/blogs/settings
// ----------------------------------------------------------------------
export const updateBlogSettings = async (req, res) => {
  try {
    const payload = req.body || {};
    const cleanSettings = {
      ...DEFAULT_BLOG_SETTINGS,
      ...payload,
      id: 'global',
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('blog_settings').upsert(cleanSettings);
      } catch (err) {
        console.warn('[blogController] Supabase settings update err:', err.message);
      }
    }

    const local = readLocalStore();
    local.settings = cleanSettings;
    writeLocalStore(local);

    clearBlogCache();
    return res.json({
      success: true,
      message: 'Blog hero settings updated successfully',
      settings: cleanSettings
    });
  } catch (error) {
    console.error('[blogController] updateBlogSettings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------------------
// 10. RESET TO DEFAULTS: POST /api/blogs/reset
// ----------------------------------------------------------------------
export const resetBlogs = async (req, res) => {
  try {
    const initial = {
      settings: DEFAULT_BLOG_SETTINGS,
      posts: DEFAULT_BLOG_POSTS,
      lastUpdated: new Date().toISOString()
    };
    writeLocalStore(initial);

    if (supabase) {
      try {
        await supabase.from('blog_settings').upsert(DEFAULT_BLOG_SETTINGS);
        // Clear and reseed default posts
        await supabase.from('blogs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('blogs').insert(DEFAULT_BLOG_POSTS);
      } catch (err) {
        console.warn('[blogController] Supabase reset err:', err.message);
      }
    }

    clearBlogCache();
    return res.json({ success: true, message: 'Reset blogs to initial defaults' });
  } catch (error) {
    console.error('[blogController] resetBlogs error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
