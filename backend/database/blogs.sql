-- ========================================================
-- TrekToShikhar: Blogs, Himalayan Field Journals & Settings Schema
-- Complete Dynamic Blog CMS synced with /blog, /blog/:slug & Homepage
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Blog Settings & Hero Slides Table (Singleton id = 'global')
CREATE TABLE IF NOT EXISTS public.blog_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    hero_badge VARCHAR(150) DEFAULT 'Himalayan Trail Journals & Field Guides',
    hero_title_line1 VARCHAR(255) NOT NULL DEFAULT 'STORIES FROM THE HIGH RIDGES,',
    hero_title_cursive VARCHAR(255) NOT NULL DEFAULT 'wisdom for every climb.',
    hero_subtitle TEXT DEFAULT 'Packing checklists, winter snowcraft, acclimatization science, and raw camp stories penned by TrekToShikhar’s Shimla & Dehradun expedition leaders.',
    hero_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
    cta_badge VARCHAR(180) DEFAULT 'Once a Shikharite, Always a Shikharite',
    cta_heading VARCHAR(255) DEFAULT 'Ready To Turn Reading Into Your Next Summit?',
    cta_subtitle TEXT DEFAULT 'Join our small-batch Himalayan departures from Shimla & Dehradun — guided by the very leaders who wrote these field journals.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Individual Blog Posts / Field Journals Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT DEFAULT '',
    excerpt TEXT DEFAULT '',
    category VARCHAR(100) DEFAULT 'Beginner Guides',
    tags JSONB DEFAULT '[]'::jsonb,
    cover_image TEXT NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read',
    read_minutes INTEGER DEFAULT 5,
    published_at VARCHAR(50) DEFAULT 'Nov 2026',
    season_tag VARCHAR(100) DEFAULT 'All Seasons',
    difficulty_tag VARCHAR(100) DEFAULT 'Essential Reading',
    views VARCHAR(50) DEFAULT '1.2k',
    featured BOOLEAN DEFAULT false,
    featured_on_home BOOLEAN DEFAULT false,
    related_trek_slug VARCHAR(200) DEFAULT '',
    related_trek_name VARCHAR(200) DEFAULT '',
    author_name VARCHAR(150) DEFAULT 'Vikram Rawat',
    author_role VARCHAR(200) DEFAULT 'Chief Expedition Leader (NIM Uttarkashi)',
    author_base VARCHAR(100) DEFAULT 'Dehradun Base Camp',
    author_avatar TEXT DEFAULT '',
    author_bio TEXT DEFAULT '',
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    sections JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Public read blog_settings" ON public.blog_settings;
CREATE POLICY "Public read blog_settings"
ON public.blog_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access blog_settings" ON public.blog_settings;
CREATE POLICY "Full access blog_settings"
ON public.blog_settings
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
CREATE POLICY "Public read blogs"
ON public.blogs
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access blogs" ON public.blogs;
CREATE POLICY "Full access blogs"
ON public.blogs
FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Seed Default Blog Settings & Hero Slides
INSERT INTO public.blog_settings (
    id,
    hero_badge,
    hero_title_line1,
    hero_title_cursive,
    hero_subtitle,
    hero_slides,
    cta_badge,
    cta_heading,
    cta_subtitle
) VALUES (
    'global',
    'Himalayan Trail Journals & Field Guides',
    'STORIES FROM THE HIGH RIDGES,',
    'wisdom for every climb.',
    'Packing checklists, winter snowcraft, acclimatization science, and raw camp stories penned by TrekToShikhar’s Shimla & Dehradun expedition leaders.',
    '[
      {
        "id": "blog-slide-1",
        "url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85",
        "title": "High Ridge Field Dispatches",
        "location": "Garhwal & Kinnaur Himalayas",
        "caption": "Real-world trekking wisdom written by NIM & ABVIMAS certified leaders."
      },
      {
        "id": "blog-slide-2",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
        "title": "Winter Summit Chronicles",
        "location": "Kedarkantha & Brahmatal",
        "caption": "Sub-zero layering tactics, snowcraft, and dawn ridge strategies."
      },
      {
        "id": "blog-slide-3",
        "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
        "title": "Alpine Meadow Journals",
        "location": "Shimla & Narkanda Foothills",
        "caption": "Weekend summit escapes, cedar forests, and ancient mountain folklore."
      },
      {
        "id": "blog-slide-4",
        "url": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=85",
        "title": "High-Altitude Safety Notes",
        "location": "10,000 ft – 14,500 ft Trails",
        "caption": "Acclimatization, hydration, and zero-trace mountain ethics for every Shikharite."
      }
    ]'::jsonb,
    'Once a Shikharite, Always a Shikharite',
    'Ready To Turn Reading Into Your Next Summit?',
    'Join our small-batch Himalayan departures from Shimla & Dehradun — guided by the very leaders who wrote these field journals.'
)
ON CONFLICT (id) DO UPDATE SET
    hero_slides = EXCLUDED.hero_slides,
    updated_at = timezone('utc'::text, now());
