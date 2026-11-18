-- ========================================================
-- TrekToShikhar: Expedition Gallery & Hero Slides Schema
-- Complete Dynamic Gallery synced with /gallery & Homepage
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Gallery Settings & Hero Slides Table (Singleton)
CREATE TABLE IF NOT EXISTS public.gallery_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    hero_badge VARCHAR(150) DEFAULT 'Himalayan Expedition Chronicles',
    hero_title_line1 VARCHAR(255) NOT NULL DEFAULT 'Captured On The Trails,',
    hero_title_cursive VARCHAR(255) NOT NULL DEFAULT 'felt forever in the soul.',
    hero_subtitle TEXT DEFAULT 'Browse trek-by-trek photo journals, click any frame to zoom in up to 350%, and read the real story behind every summit.',
    hero_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
    home_gallery_badge VARCHAR(150) DEFAULT 'Raw Trail Moments',
    home_gallery_title VARCHAR(200) DEFAULT 'Captured On The Trails',
    home_gallery_subtitle TEXT DEFAULT 'Real photos clicked by our trekkers and expedition leaders in Uttarakhand and Himachal Pradesh. Click any frame to zoom & read its story.',
    cta_badge VARCHAR(180) DEFAULT 'Be Part Of Our Next Expedition Album',
    cta_heading VARCHAR(255) DEFAULT 'Ready To Live These Moments Yourself?',
    cta_subtitle TEXT DEFAULT 'Every frame in this gallery was clicked on a real TrekToShikhar batch. Join our upcoming Shimla or Dehradun departures and bring home stories that last a lifetime.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Individual Expedition Gallery Photos Table
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    trek_name VARCHAR(200) NOT NULL DEFAULT 'Kedarkantha Summit Expedition',
    trek_slug VARCHAR(200) DEFAULT '',
    category VARCHAR(100) DEFAULT 'Summit Views',
    location VARCHAR(200) DEFAULT 'Uttarakhand / Himachal',
    altitude VARCHAR(80) DEFAULT '10,000 ft',
    captured_at VARCHAR(100) DEFAULT '2026',
    photographer VARCHAR(150) DEFAULT 'TrekToShikhar Team',
    details TEXT DEFAULT '',
    featured_on_home BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.gallery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Public read gallery_settings" ON public.gallery_settings;
CREATE POLICY "Public read gallery_settings"
ON public.gallery_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access gallery_settings" ON public.gallery_settings;
CREATE POLICY "Full access gallery_settings"
ON public.gallery_settings
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read gallery_photos" ON public.gallery_photos;
CREATE POLICY "Public read gallery_photos"
ON public.gallery_photos
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access gallery_photos" ON public.gallery_photos;
CREATE POLICY "Full access gallery_photos"
ON public.gallery_photos
FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Seed Default Gallery Settings & 4 Hero Slides
INSERT INTO public.gallery_settings (
    id,
    hero_slides
) VALUES (
    'global',
    '[
      {
        "id": "gh-1",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
        "title": "Kedarkantha Summit Sunrise",
        "location": "Sankri, Uttarakhand (12,500 ft)",
        "caption": "First golden rays hitting the Swargarohini & Bandarpoonch amphitheater."
      },
      {
        "id": "gh-2",
        "url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85",
        "title": "Alpine Ridge Expedition Walk",
        "location": "Garhwal Himalayas (11,400 ft)",
        "caption": "Small-batch Shikharites moving steadily along a pristine winter snow crest."
      },
      {
        "id": "gh-3",
        "url": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1920&q=85",
        "title": "Starlit Base Camp Glow",
        "location": "Nag Tibba Base Camp (7,600 ft)",
        "caption": "4-season waterproof dome tents glowing warmly under crisp Himalayan skies."
      },
      {
        "id": "gh-4",
        "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
        "title": "Shimla Pine & Alpine Valley",
        "location": "Narkanda / Hatu Peak (11,150 ft)",
        "caption": "Misty cedar canopies opening out into emerald and snow-dusted horizons."
      }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Default 15 Trek-Wise Expedition Photos
INSERT INTO public.gallery_photos (
    url,
    title,
    trek_name,
    trek_slug,
    category,
    location,
    altitude,
    captured_at,
    photographer,
    details,
    featured_on_home,
    display_order,
    is_active
) VALUES
(
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    'Kedarkantha Dawn Summit Panorama',
    'Kedarkantha Summit Expedition',
    'kedarkantha-summit-expedition',
    'Summit Views',
    'Sankri, Uttarakhand',
    '12,500 ft',
    'Jan 2026 • 6:22 AM',
    'Raghav Chauhan (Lead Guide)',
    'Captured moments after our 3:00 AM alpine push from Hargaon Base. At -7°C, the entire Garhwal skyline ignited in molten gold across Swargarohini, Black Peak, and Gangotri.',
    true, 1, true
),
(
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
    'Final Ridge Push in Knee-Deep Snow',
    'Kedarkantha Summit Expedition',
    'kedarkantha-summit-expedition',
    'Winter Snow',
    'Kedarkantha Shoulder Ridge',
    '11,850 ft',
    'Dec 2025 • 5:45 AM',
    'Vinay Pathak',
    'Our strict 14-trekker Shikharite batch moving in calm single-file rhythm with microspikes and gaiters. Clear skies, crunchy fresh powder, and unstoppable team spirit.',
    false, 2, true
),
(
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    'Milky Way Over Juda Ka Talab',
    'Kedarkantha Summit Expedition',
    'kedarkantha-summit-expedition',
    'Camp Life',
    'Juda Ka Talab Campsite',
    '9,100 ft',
    'Jan 2026 • 10:15 PM',
    'Devendra Negi',
    'After hot mountain soup and stories around camp, the frozen pine-ringed lake reflected millions of winter stars with zero light pollution.',
    false, 3, true
),
(
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    'Nag Tibba Flag Crest & Garhwal Wall',
    'Nag Tibba Weekend Trek',
    'nag-tibba-weekend-trek',
    'Summit Views',
    'Pantwari, Dehradun Base',
    '9,915 ft',
    'Feb 2026 • 7:40 AM',
    'Ananya Rawat',
    'Standing at the Serpent''s Peak summit with fluttering Tibetan prayer flags and an unobstructed 360-degree view of Bandarpoonch and Kedarnath domes.',
    true, 4, true
),
(
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1400&q=85',
    'Nag Tibba Base Camp Twilight Tents',
    'Nag Tibba Weekend Trek',
    'nag-tibba-weekend-trek',
    'Camp Life',
    'Nag Tibba Base Clearing',
    '7,600 ft',
    'Nov 2025 • 6:10 PM',
    'Vinay Pathak',
    'Freshly pitched 4-season waterproof dome tents nestled amidst ancient oak canopies just as hot ginger-lemon tea and pakoras were served to our weekend batch.',
    true, 5, true
),
(
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85',
    'Sunbeams Through Dense Oak Canopy',
    'Nag Tibba Weekend Trek',
    'nag-tibba-weekend-trek',
    'Forest Trails',
    'Pantwari to Goat Village Trail',
    '6,400 ft',
    'Mar 2026 • 9:30 AM',
    'Shikharite Batch #42',
    'Morning rays piercing moss-covered oak and rhododendron forests during Day 1 ascent. Ideal cool shade and gentle gradients for first-time Himalayan trekkers.',
    true, 6, true
),
(
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    'Shimla Alpine Valley Pastel Sunrise',
    'Hatu Peak & Alpine Ridge',
    'hatu-peak-alpine-ridge',
    'Summit Views',
    'Narkanda, Shimla Base',
    '11,150 ft',
    'Feb 2026 • 6:50 AM',
    'Raghav Chauhan',
    'Looking across the serene Narkanda valleys and Greater Himalayan snow line from the ancient wooden Hatu Mata sanctuary ridge.',
    true, 7, true
),
(
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85',
    'Snow-Dusted Deodar Ridge Walk',
    'Hatu Peak & Alpine Ridge',
    'hatu-peak-alpine-ridge',
    'Winter Snow',
    'Hatu Forest Crest, Himachal',
    '10,600 ft',
    'Jan 2026 • 11:05 AM',
    'Ananya Rawat',
    'Crisp winter air, untouched white deodar boughs, and dramatic cloud inversions drifting beneath our boots along the Shimla alpine trail.',
    false, 8, true
),
(
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
    'Sea of Clouds Below Narkanda Crest',
    'Hatu Peak & Alpine Ridge',
    'hatu-peak-alpine-ridge',
    'Forest Trails',
    'Hatu Viewpoint',
    '11,020 ft',
    'Oct 2025 • 4:55 PM',
    'Devendra Negi',
    'Post-monsoon clarity created a surreal ocean of valley clouds right beneath the ridge as our group paused for trail snacks and group portraits.',
    false, 9, true
),
(
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=85',
    'Churdhar Peak Dramatic Silhouette',
    'Churdhar Sanctuary Trek',
    'churdhar-sanctuary-trek',
    'Summit Views',
    'Nauradhar, Himachal Pradesh',
    '11,965 ft',
    'Nov 2025 • 8:15 AM',
    'Raghav Chauhan',
    'The highest peak of the Outer Himalayas standing tall above glacial boulder fields and sacred wildlife sanctuary ridges.',
    true, 10, true
),
(
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85',
    'Sacred Deodar Trail Into Wilderness',
    'Churdhar Sanctuary Trek',
    'churdhar-sanctuary-trek',
    'Forest Trails',
    'Teesri Meadow Approach',
    '9,800 ft',
    'Oct 2025 • 1:20 PM',
    'Vinay Pathak',
    'Walking deep inside Churdhar Wildlife Sanctuary where ancient cedar trees give way to sweeping high-altitude meadows and wild Himalayan herbs.',
    false, 11, true
),
(
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1400&q=85',
    'Trishul & Nanda Ghunti From Brahmatal',
    'Brahmatal Winter Summit Trek',
    'brahmatal-winter-summit-trek',
    'Winter Snow',
    'Lohajung, Chamoli',
    '12,250 ft',
    'Feb 2026 • 8:05 AM',
    'Ananya Rawat',
    'Face-to-face with the towering 7,000-meter giants Mt. Trishul and Nanda Ghunti gleaming under cobalt winter skies after a fresh overnight snowfall.',
    false, 12, true
),
(
    'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1400&q=85',
    'Sub-Zero Alpine Tent Life at Bekaltal',
    'Brahmatal Winter Summit Trek',
    'brahmatal-winter-summit-trek',
    'Camp Life',
    'Bekaltal Frozen Lake Camp',
    '9,885 ft',
    'Jan 2026 • 7:20 PM',
    'Devendra Negi',
    'Inside -10°C rated thermal sleeping bags with evening oximeter checks complete — cozy warmth and laughter echoing across the silent snow meadow.',
    false, 13, true
),
(
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',
    'Valley of Gods River Crossing Panorama',
    'Har Ki Dun Valley Trek',
    'har-ki-dun-valley-trek',
    'Summit Views',
    'Osla Village, Govind Wildlife Sanctuary',
    '11,700 ft',
    'Apr 2026 • 10:45 AM',
    'Vinay Pathak',
    'Glacial turquoise Supin river winding past centuries-old wooden Himalayan villages on the iconic Har Ki Dun valley approach.',
    false, 14, true
),
(
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1400&q=85',
    'Once a Shikharite, Always a Shikharite',
    'Har Ki Dun Valley Trek',
    'har-ki-dun-valley-trek',
    'Shikharite Family',
    'Kalkattiyadhar Meadow',
    '10,400 ft',
    'Apr 2026 • 4:10 PM',
    'Batch #51 Memories',
    'Strangers who met at Dehradun station five days earlier celebrating together above the clouds — proving that the best part of every trail is the family you find.',
    false, 15, true
);
