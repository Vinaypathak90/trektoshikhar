-- ========================================================
-- TrekToShikhar: Google Reviews & Section Settings Schema
-- Dynamic Reviews Marquee controlled via Admin Dashboard
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Section Header & Global Settings Table (Singleton)
CREATE TABLE IF NOT EXISTS public.google_reviews_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    badge_text VARCHAR(150) DEFAULT 'Verified Himalayan Trekker Reviews',
    headline VARCHAR(120) NOT NULL DEFAULT 'EXCELLENT',
    star_rating INTEGER NOT NULL DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
    total_reviews_label VARCHAR(120) NOT NULL DEFAULT '108+ verified reviews',
    subtitle_suffix VARCHAR(255) DEFAULT 'across Google & trail logs',
    show_google_logo BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Individual Trekker Reviews Table
CREATE TABLE IF NOT EXISTS public.google_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    avatar_bg VARCHAR(60) DEFAULT 'bg-blue-600',
    avatar_text VARCHAR(10) NOT NULL DEFAULT 'T',
    time_ago VARCHAR(80) DEFAULT 'Recently',
    trek_tag VARCHAR(150) DEFAULT 'Himalayan Expedition',
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT true,
    verified_label VARCHAR(100) DEFAULT 'Verified Stay & Trail',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.google_reviews_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Public read google_reviews_settings" ON public.google_reviews_settings;
CREATE POLICY "Public read google_reviews_settings"
ON public.google_reviews_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access google_reviews_settings" ON public.google_reviews_settings;
CREATE POLICY "Full access google_reviews_settings"
ON public.google_reviews_settings
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read google_reviews" ON public.google_reviews;
CREATE POLICY "Public read google_reviews"
ON public.google_reviews
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access google_reviews" ON public.google_reviews;
CREATE POLICY "Full access google_reviews"
ON public.google_reviews
FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Seed Default Settings
INSERT INTO public.google_reviews_settings (
    id,
    badge_text,
    headline,
    star_rating,
    total_reviews_label,
    subtitle_suffix,
    show_google_logo,
    is_active
) VALUES (
    'global',
    'Verified Himalayan Trekker Reviews',
    'EXCELLENT',
    5,
    '108+ verified reviews',
    'across Google & trail logs',
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Default 8 Verified Trekker Reviews
INSERT INTO public.google_reviews (
    name,
    avatar_bg,
    avatar_text,
    time_ago,
    trek_tag,
    rating,
    review,
    is_verified,
    verified_label,
    display_order,
    is_active
) VALUES
(
    'Ashish Agarwal',
    'bg-blue-600',
    'A',
    '8 months ago',
    'Nag Tibba Weekend Trek',
    5,
    'Trek To Shikhar provided brilliant experience for my first trek. They had amazing facilities, warm four-season tents, and provided guidance of utmost quality. The certified NIM guides were patient and motivating throughout the summit climb. Highly recommend!',
    true,
    'Verified Stay & Trail',
    1,
    true
),
(
    'Mayank Bhardwaj',
    'bg-emerald-600',
    'M',
    '9 months ago',
    'Nag Tibba Summit',
    5,
    'Nag Tibba with Trek To Shikhar was well-planned and smoothly executed. The trek leaders explained the trail well and motivated the group throughout the difficult stretches. Fresh hot meals at sub-zero base camp was a blessing.',
    true,
    'Verified Stay & Trail',
    2,
    true
),
(
    'Kamal Sarkar',
    'bg-neutral-900',
    'KS',
    '9 months ago',
    'Brahmatal Winter Expedition',
    5,
    'Brahmatal Trek exceeded expectations in every way! The team maintained a perfect balance of safety and enjoyment. Medical pulse oximeter checks twice daily and reliable high-altitude sleeping bags kept us warm at -5°C.',
    true,
    'Verified Stay & Trail',
    3,
    true
),
(
    'Priya Sharma',
    'bg-rose-500',
    'P',
    '6 months ago',
    'Kedarkantha Summit Ridge',
    5,
    'Kedarkantha sunrise summit was pure magic! As a solo female trekker, I felt 100% safe and respected. Strict 12-15 batch size meant genuine personal care. Microspikes and gaiters were provided on spot for the snow trail.',
    true,
    'Verified Stay & Trail',
    4,
    true
),
(
    'Rahul Verma',
    'bg-amber-600',
    'R',
    '5 months ago',
    'Hatu Peak & Alpine Ridge',
    5,
    'Hatu Peak alpine ridge trail was breathtaking! Equipment was spotless—waterproof dome tents and clean thermal sleeping bags kept us warm. The certified guides are born locals with deep mountain respect. Booking Kuari Pass next!',
    true,
    'Verified Stay & Trail',
    5,
    true
),
(
    'Sunita Rawat',
    'bg-indigo-600',
    'S',
    '7 months ago',
    'Churdhar Sanctuary Trek',
    5,
    'Churdhar Peak sanctuary trek was thrilling! The team monitored hydration and acclimatization with immense care. Zero plastic on trail, transparent pricing, and authentic mountain hospitality. 5 stars all the way!',
    true,
    'Verified Stay & Trail',
    6,
    true
),
(
    'Kunal Malhotra',
    'bg-teal-600',
    'K',
    '4 months ago',
    'Dayara Bugyal Meadows',
    5,
    'Having trekked across Uttarakhand with several commercial agencies, Trek To Shikhar stands in a league of its own. Capping batches strictly at 12–15 trekkers ensures zero trail chaos and medical-grade expedition safety.',
    true,
    'Verified Stay & Trail',
    7,
    true
),
(
    'Tanvi Kapoor',
    'bg-purple-600',
    'T',
    '3 months ago',
    'Kuari Pass Expedition',
    5,
    'From seamless pickup at Dehradun station to reaching the summit ridge, every logistical detail was flawless. The trek leaders are genuine mountaineers who prioritize safety first. Best Himalayan trekking operator hands down!',
    true,
    'Verified Stay & Trail',
    8,
    true
);
