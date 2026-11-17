-- ========================================================
-- TrekToShikhar: Header / Hero Slides Table (Supabase/PostgreSQL)
-- Module 1: Dynamic Hero Section
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing table if recreating cleanly
-- DROP TABLE IF EXISTS public.hero_slides CASCADE;

-- 3. Create hero_slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    highlight VARCHAR(100) DEFAULT 'Featured Expedition',
    next_batch VARCHAR(100) DEFAULT 'Upcoming Departure',
    headline_line1 VARCHAR(255) NOT NULL DEFAULT 'WALK THE UNTOUCHED TRAILS',
    cursive_text VARCHAR(255) NOT NULL DEFAULT 'reach your shikhar',
    subtitle TEXT NOT NULL DEFAULT 'Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks.',
    image_url TEXT NOT NULL,
    button_primary_text VARCHAR(100) DEFAULT 'Explore Upcoming Treks',
    button_primary_link VARCHAR(255) DEFAULT '/track',
    button_secondary_text VARCHAR(100) DEFAULT 'Why Trek With Us',
    button_secondary_link VARCHAR(255) DEFAULT '/about',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Allow public website to read hero slides
CREATE POLICY "Public read hero_slides" 
ON public.hero_slides 
FOR SELECT 
USING (true);

-- Allow full access for inserts, updates, deletes
CREATE POLICY "Full access hero_slides" 
ON public.hero_slides 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 6. Seed Data: Initial 4 Himalayan Hero Slides
INSERT INTO public.hero_slides (
    title, 
    location, 
    highlight, 
    next_batch, 
    headline_line1, 
    cursive_text, 
    subtitle, 
    image_url, 
    button_primary_text, 
    button_primary_link, 
    button_secondary_text, 
    button_secondary_link, 
    display_order, 
    is_active
) VALUES 
(
    'Kedarkantha Summit Ridge',
    'Uttarakhand (12,500 ft)',
    'Winter Snow Expedition',
    '22 Nov • 4 slots left',
    'WALK THE UNTOUCHED TRAILS',
    'reach your shikhar',
    'Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks. Small batches, verified alpine gear, zero compromises on safety.',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80',
    'Explore Upcoming Treks',
    '/track',
    'Why Trek With Us',
    '/about',
    1,
    true
),
(
    'Nag Tibba Alpine Crest',
    'Dehradun / Pantwari (9,915 ft)',
    'Best Weekend Trek',
    'Every Friday Departure',
    'EXPERIENCE THE RIDGE WALK',
    'serenity above clouds',
    'Fast weekend summit escape from Delhi & Dehradun with certified NIM mountain guides. High-altitude camp overlooking snow ranges.',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    'Explore Upcoming Treks',
    '/track',
    'Why Trek With Us',
    '/about',
    2,
    true
),
(
    'Hatu Peak Snow Walk',
    'Narkanda / Shimla (11,150 ft)',
    '360° Himalayan Panorama',
    'Weekend Escapes Open',
    'SHIMLA ALPINE ESCAPE',
    'wander amidst pines',
    'Dense oak forests and ancient pine trails leading to panoramic Greater Himalayan vistas across Shrikhand Mahadev range.',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    'Explore Upcoming Treks',
    '/track',
    'Why Trek With Us',
    '/about',
    3,
    true
),
(
    'Churdhar Sanctuary Summit',
    'Himachal Shivalik (11,965 ft)',
    'High Altitude Wilderness',
    'Registration Live',
    'HIGHEST SHIVALIK PEAK',
    'untouched solitude',
    'Walk through glacial boulder fields and sacred deodar valleys in Himachal Pradesh with certified wilderness first responders.',
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=80',
    'Explore Upcoming Treks',
    '/track',
    'Why Trek With Us',
    '/about',
    4,
    true
);
