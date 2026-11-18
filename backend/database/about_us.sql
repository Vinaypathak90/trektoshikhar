-- ========================================================
-- TrekToShikhar: About Us Page & Meet The Team Schema
-- Complete Dynamic CMS synced with Frontend & Admin Portal
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. About Us Global Settings & Editorial Content Table (Singleton)
CREATE TABLE IF NOT EXISTS public.about_us_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    -- Hero Section
    hero_badge VARCHAR(150) DEFAULT 'About Trek To Shikhar',
    hero_title_line1 VARCHAR(255) NOT NULL DEFAULT '“Not just a journey,',
    hero_title_cursive VARCHAR(255) NOT NULL DEFAULT 'but a bond that stays forever.”',
    hero_intro_para1 TEXT NOT NULL DEFAULT 'At Trek to Shikhar, we believe that travelling is not just about reaching places, it''s about the people we meet, the bonds we create, and the memories we carry forever.',
    hero_intro_para2 TEXT NOT NULL DEFAULT 'For us, you''re never just a customer. You''re family. We take care of every little detail, value your comfort, and make sure you feel safe, welcomed and at home throughout your journey. Because the best journeys aren''t just about where you go, but how you feel along the way.',
    hero_pledge_text VARCHAR(255) DEFAULT 'Once a Shikharite, Always a Shikharite.',
    hero_pledge_hover_text VARCHAR(255) DEFAULT 'Meet Your Mountain Family',
    use_global_hero_slides BOOLEAN DEFAULT true,
    custom_hero_slides JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Our Story Section
    story_badge VARCHAR(120) DEFAULT 'Our Story',
    story_heading VARCHAR(255) DEFAULT 'From Local Mountain Trails to a Family Called',
    story_highlight_word VARCHAR(100) DEFAULT 'Shikharites',
    story_subtitle TEXT DEFAULT 'Every mountain range teaches humility, patience, and kinship. Here is how Trek to Shikhar grew from a handful of passionate Pahadi mountaineers into one of the most loved Himalayan trekking families.',
    story_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85',
    story_caption_tag VARCHAR(120) DEFAULT 'Shimla & Dehradun Mountain Hubs',
    story_caption_title VARCHAR(200) DEFAULT 'Small Batches • Big Hearts • Unhurried Summits',
    story_batch_title VARCHAR(80) DEFAULT '12–15 Max',
    story_batch_subtitle VARCHAR(120) DEFAULT 'Intimate Family Batches',
    story_chapters JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Meet The Team Header
    team_badge VARCHAR(150) DEFAULT 'The Hearts Behind Every Summit',
    team_heading VARCHAR(200) DEFAULT 'Meet The Team',
    team_subtitle TEXT DEFAULT 'Certified mountaineers, wilderness first responders, and warm local hosts who treat every trail like home. Click any team member''s photo to know their story.',

    -- Why Choose TrekToShikhar Pillars Section
    pillars_badge VARCHAR(150) DEFAULT 'The Shikharite Advantage',
    pillars_heading_prefix VARCHAR(200) DEFAULT 'Why You Should Choose',
    pillars_heading_brand VARCHAR(120) DEFAULT 'TrekToShikhar',
    pillars_heading_suffix VARCHAR(200) DEFAULT 'For Your Next Shikhar Adventure?',
    pillars_subtitle TEXT DEFAULT 'Because reaching a summit is only half the story — how safe, inspired, and cared for you feel along every kilometer is what truly matters.',
    pillars JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Bottom Dark CTA Section
    cta_badge VARCHAR(180) DEFAULT 'Once a Shikharite, Always a Shikharite',
    cta_heading VARCHAR(255) DEFAULT 'Ready For Your Next Himalayan Story?',
    cta_subtitle TEXT DEFAULT 'Join an upcoming small-batch departure out of Shimla or Dehradun — walk with certified leaders, sleep under alpine skies, and come home with a family for life.',
    cta_primary_text VARCHAR(120) DEFAULT 'Explore Upcoming Treks',
    cta_primary_hover_text VARCHAR(120) DEFAULT 'Let''s Climb Your Next Peak',
    cta_secondary_text VARCHAR(120) DEFAULT 'Talk to Our Team',
    cta_secondary_hover_text VARCHAR(120) DEFAULT 'Chat With Mountain Family',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Meet The Team Profiles Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(200) NOT NULL,
    base VARCHAR(150) DEFAULT 'Shimla & Dehradun Base',
    experience VARCHAR(100) DEFAULT '5+ Years in Himalayas',
    photo TEXT NOT NULL,
    short_tag VARCHAR(150) DEFAULT 'Certified Mountain Leader',
    quote TEXT DEFAULT '',
    bio TEXT NOT NULL,
    certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    favorite_trek VARCHAR(200) DEFAULT 'Kedarkantha Summit',
    specialty VARCHAR(200) DEFAULT 'High-Altitude Trekking & Safety',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.about_us_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Public read about_us_settings" ON public.about_us_settings;
CREATE POLICY "Public read about_us_settings"
ON public.about_us_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access about_us_settings" ON public.about_us_settings;
CREATE POLICY "Full access about_us_settings"
ON public.about_us_settings
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read team_members" ON public.team_members;
CREATE POLICY "Public read team_members"
ON public.team_members
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access team_members" ON public.team_members;
CREATE POLICY "Full access team_members"
ON public.team_members
FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Seed Default About Us Settings
INSERT INTO public.about_us_settings (
    id,
    story_chapters,
    pillars
) VALUES (
    'global',
    '[
      {
        "year": "Chapter 01",
        "tag": "THE SPARK",
        "title": "Born From a Simple Promise in the Foothills",
        "desc": "Trek to Shikhar started out of Shimla and Dehradun when a tight-knit circle of mountain friends noticed something heartbreaking: trekking had become an assembly line of 45-person crowds where people were treated like ticket numbers. We promised to bring back the soul of the Himalayas."
      },
      {
        "year": "Chapter 02",
        "tag": "THE FAMILY ETHOS",
        "title": "Care in Every Detail, Warmth on Every Ridge",
        "desc": "From checking if your shoelaces are tied tight before a snow ascent, to serving extra hot ginger tea after a chilly ridge walk, we built our reputation on small, thoughtful gestures. When you feel safe and genuinely cared for, the mountains open up in a whole new way."
      },
      {
        "year": "Chapter 03",
        "tag": "THE SHIKHARITE BOND",
        "title": "A Lifelong Tribe of Mountain Lovers",
        "desc": "What begins as strangers meeting at Dehradun station or Shimla ridge ends as lifelong friends sharing stories years later. That unbreakable bond is why our community lives by one motto: Once a Shikharite, Always a Shikharite."
      }
    ]'::jsonb,
    '[
      {
        "num": "01",
        "icon": "HeartHandshake",
        "title": "You Are Family, Never Just a Booking ID",
        "desc": "We strictly cap groups at 12–15 trekkers so our leaders know your name, your pace, your comfort, and your story from pickup to summit celebration.",
        "footer_tag": "TrekToShikhar Promise"
      },
      {
        "num": "02",
        "icon": "Award",
        "title": "NIM & ABVIMAS Certified Local Leaders",
        "desc": "Every expedition is led by government-certified mountaineers born and raised in the Himalayas — combining deep local wisdom with technical alpine mastery.",
        "footer_tag": "TrekToShikhar Promise"
      },
      {
        "num": "03",
        "icon": "Activity",
        "title": "Medical-Grade Altitude Safety Protocol",
        "desc": "Twice-daily SpO2 pulse oximeter checks, portable high-altitude oxygen cylinders, WFR-trained leaders, and zero-rush acclimatization schedules.",
        "footer_tag": "TrekToShikhar Promise"
      },
      {
        "num": "04",
        "icon": "Tent",
        "title": "4-Season Expedition Gear & Hygienic Camps",
        "desc": "Rest comfortably in sub-zero temperatures with -10°C thermal sleeping bags, freshly sanitized liners, insulated mats, and waterproof 4-season dome tents.",
        "footer_tag": "TrekToShikhar Promise"
      },
      {
        "num": "05",
        "icon": "Utensils",
        "title": "Fresh, Wholesome Home-Style Mountain Meals",
        "desc": "Piping-hot vegetarian meals cooked fresh at camp — evening mountain soup, ginger-lemon tea, nutritious trail snacks, and warm hospitality at every altitude.",
        "footer_tag": "TrekToShikhar Promise"
      },
      {
        "num": "06",
        "icon": "Sprout",
        "title": "Zero-Plastic Trails & Heal Himalaya Mission",
        "desc": "Every trek supports local Pahadi villages and follows strict Leave No Trace principles with dedicated cleanup drives to preserve our sacred peaks.",
        "footer_tag": "TrekToShikhar Promise"
      }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Default 4 Team Members
INSERT INTO public.team_members (
    name,
    role,
    base,
    experience,
    photo,
    short_tag,
    quote,
    bio,
    certifications,
    favorite_trek,
    specialty,
    display_order,
    is_active
) VALUES
(
    'Vinay Pathak',
    'Founder & Lead Expedition Director',
    'Dehradun & Shimla Base',
    '10+ Years in Himalayas',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    'NIM Certified • 180+ Summits',
    'A summit lasts ten minutes, but the warmth of the people you climb with stays for a lifetime.',
    'Born with an unstoppable love for the Garhwal and Himachal ridges, Vinay founded Trek to Shikhar to break away from robotic, crowded commercial tours. He personally oversees trail safety standards, small-batch curation, and our signature "You are Family" ethos on every departure.',
    '["NIM Uttarkashi Basic & Advance Mountaineering", "Wilderness First Responder (WFR)", "180+ Successful Himalayan Expeditions"]'::jsonb,
    'Kedarkantha Winter Summit & Kuari Pass',
    'High-Altitude Route Planning & Community Leadership',
    1,
    true
),
(
    'Raghav Chauhan',
    'Co-Founder & Chief Mountain Guide',
    'Shimla Base Camp',
    '9+ Years in Himalayas',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85',
    'ABVIMAS Manali • Snow Specialist',
    'In the mountains, nobody walks alone. We climb at the pace of togetherness, never haste.',
    'Raised in the cedar valleys of Himachal Pradesh, Raghav knows every ridge, wind shift, and hidden spring from Hatu Peak to Churdhar Sanctuary. Known among Shikharites for his calm voice during steep snow pushes and endless mountain folklore around the evening campfire.',
    '["ABVIMAS Manali Mountaineering Graduate", "Alpine Snow & Ice Rescue Certified", "Search & Rescue Volunteer — Himachal"]'::jsonb,
    'Churdhar Sanctuary & Shrikhand Mahadev',
    'Winter Snow Navigation & Beginner Confidence Coaching',
    2,
    true
),
(
    'Ananya Rawat',
    'Head of Trekker Care & Safety Lead',
    'Dehradun Base Camp',
    '7+ Years in Himalayas',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85',
    'WFR Certified • Solo Female Mentor',
    'Comfort, safety, and feeling truly heard — that is what turns a nervous first-timer into a lifelong Shikharite.',
    'Ananya leads our medical-grade altitude protocols and solo-traveler hospitality wing. From pre-trek fitness check-ins to twice-daily SpO2 monitoring at sub-zero camps, she ensures every trekker — especially solo female explorers — feels completely safe, welcomed, and right at home.',
    '["Certified Wilderness First Responder (WFR)", "High-Altitude Acclimatization Specialist", "Solo Women Expedition Safety Lead"]'::jsonb,
    'Brahmatal Frozen Lake & Har Ki Dun',
    'Altitude Health Monitoring & Personalized Trekker Care',
    3,
    true
),
(
    'Devendra Negi',
    'Base Camp Operations & Eco-Trail Chief',
    'Garhwal & Sankri Hub',
    '12+ Years in Himalayas',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
    'Camp Architecture • Heal Himalaya Lead',
    'We leave nothing behind on the mountains except gratitude and footprints that fade with the snow.',
    'The quiet heartbeat behind every spotless 4-season tent and piping-hot mountain meal at 11,000 ft. Devendra coordinates local village partnerships, sustainable mule logistics, and leads Trek to Shikhar’s Heal Himalaya cleanup drives across Uttarakhand and Himachal.',
    '["Leave No Trace (LNT) Master Educator", "High-Altitude Camp & Gear Quartermaster", "1,200+ Trail Cleanup Drives Coordinated"]'::jsonb,
    'Nag Tibba & Tungnath Chandrashila',
    'Alpine Camp Hospitality & Zero-Plastic Trail Conservation',
    4,
    true
);
