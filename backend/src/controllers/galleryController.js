import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/gallery_store.json');

const CACHE_PREFIX = 'gallery_';

export const DEFAULT_GALLERY_SETTINGS = {
  id: 'global',
  hero_badge: 'Himalayan Expedition Chronicles',
  hero_title_line1: 'Captured On The Trails,',
  hero_title_cursive: 'felt forever in the soul.',
  hero_subtitle:
    'Browse trek-by-trek photo journals, click any frame to zoom in up to 350%, and read the real story behind every summit.',
  hero_slides: [
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
  ],
  home_gallery_badge: 'Raw Trail Moments',
  home_gallery_title: 'Captured On The Trails',
  home_gallery_subtitle:
    'Real photos clicked by our trekkers and expedition leaders in Uttarakhand and Himachal Pradesh. Click any frame to zoom & read its story.',
  cta_badge: 'Be Part Of Our Next Expedition Album',
  cta_heading: 'Ready To Live These Moments Yourself?',
  cta_subtitle:
    'Every frame in this gallery was clicked on a real TrekToShikhar batch. Join our upcoming Shimla or Dehradun departures and bring home stories that last a lifetime.'
};

export const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    title: 'Kedarkantha Dawn Summit Panorama',
    trek_name: 'Kedarkantha Summit Expedition',
    trek_slug: 'kedarkantha-summit-expedition',
    category: 'Summit Views',
    location: 'Sankri, Uttarakhand',
    altitude: '12,500 ft',
    captured_at: 'Jan 2026 • 6:22 AM',
    photographer: 'Raghav Chauhan (Lead Guide)',
    details: 'Captured moments after our 3:00 AM alpine push from Hargaon Base. At -7°C, the entire Garhwal skyline ignited in molten gold across Swargarohini, Black Peak, and Gangotri.',
    featured_on_home: true,
    display_order: 1,
    is_active: true
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
    title: 'Final Ridge Push in Knee-Deep Snow',
    trek_name: 'Kedarkantha Summit Expedition',
    trek_slug: 'kedarkantha-summit-expedition',
    category: 'Winter Snow',
    location: 'Kedarkantha Shoulder Ridge',
    altitude: '11,850 ft',
    captured_at: 'Dec 2025 • 5:45 AM',
    photographer: 'Vinay Pathak',
    details: 'Our strict 14-trekker Shikharite batch moving in calm single-file rhythm with microspikes and gaiters. Clear skies, crunchy fresh powder, and unstoppable team spirit.',
    featured_on_home: false,
    display_order: 2,
    is_active: true
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    title: 'Milky Way Over Juda Ka Talab',
    trek_name: 'Kedarkantha Summit Expedition',
    trek_slug: 'kedarkantha-summit-expedition',
    category: 'Camp Life',
    location: 'Juda Ka Talab Campsite',
    altitude: '9,100 ft',
    captured_at: 'Jan 2026 • 10:15 PM',
    photographer: 'Devendra Negi',
    details: 'After hot mountain soup and stories around camp, the frozen pine-ringed lake reflected millions of winter stars with zero light pollution.',
    featured_on_home: false,
    display_order: 3,
    is_active: true
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    title: 'Nag Tibba Flag Crest & Garhwal Wall',
    trek_name: 'Nag Tibba Weekend Trek',
    trek_slug: 'nag-tibba-weekend-trek',
    category: 'Summit Views',
    location: 'Pantwari, Dehradun Base',
    altitude: '9,915 ft',
    captured_at: 'Feb 2026 • 7:40 AM',
    photographer: 'Ananya Rawat',
    details: "Standing at the Serpent's Peak summit with fluttering Tibetan prayer flags and an unobstructed 360-degree view of Bandarpoonch and Kedarnath domes.",
    featured_on_home: true,
    display_order: 4,
    is_active: true
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1400&q=85',
    title: 'Nag Tibba Base Camp Twilight Tents',
    trek_name: 'Nag Tibba Weekend Trek',
    trek_slug: 'nag-tibba-weekend-trek',
    category: 'Camp Life',
    location: 'Nag Tibba Base Clearing',
    altitude: '7,600 ft',
    captured_at: 'Nov 2025 • 6:10 PM',
    photographer: 'Vinay Pathak',
    details: 'Freshly pitched 4-season waterproof dome tents nestled amidst ancient oak canopies just as hot ginger-lemon tea and pakoras were served to our weekend batch.',
    featured_on_home: true,
    display_order: 5,
    is_active: true
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85',
    title: 'Sunbeams Through Dense Oak Canopy',
    trek_name: 'Nag Tibba Weekend Trek',
    trek_slug: 'nag-tibba-weekend-trek',
    category: 'Forest Trails',
    location: 'Pantwari to Goat Village Trail',
    altitude: '6,400 ft',
    captured_at: 'Mar 2026 • 9:30 AM',
    photographer: 'Shikharite Batch #42',
    details: 'Morning rays piercing moss-covered oak and rhododendron forests during Day 1 ascent. Ideal cool shade and gentle gradients for first-time Himalayan trekkers.',
    featured_on_home: true,
    display_order: 6,
    is_active: true
  },
  {
    id: 'gal-7',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    title: 'Shimla Alpine Valley Pastel Sunrise',
    trek_name: 'Hatu Peak & Alpine Ridge',
    trek_slug: 'hatu-peak-alpine-ridge',
    category: 'Summit Views',
    location: 'Narkanda, Shimla Base',
    altitude: '11,150 ft',
    captured_at: 'Feb 2026 • 6:50 AM',
    photographer: 'Raghav Chauhan',
    details: 'Looking across the serene Narkanda valleys and Greater Himalayan snow line from the ancient wooden Hatu Mata sanctuary ridge.',
    featured_on_home: true,
    display_order: 7,
    is_active: true
  },
  {
    id: 'gal-8',
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85',
    title: 'Snow-Dusted Deodar Ridge Walk',
    trek_name: 'Hatu Peak & Alpine Ridge',
    trek_slug: 'hatu-peak-alpine-ridge',
    category: 'Winter Snow',
    location: 'Hatu Forest Crest, Himachal',
    altitude: '10,600 ft',
    captured_at: 'Jan 2026 • 11:05 AM',
    photographer: 'Ananya Rawat',
    details: 'Crisp winter air, untouched white deodar boughs, and dramatic cloud inversions drifting beneath our boots along the Shimla alpine trail.',
    featured_on_home: false,
    display_order: 8,
    is_active: true
  },
  {
    id: 'gal-9',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
    title: 'Sea of Clouds Below Narkanda Crest',
    trek_name: 'Hatu Peak & Alpine Ridge',
    trek_slug: 'hatu-peak-alpine-ridge',
    category: 'Forest Trails',
    location: 'Hatu Viewpoint',
    altitude: '11,020 ft',
    captured_at: 'Oct 2025 • 4:55 PM',
    photographer: 'Devendra Negi',
    details: 'Post-monsoon clarity created a surreal ocean of valley clouds right beneath the ridge as our group paused for trail snacks and group portraits.',
    featured_on_home: false,
    display_order: 9,
    is_active: true
  },
  {
    id: 'gal-10',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=85',
    title: 'Churdhar Peak Dramatic Silhouette',
    trek_name: 'Churdhar Sanctuary Trek',
    trek_slug: 'churdhar-sanctuary-trek',
    category: 'Summit Views',
    location: 'Nauradhar, Himachal Pradesh',
    altitude: '11,965 ft',
    captured_at: 'Nov 2025 • 8:15 AM',
    photographer: 'Raghav Chauhan',
    details: 'The highest peak of the Outer Himalayas standing tall above glacial boulder fields and sacred wildlife sanctuary ridges.',
    featured_on_home: true,
    display_order: 10,
    is_active: true
  },
  {
    id: 'gal-11',
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85',
    title: 'Sacred Deodar Trail Into Wilderness',
    trek_name: 'Churdhar Sanctuary Trek',
    trek_slug: 'churdhar-sanctuary-trek',
    category: 'Forest Trails',
    location: 'Teesri Meadow Approach',
    altitude: '9,800 ft',
    captured_at: 'Oct 2025 • 1:20 PM',
    photographer: 'Vinay Pathak',
    details: 'Walking deep inside Churdhar Wildlife Sanctuary where ancient cedar trees give way to sweeping high-altitude meadows and wild Himalayan herbs.',
    featured_on_home: false,
    display_order: 11,
    is_active: true
  },
  {
    id: 'gal-12',
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1400&q=85',
    title: 'Trishul & Nanda Ghunti From Brahmatal',
    trek_name: 'Brahmatal Winter Summit Trek',
    trek_slug: 'brahmatal-winter-summit-trek',
    category: 'Winter Snow',
    location: 'Lohajung, Chamoli',
    altitude: '12,250 ft',
    captured_at: 'Feb 2026 • 8:05 AM',
    photographer: 'Ananya Rawat',
    details: 'Face-to-face with the towering 7,000-meter giants Mt. Trishul and Nanda Ghunti gleaming under cobalt winter skies after a fresh overnight snowfall.',
    featured_on_home: false,
    display_order: 12,
    is_active: true
  },
  {
    id: 'gal-13',
    url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1400&q=85',
    title: 'Sub-Zero Alpine Tent Life at Bekaltal',
    trek_name: 'Brahmatal Winter Summit Trek',
    trek_slug: 'brahmatal-winter-summit-trek',
    category: 'Camp Life',
    location: 'Bekaltal Frozen Lake Camp',
    altitude: '9,885 ft',
    captured_at: 'Jan 2026 • 7:20 PM',
    photographer: 'Devendra Negi',
    details: 'Inside -10°C rated thermal sleeping bags with evening oximeter checks complete — cozy warmth and laughter echoing across the silent snow meadow.',
    featured_on_home: false,
    display_order: 13,
    is_active: true
  },
  {
    id: 'gal-14',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',
    title: 'Valley of Gods River Crossing Panorama',
    trek_name: 'Har Ki Dun Valley Trek',
    trek_slug: 'har-ki-dun-valley-trek',
    category: 'Summit Views',
    location: 'Osla Village, Govind Wildlife Sanctuary',
    altitude: '11,700 ft',
    captured_at: 'Apr 2026 • 10:45 AM',
    photographer: 'Vinay Pathak',
    details: 'Glacial turquoise Supin river winding past centuries-old wooden Himalayan villages on the iconic Har Ki Dun valley approach.',
    featured_on_home: false,
    display_order: 14,
    is_active: true
  },
  {
    id: 'gal-15',
    url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1400&q=85',
    title: 'Once a Shikharite, Always a Shikharite',
    trek_name: 'Har Ki Dun Valley Trek',
    trek_slug: 'har-ki-dun-valley-trek',
    category: 'Shikharite Family',
    location: 'Kalkattiyadhar Meadow',
    altitude: '10,400 ft',
    captured_at: 'Apr 2026 • 4:10 PM',
    photographer: 'Batch #51 Memories',
    details: 'Strangers who met at Dehradun station five days earlier celebrating together above the clouds — proving that the best part of every trail is the family you find.',
    featured_on_home: false,
    display_order: 15,
    is_active: true
  }
];

const isTableMissing = (error) =>
  Boolean(
    error &&
      (error.code === 'PGRST205' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache'))
  );

const parseJsonArray = (val, fallback = []) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const formatSettings = (row) => {
  const src = row || {};
  return {
    ...DEFAULT_GALLERY_SETTINGS,
    ...src,
    id: 'global',
    hero_slides: parseJsonArray(src.hero_slides, DEFAULT_GALLERY_SETTINGS.hero_slides),
    updated_at: src.updated_at || new Date().toISOString()
  };
};

const formatPhoto = (row, idx = 0) => ({
  id: row.id || `gal-${idx + 1}`,
  url: row.url || '',
  title: row.title || 'Himalayan Frame',
  trek_name: row.trek_name || row.trekName || 'Himalayan Expedition',
  trekName: row.trek_name || row.trekName || 'Himalayan Expedition',
  trek_slug: row.trek_slug ?? row.trekSlug ?? '',
  trekSlug: row.trek_slug ?? row.trekSlug ?? '',
  category: row.category || 'Summit Views',
  location: row.location || 'Himalayas',
  altitude: row.altitude || '10,000 ft',
  captured_at: row.captured_at || row.capturedAt || '2026',
  capturedAt: row.captured_at || row.capturedAt || '2026',
  photographer: row.photographer || 'TrekToShikhar Team',
  details: row.details || '',
  featured_on_home: Boolean(row.featured_on_home ?? row.featuredOnHome ?? false),
  featuredOnHome: Boolean(row.featured_on_home ?? row.featuredOnHome ?? false),
  display_order: Number(row.display_order ?? row.displayOrder ?? idx + 1),
  is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
  isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
  created_at: row.created_at,
  updated_at: row.updated_at
});

const readLocalStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
      if (parsed && parsed.settings && Array.isArray(parsed.photos)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not read local gallery store:', err.message);
  }
  return {
    settings: { ...DEFAULT_GALLERY_SETTINGS },
    photos: DEFAULT_GALLERY_PHOTOS.map((p) => ({ ...p }))
  };
};

const writeLocalStore = (store) => {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write local gallery store:', err.message);
  }
};

/**
 * GET /api/gallery
 * Fetches Gallery Settings (Hero Slides & Copy) + Trek-Wise Photos
 */
export const getGallery = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const trekFilter = req.query.trek || '';
    const featuredOnly = req.query.featured === 'true';
    const cacheKey = `${CACHE_PREFIX}${isAdmin}_${trekFilter}_${featuredOnly}`;

    if (!isAdmin) {
      const cached = appCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached);
      }
    }

    let photosQuery = supabase
      .from('gallery_photos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!isAdmin) photosQuery = photosQuery.eq('is_active', true);
    if (trekFilter && trekFilter !== 'all') photosQuery = photosQuery.eq('trek_name', trekFilter);
    if (featuredOnly) photosQuery = photosQuery.eq('featured_on_home', true);

    const [settingsRes, photosRes] = await Promise.all([
      supabase.from('gallery_settings').select('*').eq('id', 'global').limit(1),
      photosQuery
    ]);

    if (isTableMissing(settingsRes.error) || isTableMissing(photosRes.error)) {
      const local = readLocalStore();
      let list = [...local.photos].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      if (!isAdmin) list = list.filter((p) => p.is_active !== false);
      if (trekFilter && trekFilter !== 'all') list = list.filter((p) => p.trek_name === trekFilter);
      if (featuredOnly) list = list.filter((p) => p.featured_on_home);

      const formatted = list.map(formatPhoto);
      const payload = {
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        settings: formatSettings(local.settings),
        photos: formatted,
        total: formatted.length
      };
      if (!isAdmin) appCache.set(cacheKey, payload, 300);
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    }

    if (settingsRes.error || photosRes.error) {
      const local = readLocalStore();
      const formatted = local.photos.map(formatPhoto);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        tableNotReady: false,
        settings: formatSettings(local.settings),
        photos: formatted,
        total: formatted.length
      });
    }

    const settings = formatSettings(settingsRes.data?.[0] || DEFAULT_GALLERY_SETTINGS);
    const photos = (photosRes.data || []).map(formatPhoto);

    const payload = {
      success: true,
      source: 'database',
      tableNotReady: false,
      settings,
      photos,
      total: photos.length
    };

    if (!isAdmin) appCache.set(cacheKey, payload, 600);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery: ' + err.message
    });
  }
};

/**
 * PUT /api/gallery/settings
 * Updates Gallery Hero Slides, Hero Copy, Homepage Gallery Copy & Bottom CTA
 */
export const updateGallerySettings = async (req, res) => {
  try {
    const body = req.body || {};
    const current = readLocalStore();

    const cleanDbPayload = {
      id: 'global',
      hero_badge: body.hero_badge ?? current.settings.hero_badge ?? DEFAULT_GALLERY_SETTINGS.hero_badge,
      hero_title_line1: body.hero_title_line1 ?? current.settings.hero_title_line1 ?? DEFAULT_GALLERY_SETTINGS.hero_title_line1,
      hero_title_cursive: body.hero_title_cursive ?? current.settings.hero_title_cursive ?? DEFAULT_GALLERY_SETTINGS.hero_title_cursive,
      hero_subtitle: body.hero_subtitle ?? current.settings.hero_subtitle ?? DEFAULT_GALLERY_SETTINGS.hero_subtitle,
      hero_slides: Array.isArray(body.hero_slides)
        ? body.hero_slides
        : current.settings.hero_slides || DEFAULT_GALLERY_SETTINGS.hero_slides,
      home_gallery_badge: body.home_gallery_badge ?? current.settings.home_gallery_badge ?? DEFAULT_GALLERY_SETTINGS.home_gallery_badge,
      home_gallery_title: body.home_gallery_title ?? current.settings.home_gallery_title ?? DEFAULT_GALLERY_SETTINGS.home_gallery_title,
      home_gallery_subtitle: body.home_gallery_subtitle ?? current.settings.home_gallery_subtitle ?? DEFAULT_GALLERY_SETTINGS.home_gallery_subtitle,
      cta_badge: body.cta_badge ?? current.settings.cta_badge ?? DEFAULT_GALLERY_SETTINGS.cta_badge,
      cta_heading: body.cta_heading ?? current.settings.cta_heading ?? DEFAULT_GALLERY_SETTINGS.cta_heading,
      cta_subtitle: body.cta_subtitle ?? current.settings.cta_subtitle ?? DEFAULT_GALLERY_SETTINGS.cta_subtitle,
      updated_at: new Date().toISOString()
    };

    current.settings = cleanDbPayload;
    writeLocalStore(current);
    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('gallery_settings')
      .upsert([cleanDbPayload], { onConflict: 'id' })
      .select();

    if (isTableMissing(error)) {
      return res.status(200).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'Gallery settings saved live! Run gallery.sql in Supabase for cloud sync.',
        data: formatSettings(cleanDbPayload)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'Gallery hero & settings updated live!',
      data: formatSettings(data?.[0] || cleanDbPayload)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update gallery settings: ' + err.message
    });
  }
};

/**
 * POST /api/gallery/photos
 * Add a new trek photo frame
 */
export const createGalleryPhoto = async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.url || !body.title) {
      return res.status(400).json({
        success: false,
        error: 'Photo URL and Title are required.'
      });
    }

    const local = readLocalStore();
    const dbPayload = {
      url: String(body.url).trim(),
      title: String(body.title).trim(),
      trek_name: String(body.trek_name || body.trekName || 'Kedarkantha Summit Expedition').trim(),
      trek_slug: String(body.trek_slug ?? body.trekSlug ?? '').trim(),
      category: String(body.category || 'Summit Views').trim(),
      location: String(body.location || 'Uttarakhand / Himachal').trim(),
      altitude: String(body.altitude || '10,000 ft').trim(),
      captured_at: String(body.captured_at || body.capturedAt || '2026').trim(),
      photographer: String(body.photographer || 'TrekToShikhar Team').trim(),
      details: String(body.details || '').trim(),
      featured_on_home: Boolean(body.featured_on_home ?? body.featuredOnHome ?? false),
      display_order:
        body.display_order !== undefined ? Number(body.display_order) : local.photos.length + 1,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString()
    };

    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('gallery_photos')
      .insert([dbPayload])
      .select();

    if (isTableMissing(error)) {
      const localRec = {
        id: `gal-${crypto.randomBytes(4).toString('hex')}`,
        ...dbPayload,
        created_at: new Date().toISOString()
      };
      local.photos.push(localRec);
      writeLocalStore(local);
      return res.status(201).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'Photo added to gallery live!',
        data: formatPhoto(localRec)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'New photo published live!',
      data: formatPhoto(data[0])
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create photo: ' + err.message
    });
  }
};

/**
 * PUT /api/gallery/photos/:id
 * Update an existing gallery photo
 */
export const updateGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updatePayload = { updated_at: new Date().toISOString() };

    if (body.url !== undefined) updatePayload.url = String(body.url).trim();
    if (body.title !== undefined) updatePayload.title = String(body.title).trim();
    if (body.trek_name !== undefined || body.trekName !== undefined)
      updatePayload.trek_name = String(body.trek_name ?? body.trekName).trim();
    if (body.trek_slug !== undefined || body.trekSlug !== undefined)
      updatePayload.trek_slug = String(body.trek_slug ?? body.trekSlug).trim();
    if (body.category !== undefined) updatePayload.category = String(body.category).trim();
    if (body.location !== undefined) updatePayload.location = String(body.location).trim();
    if (body.altitude !== undefined) updatePayload.altitude = String(body.altitude).trim();
    if (body.captured_at !== undefined || body.capturedAt !== undefined)
      updatePayload.captured_at = String(body.captured_at ?? body.capturedAt).trim();
    if (body.photographer !== undefined) updatePayload.photographer = String(body.photographer).trim();
    if (body.details !== undefined) updatePayload.details = String(body.details).trim();
    if (body.featured_on_home !== undefined || body.featuredOnHome !== undefined)
      updatePayload.featured_on_home = Boolean(body.featured_on_home ?? body.featuredOnHome);
    if (body.display_order !== undefined) updatePayload.display_order = Number(body.display_order);
    if (body.is_active !== undefined || body.isActive !== undefined)
      updatePayload.is_active = Boolean(body.is_active ?? body.isActive);

    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { data, error } = await supabase
        .from('gallery_photos')
        .update(updatePayload)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'database',
          tableNotReady: false,
          message: 'Photo updated live!',
          data: formatPhoto(data[0])
        });
      }
      if (error && !isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    const local = readLocalStore();
    const idx = local.photos.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, error: `Photo '${id}' not found` });
    }
    local.photos[idx] = { ...local.photos[idx], ...updatePayload };
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'Photo updated live!',
      data: formatPhoto(local.photos[idx])
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update photo: ' + err.message
    });
  }
};

/**
 * DELETE /api/gallery/photos/:id
 */
export const deleteGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
      if (!error) {
        return res.status(200).json({ success: true, message: 'Photo deleted from gallery!' });
      }
      if (!isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    const local = readLocalStore();
    local.photos = local.photos.filter((p) => String(p.id) !== String(id));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Photo deleted from gallery!'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete photo: ' + err.message
    });
  }
};

/**
 * PUT /api/gallery/photos/reorder
 */
export const reorderGalleryPhotos = async (req, res) => {
  try {
    const { orderedIds } = req.body || {};
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    }

    appCache.clearPrefix(CACHE_PREFIX);

    const allUUIDs = orderedIds.every((id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
    );

    if (allUUIDs && orderedIds.length > 0) {
      const results = await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from('gallery_photos')
            .update({ display_order: index + 1, updated_at: new Date().toISOString() })
            .eq('id', id)
        )
      );
      const firstErr = results.find((r) => r.error)?.error;
      if (!firstErr) {
        return res.status(200).json({ success: true, message: 'Gallery order updated live!' });
      }
      if (!isTableMissing(firstErr)) {
        return res.status(400).json({ success: false, error: firstErr.message });
      }
    }

    const local = readLocalStore();
    const orderMap = new Map(orderedIds.map((id, idx) => [String(id), idx + 1]));
    local.photos = local.photos
      .map((p) => ({ ...p, display_order: orderMap.get(String(p.id)) ?? p.display_order }))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Gallery order updated live!'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder photos: ' + err.message
    });
  }
};

/**
 * POST /api/gallery/reset
 */
export const resetGallery = async (req, res) => {
  try {
    appCache.clearPrefix(CACHE_PREFIX);

    const freshLocal = {
      settings: { ...DEFAULT_GALLERY_SETTINGS, updated_at: new Date().toISOString() },
      photos: DEFAULT_GALLERY_PHOTOS.map((p) => ({ ...p }))
    };
    writeLocalStore(freshLocal);

    const { error: settingsErr } = await supabase
      .from('gallery_settings')
      .upsert([freshLocal.settings], { onConflict: 'id' });

    if (!isTableMissing(settingsErr)) {
      await supabase.from('gallery_photos').delete().neq('display_order', -9999);
      const seedRows = DEFAULT_GALLERY_PHOTOS.map(({ id, ...rest }) => ({
        ...rest,
        updated_at: new Date().toISOString()
      }));
      const { data: inserted } = await supabase.from('gallery_photos').insert(seedRows).select();
      return res.status(200).json({
        success: true,
        source: 'database',
        message: 'Gallery reset to defaults!',
        settings: formatSettings(freshLocal.settings),
        photos: (inserted || DEFAULT_GALLERY_PHOTOS).map(formatPhoto)
      });
    }

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'Gallery reset to defaults!',
      settings: formatSettings(freshLocal.settings),
      photos: freshLocal.photos.map(formatPhoto)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset gallery: ' + err.message
    });
  }
};
